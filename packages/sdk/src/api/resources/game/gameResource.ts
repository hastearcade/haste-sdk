import { Arcade, Game, Player, Play } from '@haste-sdk/domain';
import { BaseResource } from '../baseResource';

export class GameResource extends BaseResource<Play, Game> {
  async play(player: Player) {
    const arcade = new Arcade('one');
    const game = new Game('two');

    const path = `/arcades/${arcade.id}/games/${game.id}/play`;
    await this.post(new Play(player.id), path);
  }
}
