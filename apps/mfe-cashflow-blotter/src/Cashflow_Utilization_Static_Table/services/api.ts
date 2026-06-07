import { createApi } from "@reduxjs/toolkit/query/react";

import {
  RuleAuditRow,
  RuleListResponse,
  RuleMutationResponse,
  UtilizationRuleAuditQuery,
  UtilizationRuleMutation,
  UtilizationRuleQuery,
  UtilizationRuleRow,
} from "./api.type";
import { axiosBaseQuery } from "./base";

export const api = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: "/api/ratan/v1/static/" }),
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  tagTypes: ["Rule", "RuleAudit"],
  endpoints: (build) => ({
    queryUtilizationRuleList: build.query<
      RuleListResponse<UtilizationRuleRow>,
      UtilizationRuleQuery
    >({
      query: (params) => ({
        url: `utilizationEligibleRule`,
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
    addUtilizationRule: build.mutation<
      RuleMutationResponse,
      UtilizationRuleMutation
    >({
      query: (data) => ({
        url: "utilizationEligibleRule",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Rule"],
    }),
    updateUtilizationRule: build.mutation<
      RuleMutationResponse,
      UtilizationRuleRow
    >({
      query: (data) => ({
        url: "utilizationEligibleRule",
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, payload) => [
        { type: "Rule", id: payload.id },
      ],
    }),
    deleteUtilizationRule: build.mutation<
      RuleMutationResponse,
      UtilizationRuleRow["id"]
    >({
      query: (id) => ({
        url: `utilizationEligibleRule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rule", id }],
    }),
    checkerConfirm: build.mutation<
      RuleMutationResponse,
      UtilizationRuleRow["id"]
    >({
      query: (id) => ({
        url: `utilizationEligibleRule/${id}/confirm`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rule", id }],
    }),
    checkerReject: build.mutation<
      RuleMutationResponse,
      UtilizationRuleRow["id"]
    >({
      query: (id) => ({
        url: `utilizationEligibleRule/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rule", id }],
    }),
    queryUtilizationRuleAuditList: build.query<
      RuleListResponse<RuleAuditRow>,
      UtilizationRuleAuditQuery
    >({
      query: (params) => ({
        url: `utilizationEligibleRule/audit`,
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
  useQueryUtilizationRuleListQuery,
  useLazyQueryUtilizationRuleListQuery,
  useAddUtilizationRuleMutation,
  useUpdateUtilizationRuleMutation,
  useDeleteUtilizationRuleMutation,
  useCheckerConfirmMutation,
  useCheckerRejectMutation,
  useQueryUtilizationRuleAuditListQuery,
  useLazyQueryUtilizationRuleAuditListQuery,
} = api;
