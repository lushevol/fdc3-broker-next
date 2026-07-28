import { gql } from "graphql-request";
import { excludeFieldsFromParams } from "src/Root/common/utils/field-utils";
import { conversionDQSLRequest } from "src/Root/import/ratanutils";
import { api } from "src/Root/rtk-query/baseGraphQLApi";

import * as Types from "../../generated/types.generated";
import ratanConfig from "../Main/config/ratanConfig";

export type SettlementCashflowDataUltraQueryQueryVariables = Types.Exact<{
  payload: Types.RatanUltraQuery;
  opensearch: boolean;
}>;

type DynamicFields = Types.Exact<{
  fields: string[];
}>;
interface CashflowUltraQueryResult {
  __typename?: "UltraQueryResult";
  totalResult: number;
  pageIndex?: number | null;
  itemsPerPage: number;
  lastPage: boolean;
  results: Array<Types.ResultNew>;
}

export type SettlementCashflowDataUltraQueryQuery = {
  __typename?: "Query";
  cashflowUltraQuery: CashflowUltraQueryResult;
};
export type SettlementCashflowDataUltraByQueryOpensearch = {
  __typename?: "Query";
  cashflowUltraQueryByOpensearch: CashflowUltraQueryResult;
};

export const SettlementCashflowDataUltraQueryDocument = ({
  fields,
  opensearch = false,
}) => {
  const gqlQueryName = opensearch
    ? "SettlementCashflowUltraQueryByOpensearch"
    : "SettlementCashflowDataUltraQuery";
  const gqlQueryFn = opensearch
    ? "cashflowUltraQueryByOpensearch"
    : "cashflowUltraQuery";
  return gql`
  query ${gqlQueryName}($payload: RatanUltraQuery!) {
    ${gqlQueryFn}(payload: $payload) {
      totalResult
      pageIndex
      itemsPerPage
      lastPage
      results {
        ${conversionDQSLRequest({
          businessFields: fields.map((f) => ({ indexedTerm: f })),
          isAllFields: false,
          MANDATORY_FIELDS:
            ratanConfig.cashflow.cashflowSettlementMandatoryFields,
        })}
      }
    }
  }
  `;
};

export const isOpneSearchQuery = (
  _res: unknown,
  param: boolean
): _res is SettlementCashflowDataUltraByQueryOpensearch => {
  return param === true;
};

const injectedRtkApi = api.injectEndpoints({
  overrideExisting: module.hot?.status() === "apply",
  endpoints: (build) => ({
    SettlementCashflowDataUltraQuery: build.query<
      | SettlementCashflowDataUltraQueryQuery
      | SettlementCashflowDataUltraByQueryOpensearch,
      SettlementCashflowDataUltraQueryQueryVariables & DynamicFields
    >({
      query: (variables) => ({
        document: SettlementCashflowDataUltraQueryDocument(variables),
        variables: excludeFieldsFromParams(variables),
      }),
      providesTags: (resp, _err, args) => {
        if (!resp) {
          return [{ type: "Cashflows", id: "LIST" }];
        }

        const queryReslut = isOpneSearchQuery(resp, args.opensearch)
          ? resp.cashflowUltraQueryByOpensearch
          : resp.cashflowUltraQuery;
        if (!queryReslut) {
          return [{ type: "Cashflows", id: "LIST" }];
        }
        return [
          ...queryReslut.results
            .map((r) => ({
              type: "Cashflows" as const,
              id: r.Cashflow?.Cashflow_Id + "",
            }))
            .filter((i) => !!i.id),
          { type: "Cashflows", id: "LIST" },
        ];
      },
      keepUnusedDataFor: 1,
      transformResponse: (
        response: SettlementCashflowDataUltraQueryQuery,
        _meta,
        arg
      ) => {
        if (isOpneSearchQuery(response, arg.opensearch)) {
          return {
            cashflowUltraQuery: response?.cashflowUltraQueryByOpensearch,
          };
        }
        return response;
      },
    }),
  }),
});

export { injectedRtkApi as api };
export const {
  useSettlementCashflowDataUltraQueryQuery,
  useLazySettlementCashflowDataUltraQueryQuery,
} = injectedRtkApi;
