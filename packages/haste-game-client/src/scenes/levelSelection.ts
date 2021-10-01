import { HasteGame } from '../game/hasteGame';
import { GameSceneData } from '../models/gameState';
import { Button } from '../game-objects/button';
import { Levels } from '../game-objects/levels';
import { HasteGameState } from '@hastearcade/haste-game-domain';
import { HasteClient } from '@hastearcade/web';

// The LevelSelectionScene loads the levels available
// from the arcade and allows the user to select
// which level they will play. Each level will
// have a different cost associated with it.
export class LevelSelectionScene extends Phaser.Scene {
  private hasteClient: HasteClient;
  logoutButton: Button;
  levels: Levels;

  constructor() {
    super({
      key: 'LevelSelectionScene',
    });
  }

  init(data: GameSceneData) {
    const hasteGame = this.game as HasteGame;
    this.hasteClient = data.hasteClient;
    this.addLogoutButton();
    this.levels = new Levels(this, 300, 100, hasteGame.leaderboards, async (leaderboardId: string): Promise<void> => {
      return new Promise<void>((resolve) => {
        hasteGame.socketManager.gameInitCompletedEvent.on((data: HasteGameState) => {
          hasteGame.state = data;
          // once a user is authenticated and hits the start button
          // transition to the main game. Pass in authentication service to support the logout
          // button
          this.scene.start('GameScene', { hasteClient: this.hasteClient } as GameSceneData);
        });

        hasteGame.selectedLeaderboardId = leaderboardId;
        hasteGame.socketManager.gameInitEvent.emit(leaderboardId);
        resolve();
      });
    });

    hasteGame.socketManager.gameError.on((data: string) => {
      const errorText = new Phaser.GameObjects.Text(this, 40, 10, data, {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        color: '#F00',
      });

      this.add.existing(errorText);
    });

    this.add.existing(this.levels);
  }

  private addLogoutButton() {
    this.logoutButton = new Button(this, 700, 20, 'Logout', { fill: '#f00' }, async () => {
      return await this.logout();
    });
    this.add.existing(this.logoutButton);
  }

  preload() {
    this.cameras.main.setBackgroundColor(0xadd8e6);
  }

  async logout() {
    await new Promise((resolve) => {
      const hasteGame = this.game as HasteGame;
      hasteGame.socketManager.logoutEvent.emit();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.hasteClient.logout();
      resolve(undefined);
    });
  }
}
