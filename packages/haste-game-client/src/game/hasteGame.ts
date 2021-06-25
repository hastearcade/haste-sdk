import { io, Socket } from 'socket.io-client';
import { HasteGameState } from '../models/gameState';

export class HasteGame extends Phaser.Game {
  state: HasteGameState;
  socket: Socket;

  constructor(gameConfig?: Phaser.Types.Core.GameConfig) {
    super(gameConfig);

    this.socket = io('http://localhost:3007');
    this.socket.on('gameUpdate', (data: HasteGameState) => {
      this.state = data;
    });

    this.state = new HasteGameState();
  }
}
