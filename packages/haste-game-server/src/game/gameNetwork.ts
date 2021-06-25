import { Server, Socket } from 'socket.io';

export class GameNetwork {
  socket: Socket;

  constructor(server: Server) {
    server.on('connection', (socketCon: Socket) => {
      this.socket = socketCon;
    });
  }
}
