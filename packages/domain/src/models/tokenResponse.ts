export class TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn?: string;
  scope?: string;
  arcadeId: string;
  gameId: string;
}
