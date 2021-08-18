import { Leader } from './leader';

export class Leaderboard {
  id: string;
  name: string;
  cost: number;
  leaders?: Leader[];

  constructor(id: string) {
    this.id = id;
    this.name = '';
    this.cost = 0;
  }
}
