import { JwtPayload } from 'jsonwebtoken';
import { GameEngine } from '../../game/gameEngine';
import { Haste } from '@haste-sdk/sdk';
import { Socket } from 'socket.io';

// This is called when the user logs in
// the haste client game. The gameGetLevels event is emitted
// from the client and received by the server. The server is listening
// and then leverages the Haste SDK to retrieve all the levels for
// the current game.
export function gameGetLevelsListener(jwt: JwtPayload, haste: Haste, engine: GameEngine, socket: Socket) {
  const instances = haste.game.leaderboards();
  socket.emit('gameGetLevelsCompleted', instances);
}
