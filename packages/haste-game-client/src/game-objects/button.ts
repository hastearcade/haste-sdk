// Phase Object to create an in game button
export class Button extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, style, callback: () => Promise<void>) {
    super(scene, x, y, text, style);

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState())
      .on('pointerout', () => this.enterButtonRestState())
      .on('pointerdown', () => this.enterButtonActiveState())
      .on('pointerup', async () => {
        this.enterButtonHoverState();
        await callback();
      });
  }

  enterButtonHoverState() {
    this.setStyle({ fill: '#ff0' });
  }

  enterButtonRestState() {
    this.setStyle({ fill: '#f00' });
  }

  enterButtonActiveState() {
    this.setStyle({ fill: '#0ff' });
  }
}
