import { api } from "src/Root/rtk-query/baseGraphQLApi";

import * as Types from "../../generated/types.generated";
export type SettlementGroupMessageCountQueryVariables = Types.Exact<{
  filter: Types.GroupMsgReq;
  pageNo: Types.Scalars["Int"]["input"];
  pageSize: Types.Scalars["Int"]["input"];
}>;

export type SettlementGroupMessageCountQuery = {
  __typename?: "Query";
  groupMessages: {
    __typename?: "GroupMessages";
    pageInfo: { __typename?: "ResultPageInfo"; totalHits: number };
  };
};

export const SettlementGroupMessageCountDocument = `
    query SettlementGroupMessageCount($filter: GroupMsgReq!, $pageNo: Int!, $pageSize: Int!) {
  groupMessages(filter: $filter, page: $pageNo, size: $pageSize) {
    pageInfo {
      totalHits
    }
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  overrideExisting: Boolean(import.meta.hot),
  endpoints: (build) => ({
    SettlementGroupMessageCount: build.query<
      SettlementGroupMessageCountQuery,
      SettlementGroupMessageCountQueryVariables
    >({
      query: (variables) => ({
        document: SettlementGroupMessageCountDocument,
        variables,
      }),
    }),
  }),
});

export { injectedRtkApi as api };
export const {
  useSettlementGroupMessageCountQuery,
  useLazySettlementGroupMessageCountQuery,
} = injectedRtkApi;
