export class Score {
  id: string;
  playId: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted?: boolean;
}

export class CreateScore {
  playId: string;
  score: number;

  constructor(playId: string, score: number) {
    this.playId = playId;
    this.score = score;
  }
}
