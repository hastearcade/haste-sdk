import { HasteGameState, PlayerMovement } from '@haste-sdk/haste-game-domain';
import { io, Socket } from 'socket.io-client';
import { SocketMessage, WrappedClientSocket } from './socketManagerTypes';

export class SocketManager {
  private socket: Socket;
  gameInitEvent: WrappedClientSocket<void>;
  gameInitCompletedEvent: WrappedClientSocket<HasteGameState>;
  gameUpdateEvent: WrappedClientSocket<HasteGameState>;
  gameOverEvent: WrappedClientSocket<void>;
  gameStartEvent: WrappedClientSocket<void>;
  playerUpdateEvent: WrappedClientSocket<PlayerMovement>;

  constructor(serverUrl: string, token: string) {
    this.socket = io(serverUrl, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      auth: { token },
    });
    this.initializeEvents();
  }

  initializeEvents() {
    this.gameInitEvent = this.createSocket('gameInit');
    this.gameInitCompletedEvent = this.createSocket('gameInitCompleted');
    this.gameUpdateEvent = this.createSocket('gameUpdate');
    this.gameStartEvent = this.createSocket('gameStart');
    this.gameOverEvent = this.createSocket('gameOver');
    this.playerUpdateEvent = this.createSocket('playerUpdate');
  }

  private createSocket<T>(event: SocketMessage): WrappedClientSocket<T> {
    return {
      emit: (data) => this.socket.emit(event, data),
      on: (callback) => this.socket.on(event, callback),
      off: (callback) => this.socket.off(event, callback),
    };
  }
}
