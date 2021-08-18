import { HasteGameState } from '@haste-sdk/haste-game-domain';
import Matter, { Body } from 'matter-js';
import { mapMattertoHasteBody } from '../../util/helper';
import { GameEngine } from '../gameEngine';

// this is the primary code that maintains
// the game state. The matter-js physics simulation
// does most of the work, but based on the game play
// the game developer must direct to matter-js inputs
// go into the simulation. In this game its focused on
// things like stars being collected, a player moving, and
// applying forces to the bombs to keep them moving around
// the screen
export function afterUpdateListener(
  event: Matter.IEventTimestamped<Matter.Engine>,
  source: Matter.Engine,
  engine: GameEngine,
) {
  const collectedStars = engine.stars.filter((s) => s.disabled).length;

  if (collectedStars === 12) {
    for (let i = 0; i < 12; i++) {
      engine.stars[i].disabled = false;
      const newStar = engine.world.bodies.find((b) => b.label === `Star${i}`);

      if (!newStar) throw new Error(`A star is missing from the world with label Star${i}`);

      Body.setPosition(newStar, { x: 12 + 70 * i, y: 0 });
    }
  }

  const player = engine.world.bodies.find((b) => b.label === `Player`);
  if (!player) throw new Error(`The player could not be found`);
  engine.player.body = mapMattertoHasteBody(player);

  engine.stars.forEach((s, idx) => {
    const star = engine.world.bodies.find((b) => b.label === `Star${idx}`);
    if (!star) throw new Error(`A star could not be found with id Star${idx}`);
    s.body = mapMattertoHasteBody(star);
  });

  engine.bombs.forEach((b, idx) => {
    const bomb = engine.world.bodies.find((b) => b.label === `Bomb${idx}`);
    if (!bomb) throw new Error(`A bomb with id Bomb${idx} could not be found`);
    b.body = mapMattertoHasteBody(bomb);
  });

  const state = new HasteGameState(
    800,
    600,
    engine.player,
    engine.floor,
    engine.platforms,
    engine.stars,
    engine.bombs,
    engine.score,
  );
  if (engine.socket) engine.socket.emit('gameUpdate', state);
}
