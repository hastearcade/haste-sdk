import { Leader } from './leader';

export class Leaderboard {
  id: string;
  name: string;
  cost: number;
  currency: string;
  leaders?: Leader[];
  formattedName: string;

  constructor(id: string) {
    this.id = id;
    this.name = '';
    this.cost = 0;
    this.currency = '';
    this.formattedName = '';
  }
}
