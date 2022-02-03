import { HasteGame } from '../game/hasteGame';
import { GameSceneData } from '../models/gameState';
import { Button } from '../game-objects/button';
import { Leaderboard, HasteClient, HasteAuthentication } from '@hastearcade/web';

// The BootScene loads all the image assets,
// displays the login and start buttons, and
// handles the transition to the GameScene
export class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;
  private loginButton: Button;
  private isAuthenticated: boolean;
  private handlingAuth: boolean;
  private hasteClient: HasteClient;

  constructor() {
    super({
      key: 'BootScene',
    });
  }

  // This will take the user to the authentication
  // universal login screen and then redirect
  // back to the game. It assumes that your game
  // has the appropriately configured callback
  // urls.
  login() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.hasteClient.login();
  }

  init(): void {
    this.hasteClient = HasteClient.build(process.env.AUTH_URL, process.env.LOGIN_URL, process.env.HASTE_GAME_CLIENT_ID);
    const details = this.hasteClient.getTokenDetails();
    this.handleLoggedInUser(details);
  }

  handleLoggedInUser(hasteAuth: HasteAuthentication) {
    this.isAuthenticated = hasteAuth.isAuthenticated;
    if (hasteAuth.isAuthenticated) {
      const hasteGame = this.game as HasteGame;
      hasteGame.setupSocket(this.hasteClient);

      hasteGame.socketManager.gameGetLevelsCompletedEvent.on((data: Leaderboard[]) => {
        hasteGame.leaderboards = data;
        this.scene.start('LevelSelectionScene', { hasteClient: this.hasteClient } as GameSceneData);
      });

      setTimeout(() => {
        hasteGame.socketManager.gameGetLevelsEvent.emit();
      }, 5000); // TODO There does not appear to be a way to await the socket-io connection
    }
  }

  // As part of the Phaser lifecycle, update is called at every
  // tick. Its important not to instantite things multiple times which
  // is why the if guard is there.
  update() {
    if (this.isAuthenticated !== undefined) {
      if (!this.isAuthenticated) {
        if (this.loginButton === undefined) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.loginButton = new Button(this, 50, 25, 'Play Game', { fill: '#f00' }, (): Promise<void> => {
            return new Promise((resolve) => {
              this.login();
              resolve();
            });
          });
          this.add.existing(this.loginButton);
        }
      } else {
        if (this.loginButton) {
          this.children.remove(this.loginButton);
        }
      }
    }
  }

  // Loads all the image assets and uses a loader
  // while they are being loaded. Its normally pretty
  // quick though
  preload() {
    this.cameras.main.setBackgroundColor(0xadd8e6);
    this.createLoadingbar();

    this.load.on(
      'progress',
      (value: number) => {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x77c3ec, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16,
        );
      },
      this,
    );

    this.load.on(
      'complete',
      () => {
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this,
    );

    this.load.pack('preload', './assets/pack.json', 'preload');
  }

  private createLoadingbar(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0xadd8e6, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20,
    );
    this.progressBar = this.add.graphics();
  }
}
