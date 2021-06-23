import { HasteConfiguration } from '../../config';
import axios from 'axios';
import { buildUrl } from '../../util/urlBuilder';

export class BaseResource {
  protected configuration: HasteConfiguration;
  protected url: string;

  constructor(configuration: HasteConfiguration) {
    const { host, hostProtocol, port } = configuration;
    this.url = buildUrl(hostProtocol, host, port);
    this.configuration = configuration;
  }

  async post<T, U>(payload: T, path: string): Promise<U> {
    const result = await axios.post<U>(`${this.url}${path}`, payload, {
      headers: { Authorization: `Bearer ${this.configuration.accessToken}` },
    });

    return result.data;
  }
}
