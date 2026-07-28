import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";

import { Hooks } from "../import";
import { AUTH_REQUEST_HEADER, REQUEST_HEADER_USER_ID } from "./const";

const { getHooks } = Hooks;

export const graphqlApi = createApi({
  reducerPath: "graphqlApi",
  tagTypes: ["Cashflows"],
  baseQuery: graphqlRequestBaseQuery({
    url: "/api/ratan/stmcn/v1/cashflows",
    prepareHeaders: (headers) => {
      const hooks = getHooks();
      if (hooks.store?.token) {
        headers.set(AUTH_REQUEST_HEADER, hooks.store.token);
      }
      if (hooks.store?.user?.id) {
        headers.set(REQUEST_HEADER_USER_ID, hooks.store.user.id);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});

export const api = graphqlApi;
