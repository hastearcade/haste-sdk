import { HasteConfiguration } from '../../config';
import axios from 'axios';

export class BaseResource<T, U> {
  private configuration: HasteConfiguration;
  private url: string;
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string, configuration: HasteConfiguration) {
    const { host, hostProtocol, port } = configuration;
    this.url = `${hostProtocol}://${host}${port !== 0 ? `:${port}` : ''}`;
    this.configuration = configuration;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private getJwt() {
    return '';
  }

  async post(payload: T, path: string) {
    const token = this.getJwt();
    await axios.post<U>(`${this.url}${path}`, payload, {headers: { Authorization: `Bearer ${token}` }});
  }
}
