import { Engine, DisplayMode } from 'excalibur';

export class HasteGame extends Engine {
  constructor() {
    super({ displayMode: DisplayMode.Container });
  }

  public start() {
    return super.start();
  }
}
