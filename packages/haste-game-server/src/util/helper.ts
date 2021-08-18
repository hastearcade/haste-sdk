import { Body } from 'matter-js';
import { HasteBody } from '@hastearcade/haste-game-domain';

// matter-js does not expose certain properties
// for the actual object. Most properties on Body
// are related to the AABB bounding box. This helper
// just converts to a simple object has the needed
// details from Body but is then augmented later with
// things like height and width. See BaseEntity in
// the game domain package.
export const mapMattertoHasteBody = (b: Body) => {
  return {
    x: b.position.x,
    y: b.position.y,
    name: b.label,
    angle: b.angle,
  } as HasteBody;
};
