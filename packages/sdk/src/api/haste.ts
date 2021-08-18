import { HasteConfiguration } from '../config';
import { GameResource } from './resources/game/gameResource';
import { Game, TokenRequest, TokenResponse } from '@haste-sdk/domain';
import axios from 'axios';
import { buildUrl } from '../util/urlBuilder';
import { validateAuthenticationToken } from './auth/validate';
export class Haste {
  private configuration?: HasteConfiguration;
  game: GameResource;

  private constructor(configuration: HasteConfiguration, gameDetails: Game) {
    this.configuration = configuration;
    this.game = new GameResource(this.configuration, gameDetails);
  }

  private static async getJwt(clientId: string, clientSecret: string, url: string): Promise<TokenResponse> {
    const path = '/oauth/writetoken';
    const payload: TokenRequest = {
      clientId,
      clientSecret,
    };

    const response = await axios.post<TokenResponse>(`${url}${path}`, payload);
    return response.data;
  }

  private static async getGameDetails(accessToken: string, url: string, gameId: string): Promise<Game> {
    const path = `/developergames/${gameId}`;

    const response = await axios.get<Game>(`${url}${path}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  }

  public static async authenticate(playerAccessToken: string, authUrl = 'haste-production.us.auth0.com') {
    const jwt = await validateAuthenticationToken(playerAccessToken, authUrl);
    const playerId = jwt['https://hastearcade.com/playerId'] as string;
    return playerId;
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

    if (!configuration) {
      throw new Error(`You must provide a haste configuration.`);
    }

    const url = buildUrl(configuration.hostProtocol, configuration.host, configuration.port);
    if (!configuration) configuration = new HasteConfiguration();
    const tokenResponse = await Haste.getJwt(clientId, clientSecret, url);

    configuration.clientId = clientId;
    configuration.clientSecret = clientSecret;
    configuration.arcadeId = tokenResponse.arcadeId;
    configuration.gameId = tokenResponse.gameId;
    configuration.accessToken = tokenResponse.access_token;

    const gameDetails = await Haste.getGameDetails(configuration.accessToken, url, configuration.gameId);

    return new Haste(configuration, gameDetails);
  }
}
