import { Auth0Client } from '@auth0/auth0-spa-js';
import 'phaser';
import { Api } from '../api/api';
import { Button } from '../game-objects/button';
import { HasteGame } from '../game/hasteGame';
import { GameSceneData, PlayerDirection, PlayerMovement } from '../models/gameState';

export class GameScene extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  playerSprite: Phaser.GameObjects.Sprite;
  starSprites: Map<string, Phaser.GameObjects.Sprite>;
  bombSprites: Map<string, Phaser.GameObjects.Sprite>;
  scoreText: Phaser.GameObjects.Text;
  gameOver: boolean;
  api: Api;
  private logoutButton: Button;
  auth0: Auth0Client;

  constructor() {
    super('GameScene');
    this.api = new Api();
    this.starSprites = new Map<string, Phaser.GameObjects.Sprite>();
    this.bombSprites = new Map<string, Phaser.GameObjects.Sprite>();
  }

  async logout() {
    await new Promise((resolve) => {
      this.auth0.logout({
        returnTo: window.location.origin,
      });
      resolve(undefined);
    });
  }

  destroyBombSprites() {
    this.bombSprites.forEach((bombSprite) => {
      bombSprite.destroy();
    });
  }

  init(data: GameSceneData) {
    this.destroyBombSprites();
    this.auth0 = data.auth;
    const hasteGame = this.game as HasteGame;
    this.add.sprite(400, 300, 'sky');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.logoutButton = new Button(this, 700, 20, 'Logout', { fill: '#f00' }, async () => {
      return await this.logout();
    });
    this.add.existing(this.logoutButton);

    const ground = hasteGame.state.floor;
    this.add.sprite(ground.body.x, ground.body.y, 'ground').setDisplaySize(ground.width, ground.height);

    const platforms = hasteGame.state.platforms;
    platforms.forEach((platform) => {
      this.add.sprite(platform.body.x, platform.body.y, 'ground').setDisplaySize(platform.width, platform.height);
    });

    const stars = hasteGame.state.stars;
    stars.forEach((star) => {
      const starSprite = this.add.sprite(star.body.x, star.body.y, 'star').setDisplaySize(star.width, star.height);
      this.starSprites.set(star.body.name, starSprite);
    });

    this.bombSprites = new Map<string, Phaser.GameObjects.Sprite>();

    const player = hasteGame.state.player;
    this.playerSprite = this.add.sprite(player.body.x, player.body.y, 'dude').setOrigin(0.5, 0.5);

    this.api.play();

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', color: '#000' });

    hasteGame.socket.on('gameOver', () => {
      this.playerSprite.anims.play('turn');
      this.input.keyboard.enabled = false;
      this.playerSprite.setTint(0xff0000);
      this.playerSprite.anims.play('turn');
      this.gameOver = true;
    });
  }

  update() {
    const hasteGame = this.game as HasteGame;
    const player = hasteGame.state.player;
    const stars = hasteGame.state.stars;
    const bombs = hasteGame.state.bombs;

    bombs.forEach((bomb) => {
      const sprite = this.bombSprites.get(bomb.body.name);
      if (sprite === undefined) {
        const bombSprite = this.add.sprite(bomb.body.x, bomb.body.y, 'bomb').setDisplaySize(bomb.width, bomb.height);
        this.bombSprites.set(bomb.body.name, bombSprite);
      } else {
        sprite.setPosition(bomb.body.x, bomb.body.y);
      }
    }, this);

    this.playerSprite.setPosition(player.body.x, player.body.y);
    stars.forEach((s) => {
      const sprite = this.starSprites.get(s.body.name);

      if (s.disabled) {
        sprite.setAlpha(0);
      } else {
        sprite.setAlpha(1);
        sprite.setPosition(s.body.x, s.body.y);
      }
    }, this);

    this.scoreText.setText(`Score: ${hasteGame.state.score}`);

    if (this.cursors.left.isDown) {
      this.playerSprite.anims.play('left', true);
      hasteGame.socket.emit('playerUpdate', { direction: PlayerDirection.LEFT } as PlayerMovement);
    } else if (this.cursors.right.isDown) {
      this.playerSprite.anims.play('right', true);
      hasteGame.socket.emit('playerUpdate', { direction: PlayerDirection.RIGHT } as PlayerMovement);
    } else {
      this.playerSprite.anims.play('turn');
    }

    if (this.cursors.up.isDown) {
      hasteGame.socket.emit('playerUpdate', { direction: PlayerDirection.UP } as PlayerMovement);
    }
  }
}
