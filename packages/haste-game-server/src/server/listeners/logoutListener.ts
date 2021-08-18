import { Haste, Play } from '@haste-sdk/sdk';
import { GameEngine } from '../../game/gameEngine';
export function logoutListener(_1, haste: Haste, engine: GameEngine) {
  if (engine.currentPlay && engine.currentPlay.id && engine.currentPlay.id.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    haste.game.score(engine.currentPlay, engine.currentPlay.leaderboard, engine.score);
    engine.gameOver = true;
    engine.currentPlay = new Play();
    engine.score = 0;
  }
}
