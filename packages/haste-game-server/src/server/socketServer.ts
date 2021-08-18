/* eslint-disable @typescript-eslint/no-misused-promises */
// The type for socket.on is not defined correctly. Thus, have to ignore the typescript error on no-misused-promises

import http from 'http';
import { Server, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { GameEngine } from '../game/gameEngine';
import { Haste } from '@haste-sdk/sdk';
import { SocketActionFn, SocketMessage, WrappedServerSocket } from './socketServerTypes';
import * as listeners from './listeners';
import { PlayerMovement } from '@haste-sdk/haste-game-domain';

// The socket server is the primary communication mechanism
// between the game client and the game server. On the client its
// corresponding class is SocketManager. The socket server handles
// verifying the JWT sent down from the client once a user logins
// and it handles the management of all game and server events.
// This may not be necessary for all game types, but it does create
// a good real time user experience and aids in the creation of the
// authoritative server.
export class SocketServer {
  private io: Server;
  private playerId: string;
  private haste: Haste;

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.use(this.jwtMiddleware);
  }

  initEvents() {
    this.io.on('connection', async (socket: Socket) => {
      this.haste = await Haste.build(process.env.HASTE_CLIENT_ID, process.env.HASTE_CLIENT_SECRET, {
        hostProtocol: process.env.HASTE_API_PROTOCOL,
        host: process.env.HASTE_API_HOST,
        port: parseInt(process.env.HASTE_API_PORT, 10),
        accessToken: '',
      });

      const gameEngine = new GameEngine(socket, this.haste);

      const registeredEvents = this.getEvents();
      registeredEvents.forEach(({ event, callback }) => {
        socket.on(event, (message: string & PlayerMovement & void) => {
          callback(this.playerId, this.haste, gameEngine, socket, message);
        });
      });
    });
  }

  private getEvents() {
    const gameInitEvent = this.createSocket<string>('gameInit', listeners.gameInitListener);
    const gameStartEvent = this.createSocket<void>('gameStart', listeners.gameStartListener);
    const playerUpdateEvent = this.createSocket<PlayerMovement>('playerUpdate', listeners.playerUpdateListener);
    const logoutEvent = this.createSocket<void>('logout', listeners.logoutListener);
    const getLevelsEvent = this.createSocket<void>('gameGetLevels', listeners.gameGetLevelsListener);
    const getLeadersEvent = this.createSocket<string>('gameGetLeaders', listeners.gameGetLeadersListener);

    return [gameInitEvent, gameStartEvent, playerUpdateEvent, logoutEvent, getLevelsEvent, getLeadersEvent];
  }

  private broadcast<T>(event: SocketMessage) {
    return (message: T) => this.io.emit(event, message);
  }

  private createSocket<T>(event: SocketMessage, action?: SocketActionFn<T>): WrappedServerSocket<T> {
    const callback = action || this.broadcast(event);
    return { event, callback };
  }

  private jwtMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      Haste.authenticate(socket.handshake.auth.token, process.env.AUTH_URL)
        .then((playerId) => {
          this.playerId = playerId;
          next();
        })
        .catch((err: Error) => {
          next(err);
        });
    } else {
      next(new Error('Authentication error'));
    }
  };
}
