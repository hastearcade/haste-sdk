import Matter, { Bodies, Composite, Engine, Runner, World, Gravity } from 'matter-js';
import { Server } from 'socket.io';
import { GameNetwork } from './gameNetwork';
import { Logger } from 'tslog';
import { HasteBody, HasteGameState } from './gameState';

export class GameEngine {
  private engine: Engine;
  private server: Server;
  private network: GameNetwork;
  private world: World;
  private log: Logger;
  private runner: Runner;

  constructor(server: Server) {
    this.log = new Logger();
    this.server = server;
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.network = new GameNetwork(this.server);
    this.init();
  }

  init() {
    Engine.clear(this.engine);
    World.clear(this.engine.world, false);
    if (this.runner) Runner.stop(this.runner);

    // Create a rectangle centered at the top of the screen, (400, 0), with 120px width and 80px height
    const rectangle = Bodies.rectangle(400, 0, 120, 80, { restitution: 0.25, angle: Math.PI / 4 });

    // Create an immovable rectangle at the bottom of the screen that will act as the floor
    const floor = Bodies.rectangle(400, 575, 800, 50, { isStatic: true, label: 'Floor' });

    // Add the newly minted bodies to our physics simulation
    Composite.add(this.world, rectangle);
    Composite.add(this.world, floor);
  }

  getInitialState(): HasteGameState {
    const initialState = new HasteGameState(this.world, 800, 600);
    const player = { x: 10, y: 10, name: 'Player' } as HasteBody;
    initialState.player = player;
    return initialState;
  }

  play() {
    this.init();
    // Kick off the simulation and the render loops
    this.runner = Runner.run(this.engine);
    Matter.Events.on(this.engine, 'afterUpdate', () => {
      const state = new HasteGameState(this.world, 800, 600);
      if (this.network && this.network.socket) this.network.socket.emit('gameUpdate', state);
    });
  }
}
