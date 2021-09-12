import { HasteGameState, PlayerMovement } from '@hastearcade/haste-game-domain';
import { io, Socket } from 'socket.io-client';
import { SocketMessage, WrappedClientSocket } from './socketManagerTypes';
import { Leader, Leaderboard } from '@hastearcade/web';

// In order to clean up socket.io code from being
// spread throughout the client application, this
// manager class was created to wrap all socket events
export class SocketManager {
  private socket: Socket;
  gameInitEvent: WrappedClientSocket<string>;
  gameInitCompletedEvent: WrappedClientSocket<HasteGameState>;
  gameUpdateEvent: WrappedClientSocket<HasteGameState>;
  gameOverEvent: WrappedClientSocket<void>;
  gameStartEvent: WrappedClientSocket<void>;
  playerUpdateEvent: WrappedClientSocket<PlayerMovement>;
  logoutEvent: WrappedClientSocket<void>;
  gameGetLevelsEvent: WrappedClientSocket<void>;
  gameGetLevelsCompletedEvent: WrappedClientSocket<Leaderboard[]>;
  gameGetLeadersEvent: WrappedClientSocket<string>;
  gameGetLeadersCompletedEvent: WrappedClientSocket<Leader[]>;
  gameError: WrappedClientSocket<string>;

  constructor(serverUrl: string, token: string) {
    this.socket = io(serverUrl, {
      auth: { token },
    });
    this.initializeEvents();
  }

  initializeEvents() {
    this.gameInitEvent = this.createSocket('gameInit');
    this.gameInitCompletedEvent = this.createSocket('gameInitCompleted');
    this.gameGetLevelsEvent = this.createSocket('gameGetLevels');
    this.gameGetLevelsCompletedEvent = this.createSocket('gameGetLevelsCompleted');
    this.gameUpdateEvent = this.createSocket('gameUpdate');
    this.gameStartEvent = this.createSocket('gameStart');
    this.gameOverEvent = this.createSocket('gameOver');
    this.playerUpdateEvent = this.createSocket('playerUpdate');
    this.gameGetLeadersEvent = this.createSocket('gameGetLeaders');
    this.gameGetLeadersCompletedEvent = this.createSocket('gameGetLeadersCompleted');
    this.logoutEvent = this.createSocket('logout');
    this.gameError = this.createSocket<string>('gameError');
  }

  private createSocket<T>(event: SocketMessage): WrappedClientSocket<T> {
    return {
      emit: (data) => this.socket.emit(event, data),
      on: (callback) => this.socket.on(event, callback),
      off: (callback) => this.socket.off(event, callback),
    };
  }
}
