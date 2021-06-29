/* eslint-disable @typescript-eslint/no-misused-promises */
// The type for socket.on is not defined correctly. Thus, have to ignore the typescript error on no-misused-promises

import express from 'express';
import http from 'http';
import cors from 'cors';
import { Logger } from 'tslog';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { GameEngine } from './game/gameEngine';
import { JwksClient, SigningKey } from 'jwks-rsa';
import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from 'jsonwebtoken';
import { Haste } from '@haste-sdk/sdk';
import { Player, UserDetails } from '@haste-sdk/domain';

dotenv.config();
const log: Logger = new Logger();
const port = process.env.PORT;

const client = new JwksClient({
  jwksUri: 'https://playhaste.us.auth0.com/.well-known/jwks.json',
});

const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
  client.getSigningKey(header.kid, (err: Error, key: SigningKey) => {
    const signingKey = key.getPublicKey();
    callback(err, signingKey);
  });
};

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_URL,
    methods: ['GET', 'POST'],
  },
});

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token as string, getKey, {}, (err, decoded) => {
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
}).on('connection', async (socket: Socket) => {
  const jwt = socket.data as JwtPayload;

  const haste = await Haste.build(process.env.HASTE_CLIENT_ID, process.env.HASTE_CLIENT_SECRET, {
    hostProtocol: 'http',
    host: 'localhost',
    port: 3000,
  });

  const gameEngine = new GameEngine(socket);

  socket.on('gameInit', async () => {
    const metadata = jwt['http://haste/metadata'] as UserDetails;
    const player = new Player(metadata.playerId);
    const result = await haste.game.play(player);
    socket.emit('gameInitCompleted', gameEngine.getInitialState());
  });

  socket.on('gameStart', () => {
    gameEngine.play();
  });
});

server.listen(port, () => {
  log.info(`server started at http://localhost:${port}`);
});
