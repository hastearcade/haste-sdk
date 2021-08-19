export function buildUrl(protocol: string, host: string, port: number) {
  return `${protocol}://${host}${port !== 0 ? `:${port}` : ''}`;
}
