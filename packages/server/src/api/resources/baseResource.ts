import { HasteConfiguration } from '../../config';
import axios, { AxiosError } from 'axios';
import { buildUrl } from '../../util/urlBuilder';

export class BaseResource {
  protected configuration: HasteConfiguration;
  protected url: string;

  constructor(configuration: HasteConfiguration) {
    const { host, hostProtocol, port } = configuration;
    this.url = buildUrl(hostProtocol, host, port);
    this.configuration = configuration;
  }

  protected async get<U>(path: string): Promise<U> {
    try {
      const result = await axios.get<U>(`${this.url}${path}`, {
        headers: { Authorization: `Bearer ${this.configuration.accessToken}` },
      });

      return result.data;
    } catch (err: unknown) {
      const trueError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(
        `An error occurred when making a request to ${path}. The error is ${JSON.stringify(trueError.response.data)}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(trueError.response.data.message);
    }
  }

  protected async post<T, U>(payload: T, path: string): Promise<U> {
    try {
      const result = await axios.post<U>(`${this.url}${path}`, payload, {
        headers: { Authorization: `Bearer ${this.configuration.accessToken}` },
      });

      return result.data;
    } catch (err: unknown) {
      const trueError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(
        `An error occurred when making a request to ${path}. The error is ${JSON.stringify(trueError.response.data)}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(trueError.response.data.message);
    }
  }
}
