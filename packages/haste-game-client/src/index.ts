import 'phaser';

import { GameConfig } from './config/config';
import { HasteGame } from './game/hasteGame';

window.addEventListener('load', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const game = new HasteGame(GameConfig);
});
