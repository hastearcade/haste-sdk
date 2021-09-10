import { BaseEntity } from './baseEntity';

export class Star extends BaseEntity {
  disabled: boolean;

  constructor() {
    super();
    this.disabled = false;
  }
}