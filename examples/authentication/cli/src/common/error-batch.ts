import { v4 } from 'uuid';
import BaseCommand from './base-command';

type Error = {
  message: string;
  key: string | number;
};

/**
 * Provides deferred error handling for cases where we might want to batch up errors and throw them later
 */
export default class ErrorBatch {
  constructor(context: BaseCommand) {
    this.context = context;
  }

  context: BaseCommand;

  /**
   * A list of current errors for the run.  To throw all errors at once, run throwErrors
   */
  errors: Error[] = [];

  /**
   * Adds an error to the current list of errors
   * @param {string} message the error message that we want displayed
   * @param {string | number} key a unique key value representing this error message.  Note that if a key is not passed in, one will be auto generated
   * @returns {string | number} the key that was just added
   */
  add = (message: string, key?: string | number): string | number => {
    if (!key) {
      key = v4();
    }

    // if an item with this key has already been added, return
    if (this.errors.find((x) => x.key === key)) {
      return key;
    }

    this.errors.push({ message, key });
    return key;
  };

  /**
   * Removes an error from the current list of errors based on the key passed in
   * @param {string | number} key the unique value representing the error message
   */
  remove = (key: string | number) => {
    this.errors = this.errors.filter((x) => x.key !== key);
  };

  /**
   * Updates an error with a new message based on the key passed in
   * @param {string} message the error message that we want displayed
   * @param {string | number} key a unique key value representing this error message
   * @returns {string | number} the key that was just updated
   */
  update = (message: string, key: string | number): string | number => {
    const index = this.errors.findIndex((x) => x.key === key);

    if (index === -1) {
      return key;
    }

    this.errors[index] = { message, key };
    return key;
  };

  /**
   * Throws all errors that have been batched up and stops execution
   * @param {string} headerMessage message to display at the top of the list
   * @param {string} footerMessage message to display at the bottom ofthe list
   */
  throw = (
    headerMessage = 'the following errors have occurred',
    footerMessage = 'due to the above fatal errors, command must exit',
  ) => {
    if (this.errors.length === 0) {
      return;
    }
    this.context.logError(headerMessage);
    this.context.logList(this.errors.map((x) => x.message));
    this.context.logFatal(footerMessage);
  };
}
