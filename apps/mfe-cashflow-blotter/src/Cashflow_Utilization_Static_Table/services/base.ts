import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { getWrappedAxiosService } from "src/Root/analysis";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import { Service } from "src/Root/import";

const service =
  featureScopedEnabled("Axios_GraphQL_Monitor_Wrapper") &&
  getWrappedAxiosService
    ? getWrappedAxiosService(
        "/cashflow_blotter_cn/cashflow_utilization_static_table"
      )
    : Service.service;

export interface BaseQueryArgs {
  url: string;
  method?: string;
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface BaseQueryResult {
  data: unknown;
}

export interface BaseQueryError {
  status: number;
  data: unknown;
}

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<BaseQueryArgs, BaseQueryResult, BaseQueryError> =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await service({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result };
    } catch (axiosError) {
      const error = axiosError as BaseQueryError;
      return {
        error: {
          status: error.status,
          data: error.data,
        },
      };
    }
  };
