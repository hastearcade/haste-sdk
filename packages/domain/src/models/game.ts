import { Player } from './player';
import { Score } from './score';
import { PlayersScore } from './playersscore';

export class Game {
    name: string;
    scores: PlayersScore[];

    constructor(name: string) {
        this.name = name;
        this.scores = [];
    }

    getScores() {
        return this.scores;
    }

    addLeader(player: Player, score: Score) {
        this.scores.push(new PlayersScore(player, score));
    }
}
