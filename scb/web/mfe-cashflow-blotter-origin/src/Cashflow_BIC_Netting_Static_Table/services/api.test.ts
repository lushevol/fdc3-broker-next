import { act, ReduxProviderWrapper, renderHook } from "src/test/test-utils";

import { store } from "../store";
import { mockBicNettingRules } from "../test/mock/mockRules";
import { 
    useAddBicNettingRuleMutation,
    useCheckerConfirmMutation,
    useCheckerRejectMutation,
    useDeleteBicNettingRuleMutation,
    useLazyQueryBicNettingRuleAuditListQuery,
    useLazyQueryBicNettingRuleListQuery,
    useQueryBicNettingRuleAuditListQuery,
    useQueryBicNettingRuleListQuery,
    useUpdateBicNettingRuleMutation,
} from "./api";

it('api - useLazyQueryBicNettingRuleListQuery', () => {
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useLazyQueryBicNettingRuleListQuery(), { wrapper });
  const [query, { data }] = result.current;
  act(() => {
    query({
        page: 0,
        size: 0
    });
  });

  expect(data).toBeUndefined();
});

it('api - useQueryBicNettingRuleListQuery', () => {
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useQueryBicNettingRuleListQuery({
      page: 0,
      size: 0
  }), { wrapper });
  const { data } = result.current;

  expect(data).toBeUndefined();
});

it('api - useAddBicNettingRuleMutation', () => {
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useAddBicNettingRuleMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockBicNettingRules[0]);
  });
});

it('api - useUpdateBicNettingRuleMutation', () => {
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useUpdateBicNettingRuleMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockBicNettingRules[0]);
  });
});

it('api - useDeleteBicNettingRuleMutation', () => {
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useDeleteBicNettingRuleMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockBicNettingRules[0].id);
  });
});

it('api - useCheckerConfirmMutation', () => {
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useCheckerConfirmMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockBicNettingRules[0].id);
  });
});

it('api - useCheckerRejectMutation', () => {
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useCheckerRejectMutation(), { wrapper });
  const [mutation] = result.current;
  act(() => {
    mutation(mockBicNettingRules[0].id);
  });
});

it('api - useQueryBicNettingRuleAuditListQuery', () => {
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useQueryBicNettingRuleAuditListQuery({
      page: 0,
      size: 0
  }), { wrapper });
  const { data } = result.current;

  expect(data).toBeUndefined();
});

it('api - useLazyQueryBicNettingRuleAuditListQuery', () => {
  const wrapper = ReduxProviderWrapper(store);
  const { result } = renderHook(() => useLazyQueryBicNettingRuleAuditListQuery(), { wrapper });
  const [query, { data }] = result.current;
  act(() => {
    query({
      page: 0,
      size: 0
    })
  });

  expect(data).toBeUndefined();
});
