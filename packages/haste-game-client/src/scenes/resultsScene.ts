import { HasteGame } from '../game/hasteGame';
import { GameSceneData } from '../models/gameState';
import { Button } from '../game-objects/button';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { Leaderboard } from '../game-objects/leaderboard';
import { Leader } from '@haste-sdk/domain';

// The ResultsScene loads the leaderboard with the
// top results
export class ResultsScene extends Phaser.Scene {
  private auth0: Auth0Client;
  logoutButton: Button;
  leaderboard: Leaderboard;

  constructor() {
    super({
      key: 'ResultsScene',
    });
  }

  init(data: GameSceneData) {
    const hasteGame = this.game as HasteGame;
    this.auth0 = data.auth;
    this.addLogoutButton();

    hasteGame.socketManager.gameGetLeadersCompletedEvent.on((data: Leader[]) => {
      this.leaderboard = new Leaderboard(this, 300, 100, data);
      this.add.existing(this.leaderboard);
    });

    hasteGame.socketManager.gameGetLeadersEvent.emit(hasteGame.selectedLeaderboardId);
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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.auth0.logout({
        returnTo: window.location.origin,
      });
      resolve(undefined);
    });
  }
}
