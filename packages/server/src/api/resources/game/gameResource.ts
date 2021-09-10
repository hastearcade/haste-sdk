import { CreatePlay, Play, CreateScore, Leaderboard, Game, Player } from '@hastearcade/models';
import { HasteConfiguration } from '../../../config/hasteConfiguration';
import { BaseResource } from '../baseResource';

export class GameResource extends BaseResource {
  private details: Game;

  constructor(configuration: HasteConfiguration, details: Game) {
    super(configuration);
    this.details = details;
  }

  async play(player: Player, leaderboard: Leaderboard) {
    const createPayload = new CreatePlay(player.id, leaderboard.id);
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/play`;
    const play = await this.post<CreatePlay, Play>(createPayload, path);
    play.leaderboard = new Leaderboard(leaderboard.id);
    return play;
  }

  async score(play: Play, score: number) {
    const payload = new CreateScore(play.id, play.leaderboard.id, score);
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/score`;
    return await this.post<CreateScore, Leaderboard>(payload, path);
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
