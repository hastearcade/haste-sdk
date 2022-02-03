/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { isBrowser } from '../util/environmentCheck';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { HasteClientConfiguration } from '../config/hasteClientConfiguration';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { v4 } from 'uuid';

export type HasteAuthentication = {
  token: string;
  isAuthenticated: boolean;
  picture: string;
  displayName: string;
};

export class HasteClient {
  private auth0Client: Auth0Client;
  private configuration: HasteClientConfiguration;

  private constructor(configuration: HasteClientConfiguration, auth0Client: Auth0Client) {
    this.configuration = configuration;
    this.auth0Client = auth0Client;
  }

  public static build(
    domain = 'auth.hastearcade.com',
    signinUrl = 'https://authclient.hastearcade.com/signin',
    clientId = 'EUN4fvO6AJIjVImZxhPAw9ofpw9LrB7g',
  ) {
    if (!isBrowser())
      throw new Error(
        `Haste client build can only be called from a browser based environment. If you are on running @hastearcade/web on a server, please use the server package.`,
      );

    const auth0 = new Auth0Client({
      audience: 'https://haste.api',
      domain: domain,
      client_id: clientId,
      scope: 'offline_access',
      useRefreshTokens: true,
      useCookiesForTransactions: true,
      cacheLocation: 'localstorage',
    });

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
    const hint = btoa(`${v4()};;;;;${window.location.href};;;;;${'gamelogin'}`);
    window.location.href = `https://authclient.foundrium.hastearcade.com/landing?login_hint=${hint}`;
  }

  public logout() {
    localStorage.removeItem('haste:config');
    localStorage.removeItem('token');
    window.location.href = window.location.origin;
  }

  public getTokenDetails() {
    try {
      const cachedToken = localStorage.getItem('haste:config');

      if (cachedToken) {
        // we need to sign out users to ensure they are not using an old JWT
        // as the new JWTs will have a specific claim that the play endpoint
        // checks for and if it doesnt exist it will prevent users from playing
        // a speciifc game. This will ensure we can get all games upgraded to
        // the newest package with the new auth and all users get converted
        this.logout();
      } else {
        const query = window.location.search;
        const queryParams = new URLSearchParams(query);
        const idToken = queryParams.get('idToken');

        if (idToken) {
          queryParams.delete('idToken');
          localStorage.setItem('token', idToken);
          const plainUrl = window.location.href.split('?')[0];
          window.location.href = plainUrl;
        } else {
          const accessToken = localStorage.getItem('token');

          if (accessToken) {
            const decoded = jwtDecode<JwtPayload>(accessToken);
            return {
              token: accessToken,
              // eslint-disable-next-line dot-notation
              picture: decoded['picture'],
              displayName: decoded['https://hastearcade.com/displayName'],
              isAuthenticated: true,
            } as HasteAuthentication;
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    return {
      token: '',
      isAuthenticated: false,
    } as HasteAuthentication;
  }
}
