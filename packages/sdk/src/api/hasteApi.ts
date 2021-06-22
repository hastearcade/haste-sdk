import { HasteConfiguration } from '../config';
import { ArcadeResource } from './resources/arcade/arcadeResource';

export class HasteApi {
  arcades: ArcadeResource;
  private url: string;
  private configuration: HasteConfiguration;

  constructor(configuration: HasteConfiguration) {
    const { host, hostProtocol, port, clientId, clientSecret } = configuration;
    this.configuration = configuration;

    if (!clientId || clientId.length === 0) {
      throw new Error(`You must initialize the HasteApi with a client id.`);
    }
    if (!clientSecret || clientSecret.length === 0) {
      throw new Error(`You must initialize the HasteApi with a client secret.`);
    }

    this.url = `${hostProtocol}://${host}${port !== 0 ? `:${port}` : ''}`;
    this.arcades = new ArcadeResource(this.url, this.configuration);
  }
}
