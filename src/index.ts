import {
  IConfig,
  ILocationParams,
  TToken,
  ITokens,
  IAuth,
  ITokenResponse
} from "./types";

import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
  LOCATION_CODE_PARAM,
  LOCATION_STATE_PARAM,
  SERVICE_AUTHORIZE_PATH,
  SERVICE_TOKEN_PATH
} from "./constants";

import request from "./request";

import { getUrlParams } from "./helper";

class DatawizAuth {
  config: IConfig;
  storage: Storage = localStorage;
  locationParams: ILocationParams = getUrlParams();
  tokens: ITokens = {
    accessToken: "",
    refreshToken: ""
  };

  constructor(config: IConfig) {
    this.config = config;
    request.baseUrl = config.serviceUrl;
  }

  // Initalize authorization process
  async init() {
    this.initTokens();
    const code: TToken = this.getCode();

    if (code) {
      const state = this.getState();
      try {
        await this.updateTokensWithCode(code);
        this.redirectToUrl(state);

        return this.buildResult();
      } catch (e) {
        this.redirectToLoginService();
        throw new Error("Failed to get accessToken and refreshToken with code");
      }
    }

    if (this.tokens.accessToken && this.tokens.refreshToken) {
      return this.buildResult();
    }

    this.redirectToLoginService();
    return false;
  }

  // Refresh token after expired access token
  async refreshToken() {
    if (this.tokens.refreshToken) {
      try {
        await this.updateTokensWithRefreshToken(this.tokens.refreshToken);
        const result = this.buildResult();
        this.onTokenRefreshed(result);
        return result;
      } catch (e) {
        // this.redirectToLoginService();
        throw new Error(
          "Failed to get accessToken and refreshToken with refreshToken"
        );
      }
    }

    this.redirectToLoginService();
    throw new Error("Not found refresfToken, send to login proccess");
  }

  buildResult() {
    return {
      accessToken: this.tokens.accessToken,
      refreshToken: this.tokens.refreshToken
    };
  }

  async updateTokensWithRefreshToken(refreshToken: TToken) {
    const response = await request.post(SERVICE_TOKEN_PATH, {
      grant_type: "refresh_token",
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: refreshToken
    });

    this.handleTokensResponse(response);
  }

  async updateTokensWithCode(code: TToken) {
    const response = await request.post(SERVICE_TOKEN_PATH, {
      code,
      grant_type: "authorization_code",
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret
    });

    this.handleTokensResponse(response);
  }

  handleTokensResponse(response: ITokenResponse) {
    if (!response.access_token || !response.refresh_token) {
      throw new Error(
        "Bad response: can not get access token and refresh token"
      );
    }

    this.parseTokenResponse(response);
  }

  redirectToUrl(url: string) {
    history.pushState("", "", url);
  }

  parseTokenResponse(response: ITokenResponse) {
    const { access_token, refresh_token } = response;

    if (access_token) this.setAccessToken(access_token);
    if (refresh_token) this.setRefreshToken(refresh_token);
  }

  initTokens() {
    this.tokens = {
      accessToken: this.getAccessTokenFromLocation(),
      refreshToken: this.getRefreshTokenFromLocalStorage()
    };
  }

  redirectToLoginService() {
    const url = request.buildUrl(SERVICE_AUTHORIZE_PATH, {
      response_type: "code",
      state: encodeURIComponent(location.href),
      client_id: this.config.clientId
    });

    location.href = url;
    console.log("REDIRECT!!!! to ", url);
  }

  setRefreshToken(refreshToken: TToken) {
    if (!refreshToken) return;
    this.tokens.refreshToken = refreshToken;
    this.storage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, this.tokens.refreshToken);
  }

  setAccessToken(accessToken: TToken) {
    if (!accessToken) return;
    this.tokens.accessToken = accessToken;
    this.storage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, this.tokens.accessToken);
  }

  getCode(): TToken {
    return this.locationParams[LOCATION_CODE_PARAM] || "";
  }

  getState() {
    return decodeURIComponent(this.locationParams[LOCATION_STATE_PARAM] || "");
  }

  getRefreshTokenFromLocalStorage(): string {
    return this.storage.getItem(LOCAL_STORAGE_REFRESH_TOKEN) || "";
  }

  getAccessTokenFromLocation(): string {
    return this.storage.getItem(LOCAL_STORAGE_ACCESS_TOKEN) || "";
  }

  onTokenExpired() {}
  onTokenRefreshed(result: IAuth) {}
}

export default DatawizAuth;
