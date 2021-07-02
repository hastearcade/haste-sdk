import { Leader } from '@haste-sdk/domain';
import { Scene } from 'phaser';

export class Leaderboard extends Phaser.GameObjects.Container {
  private leaders: Leader[];

  constructor(scene: Scene, x: number, y: number, leaders: Leader[]) {
    super(scene, x, y);
    this.leaders = leaders;

    const topLine = new Phaser.GameObjects.Line(scene, 10, 10, 0, 30, 200, 30);
    topLine.setOrigin(0, 0);
    topLine.setStrokeStyle(5, 0xff0000, 1);
    this.add(topLine);

    const verticalLine = new Phaser.GameObjects.Line(scene, 10, 10, 100, 0, 100, 200);
    verticalLine.setOrigin(0, 0);
    verticalLine.setStrokeStyle(5, 0xff0000, 1);
    this.add(verticalLine);

    const nameText = new Phaser.GameObjects.Text(scene, 40, 10, 'Name', {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      color: '#F00',
    });
    this.add(nameText);

    const scoreText = new Phaser.GameObjects.Text(scene, 130, 10, 'Score', {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      color: '#F00',
    });
    this.add(scoreText);

    this.leaders.forEach((leader, index) => {
      const leaderName = new Phaser.GameObjects.Text(
        scene,
        20,
        50 + index * 20,
        leader.name ? leader.name.substr(0, 10) : leader.playerId.substr(0, 10),
        {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          color: '#F00',
        },
      );

      this.add(leaderName);

      const leaderScore = new Phaser.GameObjects.Text(scene, 130, 50 + index * 20, `${leader.score}`, {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        color: '#F00',
      });
      this.add(leaderScore);
    });
  }
}
