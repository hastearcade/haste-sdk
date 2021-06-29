import { GameEngine } from '../../game/gameEngine';
export function gameStartListener(_1, _2, engine: GameEngine) {
  engine.play();
}
