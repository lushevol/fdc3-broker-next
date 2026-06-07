import { api } from "src/Root/rtk-query/baseGraphQLApi";

import * as Types from "../../generated/types.generated";
export type SettlementCashflowDataUltraQueryCountQueryVariables = Types.Exact<{
  payload: Types.RatanUltraQueryCount;
}>;

export type SettlementCashflowDataUltraQueryCountQuery = {
  __typename?: "Query";
  cashflowUltraQueryCount: {
    __typename?: "UltraQueryCountResult";
    count: number;
  };
};

export type SettlementCashflowDataUltraQueryCountGroupByQueryVariables =
  Types.Exact<{
    payload: Types.RatanUltraQueryCount;
  }>;

export type SettlementCashflowDataUltraQueryCountGroupByQuery = {
  __typename?: "Query";
  cashflowUltraQueryCount: {
    __typename?: "UltraQueryCountResult";
    count: number;
    groups?: Array<{
      __typename?: "GroupCount";
      field?: string | null;
      count?: number | null;
    }> | null;
  };
};

export const SettlementCashflowDataUltraQueryCountDocument = `
    query SettlementCashflowDataUltraQueryCount($payload: RatanUltraQueryCount!) {
  cashflowUltraQueryCount(payload: $payload) {
    count
  }
}
    `;
export const SettlementCashflowDataUltraQueryCountGroupByDocument = `
    query SettlementCashflowDataUltraQueryCountGroupBy($payload: RatanUltraQueryCount!) {
  cashflowUltraQueryCount(payload: $payload) {
    count
    groups {
      field
      count
    }
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  overrideExisting: module.hot?.status() === "apply",
  endpoints: (build) => ({
    SettlementCashflowDataUltraQueryCount: build.query<
      SettlementCashflowDataUltraQueryCountQuery,
      SettlementCashflowDataUltraQueryCountQueryVariables
    >({
      query: (variables) => ({
        document: SettlementCashflowDataUltraQueryCountDocument,
        variables,
      }),
    }),
    SettlementCashflowDataUltraQueryCountGroupBy: build.query<
      SettlementCashflowDataUltraQueryCountGroupByQuery,
      SettlementCashflowDataUltraQueryCountGroupByQueryVariables
    >({
      query: (variables) => ({
        document: SettlementCashflowDataUltraQueryCountGroupByDocument,
        variables,
      }),
    }),
  }),
});

export { injectedRtkApi as api };
export const {
  useSettlementCashflowDataUltraQueryCountQuery,
  useLazySettlementCashflowDataUltraQueryCountQuery,
  useSettlementCashflowDataUltraQueryCountGroupByQuery,
  useLazySettlementCashflowDataUltraQueryCountGroupByQuery,
} = injectedRtkApi;
