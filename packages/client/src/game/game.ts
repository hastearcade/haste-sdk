import { Game } from '@haste-sdk/domain';

export function getHighScore(game: Game): number {
    const scores = game.getScores().map((g) => g.score.getScore());
    return Math.max(...scores);
}
