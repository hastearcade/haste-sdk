export class HasteClientConfiguration {
  domain: string;
  clientId: string;

  constructor(clientId: string, domain = 'auth.hastearcade.com') {
    this.clientId = clientId;
    this.domain = domain;
  }
}
