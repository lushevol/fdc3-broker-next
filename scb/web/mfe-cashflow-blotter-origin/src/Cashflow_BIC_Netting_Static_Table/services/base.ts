import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { getWrappedAxiosService } from "src/Root/analysis";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import { Service } from "src/Root/import";

const service =
  featureScopedEnabled("Axios_GraphQL_Monitor_Wrapper") &&
  getWrappedAxiosService
    ? getWrappedAxiosService(
        "/cashflow_blotter_cn/cashflow_bic_netting_static_table"
      )
    : Service.service;

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method?: any;
      data?: any;
      params?: any;
      headers?: any;
    },
    { data: any },
    { status: any; data: any }
  > =>
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
      const error = axiosError as any;
      return {
        error: {
          status: error.status,
          data: error.data,
        },
      };
    }
  };
