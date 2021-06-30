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

  constructor(playerId: string) {
    this.playerId = playerId;
  }
}
