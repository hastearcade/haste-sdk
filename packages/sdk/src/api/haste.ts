import { HasteConfiguration } from '../config';
import { GameResource } from './resources/game/gameResource';
import { TokenRequest, TokenResponse } from '@haste-sdk/domain';
import axios from 'axios';
import { buildUrl } from '../util/urlBuilder';
import { LeaderboardInstanceResource } from './resources/leaderboard/leaderboardinstances';
export class Haste {
  private configuration?: HasteConfiguration;
  game: GameResource;
  leaderboardinstances: LeaderboardInstanceResource;

  private constructor(configuration: HasteConfiguration) {
    this.configuration = configuration;
    this.game = new GameResource(this.configuration);
    this.leaderboardinstances = new LeaderboardInstanceResource(this.configuration);
  }

  private static async getJwt(clientId: string, clientSecret: string, url: string) {
    const path = '/oauth/writetoken';
    const payload: TokenRequest = {
      clientId,
      clientSecret,
    };
    const response = await axios.post<TokenResponse>(`${url}${path}`, payload);
    const tokenResponse = response.data;

    return tokenResponse;
  }

  public static async build(
    clientId: string,
    clientSecret: string,
    configuration?: HasteConfiguration,
  ): Promise<Haste> {
    if (!clientId || clientId.length === 0) {
      throw new Error(`You must initialize Haste with a client id.`);
    }
    if (!clientSecret || clientSecret.length === 0) {
      throw new Error(`You must initialize Haste with a client secret.`);
    }

    if (!configuration) configuration = new HasteConfiguration();
    const tokenResponse = await Haste.getJwt(
      clientId,
      clientSecret,
      buildUrl(configuration.hostProtocol, configuration.host, configuration.port),
    );

    configuration.clientId = clientId;
    configuration.clientSecret = clientSecret;
    configuration.arcadeId = tokenResponse.arcadeId;
    configuration.gameId = tokenResponse.gameId;
    configuration.accessToken = tokenResponse.access_token;

    return new Haste(configuration);
  }
}
