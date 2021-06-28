import Matter, { Bodies, Composite, Engine, Runner, World, Body } from 'matter-js';
import { Logger } from 'tslog';
import {
  Bomb,
  Floor,
  HasteGameState,
  Platform,
  Player,
  PlayerDirection,
  PlayerMovement,
  Star,
  Wall,
} from './gameState';
import { mapMattertoHasteBody } from '../util/helper';
import { Socket } from 'socket.io';

export class GameEngine {
  private engine: Engine;
  private world: World;
  private log: Logger;
  private runner: Runner;
  private score: number;
  private socket: Socket;

  private player: Player;
  private floor: Floor;
  private leftWall: Wall;
  private rightWall: Wall;
  private platforms: Platform[];
  private stars: Star[];
  private bombs: Bomb[];

  constructor(socket: Socket) {
    this.log = new Logger();
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.socket = socket;
    this.score = 0;

    this.init();
  }

  private movePlayer(movement: PlayerMovement) {
    const playerBody = this.world.bodies.find((b) => b.label === `Player`);
    if (movement.direction === PlayerDirection.LEFT) {
      Body.applyForce(playerBody, { x: playerBody.position.x, y: playerBody.position.y }, { x: -0.001, y: 0 });
    }
    if (movement.direction === PlayerDirection.RIGHT) {
      Body.applyForce(playerBody, { x: playerBody.position.x, y: playerBody.position.y }, { x: 0.001, y: 0 });
    }
    if (movement.direction === PlayerDirection.UP && !this.player.isUp) {
      this.player.isUp = true;
      Body.applyForce(playerBody, { x: playerBody.position.x, y: playerBody.position.y }, { x: 0, y: -0.05 });
    }
  }

  init() {
    Engine.clear(this.engine);
    World.clear(this.engine.world, false);

    if (this.runner) Runner.stop(this.runner);

    this.player = new Player();
    this.player.width = 30;
    this.player.height = 28;
    this.player.isUp = false;

    this.rightWall = new Wall();
    this.rightWall.width = 5;
    this.rightWall.height = 10000;
    this.leftWall = new Wall();
    this.leftWall.width = 5;
    this.leftWall.height = 10000;
    this.floor = new Floor();
    this.floor.width = 800;
    this.floor.height = 50;
    this.platforms = [];
    this.stars = [];
    this.bombs = [];
    this.score = 0;

    const playerBody = Bodies.rectangle(100, 450, this.player.width, this.player.height, {
      label: 'Player',
      restitution: 0.0,
      friction: 0.0,
      frictionAir: 0.05,
    });
    this.player.body = mapMattertoHasteBody(playerBody);

    const floor = Bodies.rectangle(400, 575, this.floor.width, this.floor.height, { isStatic: true, label: 'Floor' });
    this.floor.body = mapMattertoHasteBody(floor);

    const leftWall = Bodies.rectangle(0, 0, this.leftWall.width, this.leftWall.height, {
      isStatic: true,
      label: 'LeftWall',
    });
    this.leftWall.body = mapMattertoHasteBody(leftWall);

    const rightWall = Bodies.rectangle(800, 0, this.rightWall.width, this.rightWall.height, {
      isStatic: true,
      label: 'Right',
    });
    this.rightWall.body = mapMattertoHasteBody(rightWall);

    const platform1 = new Platform();
    platform1.height = 32;
    platform1.width = 400;
    const platform1Body = Bodies.rectangle(600, 400, platform1.width, platform1.height, {
      isStatic: true,
      label: 'Platform1',
    });
    platform1.body = mapMattertoHasteBody(platform1Body);
    this.platforms.push(platform1);

    const platform2 = new Platform();
    platform2.height = 32;
    platform2.width = 400;
    const platform2Body = Bodies.rectangle(50, 250, platform2.width, platform2.height, {
      isStatic: true,
      label: 'Platform2',
    });
    platform2.body = mapMattertoHasteBody(platform2Body);
    this.platforms.push(platform2);

    const platform3 = new Platform();
    platform3.height = 32;
    platform3.width = 400;
    const platform3Body = Bodies.rectangle(750, 220, platform3.width, platform3.height, {
      isStatic: true,
      label: 'Platform3',
    });
    platform3.body = mapMattertoHasteBody(platform3Body);
    this.platforms.push(platform3);

    for (let i = 0; i < 12; i++) {
      const star = new Star();
      star.height = 22;
      star.width = 24;

      const starBody = Bodies.rectangle(12 + i * 70, 0, star.width, star.height, {
        label: `Star${i}`,
      });

      star.body = mapMattertoHasteBody(starBody);
      this.stars.push(star);
      Composite.add(this.world, starBody);
    }

    // Add the newly minted bodies to our physics simulation
    Composite.add(this.world, floor);
    Composite.add(this.world, playerBody);
    Composite.add(this.world, platform1Body);
    Composite.add(this.world, platform2Body);
    Composite.add(this.world, platform3Body);
    Composite.add(this.world, leftWall);
    Composite.add(this.world, rightWall);
  }

  getInitialState(): HasteGameState {
    const initialState = new HasteGameState(
      800,
      600,
      this.player,
      this.floor,
      this.platforms,
      this.stars,
      this.bombs,
      this.score,
    );
    return initialState;
  }

  addBombs(timestamp: number): void {
    timestamp = Math.round(timestamp);

    if (timestamp !== 0 && timestamp % (10 * 1000) === 0) {
      const bomb = new Bomb();
      bomb.height = 14;
      bomb.width = 14;

      const bombBody = Bodies.rectangle(12, 0, bomb.width, bomb.height, {
        label: `Bomb${this.bombs.length}`,
        friction: 0,
        frictionAir: 0,
        restitution: 1,
      });

      bomb.body = mapMattertoHasteBody(bombBody);
      this.bombs.push(bomb);
      Body.setVelocity(bombBody, { x: Matter.Common.random(-1, 1) * 8, y: 12 });
      Composite.add(this.world, bombBody);
    }
  }

  play() {
    this.init();

    this.socket.on('playerUpdate', (movement: PlayerMovement) => {
      this.movePlayer(movement);
    });

    // Kick off the simulation and the render loops
    this.runner = Runner.run(this.engine);
    Matter.Events.on(this.runner, 'tick', (event) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.addBombs(event.timestamp);
    });

    Matter.Events.on(this.engine, 'afterUpdate', () => {
      const collectedStars = this.stars.filter((s) => s.disabled).length;

      if (collectedStars === 12) {
        for (let i = 0; i < 12; i++) {
          this.stars[i].disabled = false;
          const newStar = this.world.bodies.find((b) => b.label === `Star${i}`);
          Body.setPosition(newStar, { x: 12 + 70 * i, y: 0 });
        }
      }

      this.player.body = mapMattertoHasteBody(this.world.bodies.find((b) => b.label === `Player`));

      this.stars.forEach((s, idx) => {
        s.body = mapMattertoHasteBody(this.world.bodies.find((b) => b.label === `Star${idx}`));
      });

      this.bombs.forEach((b, idx) => {
        b.body = mapMattertoHasteBody(this.world.bodies.find((b) => b.label === `Bomb${idx}`));
      });

      const state = new HasteGameState(
        800,
        600,
        this.player,
        this.floor,
        this.platforms,
        this.stars,
        this.bombs,
        this.score,
      );
      if (this.socket) this.socket.emit('gameUpdate', state);
    });

    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      this.handleCollisions(event);
    });
  }

  handleCollisions(event: Matter.IEventCollision<Matter.Engine>) {
    const pairs = event.pairs;

    pairs.forEach((pair) => {
      if (pair.bodyA.label === 'Player' || pair.bodyB.label === 'Player') {
        this.player.isUp = false;
      }

      if (
        (pair.bodyA.label.indexOf('Bomb') >= 0 && pair.bodyB.label !== 'Player') ||
        (pair.bodyA.label !== 'Player' && pair.bodyB.label.indexOf('Bomb') >= 0)
      ) {
        const bodyToMove = pair.bodyA.label.indexOf('Bomb') >= 0 ? pair.bodyA : pair.bodyB;
        const bombBody = this.world.bodies.find((b) => b.label === bodyToMove.label);

        Body.setVelocity(bombBody, { x: Matter.Common.random(-1, 1) * 10, y: 12 });
        // eslint-disable-next-line no-console
        // Body.applyForce(bombBody, { x: bombBody.position.x, y: bombBody.position.y }, { x: randomX, y: randomY });
      }

      if (
        (pair.bodyA.label.indexOf('Bomb') >= 0 && pair.bodyB.label === 'Player') ||
        (pair.bodyA.label === 'Player' && pair.bodyB.label.indexOf('Bomb') >= 0)
      ) {
        Matter.Events.off(this.runner, '', undefined);
        Matter.Events.off(this.engine, '', undefined);
        Runner.stop(this.runner);
        Engine.clear(this.engine);
        World.clear(this.engine.world, false);
        this.socket.emit('gameOver');
        this.socket.disconnect();
      }

      if (
        (pair.bodyA.label === 'Player' && pair.bodyB.label.indexOf('Star') >= 0) ||
        (pair.bodyA.label.indexOf('Star') >= 0 && pair.bodyB.label === 'Player')
      ) {
        this.score += 10;
        const bodyToRemove = pair.bodyA.label.indexOf('Star') >= 0 ? pair.bodyA : pair.bodyB;
        const star = this.stars.find((s) => s.body.name === bodyToRemove.label);
        star.disabled = true;

        Body.setPosition(bodyToRemove, { x: 1000, y: 1000 });
      }
    });
  }
}
