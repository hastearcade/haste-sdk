import { flags } from '@oclif/command';
import cli from 'cli-ux';
import os from 'os';
import axios from 'axios';
import { config } from 'dotenv';
import BaseCommand from '../common/base-command';
import Netrc from 'netrc-parser';
import jwtDecode, { JwtPayload } from 'jwt-decode';

interface NetrcEntry {
  login: string;
  password: string;
}

export default class Login extends BaseCommand {
  static description = 'Login to Haste Arcade';

  static examples = ['$ haste login'];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async sleep(ms: number) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async fetchAuth(
    retries: number,
    response: { data: { cliUrl: string; token: string; requestorId: string } },
    loginSpinner: { fail: (arg0: string) => void },
  ): Promise<any> {
    try {
      // the second call to the authentication server requres
      // the bearer token given from the first request to /cli
      // this endpoint must be polled until a player bearer token
      // is returned.
      const accessTokenResponse = await axios.get<{ access_token: string }>(
        `${process.env.AUTH_API_URL}${response.data.cliUrl}/${response.data.requestorId}`,
        {
          headers: { authorization: `Bearer ${response.data.token}` },
        },
      );

      const decoded = jwtDecode<JwtPayload & { 'https://hastearcade.com/email': string }>(
        accessTokenResponse.data.access_token,
      );
      const email = decoded['https://hastearcade.com/email'];

      return {
        login: email,
        password: accessTokenResponse.data.access_token,
      } as NetrcEntry;
    } catch (error) {
      if (retries > 0 && error.response.status >= 400) {
        await this.sleep(10_000);
        return this.fetchAuth(retries - 1, response, loginSpinner);
      }

      loginSpinner.fail(`The login was not completed successfully. Please try again. ${error}`);
      throw error;
    }
  }

  // The entry point for the login command
  async run(): Promise<void> {
    config({ path: `${__dirname}/.env` });

    // Load the details from the netrc file
    // remove the token for testing purposes so the authentication process
    // runs everytime. In a real world example, you could use the stored
    // token to authenticate the user and not require them to login
    // every time they play your game.
    await Netrc.load();
    await this.removeToken();

    // first call to the authentication service. This call to /cli kicks off the process
    // the cli endpoint will return a bearer token, a requestor id, and a browser url that can be used
    // to move the player to the next step.
    const response = await axios.post(`${process.env.AUTH_API_URL}/cli`, { description: os.hostname() }, {});

    // build the browser url that you will direct the user to for authentication
    const browserUrl = `${process.env.AUTH_CLIENT_URL}${response.data.browserUrl}`;
    this.logCommandStart(
      `The following link will open in your browser to login to Haste. If for some reason it does not open automatically please click here: ${browserUrl}`,
    );

    // open the browser
    await cli.open(browserUrl);

    // spin here until the user authenticates. This code will vary based on your game / platform
    const loginSpinner = this.spinner.add('Waiting for you to login within your browser using the link above');

    await this.sleep(10_000);

    // check to see if the player has authenticated yet.
    const auth = await this.fetchAuth(3, response, loginSpinner);

    // once authenticated, then save off the token for use later.
    this.saveToken(auth);
    loginSpinner.succeed('You are successfully logged in.');
  }

  private async saveToken(entry: NetrcEntry) {
    const hosts = ['api.hastearcade.com'];

    hosts.forEach((host) => {
      if (!Netrc.machines[host]) Netrc.machines[host] = {};
      Netrc.machines[host].login = entry.login;
      Netrc.machines[host].password = entry.password;
      delete Netrc.machines[host].method;
      delete Netrc.machines[host].org;
    });

    await Netrc.save();
  }

  private async removeToken() {
    const hosts = ['api.hastearcade.com'];

    hosts.forEach((host) => {
      Netrc.machines[host] = {};
    });

    await Netrc.save();
  }
}
