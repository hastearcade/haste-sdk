import Matter, { Body, Engine, Runner, World } from 'matter-js';
import { GameEngine } from '../gameEngine';

export function collisionStartListener(
  event: Matter.IEventCollision<Matter.Engine>,
  source: Matter.Engine,
  engine: GameEngine,
) {
  const pairs = event.pairs;

  pairs.forEach((pair) => {
    if (pair.bodyA.label === 'Player' || pair.bodyB.label === 'Player') {
      engine.player.isUp = false;
    }

    if (
      (pair.bodyA.label.indexOf('Bomb') >= 0 && pair.bodyB.label !== 'Player') ||
      (pair.bodyA.label !== 'Player' && pair.bodyB.label.indexOf('Bomb') >= 0)
    ) {
      const bodyToMove = pair.bodyA.label.indexOf('Bomb') >= 0 ? pair.bodyA : pair.bodyB;
      const bombBody = engine.world.bodies.find((b) => b.label === bodyToMove.label);

      Body.setVelocity(bombBody, { x: Matter.Common.random(-1, 1) * 10, y: 12 });
    }

    if (
      (pair.bodyA.label.indexOf('Bomb') >= 0 && pair.bodyB.label === 'Player') ||
      (pair.bodyA.label === 'Player' && pair.bodyB.label.indexOf('Bomb') >= 0)
    ) {
      Matter.Events.off(engine.runner, '', undefined);
      Matter.Events.off(engine.engine, '', undefined);
      Runner.stop(engine.runner);
      Engine.clear(engine.engine);
      World.clear(engine.engine.world, false);
      engine.socket.emit('gameOver');
      engine.socket.disconnect();
    }

    if (
      (pair.bodyA.label === 'Player' && pair.bodyB.label.indexOf('Star') >= 0) ||
      (pair.bodyA.label.indexOf('Star') >= 0 && pair.bodyB.label === 'Player')
    ) {
      engine.score += 10;
      const bodyToRemove = pair.bodyA.label.indexOf('Star') >= 0 ? pair.bodyA : pair.bodyB;
      const star = engine.stars.find((s) => s.body.name === bodyToRemove.label);
      star.disabled = true;

      Body.setPosition(bodyToRemove, { x: 1000, y: 1000 });
    }
  });
}
