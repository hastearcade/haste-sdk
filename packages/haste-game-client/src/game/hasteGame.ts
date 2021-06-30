import { Floor, HasteGameState, Player } from '@haste-sdk/haste-game-domain';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { SocketManager } from '../socket/socketManager';

export class HasteGame extends Phaser.Game {
  state: HasteGameState;
  socketManager: SocketManager;

  constructor(gameConfig?: Phaser.Types.Core.GameConfig) {
    super(gameConfig);
    this.state = new HasteGameState(800, 600, new Player(), new Floor(), [], [], [], 0);
  }

  // the haste game client integrates with haste-game-server using
  // socket.io. In order to ensure a secure connection between client
  // and server, a JWT from the auth0 game is leveraged. This JWT will
  // contain the necessary information necessary to validate the client
  // to the server, and contain the player id from the user metadata
  async setupSocket(auth0: Auth0Client) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = await auth0.getTokenSilently();
    const serverUrl = `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`;
    this.socketManager = new SocketManager(serverUrl, token);

    this.socketManager.gameUpdateEvent.on((data: HasteGameState) => {
      this.state = data;
    });
  }
}
