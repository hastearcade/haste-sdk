import Matter from 'matter-js';
import { GameEngine } from '../gameEngine';

// this listener is run at every tick of
// the matter-js simulation. It gives a place
// to perform some actions at every moment. In
// the case of this game, its used to call addBombs
// which periodically adds bombs into the simulation
// to then be rendered on the client side
export function tickListener(
  event: Matter.IEventTimestamped<Matter.Runner>,
  source: Matter.Runner,
  engine: GameEngine,
) {
  engine.addBombs(event.timestamp);
}
