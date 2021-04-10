import { Player } from './player';
import { Score } from './score';

export class PlayersScore {
  score: Score;
  player: Player;

  constructor(player: Player, score: Score) {
    this.score = score;
    this.player = player;
  }
}
