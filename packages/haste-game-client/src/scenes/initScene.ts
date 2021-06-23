/* eslint-disable @typescript-eslint/no-empty-function */
import { Engine, Scene } from 'excalibur';
import { configureClient } from '../utils/auth';

/**
 * Managed scene
 */
export class InitScene extends Scene {
  public async onInitialize(engine: Engine) {
    const auth0Client = await configureClient();

    const query = window.location.search;
    if (query.includes('code=') && query.includes('state=')) {
      // Process the login state
      await auth0Client.handleRedirectCallback();
      // Use replaceState to redirect the user away and remove the querystring parameters
      window.history.replaceState({}, document.title, '/');
    }

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (!isAuthenticated) {
      await auth0Client.loginWithRedirect({
        redirect_uri: window.location.origin,
      });
    } else {
      const token = (await auth0Client.getTokenSilently()) as unknown as string;
    }
  }

  public onActivate() {}
  public onDeactivate() {}
}
