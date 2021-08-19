export class HasteClientConfiguration {
  domain: string;
  clientId: string;

  constructor(clientId: string, domain = 'haste-production.us.auth0.com') {
    this.clientId = clientId;
    this.domain = domain;
  }
}
