import { Socket } from 'socket.io-client';
import Emitter from 'component-emitter';

export type SocketMessage =
  | 'gameInit'
  | 'gameStart'
  | 'playerUpdate'
  | 'gameInitCompleted'
  | 'gameUpdate'
  | 'gameOver'
  | 'gameStart'
  | 'playerUpdate';

export interface EmitterCallback<T> {
  (data: T): void;
}

export interface WrappedClientSocket<T> {
  emit: (data: T) => Socket;
  on: (callback: EmitterCallback<T>) => Socket;
  off: (callback: EmitterCallback<T>) => Emitter;
}
