import { Leaderboard } from '@haste-sdk/sdk-client';
import { Scene } from 'phaser';
import { Button } from './button';

export class Levels extends Phaser.GameObjects.Container {
  private leaderboards: Leaderboard[];

  constructor(
    scene: Scene,
    x: number,
    y: number,
    leaderboards: Leaderboard[],
    selectedLevelCallback: (level: string) => Promise<void>,
  ) {
    super(scene, x, y);
    this.leaderboards = leaderboards;

    this.leaderboards.forEach((instance, index) => {
      const instanceButton = new Button(
        scene,
        20,
        50 + index * 20,
        `${instance.name} - ${instance.cost}`,
        { fill: '#f00' },
        async () => {
          return await selectedLevelCallback(instance.id);
        },
      );
      this.add(instanceButton);
    });
  }
}
