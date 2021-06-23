import { Player, CreatePlay, Play, CreateScore, Score } from '@haste-sdk/domain';
import { BaseResource } from '../baseResource';

export class GameResource extends BaseResource {
  async play(player: Player) {
    const payload = new CreatePlay(player.id);
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/play`;
    return await this.post<CreatePlay, Play>(payload, path);
  }

  async score(play: Play, score: number) {
    const payload = new CreateScore(play.id, score);
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/score`;
    return await this.post<CreateScore, Score>(payload, path);
  }
}
