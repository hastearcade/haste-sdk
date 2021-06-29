export class HasteConfiguration {
  apiVersion?: string;
  hostProtocol?: string;
  host?: string;
  port?: number;
  arcadeId?: string;
  gameId?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;

  constructor(host = 'api.hastearcade.com', hostProtocol = 'https', port = 0) {
    this.hostProtocol = hostProtocol;
    this.port = port;
    this.host = host;
  }
}
