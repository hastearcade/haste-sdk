/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HasteGame } from '../game/hasteGame';
import { HasteGameState } from '../models/gameState';
import { Button } from '../game-objects/button';
import { configureClient } from '../utils/auth';

declare const __API_HOST__: string;

export class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;
  private loginButton: Button;
  private auth0: any;
  private isAuthenticated: boolean;

  constructor() {
    super({
      key: 'BootScene',
    });
  }

  login() {
    this.auth0.loginWithRedirect({
      redirect_uri: window.location.origin,
    });
  }

  create() {
    if (!this.isAuthenticated) {
      this.loginButton = new Button(this, 50, 25, 'Login', { fill: '#f00' }, () => this.login());
      this.add.existing(this.loginButton);
    } else {
      // eslint-disable-next-line no-console
      console.log('here');
      const hasteGame = this.game as HasteGame;
      hasteGame.state = this.cache.json.get('gameState') as HasteGameState;
      this.scene.start('GameScene', { auth: this.auth0 });
    }
  }

  preload(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    configureClient().then((val) => {
      this.auth0 = val;

      if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        this.auth0.handleRedirectCallback().then((val) => {
          window.history.replaceState({}, document.title, '/');
          this.auth0.isAuthenticated().then((val) => {
            this.isAuthenticated = val;
          });
        });
      } else {
        this.auth0.isAuthenticated().then((val) => {
          this.isAuthenticated = val;
        });
      }
    });

    // set the background and create loading bar
    this.cameras.main.setBackgroundColor(0x98d687);
    this.createLoadingbar();

    // pass value to change the loading bar fill
    this.load.on(
      'progress',
      (value: number) => {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xfff6d3, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16,
        );
      },
      this,
    );

    // delete bar graphics, when loading complete
    this.load.on(
      'complete',
      () => {
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this,
    );

    // load out package
    this.load.pack('preload', './assets/pack.json', 'preload');
    this.load.json('gameState', `${__API_HOST__}/getInitialGameState`);
  }

  private createLoadingbar(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x5dae47, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20,
    );
    this.progressBar = this.add.graphics();
  }
}
