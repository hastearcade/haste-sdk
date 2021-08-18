import { HasteBody } from './hasteBody';

// a simple class to send down to the
// game client. The matter-js body does
// not track height and width of the needed object
// but rather tracks the height and width of the
// AABB bounding box. That will not work when trying
// to render objects though so this was created to send
// down to the client.
export class BaseEntity {
  body: HasteBody;
  width: number;
  height: number;

  constructor() {
    this.body = new HasteBody();
    this.width = 0;
    this.height = 0;
  }
}
