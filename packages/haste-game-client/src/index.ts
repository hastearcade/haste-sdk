import { HasteGame } from './hasteGame';

const game = new HasteGame();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
game.start().then(() => {
  game.goToScene('initScene');
});
