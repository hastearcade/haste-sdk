export class Leader {
  playerId: string;
  score: number;
  name?: string;

  constructor(playerId: string, score: number, name?: string) {
    this.playerId = playerId;
    this.score = score;
    this.name = name;
  }
}
