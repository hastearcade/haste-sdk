import express from 'express';
import dotenv from 'dotenv';
import { Logger } from 'tslog';
import { expressJwtSecret } from 'jwks-rsa';
import jwt from 'express-jwt';
import { Server, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { GameEngine } from './game/gameEngine';

dotenv.config();
const log: Logger = new Logger();
const port = process.env.PORT;

const jwtCheck = jwt({
  secret: expressJwtSecret({
    jwksUri: 'https://playhaste.us.auth0.com/.well-known/jwks.json',
    cache: true,
    cacheMaxEntries: 5,
  }),
  audience: 'https://hastegame.api',
  issuer: 'https://playhaste.us.auth0.com/',
  algorithms: ['RS256'],
});

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3008',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socketCon: Socket) => {
  const gameEngine = new GameEngine(socketCon);

  socketCon.on('gameInit', () => {
    socketCon.emit('gameInitCompleted', gameEngine.getInitialState());
  });

  socketCon.on('gameStart', () => {
    gameEngine.play();
  });
});

app.get('/', (req, res) => res.send('Public endpoint'));
app.get('/private', jwtCheck, (req, res) => res.send('Private endpoint'));

server.listen(port, () => {
  log.info(`server started at http://localhost:${port}`);
});
