import { Auth0Client } from '@auth0/auth0-spa-js';

// This is a way to type a simple
// JavaScript object to pass the auth0
// client between scenes to support the
// login and logout buttons
export class GameSceneData {
  auth: Auth0Client;
}
