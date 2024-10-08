export interface IConfig {
  serviceUrl: string;
  clientId: string;
  clientSecret: string;
  redirectPath?: string;
}
export interface ILocationParams {
  [key: string]: string;
}

export type TToken = string;

export interface ITokens {
  [key: string]: string;
}

export interface IAuth {
  accessToken?: string;
  refreshToken?: string;
}

export interface ITokenResponse {
  access_token?: string;
  refresh_token?: string;
  store_type?: "localStorage" | "sessionStorage";
}
