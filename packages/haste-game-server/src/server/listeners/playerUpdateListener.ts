import { GameEngine } from '../../game/gameEngine';
import { PlayerMovement } from '@hastearcade/haste-game-domain';

// this listener is fired when the haste game client
// emits the playerUpdate event. The message contains
// which direction the player moves. This can notify
// the game engine which can direct the matter-js
// simulation
export function playerUpdateListener(_1, _2, engine: GameEngine, _3, message: PlayerMovement) {
  engine.movePlayer(message);
}
