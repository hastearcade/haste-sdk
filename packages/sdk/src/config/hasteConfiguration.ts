export class HasteConfiguration {
  apiVersion: string;
  hostProtocol: string;
  host: string;
  port: number;

  constructor() {
    this.apiVersion = '';
    this.hostProtocol = 'https:';
    this.port = 0;
    this.host = 'api.hastearcade.com';
  }
}
