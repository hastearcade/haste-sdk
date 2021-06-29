import express from 'express';
import http from 'http';
import cors from 'cors';
import { Logger } from 'tslog';
import dotenv from 'dotenv';
import { SocketServer } from './server/socketServer';

dotenv.config();
const log: Logger = new Logger();
const port = process.env.PORT;

const app = express();
app.use(cors());

const server = http.createServer(app);
const socketServer = new SocketServer(server);
socketServer.initEvents();

server.listen(port, () => {
  log.info(`server started at http://localhost:${port}`);
});
