import { CreatePlay, Play, CreateScore, Score, Leaderboard, Game, Player, TopScore } from '@hastearcade/models';
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
      newLeaderboard.formattedName = `${l.name} - ${l.cost} ${l.currency}`;
      return newLeaderboard;
    });
  }

  async play(player: Player, leaderboard: Leaderboard) {
    const createPayload = new CreatePlay(player.id, leaderboard.id);
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/play`;
    const play = await this.post<CreatePlay, Play>(createPayload, path);
    play.leaderboard = new Leaderboard(leaderboard.id);
    play.leaderboard.cost = play.cost;
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
}
