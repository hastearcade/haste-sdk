import 'phaser';
import { GameConfig } from './config/config';

export class Game extends Phaser.Game {}

window.addEventListener('load', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const game = new Game(GameConfig);
});
