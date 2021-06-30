import { Haste } from '@haste-sdk/sdk';
import { GameEngine } from '../../game/gameEngine';
export function logoutListener(_1, haste: Haste, engine: GameEngine) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  haste.game.score(engine.currentPlay, 0);
}
