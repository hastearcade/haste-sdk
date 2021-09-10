export class Leader {
  playerId: string;
  score: number;
  name?: string;
  avatar?: string;

  constructor(playerId: string, score: number, name?: string, avatar?: string) {
    this.playerId = playerId;
    this.score = score;
    this.name = name;
    this.avatar = avatar;
  }
}
