import { HasteEnvironment } from '@hastearcade/models';

export class HasteConfiguration {
  apiVersion?: string;
  hostProtocol: string;
  host: string;
  port: number;
  arcadeId?: string;
  gameId?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken: string;
  playerId?: string;
  environment: HasteEnvironment;

  constructor(environment: HasteEnvironment, host = 'api.hastearcade.com', hostProtocol = 'https', port = 0) {
    this.hostProtocol = hostProtocol;
    this.port = port;
    this.host = host;
    this.accessToken = '';
    this.environment = environment;
  }
}
