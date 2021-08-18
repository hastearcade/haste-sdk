import { GameEngine } from '../game/gameEngine';
import { Haste } from '@haste-sdk/sdk';
import { Socket } from 'socket.io';

// create strong types for socket.io
// and the game corresponding events
export type SocketMessage = 'gameInit' | 'gameStart' | 'playerUpdate' | 'logout' | 'gameGetLevels' | 'gameGetLeaders';

export type SocketActionFn<T> = (
  playerId: string,
  haste: Haste,
  engine: GameEngine,
  socket: Socket,
  message: T,
) => void;

export interface WrappedServerSocket<T> {
  event: string;
  callback: SocketActionFn<T>;
}
