import { HasteGameState } from '@haste-sdk/haste-game-domain';
import Matter, { Body } from 'matter-js';
import { mapMattertoHasteBody } from '../../util/helper';
import { GameEngine } from '../gameEngine';

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
      Body.setPosition(newStar, { x: 12 + 70 * i, y: 0 });
    }
  }

  engine.player.body = mapMattertoHasteBody(engine.world.bodies.find((b) => b.label === `Player`));

  engine.stars.forEach((s, idx) => {
    s.body = mapMattertoHasteBody(engine.world.bodies.find((b) => b.label === `Star${idx}`));
  });

  engine.bombs.forEach((b, idx) => {
    b.body = mapMattertoHasteBody(engine.world.bodies.find((b) => b.label === `Bomb${idx}`));
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
