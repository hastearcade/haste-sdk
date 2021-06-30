import Matter, { Bodies, Composite, Engine, Runner, World, Body } from 'matter-js';
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
} from '@haste-sdk/haste-game-domain';
import { mapMattertoHasteBody } from '../util/helper';
import { Socket } from 'socket.io';
import { GameEngineActionFn, GameEngineEvent, WrappedGameEngineEvent } from './gameEngineEventTypes';
import * as listeners from './listeners';
import { Play } from '@haste-sdk/domain';
import { Haste } from '@haste-sdk/sdk';

// controls the initialization of the matter-js simulation
// as well as managing the events throughout the system
export class GameEngine {
  private leftWall: Wall;
  private rightWall: Wall;

  engine: Engine;
  runner: Runner;
  world: World;
  score: number;
  socket: Socket;

  player: Player;
  floor: Floor;

  platforms: Platform[];
  stars: Star[];
  bombs: Bomb[];

  currentPlay: Play;
  haste: Haste;

  constructor(socket: Socket, haste: Haste) {
    this.haste = haste;
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.socket = socket;

    this.init();
  }

  init() {
    Engine.clear(this.engine);
    World.clear(this.engine.world, false);
    if (this.runner) Runner.stop(this.runner);

    this.bombs = [];
    this.score = 0;

    this.initializePlayer();
    this.initializeLevel();
    this.initializeLevelPlatforms();
    this.initializeStars();
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

  play() {
    this.init();
    this.runner = Runner.run(this.engine);
    this.initializeEvents();
  }

  movePlayer(movement: PlayerMovement) {
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

  addBombs(timestamp: number): void {
    timestamp = Math.round(timestamp);

    if (timestamp !== 0 && timestamp % (10 * 1000) === 0) {
      const bomb = new Bomb();
      bomb.height = 14;
      bomb.width = 14;

      const bombBody = Bodies.rectangle(Math.random() * (750 - 10) + 10, 0, bomb.width, bomb.height, {
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

  private initializeEvents() {
    const registeredRunnerEvents = this.getRunnerEvents();
    registeredRunnerEvents.forEach(({ source, eventName, callback }) => {
      Matter.Events.on(source, eventName, (matterEvent) => {
        callback(matterEvent, source, this, this.haste);
      });
    });

    const registeredEngineEvents = this.getEngineEvents();
    registeredEngineEvents.forEach(({ source, eventName, callback }) => {
      Matter.Events.on(source, eventName, (matterEvent) => {
        callback(matterEvent, source, this, this.haste);
      });
    });
  }

  private getRunnerEvents() {
    const tickListener = this.createGameEngineEvent<Matter.Runner, Matter.IEventTimestamped<Matter.Runner>>(
      this.runner,
      'tick',
      listeners.tickListener,
    );
    return [tickListener];
  }

  private getEngineEvents() {
    const afterUpdateListener = this.createGameEngineEvent<Matter.Engine, Matter.IEventTimestamped<Matter.Engine>>(
      this.engine,
      'afterUpdate',
      listeners.afterUpdateListener,
    );

    const collisionStartListener = this.createGameEngineEvent<Matter.Engine, Matter.IEventCollision<Matter.Engine>>(
      this.engine,
      'collisionStart',
      listeners.collisionStartListener,
    );
    return [afterUpdateListener, collisionStartListener];
  }

  private createGameEngineEvent<T, R>(
    source: T,
    eventName: GameEngineEvent,
    callback: GameEngineActionFn<T, R>,
  ): WrappedGameEngineEvent<T, R> {
    return { source, eventName, callback };
  }

  private initializeStars() {
    this.stars = [];
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
  }

  private initializeLevelPlatforms() {
    this.platforms = [];
    const platform1Body = this.initializePlatform('Platform1', 32, 400, 600, 400);
    Composite.add(this.world, platform1Body);

    const platform2Body = this.initializePlatform('Platform2', 32, 400, 50, 250);
    Composite.add(this.world, platform2Body);

    const platform3Body = this.initializePlatform('Platform3', 32, 400, 750, 220);
    Composite.add(this.world, platform3Body);
  }

  private initializePlatform(label: string, height: number, width: number, x: number, y: number) {
    const platform = new Platform();
    platform.height = height;
    platform.width = width;
    const platformBody = Bodies.rectangle(x, y, platform.width, platform.height, {
      isStatic: true,
      label: label,
    });
    platform.body = mapMattertoHasteBody(platformBody);
    this.platforms.push(platform);
    return platformBody;
  }

  private initializeLevel() {
    this.rightWall = new Wall();
    this.rightWall.width = 5;
    this.rightWall.height = 10000;
    this.leftWall = new Wall();
    this.leftWall.width = 5;
    this.leftWall.height = 10000;
    this.floor = new Floor();
    this.floor.width = 800;
    this.floor.height = 50;

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

    Composite.add(this.world, floor);
    Composite.add(this.world, leftWall);
    Composite.add(this.world, rightWall);
  }

  private initializePlayer() {
    this.player = new Player();
    this.player.width = 30;
    this.player.height = 28;
    this.player.isUp = false;

    const playerBody = Bodies.rectangle(100, 450, this.player.width, this.player.height, {
      label: 'Player',
      restitution: 0.0,
      friction: 0.0,
      frictionAir: 0.05,
    });
    this.player.body = mapMattertoHasteBody(playerBody);

    Composite.add(this.world, playerBody);
  }
}
