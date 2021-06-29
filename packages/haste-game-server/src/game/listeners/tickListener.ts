import Matter from 'matter-js';
import { GameEngine } from '../gameEngine';

export function tickListener(
  event: Matter.IEventTimestamped<Matter.Runner>,
  source: Matter.Runner,
  engine: GameEngine,
) {
  engine.addBombs(event.timestamp);
}
