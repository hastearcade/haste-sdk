import { BaseEntity } from './baseEntity';

export class Player extends BaseEntity {
  isUp: boolean;
  constructor() {
    super();
    this.isUp = false;
  }
}

export enum PlayerDirection {
  LEFT,
  RIGHT,
  UP,
}
export class PlayerMovement {
  direction: PlayerDirection;

  constructor() {
    this.direction = PlayerDirection.LEFT;
  }
}
