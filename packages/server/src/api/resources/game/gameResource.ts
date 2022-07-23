import { CreatePlay, Play, CreateScore, Score, Leaderboard, Game, Player, TopScore, Payout } from '@hastearcade/models';
import { HasteConfiguration } from '../../../config/hasteConfiguration';
import { BaseResource } from '../baseResource';

export class GameResource extends BaseResource {
  private details: Game;

  constructor(configuration: HasteConfiguration, details: Game) {
    super(configuration);
    this.details = details;
    this.details.leaderboards = this.details.leaderboards.map((l) => {
      const newLeaderboard = new Leaderboard(l.id);
      newLeaderboard.cost = l.cost;
      newLeaderboard.currency = l.currency;
      newLeaderboard.name = l.name;
      newLeaderboard.leaders = l.leaders;
      newLeaderboard.formattedCostString = l.formattedCostString;
      newLeaderboard.formattedName =
        l.formattedCostString && l.formattedCostString.length > 0
          ? `${l.formattedCostString}`
          : `${l.name} - ${l.cost} ${l.currency}`;
      return newLeaderboard;
    });
  }

  async play(player: Player, leaderboard: Leaderboard) {
    const createPayload = new CreatePlay(player.id, leaderboard.id);
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/play`;
    const play = await this.post<CreatePlay, Play>(createPayload, path);

    const hydratedLeaderboard = this.details.leaderboards.find((ld) => ld.id === leaderboard.id);

    play.leaderboard = new Leaderboard(leaderboard.id);
    play.leaderboard.cost = play.cost;

    if (hydratedLeaderboard) {
      play.leaderboard.name = hydratedLeaderboard.name;
      play.leaderboard.formattedCostString = hydratedLeaderboard.formattedCostString;
      play.leaderboard.formattedName = hydratedLeaderboard.formattedName;
      play.leaderboard.currency = hydratedLeaderboard.currency;
    }

    return play;
  }

  async score(play: Play, score: number) {
    const payload = new CreateScore(play.id, play.leaderboard.id, score);
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/score`;
    return await this.post<CreateScore, Score>(payload, path);
  }

  async topscore(player: Player, leaderboard: Leaderboard) {
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/topscore/${leaderboard.id}/${player.id}`;
    const result = await this.get<TopScore>(path);
    return result;
  }

  leaderboards() {
    return this.details.leaderboards;
  }

  async leaders(leaderboard: Leaderboard) {
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/leaders/${leaderboard.id}`;
    const result = await this.get<Leaderboard>(path);
    return result.leaders;
  }

  async payouts(player: Player, limit?: number, startingAfter?: string, endingBefore?: string) {
    if (limit && limit < 1) {
      throw new Error(`The limit must be greater than zero.`);
    }

    if (limit && limit > 100) {
      throw new Error(`The limit must be less than 100.`);
    }

    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/payouts/${player.id}${
      limit ? `?limit=${limit}` : `?limit=100`
    }${startingAfter ? `&starting_after=${startingAfter}` : ''}${endingBefore ? `&endingBefore=${endingBefore}` : ''}`;
    const result = await this.get<Payout>(path);
    return result;
  }
}
