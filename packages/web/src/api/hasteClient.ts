/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { isBrowser } from '../util/environmentCheck';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { HasteClientConfiguration } from '../config/hasteClientConfiguration';
import SecureLS from 'secure-ls';
import jwtDecode, { JwtPayload } from 'jwt-decode';

export type HasteAuthentication = {
  token: string;
  isAuthenticated: boolean;
  picture: string;
  displayName: string;
};

export class HasteClient {
  private auth0Client: Auth0Client;
  private configuration: HasteClientConfiguration;
  private ls: SecureLS;

  private constructor(configuration: HasteClientConfiguration, auth0Client: Auth0Client) {
    this.configuration = configuration;
    this.auth0Client = auth0Client;
    this.ls = new SecureLS({
      encodingType: 'aes',
    });
  }

  public static async build(
    clientId: string,
    domain = 'auth.hastearcade.com',
    signinUrl = 'https://app.hastearcade.com/signin',
  ) {
    if (!isBrowser())
      throw new Error(
        `Haste client build can only be called from a browser based environment. If you are on a server, use the server package.`,
      );

    const auth0 = new Auth0Client({
      domain: domain,
      client_id: clientId,
      cacheLocation: 'localstorage',
    });

    // this is a short term hack to avoid changing the interface last minute
    // this will be removed in the next minor version release
    // TODO
    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    await sleep(1);

    return new HasteClient(
      {
        domain: domain,
        clientId: clientId,
        signinUrl: signinUrl,
      },
      auth0,
    );
  }

  public login() {
    window.location.href = `${
      this.configuration.signinUrl
    }?redirectUrl=${`${window.location.href}?redirectClientId=${this.configuration.clientId}`}`;
  }

  public logout() {
    this.ls.removeAll();
    return this.auth0Client.logout({
      returnTo: window.location.origin,
    });
  }

  public async getTokenDetails() {
    try {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const idToken = urlSearchParams.get('id_token');
      const cachedToken = this.ls.get('haste:config');

      if (cachedToken) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const decoded = jwtDecode<JwtPayload>(cachedToken);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const expiration = decoded.exp;
        if (expiration && new Date(expiration * 1000) > new Date()) {
          return {
            token: cachedToken,
            // eslint-disable-next-line dot-notation
            picture: decoded['picture'],
            displayName: decoded['https://hastearcade.com/displayName'],
            isAuthenticated: true,
          } as HasteAuthentication;
        } else {
          this.ls.remove('haste:config');
          return {
            token: '',
            picture: '',
            displayName: '',
            isAuthenticated: false,
          } as HasteAuthentication;
        }
      } else if (idToken) {
        this.ls.set('haste:config', idToken);
        urlSearchParams.delete('id_token');
        const decoded = jwtDecode<JwtPayload>(idToken);
        const plainUrl = window.location.href.split('?')[0];
        window.history.pushState({}, document.title, `${plainUrl}${urlSearchParams.toString()}`);
        return {
          token: idToken,
          // eslint-disable-next-line dot-notation
          picture: decoded['picture'],
          displayName: decoded['https://hastearcade.com/displayName'],
          isAuthenticated: true,
        } as HasteAuthentication;
      } else {
        const accessToken = await this.auth0Client.getTokenSilently();
        const idTokenClaims = await this.auth0Client.getIdTokenClaims();
        const idToken = idTokenClaims.__raw;

        const decoded = jwtDecode<JwtPayload>(idToken);
        if (accessToken) {
          return {
            token: idToken,
            // eslint-disable-next-line dot-notation
            picture: decoded['picture'],
            displayName: decoded['https://hastearcade.com/displayName'],
            isAuthenticated: true,
          } as HasteAuthentication;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.error === 'consent_required') {
        await this.auth0Client.loginWithRedirect({
          redirect_uri: window.location.origin,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.error !== 'login_required') {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    return {
      token: '',
      isAuthenticated: false,
    } as HasteAuthentication;
  }
}
