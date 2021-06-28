/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable node/handle-callback-err */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Logger } from 'tslog';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { GameEngine } from './game/gameEngine';
import { JwksClient } from 'jwks-rsa';
import jwt from 'jsonwebtoken';

dotenv.config();
const log: Logger = new Logger();
const port = process.env.PORT;

const client = new JwksClient({
  jwksUri: 'https://playhaste.us.auth0.com/.well-known/jwks.json',
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_URL,
    methods: ['GET', 'POST'],
  },
});

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token as string, getKey, {}, function (err, decoded) {
      if (err) return next(new Error('Authentication error'));
      if (decoded.iss === process.env.AUTH0_ISSUER && decoded.exp > new Date().getTime() / 1000) {
        return next();
      } else {
        return next(new Error('Authentication error'));
      }
    });
  } else {
    next(new Error('Authentication error'));
  }
}).on('connection', (socketCon: Socket) => {
  const gameEngine = new GameEngine(socketCon);

  socketCon.on('gameInit', () => {
    socketCon.emit('gameInitCompleted', gameEngine.getInitialState());
  });

  socketCon.on('gameStart', () => {
    gameEngine.play();
  });
});

server.listen(port, () => {
  log.info(`server started at http://localhost:${port}`);
});
