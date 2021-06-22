import { HasteConfiguration } from '../config';
import { GameResource } from './resources/game/gameResource';

export class Haste {
  game: GameResource;
  private configuration?: HasteConfiguration;

  // make this optional and add the client id and secret to the config object?
  // need client id and secret inside base resource
  constructor(clientId: string, clientSecret: string, configuration?: HasteConfiguration) {
    this.configuration = configuration;

    if (!clientId || clientId.length === 0) {
      throw new Error(`You must initialize the HasteApi with a client id.`);
    }
    if (!clientSecret || clientSecret.length === 0) {
      throw new Error(`You must initialize the HasteApi with a client secret.`);
    }

    this.game = new GameResource(clientId, clientSecret, this.configuration);
  }
}
