import { flags } from '@oclif/command';
import os from 'os';
import axios from 'axios';
import { config } from 'dotenv';
import BaseCommand from '../common/base-command';

export default class Login extends BaseCommand {
  static description = 'Login to Haste Arcade';

  static examples = ['$ haste login'];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run(): Promise<void> {
    config({ path: `${__dirname}/.env` });
    const response = await axios.post(`${process.env.AUTH_API_URL}/cli`, { description: os.hostname() }, {});
    this.logCommandStart(
      `Please open the following link in your browser to login: ${process.env.AUTH_CLIENT_URL}${response.data.browserUrl}`,
    );

    // const succeedSpinner = this.spinner.add('Once you login with your browser, the login will complete');
    // const failSpinner = this.spinner.add('If the login fails, this will show');
  }
}
