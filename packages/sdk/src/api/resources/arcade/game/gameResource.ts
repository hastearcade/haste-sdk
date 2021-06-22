import { Game } from '@haste-sdk/domain';
import axios from 'axios';
import { HasteConfiguration } from '../../../../config';

export class GameResource {
  private configuration: HasteConfiguration;
  private url: string;
  constructor(url: string, configuration: HasteConfiguration) {
    this.url = url;
    this.configuration = configuration;
  }

  async play(value: string) {
    const path = `/users/play`;
    const params = {
      response: value,
    };

    await axios.post<Game>(`${this.url}${path}`, params);
  }
}
