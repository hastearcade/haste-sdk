export class HasteClientConfiguration {
  domain: string;
  clientId: string;
  signinUrl: string;

  constructor(clientId: string, domain = 'auth.hastearcade.com', signinUrl: 'https://app.hastearcade.com/signin') {
    this.clientId = clientId;
    this.domain = domain;
    this.signinUrl = signinUrl;
  }
}
