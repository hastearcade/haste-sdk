import { Composite, Body } from 'matter-js';

export class HasteBody {
  x: number;
  y: number;
  height: number;
  width: number;
  name: string;
  angle: number;
}

export class HasteGameState {
  height: number;
  width: number;
  player: HasteBody;
  staticBodies: HasteBody[];
  stars: HasteBody[];
  bombs: HasteBody[];
  rectangle: HasteBody;

  private mapMattertoHasteBody(b: Body) {
    const { min, max } = b.bounds;
    return {
      x: b.position.x,
      y: b.position.y,
      width: max.x - min.x,
      height: max.y - min.y,
      name: b.label,
      angle: b.angle,
    } as HasteBody;
  }

  constructor(world: Composite, width: number, height: number) {
    this.height = height;
    this.width = width;

    this.staticBodies = world.bodies.filter((b) => b.isStatic).map((b) => this.mapMattertoHasteBody(b));
    this.rectangle = world.bodies.filter((b) => !b.isStatic).map((b) => this.mapMattertoHasteBody(b))[0];

    this.rectangle.width = 120;
    this.rectangle.height = 80;

    this.stars = [];
    this.bombs = [];
  }
}
