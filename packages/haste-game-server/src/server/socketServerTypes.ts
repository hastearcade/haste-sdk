import { GameEngine } from '../game/gameEngine';
import { Haste } from '@haste-sdk/sdk';
import { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';

// create strong types for socket.io
// and the game corresponding events
export type SocketMessage = 'gameInit' | 'gameStart' | 'playerUpdate' | 'logout' | 'gameGetLevels';

export type SocketActionFn<T> = (jwt: JwtPayload, haste: Haste, engine: GameEngine, socket: Socket, message: T) => void;

export interface WrappedServerSocket<T> {
  event: string;
  callback: SocketActionFn<T>;
}
