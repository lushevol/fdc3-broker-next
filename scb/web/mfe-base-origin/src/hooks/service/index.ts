import { AxiosRequestConfig, AxiosResponse } from "axios";
import { getHooksBase } from "../HooksBase";
import service from "./config";
import { getEndPoint } from "./util/getEndpoint";

export interface ConfigProps {
  signal?: any;
  headers?: any;
}

export const signal = {
  getRefreshToken: undefined as any,
  relogin: undefined as any,
};

export const getRefreshToken = () => {
  if (signal?.getRefreshToken) {
    signal?.getRefreshToken?.abort();
  }
  signal.getRefreshToken = new AbortController();
  const { store } = getHooksBase();
  service
    .post(
      getEndPoint("/auth/v2/sso/refreshtoken"),
      { singleUIAuthorization: store.token },
      {
        signal: signal.getRefreshToken.signal,
      }
    )
    .catch((e) => {
      console.error("e", e);
    });
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

const putService = <T = any, R = AxiosResponse<T>, D = any>(
  path: string,
  data: D,
  config?: AxiosRequestConfig<D>
) => {
  return service.put<T, R, D>(getEndPoint(path), data, config);
};

const postService = <T = any, R = AxiosResponse<T>, D = any>(
  path: string,
  data: D,
  config?: AxiosRequestConfig<D>
) => {
  return service.post<T, R, D>(getEndPoint(path), data, config);
};

const getService = <T = any, R = AxiosResponse<T>, D = any>(
  path: string,
  config?: AxiosRequestConfig<D>
) => {
  return service.get<T, R, D>(getEndPoint(path), config);
};

const deleteService = <T = any, R = AxiosResponse<T>, D = any>(
  path: string,
  config?: AxiosRequestConfig<D>
) => {
  return service.delete<T, R, D>(getEndPoint(path), config);
};

const patchService = (path, data, config?: ConfigProps) => {
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
