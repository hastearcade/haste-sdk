export class Score {
  id: string;
  playId: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted?: boolean;

  constructor() {
    this.id = '';
    this.playId = '';
    this.score = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
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
