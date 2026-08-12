import { createApi } from "@reduxjs/toolkit/query/react";

import {
  BicNettingRuleAuditQuery,
  BicNettingRuleMutation,
  BicNettingRuleQuery,
  BicNettingRuleRow,
  RuleAuditRow,
  RuleListResponse,
  RuleMutationResponse,
} from "./api.type";
import { axiosBaseQuery } from "./base";

export const api = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: "/api/ratan/v1/static/" }),
  keepUnusedDataFor: 20,
  refetchOnMountOrArgChange: 20,
  refetchOnFocus: true,
  tagTypes: ["Rule", "RuleAudit"],
  endpoints: (build) => ({
    queryBicNettingRuleList: build.query<
      RuleListResponse<BicNettingRuleRow>,
      BicNettingRuleQuery
    >({
      query: (params) => ({
        url: `bicNettingEligibleRule`,
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
    addBicNettingRule: build.mutation<
      RuleMutationResponse,
      BicNettingRuleMutation
    >({
      query: (data) => ({
        url: "bicNettingEligibleRule",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Rule"],
    }),
    updateBicNettingRule: build.mutation<
      RuleMutationResponse,
      BicNettingRuleRow
    >({
      query: (data) => ({
        url: "bicNettingEligibleRule",
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, payload) => [
        { type: "Rule", id: payload.id },
      ],
    }),
    deleteBicNettingRule: build.mutation<
      RuleMutationResponse,
      BicNettingRuleRow["id"]
    >({
      query: (id) => ({
        url: `bicNettingEligibleRule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rule", id }],
    }),
    checkerConfirm: build.mutation<
      RuleMutationResponse,
      BicNettingRuleRow["id"]
    >({
      query: (id) => ({
        url: `bicNettingEligibleRule/${id}/confirm`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rule", id }],
    }),
    checkerReject: build.mutation<
      RuleMutationResponse,
      BicNettingRuleRow["id"]
    >({
      query: (id) => ({
        url: `bicNettingEligibleRule/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rule", id }],
    }),
    queryBicNettingRuleAuditList: build.query<
      RuleListResponse<RuleAuditRow>,
      BicNettingRuleAuditQuery
    >({
      query: (params) => ({
        url: `bicNettingEligibleRule/audit`,
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
    // queryBicNettingRuleAuditItemById: build.query<
    //   RuleListResponse<RuleAuditRow>,
    //   BicNettingRuleAuditQueryById
    // >({
    //   query: ({ id, page, size }) => ({
    //     url: `bicNettingEligibleRule/audit/${id}`,
    //     params: { page, size },
    //   }),
    //   providesTags: (result, error) =>
    //     result
    //       ? [
    //           ...result.results.map(({ id }) => ({
    //             type: "RuleAudit" as const,
    //             id,
    //           })),
    //           "RuleAudit",
    //         ]
    //       : ["RuleAudit"],
    // }),
  }),
});

export const {
  useLazyQueryBicNettingRuleListQuery,
  useQueryBicNettingRuleListQuery,
  useAddBicNettingRuleMutation,
  useUpdateBicNettingRuleMutation,
  useDeleteBicNettingRuleMutation,
  useCheckerConfirmMutation,
  useCheckerRejectMutation,
  useQueryBicNettingRuleAuditListQuery,
  useLazyQueryBicNettingRuleAuditListQuery,
  // useQueryBicNettingRuleAuditItemByIdQuery,
  // useLazyQueryBicNettingRuleAuditItemByIdQuery,
} = api;
