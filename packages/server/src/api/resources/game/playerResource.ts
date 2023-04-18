import { PlayerDetails } from '@hastearcade/models';
import { BaseResource } from '../baseResource';

export class PlayerResource extends BaseResource {
  async details(id: string) {
    const path = `/players/${id}/details`;
    return await this.get<PlayerDetails>(path);
  }
}
