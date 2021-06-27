import { Auth0Client } from '@auth0/auth0-spa-js';

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

export class Wall extends BaseEntity {}
export class Floor extends BaseEntity {}
export class Platform extends BaseEntity {}
export class Star extends BaseEntity {
  disabled: boolean;
}
export class Bomb extends BaseEntity {}

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
  platforms: Platform[];
  floor: Floor;
  stars: Star[];
  bombs: Bomb[];
  score: number;
}

export class GameSceneData {
  auth: Auth0Client;
}
