import { GameEngine } from '../../game/gameEngine';
import { Haste, Leaderboard, Player } from '@haste-sdk/sdk';
import { Socket } from 'socket.io';

// This is called when the user hits "start" in
// the haste client game. The gameInit event is emitted
// from the client and received by the server. The server is listening
// and then leverages the Haste SDK to create a "Play". A "play" is essentially
// like putting in a physical quarter at a physical arcade.
export async function gameInitListener(
  playerId: string,
  haste: Haste,
  engine: GameEngine,
  socket: Socket,
  leaderboardId: string,
) {
  const play = await haste.game.play(new Player(playerId), new Leaderboard(leaderboardId));
  engine.currentPlay = play;

  // if play comes back successfully, the game has finished initializing
  // and the client can render the initial game state
  socket.emit('gameInitCompleted', engine.getInitialState());
}
