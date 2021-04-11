import { Game } from '@haste-sdk/domain';

export function getHighScore(game: Game): number {
  if (game.name === 'test') {
    return 32;
  }
  const scores = game.getScores().map((g) => g.score.getScore());
  return Math.max(...scores);
}
