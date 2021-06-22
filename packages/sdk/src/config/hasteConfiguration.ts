export class HasteConfiguration {
  apiVersion: string;
  hostProtocol: string;
  host: string;
  port: number;
  clientId: string;
  clientSecret: string;

  constructor() {
    this.apiVersion = '';
    this.hostProtocol = 'https:';
    this.port = 0;
    this.host = 'api.hastearcade.com';
  }
}
