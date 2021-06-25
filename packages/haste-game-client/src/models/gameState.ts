export class HasteBody {
  x: number;
  y: number;
  height: number;
  width: number;
  name: string;
  angle: number;
}

export class BaseEntity {
  body: HasteBody;
  width: number;
  height: number;
}

export class Player extends BaseEntity {
  isUp: boolean;
}

export class Rectangle extends BaseEntity {}

export enum PlayerDirection {
  LEFT,
  RIGHT,
  UP,
}
export class PlayerMovement {
  direction: PlayerDirection;
}

export class HasteGameState {
  height: number;
  width: number;
  player: Player;
  staticBodies: BaseEntity[];
  stars: HasteBody[];
  bombs: HasteBody[];
  rectangle: Rectangle;
}
