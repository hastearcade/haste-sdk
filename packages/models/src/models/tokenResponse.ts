/* eslint-disable camelcase */
export class TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: string;
  scope?: string;
  arcadeId: string;
  gameId: string;

  constructor(access_token: string, token_type: string, arcadeId: string, gameId: string) {
    this.access_token = access_token;
    this.token_type = token_type;
    this.arcadeId = arcadeId;
    this.gameId = gameId;
  }
}
