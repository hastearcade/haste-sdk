import { HasteEnvironment } from './hasteEnvironment';

export class TokenRequest {
  clientId: string;
  clientSecret: string;
  environment: HasteEnvironment;

  constructor() {
    this.clientId = '';
    this.clientSecret = '';
  }
}
