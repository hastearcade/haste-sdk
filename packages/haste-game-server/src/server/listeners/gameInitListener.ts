import { JwtPayload } from 'jsonwebtoken';
import { GameEngine } from '../../game/gameEngine';
import { Haste } from '@haste-sdk/sdk';
import { Leaderboard, Player, UserDetails } from '@haste-sdk/domain';
import { Socket } from 'socket.io';

// This is called when the user hits "start" in
// the haste client game. The gameInit event is emitted
// from the client and received by the server. The server is listening
// and then leverages the Haste SDK to create a "Play". A "play" is essentially
// like putting in a physical quarter at a physical arcade.
export async function gameInitListener(
  jwt: JwtPayload,
  haste: Haste,
  engine: GameEngine,
  socket: Socket,
  leaderboardId: string,
) {
  // eslint-disable-next-line no-console
  console.log(jwt);
  const metadata = jwt['http://haste/metadata'] as UserDetails;
  const player = new Player(metadata.playerId);
  const play = await haste.game.play(player, new Leaderboard(leaderboardId));
  engine.currentPlay = play;

  // if play comes back successfully, the game has finished initializing
  // and the client can render the initial game state
  socket.emit('gameInitCompleted', engine.getInitialState());
}
