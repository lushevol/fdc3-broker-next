import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper, renderHook } from "@Test/test-utils";
import { PAGE_SIZE_FOR_CASHFLOW } from "src/Cashflow_CN/Main/config/UIconfig";
import { queryNextPageCashflowList } from "src/Cashflow_CN/Main/store/actions";
import { mockAggridEvent } from "src/test/mockUtils/aggrid";

import { useGridScroll } from "./useGridScroll";

afterAll(() => {
  vi.clearAllMocks();
});

vi.mock("src/Cashflow_CN/Main/store/actions", () => {
  return {
    queryNextPageCashflowList: vi.fn(() => vi.fn(() => Promise.resolve())),
  };
});

describe('useGridScroll', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("default", () => {
        vi.mocked(queryNextPageCashflowList);
        const store = configureStore({
            reducer: {
              initParams: createReducer({}, (builder) => {
                builder.addCase(createAction("INIT"), (state, action) => state);
              }),
              cashflowGridEvent: createReducer(mockAggridEvent,
                (builder) => builder,
              ),
              searchFilters: createReducer([], (builder) => builder),
              quickFilters: createReducer([], (builder) => builder),
              switchSearch: createReducer("init", (builder) => builder),
              cashflowListQueryPageSize: createReducer(PAGE_SIZE_FOR_CASHFLOW, (builder) => builder),
              cashflowList: createReducer([], (builder) => builder),
              cashflowListQueryId: createReducer(0, (builder) => builder),
              cashflowListQueryStatus: createReducer(new Promise(() => {}), (builder) => builder),
              cashflowListPagination: createReducer({
                lastPage: true,
                totalHits: 0,
                pageNo: 0,
                pageSize: PAGE_SIZE_FOR_CASHFLOW,
              }, (builder) => builder),
              queryCount: createReducer({
                totalHits: 0,
              }, (builder) => builder),
              quickSearch: createReducer({}, (builder) => builder),
              advancedSearch: createReducer({
                appliedFilter: null,
              }, (builder) => builder),
            },
          });
        const wrapper = ReduxProviderWrapper(store);
        const { result } = renderHook(() => useGridScroll(), { wrapper });
        vi.runAllTimers();
        result.current.onBodyScrollEnd({
            ...mockAggridEvent,
            direction: "horizontal",
            left: 0,
            top: 0,
            type: "bodyScrollEnd",
        })
        expect(queryNextPageCashflowList).toHaveBeenCalled();
    });
});
