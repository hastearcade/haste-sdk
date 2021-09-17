import { Floor, HasteGameState, Player } from '@hastearcade/haste-game-domain';
import { SocketManager } from '../socket/socketManager';
import { HasteClient, Leaderboard } from '@hastearcade/web';

export class HasteGame extends Phaser.Game {
  state: HasteGameState;
  leaderboards: Leaderboard[];
  socketManager: SocketManager;
  selectedLeaderboardId: string;

  constructor(gameConfig?: Phaser.Types.Core.GameConfig) {
    super(gameConfig);
    this.state = new HasteGameState(800, 600, new Player(), new Floor(), [], [], [], 0);
  }

  // the haste game client integrates with haste-game-server using
  // socket.io. In order to ensure a secure connection between client
  // and server, a JWT from the haste game is leveraged. This JWT will
  // contain the necessary information necessary to validate the client
  // to the server, and contain the player id from the user metadata
  async setupSocket(hasteClient: HasteClient) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const details = await hasteClient.getTokenDetails();
    const serverUrl = `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`;
    this.socketManager = new SocketManager(serverUrl, details.token);

    this.socketManager.gameUpdateEvent.on((data: HasteGameState) => {
      this.state = data;
    });
  }
}
