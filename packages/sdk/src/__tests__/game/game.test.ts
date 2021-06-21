import { Game, Player, Score } from '@haste-sdk/domain';
import { getHighScore } from '../..';

const game = new Game('testgame');

const initializeTestGame = () => {
  game.addLeader(new Player('test@gmail.com'), new Score(0));
  game.addLeader(new Player('test@gmail1.com'), new Score(1));
  game.addLeader(new Player('test@gmail2.com'), new Score(2));
  game.addLeader(new Player('test@gmail3.com'), new Score(3));
  game.addLeader(new Player('test@gmail4.com'), new Score(4));
};

beforeEach(() => {
  initializeTestGame();
});

test('getHighScore', () => {
  expect(getHighScore(game)).toBe(4);
});
