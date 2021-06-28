import { io, Socket } from 'socket.io-client';
import { Floor, HasteGameState, Player } from '@haste-sdk/haste-game-domain';

export class HasteGame extends Phaser.Game {
  state: HasteGameState;
  socket: Socket;

  constructor(gameConfig?: Phaser.Types.Core.GameConfig) {
    super(gameConfig);
    this.socket = io('http://localhost:3007');
    this.state = new HasteGameState(800, 600, new Player(), new Floor(), [], [], [], 0);
  }
}
