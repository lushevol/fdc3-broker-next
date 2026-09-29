import type { AxiosRequestConfig } from "axios";
import { getHooksBase } from "../../HooksBase";

export interface SessionRequestConfig extends AxiosRequestConfig {
  // Client-only metadata; Axios does not send this to the server.
  sessionGeneration?: number;
}

export const isStaleSessionRequest = (config?: SessionRequestConfig): boolean => {
  if (config?.sessionGeneration === undefined) return false;
  const { store } = getHooksBase();
  return (
    !store.token ||
    !!store.isOnLogout ||
    config.sessionGeneration !== (store.sessionGeneration ?? 0)
  );
};
