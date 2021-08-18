import { GameEngine } from '../../game/gameEngine';
import { Haste, Leaderboard } from '@hastearcade/haste';
import { Socket } from 'socket.io';

// This is called when the user logs in
// the haste client game. The gameGetLevels event is emitted
// from the client and received by the server. The server is listening
// and then leverages the Haste SDK to retrieve all the levels for
// the current game.
export async function gameGetLeadersListener(
  _1,
  haste: Haste,
  engine: GameEngine,
  socket: Socket,
  leaderboardId: string,
) {
  const leaders = await haste.game.leaders(new Leaderboard(leaderboardId));
  socket.emit('gameGetLeadersCompleted', leaders);
}
