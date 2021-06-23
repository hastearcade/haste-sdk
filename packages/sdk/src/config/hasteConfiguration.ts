export class HasteConfiguration {
  apiVersion: string;
  hostProtocol: string;
  host: string;
  port: number;
  arcadeId: string;
  gameId: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;

  constructor() {
    this.apiVersion = '';
    this.hostProtocol = 'https:';
    this.port = 0;
    this.host = 'api.hastearcade.com';
  }
}
