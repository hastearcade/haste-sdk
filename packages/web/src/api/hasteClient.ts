/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { isBrowser } from '../util/environmentCheck';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { HasteClientConfiguration } from '../config/hasteClientConfiguration';

export type HasteAuthentication = {
  token: string;
  isAuthenticated: boolean;
};
export class HasteClient {
  private auth0Client: Auth0Client;
  private configuration: HasteClientConfiguration;

  private constructor(configuration: HasteClientConfiguration, auth0Client: Auth0Client) {
    this.configuration = configuration;
    this.auth0Client = auth0Client;
  }

  public static async build(clientId: string, domain = 'haste-development.us.auth0.com') {
    if (!isBrowser()) throw new Error(`Haste client build may only be called from a browser based environment please.`);

    const auth0 = await createAuth0Client({
      domain: domain,
      client_id: clientId,
      audience: 'https://hastegame.api',
    });

    return new HasteClient(
      {
        domain: domain,
        clientId: clientId,
      },
      auth0,
    );
  }

  public async handleRedirect() {
    const isAuthenticated = await this.isAuthenticated();
    const query = window.location.search;

    if (query.includes('code=') && query.includes('state=')) {
      await this.handleRedirectCallback();
      window.history.replaceState({}, document.title, '/');
      if (this.isAuthenticated) {
        const token = await this.getTokenSilently();
        return {
          token: token,
          isAuthenticated: true,
        } as HasteAuthentication;
      } else {
        throw new Error(`An error occurred during authentication`);
      }
    } else {
      if (isAuthenticated) {
        const token = await this.getTokenSilently();
        return {
          token: token,
          isAuthenticated: true,
        } as HasteAuthentication;
      }
    }

    return {
      token: '',
      isAuthenticated: false,
    } as HasteAuthentication;
  }

  public logout() {
    return this.auth0Client.logout({
      returnTo: window.location.origin,
    });
  }

  public async getTokenSilently() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.auth0Client.getTokenSilently();
  }

  public async isAuthenticated() {
    return await this.auth0Client.isAuthenticated();
  }

  public async loginWithRedirect() {
    return await this.auth0Client.loginWithRedirect({
      redirect_uri: window.location.origin,
    });
  }

  private async handleRedirectCallback() {
    return await this.auth0Client.handleRedirectCallback();
  }
}