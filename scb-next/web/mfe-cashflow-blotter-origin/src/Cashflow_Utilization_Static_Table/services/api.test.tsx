import { act, ReduxProviderWrapper, renderHook } from "src/test/test-utils";

import store from "../store";
import { mockUtilizationRules } from "../test/mock/mockRules";
import {
  useAddUtilizationRuleMutation,
  useCheckerConfirmMutation,
  useCheckerRejectMutation,
  useDeleteUtilizationRuleMutation,
  useLazyQueryUtilizationRuleAuditListQuery,
  useLazyQueryUtilizationRuleListQuery,
  useQueryUtilizationRuleAuditListQuery,
  useQueryUtilizationRuleListQuery,
  useUpdateUtilizationRuleMutation,
} from "./api";

it("api - useLazyQueryUtilizationRuleListQuery", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(() => useLazyQueryUtilizationRuleListQuery(), {
    wrapper,
  });
  const [query, { data }] = result.current;
  act(() => {
    query({
      page: 0,
      size: 0,
    });
  });

  expect(data).toBeUndefined();
});

it("api - useQueryUtilizationRuleListQuery", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(
    () =>
      useQueryUtilizationRuleListQuery({
        page: 0,
        size: 0,
      }),
    { wrapper }
  );
  const { data } = result.current;

  expect(data).toBeUndefined();
});

it("api - useAddUtilizationRuleMutation", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(() => useAddUtilizationRuleMutation(), {
    wrapper,
  });
  const [mutation] = result.current;
  act(() => {
    mutation(mockUtilizationRules[0]);
  });
});

it("api - useUpdateUtilizationRuleMutation", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(() => useUpdateUtilizationRuleMutation(), {
    wrapper,
  });
  const [mutation] = result.current;
  act(() => {
    mutation(mockUtilizationRules[0]);
  });
});

it("api - useDeleteUtilizationRuleMutation", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(() => useDeleteUtilizationRuleMutation(), {
    wrapper,
  });
  const [mutation] = result.current;
  act(() => {
    mutation(mockUtilizationRules[0].id);
  });
});

it("api - useCheckerConfirmMutation", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(() => useCheckerConfirmMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockUtilizationRules[0].id);
  });
});

it("api - useCheckerRejectMutation", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(() => useCheckerRejectMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockUtilizationRules[0].id);
  });
});

it("api - useQueryUtilizationRuleAuditListQuery", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(
    () =>
      useQueryUtilizationRuleAuditListQuery({
        page: 0,
        size: 0,
      }),
    { wrapper }
  );
  const { data } = result.current;

  expect(data).toBeUndefined();
});

it("api - useLazyQueryUtilizationRuleAuditListQuery", () => {
  const wrapper = ReduxProviderWrapper(store());
  const { result } = renderHook(
    () => useLazyQueryUtilizationRuleAuditListQuery(),
    { wrapper }
  );
  const [query, { data }] = result.current;
  act(() => {
    query({
      page: 0,
      size: 0,
    });
  });

  expect(data).toBeUndefined();
});
