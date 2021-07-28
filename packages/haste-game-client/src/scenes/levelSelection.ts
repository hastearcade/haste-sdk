import { HasteGame } from '../game/hasteGame';
import { GameSceneData } from '../models/gameState';
import { Button } from '../game-objects/button';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { Levels } from '../game-objects/levels';
import { HasteGameState } from '@haste-sdk/haste-game-domain';

// The LevelSelectionScene loads the levels available
// from the arcade and allows the user to select
// which level they will play. Each level will
// have a different cost associated with it.
export class LevelSelectionScene extends Phaser.Scene {
  private auth0: Auth0Client;
  logoutButton: Button;
  levels: Levels;

  constructor() {
    super({
      key: 'LevelSelectionScene',
    });
  }

  init(data: GameSceneData) {
    const hasteGame = this.game as HasteGame;
    this.auth0 = data.auth;
    this.addLogoutButton();
    this.levels = new Levels(
      this,
      300,
      100,
      hasteGame.leaderboards,
      async (leaderboardId: string): Promise<void> => {
        return new Promise<void>((resolve) => {
          hasteGame.socketManager.gameInitCompletedEvent.on((data: HasteGameState) => {
            hasteGame.state = data;
            // once a user is authenticated and hits the start button
            // transition to the main game. Pass in auth0 to support the logout
            // button
            this.scene.start('GameScene', { auth: this.auth0 } as GameSceneData);
          });

          hasteGame.selectedLeaderboardId = leaderboardId;
          hasteGame.socketManager.gameInitEvent.emit(leaderboardId);
          resolve();
        });
      },
    );
    this.add.existing(this.levels);
  }

  private addLogoutButton() {
    this.logoutButton = new Button(this, 700, 20, 'Logout', { fill: '#f00' }, async () => {
      return await this.logout();
    });
    this.add.existing(this.logoutButton);
  }

  preload() {
    this.cameras.main.setBackgroundColor(0x98d687);
  }

  async logout() {
    await new Promise((resolve) => {
      const hasteGame = this.game as HasteGame;
      hasteGame.socketManager.logoutEvent.emit();
      this.auth0.logout({
        returnTo: window.location.origin,
      });
      resolve(undefined);
    });
  }
}
