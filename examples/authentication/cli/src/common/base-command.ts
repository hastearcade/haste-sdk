import Command from '@oclif/command';
import chalk from 'chalk';
import { getColorValue } from '../visuals/colors';
import ErrorBatch from './error-batch';
import Spinner from './spinner';

export default abstract class BaseCommand extends Command {
  /**
   * A boolean dictating whether or not emojis should be used.  This is based off of whether
   * or not a user's shell can support emojis
   */
  private useEmoji = this.config.shell !== 'cmd.exe';

  /**
   * A rocket emoji for use when a command kicks off
   */
  rocket = '🚀';

  /**
   * A bomb emoji for use when a command fails
   */
  bomb = '💣';

  /**
   * A sparkle emoji for when a command succeeds
   */
  sparkles = '✨';

  /**
   * A tada emoji for when a command succeeds
   */
  tada = '🎉';

  /**
   * An exclamation point emoji
   */
  exclamation = '❗';

  /**
   * Standard spinner instance that can be used to show that the CLI is working.  Can have multiple simultaneously
   */
  spinner = new Spinner();

  /**
   * A batch for errors so you can add errors and throw them all at once; allows execution to continue even if there are fatal errors
   */
  errorBatch = new ErrorBatch(this);

  async init() {
    chalk.level = 3;
    await super.init();
  }

  /**
   * Logs an fatal error message.  Note that when this method is called, the command line will exit
   * @param {string} message The message to be logged
   */
  logFatal(message: string): never {
    const emoji = this.useEmoji ? `${this.bomb} ` : '';
    super.error(`${emoji}${message}`);
  }

  /**
   * Logs a list of things to the terminal window with bullet points for each one
   * @param {string[]} list an array containing each individual thing to log
   * @param {string} header optional message to serve as the header
   * @returns {void}
   */
  logList = (list: string[], header?: string): void => {
    if (header) this.log(header);
    list.forEach((item) => this.log(`• ${item}`));
  };

  /**
   * Logs an important message to the terminal window
   * @param {string} message the message to be logged
   * @param {string} emoji optional emoji to start the log message; uses the rocket ship by default
   * @returns {void}
   */
  logImportant = (message: string, emoji: string = this.exclamation): void => {
    message = emoji && this.useEmoji ? `${emoji} ${message}` : message;
    this.log(chalk.hex(getColorValue('primary')).bold(message));
  };

  /**
   * Logs an command start message to the terminal window
   * @param {string} message the message to be logged
   * @returns {void}
   */
  logCommandStart = (message: string) => this.logImportant(message, this.useEmoji ? this.rocket : undefined);

  /**
   * Logs an command finish message to the terminal window
   * @param {string} message the message to be logged
   * @returns {void}
   */
  logCommandFinish = (message: string) => this.logImportant(message, this.useEmoji ? this.tada : undefined);

  /**
   * Logs a command with emphasis to the terminal window
   * @param {string} message the message to be logged
   * @returns {void}
   */
  logEmphasis = (message: string) => {
    this.log(`${chalk.bold.hex(getColorValue('primary'))(message)}`);
  };

  /**
   * Logs an error to the console.  Note that this is different from commandError (which exits) this will continue execution
   * @param {string} message the message to be logged
   */
  logError = (message: string) => {
    this.log(`${chalk.bold.hex(getColorValue('failure'))(message)}`);
  };

  /**
   * Logs a success to the console.
   * @param {string} message the message to be logged
   */
  logSuccess = (message: string) => {
    this.log(`${chalk.bold.hex(getColorValue('success'))(message)}`);
  };

  /**
   * Logs a warning to the console.
   * @param {string} message the message to be logged
   */
  logWarning = (message: string) => {
    this.log(`${chalk.bold.hex(getColorValue('secondary'))(message)}`);
  };

  /**
   * Logs an info to the console.
   * @param {string} message the message to be logged
   */
  logInfo = (message: string) => {
    this.log(`${chalk.bold.hex(getColorValue('info'))(message)}`);
  };
}
