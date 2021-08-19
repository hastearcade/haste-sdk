import { Haste, Play } from '@hastearcade/server';
import Matter, { Body, Engine, Runner, World } from 'matter-js';
import { GameEngine } from '../gameEngine';

// directly the matter-js simulation on what
// to do when collisions between the various
// game objects occur.
export function collisionStartListener(
  event: Matter.IEventCollision<Matter.Engine>,
  source: Matter.Engine,
  engine: GameEngine,
  haste: Haste,
) {
  const pairs = event.pairs;

  for (const pair of pairs) {
    if (pair.bodyA.label === 'Player' || pair.bodyB.label === 'Player') {
      engine.player.isUp = false;
    }

    if (
      (pair.bodyA.label.indexOf('Bomb') >= 0 && pair.bodyB.label !== 'Player') ||
      (pair.bodyA.label !== 'Player' && pair.bodyB.label.indexOf('Bomb') >= 0)
    ) {
      const bodyToMove = pair.bodyA.label.indexOf('Bomb') >= 0 ? pair.bodyA : pair.bodyB;
      const bombBody = engine.world.bodies.find((b) => b.label === bodyToMove.label);

      if (!bombBody) throw new Error(`A bomb could not be found with label ${bodyToMove.label}`);

      Body.setVelocity(bombBody, { x: Matter.Common.random(-1, 1) * 10, y: 12 });
    }

    if (
      (pair.bodyA.label.indexOf('Bomb') >= 0 && pair.bodyB.label === 'Player') ||
      (pair.bodyA.label === 'Player' && pair.bodyB.label.indexOf('Bomb') >= 0)
    ) {
      engine.gameOver = true;
      Matter.Events.off(engine.runner, '', undefined);
      Matter.Events.off(engine.engine, '', undefined);
      Runner.stop(engine.runner);
      Engine.clear(engine.engine);
      World.clear(engine.engine.world, false);

      // submit the score to the haste api
      if (engine.currentPlay && engine.currentPlay.id && engine.currentPlay.id.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        haste.game.score(engine.currentPlay, engine.currentPlay.leaderboard, engine.score);

        // reset the play so it does not get used again.
        // this only matters if the user logs out before starting a new game.
        engine.currentPlay = new Play();
      }
      engine.socket.emit('gameOver');
    }

    if (
      (pair.bodyA.label === 'Player' && pair.bodyB.label.indexOf('Star') >= 0) ||
      (pair.bodyA.label.indexOf('Star') >= 0 && pair.bodyB.label === 'Player')
    ) {
      engine.score += 10;
      const bodyToRemove = pair.bodyA.label.indexOf('Star') >= 0 ? pair.bodyA : pair.bodyB;
      const star = engine.stars.find((s) => s.body.name === bodyToRemove.label);

      if (!star) throw new Error(`A star could not be found with id ${bodyToRemove.label}`);
      star.disabled = true;

      Body.setPosition(bodyToRemove, { x: 1000, y: 1000 });
    }
  }
}
