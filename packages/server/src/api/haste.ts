import { HasteConfiguration } from '../config';
import { GameResource } from './resources/game/gameResource';
import { Game, HasteEnvironment, TokenRequest, TokenResponse } from '@hastearcade/models';
import axios from 'axios';
import { buildUrl } from '../util/urlBuilder';
import { validateAuthenticationToken } from './auth/validate';
import { isBrowser } from '../util/environmentCheck';
export class Haste {
  private configuration?: HasteConfiguration;
  game: GameResource;

  private constructor(configuration: HasteConfiguration, gameDetails: Game) {
    this.configuration = configuration;
    this.game = new GameResource(this.configuration, gameDetails);
  }

  private static async getJwt(
    clientId: string,
    clientSecret: string,
    url: string,
    environment: HasteEnvironment,
  ): Promise<TokenResponse> {
    const path = '/oauth/writetoken';
    const payload: TokenRequest = {
      clientId,
      clientSecret,
      environment,
    };

    const response = await axios.post<TokenResponse>(`${url}${path}`, payload);
    return response.data;
  }

  private static async getGameDetails(
    accessToken: string,
    url: string,
    arcadeId: string,
    gameId: string,
  ): Promise<Game> {
    const path = `/arcades/${arcadeId}/developergames/${gameId}`;

    const response = await axios.get<Game>(`${url}${path}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  }

  public static async validatePlayerAccess(playerAccessToken: string, authUrl = 'auth.hastearcade.com') {
    if (isBrowser())
      throw new Error(
        `Validate player access may only be called from a server environment. Do not use in browser please.`,
      );
    const jwt = await validateAuthenticationToken(playerAccessToken, authUrl);
    const playerId = jwt['https://hastearcade.com/playerId'] as string;
    return playerId;
  }

  public static async build(
    clientId: string,
    clientSecret: string,
    environment: HasteEnvironment,
    configuration?: HasteConfiguration,
  ): Promise<Haste> {
    if (isBrowser()) throw new Error(`build may only be called from a server environment.`);

    if (!clientId || clientId.length === 0) {
      throw new Error(`You must initialize Haste with a client id.`);
    }
    if (!clientSecret || clientSecret.length === 0) {
      throw new Error(`You must initialize Haste with a client secret.`);
    }
    if (!environment) {
      throw new Error(`You must initialize Haste with an environment equal to production or nonproduction.`);
    }

    const url = buildUrl(configuration.hostProtocol, configuration.host, configuration.port);
    if (!configuration) configuration = new HasteConfiguration(environment);
    const tokenResponse = await Haste.getJwt(clientId, clientSecret, url, configuration.environment);

    configuration.clientId = clientId;
    configuration.clientSecret = clientSecret;
    configuration.arcadeId = tokenResponse.arcadeId;
    configuration.gameId = tokenResponse.gameId;
    configuration.accessToken = tokenResponse.access_token;

    const gameDetails = await Haste.getGameDetails(
      configuration.accessToken,
      url,
      configuration.arcadeId,
      configuration.gameId,
    );

    return new Haste(configuration, gameDetails);
  }
}
