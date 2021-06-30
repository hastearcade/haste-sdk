import { Socket } from 'socket.io-client';
import Emitter from 'component-emitter';

// create strong types for socket.io
// and the game corresponding events
export type SocketMessage =
  | 'gameInit'
  | 'gameStart'
  | 'playerUpdate'
  | 'gameInitCompleted'
  | 'gameUpdate'
  | 'gameOver'
  | 'gameStart'
  | 'playerUpdate'
  | 'logout';

export interface EmitterCallback<T> {
  (data: T): void;
}

export interface WrappedClientSocket<T> {
  emit: (data: T) => Socket;
  on: (callback: EmitterCallback<T>) => Socket;
  off: (callback: EmitterCallback<T>) => Emitter;
}
