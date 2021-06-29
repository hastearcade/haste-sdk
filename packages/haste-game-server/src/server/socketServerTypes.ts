import { GameEngine } from '../game/gameEngine';
import { Haste } from '@haste-sdk/sdk';
import { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';

export type SocketMessage = 'gameInit' | 'gameStart' | 'playerUpdate';

export type SocketActionFn<T> = (jwt: JwtPayload, haste: Haste, engine: GameEngine, socket: Socket, message: T) => void;

export interface WrappedServerSocket<T> {
  event: string;
  callback: SocketActionFn<T>;
}
