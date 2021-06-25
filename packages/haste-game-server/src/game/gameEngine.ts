import Matter, { Bodies, Composite, Engine, Runner, World, Body } from 'matter-js';
import { Server } from 'socket.io';
import { GameNetwork } from './gameNetwork';
import { Logger } from 'tslog';
import { Floor, HasteGameState, Player, PlayerDirection, PlayerMovement, Rectangle } from './gameState';
import { mapMattertoHasteBody } from '../util/helper';

export class GameEngine {
  private engine: Engine;
  private server: Server;
  private network: GameNetwork;
  private world: World;
  private log: Logger;
  private runner: Runner;
  private playerBody: Body;

  private rect: Rectangle;
  private player: Player;
  private floor: Floor;

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

    this.rect = new Rectangle();
    this.rect.height = 80;
    this.rect.width = 120;

    this.player = new Player();
    this.player.width = 30;
    this.player.height = 40;
    this.player.isUp = false;

    this.floor = new Floor();
    this.floor.width = 800;
    this.floor.height = 50;

    // Create a rectangle centered at the top of the screen, (400, 0), with 120px width and 80px height
    const rectangle = Bodies.rectangle(400, 0, this.rect.width, this.rect.height, {
      restitution: 0.25,
      angle: Math.PI / 4,
      label: 'Rectangle',
    });
    this.rect.body = mapMattertoHasteBody(rectangle);

    this.playerBody = Bodies.rectangle(100, 450, this.player.width, this.player.height, {
      label: 'Player',
      restitution: 0.0,
      friction: 0.01,
    });
    this.player.body = mapMattertoHasteBody(this.playerBody);

    // Create an immovable rectangle at the bottom of the screen that will act as the floor
    const floor = Bodies.rectangle(400, 575, this.floor.width, this.floor.height, { isStatic: true, label: 'Floor' });
    this.floor.body = mapMattertoHasteBody(floor);

    // Add the newly minted bodies to our physics simulation
    Composite.add(this.world, rectangle);
    Composite.add(this.world, floor);
    Composite.add(this.world, this.playerBody);
  }

  getInitialState(): HasteGameState {
    const initialState = new HasteGameState(this.world, 800, 600, this.rect, this.player, this.floor);
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
      this.rect.body = mapMattertoHasteBody(this.world.bodies.filter((b) => b.label === 'Rectangle')[0]);
      this.player.body = mapMattertoHasteBody(this.world.bodies.filter((b) => b.label === 'Player')[0]);

      const state = new HasteGameState(this.world, 800, 600, this.rect, this.player, this.floor);
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
