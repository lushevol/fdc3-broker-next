import {
  AxiosError,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getHooksBase } from "../HooksBase";
import service from "./config";
import { getEndPoint } from "./util/getEndpoint";
import type { SessionConfig } from "./util/session";
import { getSessionGeneration } from "./util/session";

export interface ConfigProps {
  signal?: any;
  headers?: any;
}

export const signal = {
  getRefreshToken: undefined as any,
  relogin: undefined as any,
};

export type RefreshResult =
  | "acquired"
  | "temporaryFailure"
  | "rejected"
  | "cancelled";
let refreshInFlight:
  | { token?: string; generation: number; promise: Promise<RefreshResult> }
  | undefined;

export const getRefreshToken = (): Promise<RefreshResult> => {
  const { store } = getHooksBase();
  const generation = getSessionGeneration();
  // Visibility changes must not abort a request that can still supply refresh.
  if (
    refreshInFlight &&
    refreshInFlight.token === store.token &&
    refreshInFlight.generation === generation
  ) {
    return refreshInFlight.promise;
  }
  if (signal?.getRefreshToken) {
    signal?.getRefreshToken?.abort();
  }
  signal.getRefreshToken = new AbortController();
  const config: SessionConfig = {
    signal: signal.getRefreshToken.signal,
    // Only replacement failures can preserve an already available credential.
    refreshReplacement: Boolean(store.refreshToken),
  };
  const promise = service
    .post(
      getEndPoint("/auth/v2/sso/refreshtoken"),
      { singleUIAuthorization: store.token },
      config
    )
    .then<RefreshResult>(() => "acquired")
    .catch((error: unknown): RefreshResult => {
      const failure = error as AxiosError | undefined;
      if (failure?.code === "ERR_CANCELED") return "cancelled";
      const status = failure?.response?.status;
      // Retry only temporary failures. A 401/403 must not become a retry loop.
      if (
        (status !== undefined && status >= 500 && status <= 599) ||
        (!failure?.response &&
          ["ERR_NETWORK", "ECONNABORTED", "ETIMEDOUT"].includes(
            failure?.code ?? ""
          ))
      ) {
        return "temporaryFailure";
      }
      return "rejected";
    })
    .finally(() => {
      if (refreshInFlight?.promise === promise) refreshInFlight = undefined;
    });
  refreshInFlight = { token: store.token, generation, promise };
  return promise;
};

export const relogin = () => {
  if (signal?.relogin) {
    signal?.relogin?.abort();
  }
  signal.relogin = new AbortController();
  service
    .post(
      getEndPoint("/auth/v2/sso/relogin"),
      {},
      {
        signal: signal.relogin.signal,
      }
    )
    .catch((e) => {
      console.error("e", e);
    });
};

const putService = <T = unknown, D = unknown>(
  path: string,
  data: D,
  config?: AxiosRequestConfig<D>
): AxiosPromise<T, D> => {
  return service.put<T, AxiosResponse<T, D>, D>(
    getEndPoint(path),
    data,
    config
  );
};

const postService = <T = unknown, D = unknown>(
  path: string,
  data: D,
  config?: AxiosRequestConfig<D>
): AxiosPromise<T, D> => {
  return service.post<T, AxiosResponse<T, D>, D>(
    getEndPoint(path),
    data,
    config
  );
};

const getService = <T = unknown, D = unknown>(
  path: string,
  config?: AxiosRequestConfig<D>
): AxiosPromise<T, D> => {
  return service.get<T, AxiosResponse<T, D>, D>(getEndPoint(path), config);
};

const deleteService = <T = unknown, D = unknown>(
  path: string,
  config?: AxiosRequestConfig<D>
): AxiosPromise<T, D> => {
  return service.delete<T, AxiosResponse<T, D>, D>(getEndPoint(path), config);
};

const patchService = <T = unknown, D = unknown>(
  path: string,
  data: D,
  config?: ConfigProps
): AxiosPromise<T, D> => {
  return service.patch(getEndPoint(path), data, config);
};

export {
  putService,
  postService,
  getService,
  deleteService,
  patchService,
  service,
};
