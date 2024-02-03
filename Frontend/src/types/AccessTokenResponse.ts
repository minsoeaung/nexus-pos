export type AccessTokenResponse = {
  tokenType: string;
  accessToken: string;
  expiresIn: number; // seconds
  refreshToken: string;
}