import { Leader } from './leader';

export class Score {
  id: string;
  score: number;
  leaders: Leader[];
  isWinner: boolean;
  leaderRank: number;

  constructor() {
    this.id = '';
    this.isWinner = false;
    this.score = 0;
    this.leaderRank = 0;
  }
}

export class CreateScore {
  playId: string;
  score: number;
  leaderboardId: string;

  constructor(playId: string, leaderboardId: string, score: number) {
    this.playId = playId;
    this.score = score;
    this.leaderboardId = leaderboardId;
  }
}
