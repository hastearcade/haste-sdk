import createAuth0Client from '@auth0/auth0-spa-js';

export const configureClient = async () => {
  return await createAuth0Client({
    domain: 'playhaste.us.auth0.com', // TODO Move these to env vars
    client_id: 'bYphYYXNRaQf4JRJgqfYlMWig1N850z5',
    audience: 'https://hastegame.api',
  });
};
