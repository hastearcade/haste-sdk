export class HasteClientConfiguration {
  domain: string;
  clientId: string;

  constructor(clientId: string, domain = 'haste-development.us.auth0.com') {
    this.clientId = clientId;
    this.domain = domain;
  }
}
