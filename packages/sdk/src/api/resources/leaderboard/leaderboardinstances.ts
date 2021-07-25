import { LeaderboardInstance } from '@haste-sdk/domain';
import { BaseResource } from '../baseResource';

export class LeaderboardInstanceResource extends BaseResource {
  async all() {
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/leaderboardinstances`;
    return await this.get<LeaderboardInstance[]>(path);
  }
}
