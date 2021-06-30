import { BaseEntity } from './baseEntity';

export class Player extends BaseEntity {
  isUp: boolean;
}

export enum PlayerDirection {
  LEFT,
  RIGHT,
  UP,
}
export class PlayerMovement {
  direction: PlayerDirection;
}
