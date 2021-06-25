import Matter, { Bodies, Composite, Engine, Runner, World, Body } from 'matter-js';
import { Server } from 'socket.io';
import { GameNetwork } from './gameNetwork';
import { Logger } from 'tslog';
import { Floor, HasteGameState, Platform, Player, PlayerDirection, PlayerMovement, Star } from './gameState';
import { mapMattertoHasteBody } from '../util/helper';

export class GameEngine {
  private engine: Engine;
  private server: Server;
  private network: GameNetwork;
  private world: World;
  private log: Logger;
  private runner: Runner;
  private score: number;

  private player: Player;
  private floor: Floor;
  private platforms: Platform[];
  private stars: Star[];

  constructor(server: Server) {
    this.log = new Logger();
    this.server = server;
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.network = new GameNetwork(this.server);
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
    this.player.height = 40;
    this.player.isUp = false;

    this.floor = new Floor();
    this.floor.width = 800;
    this.floor.height = 50;
    this.platforms = [];
    this.stars = [];
    this.score = 0;

    const playerBody = Bodies.rectangle(100, 450, this.player.width, this.player.height, {
      label: 'Player',
      restitution: 0.0,
      friction: 0.01,
    });
    this.player.body = mapMattertoHasteBody(playerBody);

    // Create an immovable rectangle at the bottom of the screen that will act as the floor
    const floor = Bodies.rectangle(400, 575, this.floor.width, this.floor.height, { isStatic: true, label: 'Floor' });
    this.floor.body = mapMattertoHasteBody(floor);

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
  }

  getInitialState(): HasteGameState {
    const initialState = new HasteGameState(800, 600, this.player, this.floor, this.platforms, this.stars, this.score);
    return initialState;
  }

  play() {
    this.init();

    this.network.socket.on('playerUpdate', (movement: PlayerMovement) => {
      this.movePlayer(movement);
    });

    // Kick off the simulation and the render loops
    this.runner = Runner.run(this.engine);
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

      const state = new HasteGameState(800, 600, this.player, this.floor, this.platforms, this.stars, this.score);
      if (this.network && this.network.socket) this.network.socket.emit('gameUpdate', state);
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
