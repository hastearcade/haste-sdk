import 'phaser';

import { GameConfig } from './config/config';
import { HasteGame } from './game/hasteGame';

// upon browser load, instantiage the primary element
// HasteGame is an extension of a Phaser Game object which
// defaults to WebGL if available or a canvas element if not
// for rendering. There is essentially no html markup for this client
// side application
window.addEventListener('load', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const game = new HasteGame(GameConfig);
});
