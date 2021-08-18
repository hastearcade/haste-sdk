import { Leaderboard } from './leaderboard';

export class Game {
  id: string;
  name: string;
  description: string;
  category: string; // TODO Change this to Enum
  developerInfo?: string;
  tagLine?: string;
  url: string;
  leaderboards: Leaderboard[];
  playerId: string;

  constructor(id: string) {
    this.id = id;
    this.name = '';
    this.description = '';
    this.category = '';
    this.url = '';
    this.leaderboards = [];
    this.playerId = '';
  }
}
