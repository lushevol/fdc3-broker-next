import { createApi } from "@reduxjs/toolkit/query/react";

import {
  RuleAuditRow,
  RuleListResponse,
  RuleMutationResponse,
  SplittingRuleMutation,
  SplittingRuleQuery,
  StaticRuleAuditQuery,
  StaticRuleRow,
} from "./api.type";
import { axiosBaseQuery } from "./base";

export const api = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: "/api/ratan/v1/static/" }),
  keepUnusedDataFor: 20,
  refetchOnMountOrArgChange: 20,
  refetchOnFocus: true,
  tagTypes: ["Rule", "RuleAudit"],
  endpoints: (build) => ({
    queryStaticRuleList: build.query<
      RuleListResponse<StaticRuleRow>,
      SplittingRuleQuery
    >({
      query: (params) => ({
        url: `splittingRule/query`,
        params,
      }),
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "Rule" as const,
                id,
              })),
              "Rule",
            ]
          : ["Rule"],
    }),
    addStaticRule: build.mutation<RuleMutationResponse, SplittingRuleMutation>({
      query: (data) => ({
        url: "splittingRule/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Rule"],
    }),
    updateSplittingRule: build.mutation<RuleMutationResponse, StaticRuleRow>({
      query: (data) => ({
        url: "splittingRule/update",
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, payload) => [
        { type: "Rule", id: payload.id },
      ],
    }),
    deleteSplittingRule: build.mutation<
      RuleMutationResponse,
      StaticRuleRow["id"]
    >({
      query: (id) => ({
        url: `splittingRule/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rule", id }],
    }),
    checkerConfirm: build.mutation<RuleMutationResponse, StaticRuleRow["id"]>({
      query: (id) => ({
        url: `splittingRule/confirm`,
        method: "POST",
        data: { id },
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rule", id }],
    }),
    checkerReject: build.mutation<RuleMutationResponse, StaticRuleRow["id"]>({
      query: (id) => ({
        url: `splittingRule/reject`,
        method: "POST",
        data: { id },
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rule", id }],
    }),
    queryStaticRuleAuditList: build.query<
      RuleListResponse<RuleAuditRow>,
      StaticRuleAuditQuery
    >({
      query: (params) => ({
        url: `splittingRule/audit`,
        params,
      }),
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "RuleAudit" as const,
                id,
              })),
              "RuleAudit",
            ]
          : ["RuleAudit"],
    }),
  }),
});

export const {
  useLazyQueryStaticRuleListQuery,
  useQueryStaticRuleListQuery,
  useAddStaticRuleMutation,
  useUpdateSplittingRuleMutation,
  useDeleteSplittingRuleMutation,
  useCheckerConfirmMutation,
  useCheckerRejectMutation,
  useQueryStaticRuleAuditListQuery,
  useLazyQueryStaticRuleAuditListQuery,
} = api;
