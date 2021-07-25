export class Play {
  id: string;
  gameId: string;
  playerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted?: boolean;
}

export class CreatePlay {
  playerId: string;
  leaderboardId: string;

  constructor(playerId: string, leaderboardId: string) {
    this.playerId = playerId;
    this.leaderboardId = leaderboardId;
  }
}
