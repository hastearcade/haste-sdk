import Matter, { Bodies, Composite, Engine, Runner, World, Body } from 'matter-js';
import { Server } from 'socket.io';
import { GameNetwork } from './gameNetwork';
import { Logger } from 'tslog';
import { Floor, HasteGameState, Platform, Player, PlayerDirection, PlayerMovement } from './gameState';
import { mapMattertoHasteBody } from '../util/helper';

export class GameEngine {
  private engine: Engine;
  private server: Server;
  private network: GameNetwork;
  private world: World;
  private log: Logger;
  private runner: Runner;
  private playerBody: Body;

  private player: Player;
  private floor: Floor;
  private platforms: Platform[];

  constructor(server: Server) {
    this.log = new Logger();
    this.server = server;
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.network = new GameNetwork(this.server);

    this.init();
  }

  private movePlayer(movement: PlayerMovement) {
    if (movement.direction === PlayerDirection.LEFT) {
      Body.applyForce(
        this.playerBody,
        { x: this.playerBody.position.x, y: this.playerBody.position.y },
        { x: -0.001, y: 0 },
      );
    }
    if (movement.direction === PlayerDirection.RIGHT) {
      Body.applyForce(
        this.playerBody,
        { x: this.playerBody.position.x, y: this.playerBody.position.y },
        { x: 0.001, y: 0 },
      );
    }
    if (movement.direction === PlayerDirection.UP && !this.player.isUp) {
      this.player.isUp = true;
      Body.applyForce(
        this.playerBody,
        { x: this.playerBody.position.x, y: this.playerBody.position.y },
        { x: 0, y: -0.05 },
      );
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

    this.playerBody = Bodies.rectangle(100, 450, this.player.width, this.player.height, {
      label: 'Player',
      restitution: 0.0,
      friction: 0.01,
    });
    this.player.body = mapMattertoHasteBody(this.playerBody);

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

    // Add the newly minted bodies to our physics simulation
    Composite.add(this.world, floor);
    Composite.add(this.world, this.playerBody);
    Composite.add(this.world, platform1Body);
    Composite.add(this.world, platform2Body);
    Composite.add(this.world, platform3Body);
  }

  getInitialState(): HasteGameState {
    const initialState = new HasteGameState(800, 600, this.player, this.floor, this.platforms);
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
      this.player.body = mapMattertoHasteBody(this.world.bodies.filter((b) => b.label === 'Player')[0]);

      const state = new HasteGameState(800, 600, this.player, this.floor, this.platforms);
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
    });
  }
}
