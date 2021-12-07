import Spinnies from 'spinnies';
import chalk from 'chalk';

import { getColorValue } from '../visuals/colors';

/**
 * Outcomes available for the spinner
 */
type SpinnerOutcome = {
  succeed: (successVerbiage?: string) => void;
  fail: (failVerbiage?: string) => void;
};

export default class Spinner {
  constructor() {
    chalk.level = 3;
  }

  /**
   * Backing spinnies instance for controlling the spinner
   */
  private spinner = new Spinnies({
    color: getColorValue('primary'),
    succeedColor: getColorValue('success'),
    spinnerColor: getColorValue('primary'),
    failColor: getColorValue('failure'),
    failPrefix: '×',
  });

  /**
   * Add a new spinner to the console.  The add method will render the spinner on the screen.  The return object of this method is used to control success or failure of the spinner.
   * @param {string} text text to be displayed to the console
   * @returns {SpinnerOutcome} returns an object with succeed and fail methods.  Calling each one will cause the spinner to show a success or failure message respectively.
   */
  add(text: string): SpinnerOutcome {
    this.spinner.add(text, { text: `${text}` });

    return {
      /**
       * Causes the spinner to succeed; displays a green checkmark and displays success verbiage
       * @param {string} successVerbiage message to be displayed if succeed is called.  Is 'success!' by default
       * @returns {void}
       */
      succeed: (successVerbiage = 'success!'): void =>
        this.spinner.succeed(text, { text: `  ${text}... ${successVerbiage}` }),
      /**
       * Causes the spinner to fail; displays a red x icon and displays fail verbiage
       * @param {string} failVerbiage message to be displayed if fail is called.  Is 'fail.' by default
       * @returns {void}
       */
      fail: (failVerbiage = 'fail.'): void => this.spinner.fail(text, { text: `  ${text}... ${failVerbiage}` }),
    };
  }
}
