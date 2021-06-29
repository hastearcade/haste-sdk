import { GameEngine } from '../../game/gameEngine';
import { PlayerMovement } from '@haste-sdk/haste-game-domain';

export function playerUpdateListener(_1, _2, engine: GameEngine, _3, message: PlayerMovement) {
  engine.movePlayer(message);
}
