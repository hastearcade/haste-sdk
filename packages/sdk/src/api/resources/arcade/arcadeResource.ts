import { Game } from '@haste-sdk/domain';
import axios from 'axios';
import { HasteConfiguration } from '../../../config';
import { GameResource } from './game/gameResource';

export class ArcadeResource {
  private configuration: HasteConfiguration;
  private url: string;
  games: GameResource;

  constructor(url: string, configuration: HasteConfiguration) {
    this.url = url;
    this.configuration = configuration;
    this.games = new GameResource(this.url, this.configuration);
  }

  async retrieve() {
    const path = `/arcades`;
    await axios.get<Game>(`${this.url}${path}`);
  }
}
