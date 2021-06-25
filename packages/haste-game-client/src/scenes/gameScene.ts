/* eslint-disable @typescript-eslint/no-unsafe-call */
import 'phaser';
import { Api } from '../api/api';
import { HasteGame } from '../game/hasteGame';

export class GameScene extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  groundSprite: Phaser.GameObjects.Sprite;
  rectangleSprite: Phaser.GameObjects.Sprite;
  score: number;
  scoreText: Phaser.GameObjects.Text;
  gameOver: boolean;
  api: Api;

  constructor() {
    super('GameScene');
    this.score = 0;
    this.api = new Api();
  }

  /*
  collectStar = (player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, star: Phaser.GameObjects.GameObject) => {
    star.destroy();

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.stars.countActive(true) === 0) {
      this.stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
      });

      this.stars.children.iterate((child) => {
        const body = child.body as Phaser.Physics.Arcade.Body;
        body.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(this.stars, this.platforms);
      this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

      const x = this.player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      const bomb = this.bombs.create(x, 16, 'bomb') as Phaser.GameObjects.GameObject;
      const bombBody = bomb.body as Phaser.Physics.Arcade.Body;
      bombBody.setBounce(1, 1);
      bombBody.setCollideWorldBounds(true);
      bombBody.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  };

  hitBomb = (player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, bomb: Phaser.GameObjects.GameObject) => {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    this.gameOver = true;
  };

  */

  init() {
    const hasteGame = this.game as HasteGame;
    this.add.sprite(400, 300, 'sky');
    this.cursors = this.input.keyboard.createCursorKeys();

    const ground = hasteGame.state.staticBodies.find((b) => b.name === 'Floor');
    this.groundSprite = this.add.sprite(ground.x, ground.y, 'ground').setDisplaySize(ground.width, ground.height);

    const rectangle = hasteGame.state.rectangle;
    this.rectangleSprite = this.add
      .sprite(rectangle.x, rectangle.y, 'ground')
      .setDisplaySize(rectangle.width, rectangle.height)
      .setAngle(rectangle.angle * (180 / Math.PI))
      .setTint(0xff0000);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.api.play();

    // let bg = this.add.sprite(0, 0, 'background');
    /*
    this.platforms = this.physics.add.staticGroup();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'dude');

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

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

    this.physics.add.collider(this.player, this.platforms);

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate((child) => {
      const body = child.body as Phaser.Physics.Arcade.Body;
      body.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', color: '#000' });

    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    */
  }

  update() {
    const hasteGame = this.game as HasteGame;
    const ground = hasteGame.state.staticBodies.find((b) => b.name === 'Floor');
    const rectangle = hasteGame.state.rectangle;

    this.rectangleSprite.setPosition(rectangle.x, rectangle.y).setAngle(rectangle.angle * (180 / Math.PI));
    this.groundSprite.setPosition(ground.x, ground.y);

    /*
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
    */
  }
}
