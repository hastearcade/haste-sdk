import { Body } from 'matter-js';
import { HasteBody } from '../game/gameState';

export const mapMattertoHasteBody = (b: Body) => {
  return {
    x: b.position.x,
    y: b.position.y,
    name: b.label,
    angle: b.angle,
  } as HasteBody;
};
