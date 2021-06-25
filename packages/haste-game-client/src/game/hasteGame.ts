import { io } from 'socket.io-client';
import { HasteGameState } from '../models/gameState';

export class HasteGame extends Phaser.Game {
  state: HasteGameState;

  constructor(gameConfig?: Phaser.Types.Core.GameConfig) {
    super(gameConfig);

    const socket = io('http://localhost:3007');
    socket.on('gameUpdate', (data: HasteGameState) => {
      this.state = data;
    });

    this.state = new HasteGameState();
  }
}
