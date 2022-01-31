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
    clientId: string,
    domain = 'auth.hastearcade.com',
    signinUrl = 'https://authclient.hastearcade.com/signin',
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

  public async login() {
    const hint = btoa(`${v4()};;;;;${window.location.href};;;;;${'signin'}`);
    await this.auth0Client.loginWithRedirect({
      connection: 'Haste-Authorization',
      login_hint: hint,
      redirect_uri: window.location.href,
    });
  }

  public logout() {
    localStorage.removeItem('haste:config');
    return this.auth0Client.logout({
      returnTo: window.location.origin,
    });
  }

  public async getTokenDetails() {
    try {
      const cachedToken = localStorage.getItem('haste:config');

      if (cachedToken) {
        // we need to sign out users to ensure they are not using an old JWT
        // as the new JWTs will have a specific claim that the play endpoint
        // checks for and if it doesnt exist it will prevent users from playing
        // a speciifc game. This will ensure we can get all games upgraded to
        // the newest package with the new auth and all users get converted
        await this.logout();
      } else {
        const query = window.location.search;
        // eslint-disable-next-line no-console
        console.log(`query = ${query}`);
        const shouldParseResult = query.includes('code=') && query.includes('state=');
        // eslint-disable-next-line no-console
        console.log(`shouldParseResult = ${JSON.stringify(shouldParseResult)}`);

        if (shouldParseResult) {
          // eslint-disable-next-line no-console
          console.log(`in the should parse result`);
          await this.auth0Client.handleRedirectCallback();
          // eslint-disable-next-line no-console
          console.log(`past the handleRedirectCallback in the should parse result`);
        }

        // eslint-disable-next-line no-console
        console.log(`getting the token silently`);
        const accessToken = await this.auth0Client.getTokenSilently();
        // eslint-disable-next-line no-console
        console.log(`accessToken = ${JSON.stringify(accessToken)}`);
        const idTokenClaims = await this.auth0Client.getIdTokenClaims();
        const idToken = idTokenClaims.__raw;
        // eslint-disable-next-line no-console
        console.log(`idToken = ${JSON.stringify(idToken)}`);

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
      // eslint-disable-next-line no-console
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.error === 'consent_required') {
        const hint = btoa(`${v4()};;;;;${window.location.href};;;;;${'game'}`);
        await this.auth0Client.loginWithRedirect({
          connection: 'Haste-Authorization',
          login_hint: hint,
          redirect_uri: window.location.href,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.error !== 'login_required') {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    // eslint-disable-next-line no-console
    console.log(`not logged in`);
    return {
      token: '',
      isAuthenticated: false,
    } as HasteAuthentication;
  }
}
