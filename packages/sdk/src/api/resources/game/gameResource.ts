import { Player, CreatePlay, Play, CreateScore, Score, Leader, LeaderboardInstance } from '@haste-sdk/domain';
import { BaseResource } from '../baseResource';

export class GameResource extends BaseResource {
  async play(player: Player, leaderboardInstance: LeaderboardInstance) {
    const payload = new CreatePlay(player.id, leaderboardInstance.id);
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/play`;
    return await this.post<CreatePlay, Play>(payload, path);
  }

  async score(play: Play, leaderboardInstance: LeaderboardInstance, score: number) {
    const payload = new CreateScore(play.id, leaderboardInstance.id, score);
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/score`;
    return await this.post<CreateScore, Score>(payload, path);
  }

  async leaders() {
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/leaders`;
    return await this.get<Leader[]>(path);
  }
}
