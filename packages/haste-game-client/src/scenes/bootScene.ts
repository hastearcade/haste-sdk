import { HasteGame } from '../game/hasteGame';
import { GameSceneData } from '../models/gameState';
import { HasteGameState } from '@haste-sdk/haste-game-domain';
import { Button } from '../game-objects/button';
import { configureClient } from '../utils/auth';
import { Auth0Client } from '@auth0/auth0-spa-js';

export class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;
  private loginButton: Button;
  private startButton: Button;
  private auth0: Auth0Client;
  private isAuthenticated: boolean;

  constructor() {
    super({
      key: 'BootScene',
    });
  }

  async login() {
    await this.auth0.loginWithRedirect({
      redirect_uri: window.location.origin,
    });
  }

  async init(): Promise<void> {
    this.auth0 = await configureClient();
    const query = window.location.search;

    if (query.includes('code=') && query.includes('state=')) {
      await this.auth0.handleRedirectCallback();
      this.isAuthenticated = await this.auth0.isAuthenticated();
      window.history.replaceState({}, document.title, '/');
      if (this.isAuthenticated) {
        const hasteGame = this.game as HasteGame;
        await hasteGame.setupSocket(this.auth0);
      }
    } else {
      this.isAuthenticated = await this.auth0.isAuthenticated();
      if (this.isAuthenticated) {
        const hasteGame = this.game as HasteGame;
        await hasteGame.setupSocket(this.auth0);
      }
    }
  }

  update() {
    if (this.isAuthenticated !== undefined && this.loginButton === undefined) {
      if (!this.isAuthenticated) {
        this.loginButton = new Button(this, 50, 25, 'Login', { fill: '#f00' }, async (): Promise<void> => {
          return this.login();
        });
        this.add.existing(this.loginButton);
      } else {
        const hasteGame = this.game as HasteGame;

        this.startButton = new Button(this, 50, 25, 'Start', { fill: '#f00' }, (): Promise<void> => {
          hasteGame.socketManager.gameInitCompletedEvent.on((data: HasteGameState) => {
            hasteGame.state = data;
            this.scene.start('GameScene', { auth: this.auth0 } as GameSceneData);
          });

          hasteGame.socketManager.gameInitEvent.emit();
          return Promise.resolve();
        });
        this.add.existing(this.startButton);
      }
    }
  }

  preload() {
    this.cameras.main.setBackgroundColor(0x98d687);
    this.createLoadingbar();

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
