/* eslint-disable @typescript-eslint/no-misused-promises */
// The type for socket.on is not defined correctly. Thus, have to ignore the typescript error on no-misused-promises

import http from 'http';
import { Server, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { JwksClient, SigningKey } from 'jwks-rsa';
import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from 'jsonwebtoken';
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
  private jwtClient: JwksClient;

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_URL,
        methods: ['GET', 'POST'],
      },
    });

    this.jwtClient = new JwksClient({
      jwksUri: 'https://playhaste.us.auth0.com/.well-known/jwks.json',
    });

    this.io.use(this.jwtMiddleware);
  }

  initEvents() {
    this.io.on('connection', async (socket: Socket) => {
      const jwt = socket.data as JwtPayload;

      const haste = await Haste.build(process.env.HASTE_CLIENT_ID, process.env.HASTE_CLIENT_SECRET, {
        hostProtocol: process.env.HASTE_API_PROTOCOL,
        host: process.env.HASTE_API_HOST,
        port: parseInt(process.env.HASTE_API_PORT, 10),
      });

      const gameEngine = new GameEngine(socket, haste);

      const registeredEvents = this.getEvents();
      registeredEvents.forEach(({ event, callback }) => {
        socket.on(event, (message) => {
          callback(jwt, haste, gameEngine, socket, message);
        });
      });
    });
  }

  private getEvents() {
    const gameInitEvent = this.createSocket<void>('gameInit', listeners.gameInitListener);
    const gameStartEvent = this.createSocket<void>('gameStart', listeners.gameStartListener);
    const playerUpdateEvent = this.createSocket<PlayerMovement>('playerUpdate', listeners.playerUpdateListener);
    const logoutEvent = this.createSocket<void>('logout', listeners.logoutListener);

    return [gameInitEvent, gameStartEvent, playerUpdateEvent, logoutEvent];
  }

  private broadcast<T>(event: SocketMessage) {
    return (message: T) => this.io.emit(event, message);
  }

  private createSocket<T>(event: SocketMessage, action?: SocketActionFn<T>): WrappedServerSocket<T> {
    const callback = action || this.broadcast(event);
    return { event, callback };
  }

  private getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
    this.jwtClient.getSigningKey(header.kid, (err: Error, key: SigningKey) => {
      const signingKey = key.getPublicKey();
      callback(err, signingKey);
    });
  };

  private jwtMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(socket.handshake.auth.token as string, this.getKey, {}, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        if (decoded.iss === process.env.AUTH0_ISSUER && decoded.exp > new Date().getTime() / 1000) {
          socket.data = decoded;
          return next();
        } else {
          return next(new Error('Authentication error'));
        }
      });
    } else {
      next(new Error('Authentication error'));
    }
  };
}
