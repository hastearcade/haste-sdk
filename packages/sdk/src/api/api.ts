import { Game } from '@haste-sdk/domain';
import axios from 'axios';

export default class Api {
  url: string;

  constructor() {
    this.url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}${
      process.env.API_PORT !== '' ? ':' + process.env.API_PORT : ''
    }`;
  }

  async play(value: string) {
    const path = `${this.url}/api/user/verify`;
    const params = {
      response: value,
    };

    await axios.post<Game>(path, params);
  }
}
