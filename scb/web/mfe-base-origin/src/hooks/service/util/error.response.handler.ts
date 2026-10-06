import { AxiosError } from "axios";
import { getHooksBase } from "../../HooksBase";
import { ActionType } from "../../reducer/util/ActionType";
import { clearStorageWhenLogout, getJWTPayload } from "../../../utils/common";
import type { SessionConfig } from "./session";
import {
  isCurrentSession,
  releaseSessionRequest,
  staleSessionError,
} from "./session";

export const errorHandler = (error: AxiosError): unknown => {
  releaseSessionRequest(error.config);
  // An old expiry error must not clear credentials or errors in a later login.
  if (!isCurrentSession(error.config))
    return Promise.reject(staleSessionError());
  const { baseDispatch, store } = getHooksBase();
  const request = error.config as SessionConfig | undefined;
  const data = error.response?.data as { errorCode?: string } | undefined;
  let usableRefresh = false;
  try {
    const payload = store.refreshToken
      ? getJWTPayload(store.refreshToken)
      : undefined;
    usableRefresh = Boolean(payload && (payload.exp ?? 0) * 1000 > Date.now());
  } catch {
    // A malformed credential must not disable the authentication failure rule.
  }
  if (
    error.response?.status === 401 &&
    request?.url?.endsWith("/sso/refreshtoken") &&
    request.sessionGeneration !== undefined &&
    request.refreshReplacement &&
    data?.errorCode === "ACCESS_TOKEN_EXPIRED" &&
    usableRefresh &&
    !store.isOnLogout
  ) {
    // The server verified identity and revocation. Preserve usable refresh for
    // explicit Extend; this rejected replacement must not clear authentication.
    baseDispatch({
      type: ActionType.SET_IS_LOADING,
      data: { isLoading: false },
    });
    return Promise.reject(error);
  }
  if (
    error.code !== "ERR_CANCELED" &&
    !error?.config?.url?.includes("/logout") &&
    !error?.config?.url?.includes("/api/analytics/") &&
    !error?.config?.url?.includes("/api/sse/")
  ) {
    let msg = `${error?.config?.url} : ${error.message}`;
    if (
      error?.response?.data ||
      error.message === "Network Error" ||
      error.message === "Request failed with status code 401"
    ) {
      let data: any = error?.response?.data;
      msg =
        data?.message ||
        data?.errorMessage ||
        `Error happened, service is unavailable, pls check with support team: ${error?.config?.url}: API request failed`;
      if (typeof data === "string") {
        msg = data;
      }
    }
    if (msg?.includes("TOKEN_INVALID_EXPIRED")) {
      clearStorageWhenLogout(baseDispatch);
      msg = "Expired Session, please login again.";
    }
    if (msg?.includes("AuthenticationException")) {
      msg =
        "Invalid username and password combination or SSO service is unavailable.";
    }
    baseDispatch({ type: ActionType.SET_ERRORMSG, data: { errorMsg: msg } });
  }
  baseDispatch({ type: ActionType.SET_IS_LOADING, data: { isLoading: false } });
  return Promise.reject({ ...error });
};
