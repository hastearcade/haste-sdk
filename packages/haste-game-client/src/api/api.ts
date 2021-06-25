import axios from 'axios';
import { HasteGameState } from '../models/gameState';

declare const __API_HOST__: string;

export class Api {
  async getInitialGameState(): Promise<HasteGameState> {
    const response = await axios.get<HasteGameState>(`${__API_HOST__}/getInitialGameState`);
    const gameState = response.data;

    // todo add error handling
    return gameState;
  }

  play(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    axios.post(`${__API_HOST__}/play`);
  }
}
