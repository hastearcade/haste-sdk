import { Play, PlayTransaction } from '@hastearcade/models';
import { BaseResource } from '../baseResource';

export class PlayResource extends BaseResource {
  async transaction(id: string) {
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/play/${id}/transaction`;
    return await this.get<PlayTransaction>(path);
  }

  async find(id: string) {
    const path = `/arcades/${this.configuration.arcadeId}/games/${this.configuration.gameId}/play/${id}`;
    return await this.get<Play>(path);
  }
}
