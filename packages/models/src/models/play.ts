import { Leaderboard } from './leaderboard';

export class Play {
  id: string;
  gameId: string;
  playerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted?: boolean;
  leaderboard: Leaderboard;
  cost: number;
  costInCredits: number;

  constructor() {
    this.id = '';
    this.gameId = '';
    this.playerId = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.leaderboard = new Leaderboard('');
    this.cost = 0;
    this.costInCredits = 0;
  }
}

export class PlayTransaction {
  id: string;
  status: string;
  tx: string;

  constructor() {
    this.id = '';
    this.status = '';
    this.tx = '';
  }
}
export class CreatePlay {
  playerId: string;
  leaderboardId: string;

  constructor(playerId: string, leaderboardId: string) {
    this.playerId = playerId;
    this.leaderboardId = leaderboardId;
  }
}
