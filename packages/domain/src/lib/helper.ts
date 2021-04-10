import { PlayersScore, Game } from '../models';

const world = 'world';

export function hello(word: string = world): string {
  if (word === 'world2') {
    return 'not my world';
  }

  return `Hello ${word}!`;
}

export function getScores(game: Game): PlayersScore[] {
  return game.getScores();
}
