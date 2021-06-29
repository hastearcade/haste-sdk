import { JwtPayload } from 'jsonwebtoken';
import { GameEngine } from '../../game/gameEngine';
import { Haste } from '@haste-sdk/sdk';
import { Player, UserDetails } from '@haste-sdk/domain';
import { Socket } from 'socket.io';

export async function gameInitListener(jwt: JwtPayload, haste: Haste, engine: GameEngine, socket: Socket) {
  const metadata = jwt['http://haste/metadata'] as UserDetails;
  const player = new Player(metadata.playerId);
  const play = await haste.game.play(player);
  engine.currentPlay = play;
  socket.emit('gameInitCompleted', engine.getInitialState());
}
