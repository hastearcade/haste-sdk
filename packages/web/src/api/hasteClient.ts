/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { isBrowser } from '../util/environmentCheck';
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
  private configuration: HasteClientConfiguration;

  private constructor(configuration: HasteClientConfiguration) {
    this.configuration = configuration;
  }

  public static build(signinUrl = 'https://authclient.hastearcade.com') {
    if (!isBrowser())
      throw new Error(
        `Haste client build can only be called from a browser based environment. If you are on running @hastearcade/web on a server, please use the server package instead.`,
      );

    return new HasteClient({
      signinUrl: `${signinUrl}`,
    });
  }

  public login() {
    const hint = btoa(`${v4()};;;;;${window.location.href};;;;;${'gamelogin'}`);
    window.location.href = `${this.configuration.signinUrl}/landing?login_hint=${hint}`;
  }

  public logout() {
    localStorage.removeItem('haste:config');
    localStorage.removeItem('token');
    window.location.href = `${this.configuration.signinUrl}/logout?redirect_uri=${window.location.origin}`;
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
          localStorage.setItem('token', idToken);
          const url = new URL(window.location.href);
          const params = new URLSearchParams(url.search.slice(1));
          params.delete('idToken');
          window.location.href = `${window.location.origin}${window.location.pathname}?${params.toString()}${
            window.location.hash
          }`;
        } else {
          const accessToken = localStorage.getItem('token');

          if (accessToken) {
            const decoded = jwtDecode<JwtPayload>(accessToken);
            return {
              token: accessToken,
              picture: decoded['https://hastearcade.com/picture'],
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
