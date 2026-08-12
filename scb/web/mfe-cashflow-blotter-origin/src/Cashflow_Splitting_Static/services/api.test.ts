import { act, ReduxProviderWrapper, renderHook } from "src/test/test-utils";

import createStroe from "../store";
import { mockSplittingStaticRules } from "../test/mock/mockRules";
import {
  useAddStaticRuleMutation,
  useCheckerConfirmMutation,
  useCheckerRejectMutation,
  useDeleteSplittingRuleMutation,
  useLazyQueryStaticRuleAuditListQuery,
  useLazyQueryStaticRuleListQuery,
  useQueryStaticRuleAuditListQuery,
  useQueryStaticRuleListQuery,
  useUpdateSplittingRuleMutation,
} from "./api";

it('api - useLazyQueryStaticRuleListQuery', () => {
  const store = createStroe();
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useLazyQueryStaticRuleListQuery(), { wrapper });
  const [query, { data }] = result.current;
  act(() => {
    query({
      page: 0,
      size: 0
    });
  });

  expect(data).toBeUndefined();
});

it('api - useQueryStaticRuleListQuery', () => {
  const store = createStroe();
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useQueryStaticRuleListQuery({
    page: 0,
    size: 0
  }), { wrapper });
  const { data } = result.current;

  expect(data).toBeUndefined();
});

it('api - useAddStaticRuleMutation', () => {
  const store = createStroe();
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useAddStaticRuleMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockSplittingStaticRules[0]);
  });
});

it('api - useUpdateSplittingRuleMutation', () => {
  const store = createStroe();
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useUpdateSplittingRuleMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockSplittingStaticRules[0]);
  });
});

it('api - useDeleteSplittingRuleMutation', () => {
  const store = createStroe();
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useDeleteSplittingRuleMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockSplittingStaticRules[0].id);
  });
});

it('api - useCheckerConfirmMutation', () => {
  const store = createStroe();
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useCheckerConfirmMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockSplittingStaticRules[0].id);
  });
});

it('api - useCheckerRejectMutation', () => {
  const store = createStroe();
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useCheckerRejectMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockSplittingStaticRules[0].id);
  });
});

it('api - useQueryStaticRuleAuditListQuery', () => {
  const store = createStroe();
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useQueryStaticRuleAuditListQuery({
    page: 0,
    size: 0
  }), { wrapper });
  const { data } = result.current;

  expect(data).toBeUndefined();
});

it('api - useLazyQueryStaticRuleAuditListQuery', () => {
  const store = createStroe();
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useLazyQueryStaticRuleAuditListQuery(), { wrapper });
  const [query, { data }] = result.current;
  act(() => {
    query({
      page: 0,
      size: 0
    })
  });

  expect(data).toBeUndefined();
});
