import { Actor, Logger } from 'excalibur';
import { Resources } from '../resources';

export class Logout extends Actor {
  constructor() {
    super({
      x: 200,
      y: 200,
    });
  }

  onInitialize() {
    this.addDrawing(Resources.Logout);

    this.enableCapturePointer = true;
    this.capturePointer.captureMoveEvents = true;
    this.capturePointer.captureDragEvents = true;

    this.on('pointerup', () => {
      alert("I've been clicked");
    });

    this.on('pointerenter', () => {
      Logger.getInstance().info('enter');
    });

    this.on('pointerleave', () => {
      Logger.getInstance().info('leave');
    });
  }
}
