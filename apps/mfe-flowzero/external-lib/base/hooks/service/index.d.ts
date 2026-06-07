import { AxiosRequestConfig, AxiosResponse } from "axios";

import service from "./config";
export interface ConfigProps {
  signal?: any;
  headers?: any;
}
export declare const signal: {
  getRefreshToken: any;
  relogin: any;
};
export declare const getRefreshToken: () => void;
export declare const relogin: () => void;
declare const putService: <T = any, R = AxiosResponse<T, any, {}>, D = any>(
  path: string,
  data: D,
  config?: AxiosRequestConfig<D> | undefined
) => Promise<R>;
declare const postService: <T = any, R = AxiosResponse<T, any, {}>, D = any>(
  path: string,
  data: D,
  config?: AxiosRequestConfig<D> | undefined
) => Promise<R>;
declare const getService: <T = any, R = AxiosResponse<T, any, {}>, D = any>(
  path: string,
  config?: AxiosRequestConfig<D> | undefined
) => Promise<R>;
declare const deleteService: <T = any, R = AxiosResponse<T, any, {}>, D = any>(
  path: string,
  config?: AxiosRequestConfig<D> | undefined
) => Promise<R>;
export { deleteService, getService, postService, putService, service };
