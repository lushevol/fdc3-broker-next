import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper, renderHook } from "@Test/test-utils";
import { PAGE_SIZE_FOR_CASHFLOW } from "src/Cashflow_CN/Main/config/UIconfig";
import { mockAggridEvent } from "src/test/mockUtils/aggrid";

import { useGridReadyEvent } from "./useGridReadyEvent";

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock("src/Cashflow_CN/Main/store/actions", () => {
  const mockReturn = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
  const mockPromiseReturn = jest.fn().mockResolvedValueOnce({}).mockRejectedValueOnce({});
  return {
    setCashflowGridEvent: jest.fn(() => ({
      type: "test",
      data: {},
    })),
    queryNextPageCashflowList: jest.fn(() => jest.fn(() => Promise.resolve())),
    // queryCashflowList: jest.fn(),
    // advancedSearchAction: jest.fn(),
    queryCashflowList: jest.fn(({ callback }) => {
      return jest.fn(() => {
        callback(mockReturn());
      })
    }),
    advancedSearchAction: jest.fn(() => {
      return jest.fn(() => {
        return mockPromiseReturn();
      });
    }),
  };
});

describe('useGridReadyEvent', () => {
    it("default", () => {
        const store = configureStore({
            reducer: {
              initParams: createReducer({}, (builder) => {
                builder.addCase(createAction("INIT"), (state, action) => state);
              }),
              cashflowGridEvent: createReducer({
                  api: undefined,
                },
                (builder) => builder,
              ),
              searchFilters: createReducer([], (builder) => builder),
              quickFilters: createReducer([], (builder) => builder),
              switchSearch: createReducer("init", (builder) => builder),
              cashflowListQueryPageSize: createReducer(1000, (builder) => builder),
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
        const { result } = renderHook(() => useGridReadyEvent(), { wrapper });
        jest.runAllTimers();
        expect(result.current.onGridReady({
          api: mockAggridEvent.api,
          context: undefined,
          type: "gridReady"
        })).toBeUndefined();
        expect(result.current.initialSearch()).toBeUndefined();
        renderHook(() => useGridReadyEvent(), { wrapper });
    });
    it("open with cashflowId", () => {
        const store = configureStore({
            reducer: {
              initParams: createReducer({
                cashflowId: "test",
              }, (builder) => {
                builder.addCase(createAction("INIT"), (state, action) => state);
              }),
              cashflowGridEvent: createReducer({
                  api: undefined,
                },
                (builder) => builder,
              ),
              searchFilters: createReducer([], (builder) => builder),
              quickFilters: createReducer([], (builder) => builder),
              switchSearch: createReducer("init", (builder) => builder),
              cashflowListQueryPageSize: createReducer(1000, (builder) => builder),
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
        const { result } = renderHook(() => useGridReadyEvent(), { wrapper });
        jest.runAllTimers();
        expect(result.current.onGridReady({
          api: mockAggridEvent.api,
          context: undefined,
          type: "gridReady"
        })).toBeUndefined();
        expect(result.current.initialSearch()).toBeUndefined();
        renderHook(() => useGridReadyEvent(), { wrapper });
    });
    it("open with filters", () => {
        const store = configureStore({
            reducer: {
              initParams: createReducer({
                filters: [],
              }, (builder) => {
                builder.addCase(createAction("INIT"), (state, action) => state);
              }),
              cashflowGridEvent: createReducer({
                  api: undefined,
                },
                (builder) => builder,
              ),
              searchFilters: createReducer([], (builder) => builder),
              quickFilters: createReducer([], (builder) => builder),
              switchSearch: createReducer("init", (builder) => builder),
              cashflowListQueryPageSize: createReducer(1000, (builder) => builder),
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
        const { result } = renderHook(() => useGridReadyEvent(), { wrapper });
        jest.runAllTimers();
        expect(result.current.onGridReady({
          api: mockAggridEvent.api,
          context: undefined,
          type: "gridReady"
        })).toBeUndefined();
        expect(result.current.initialSearch()).toBeUndefined();
        renderHook(() => useGridReadyEvent(), { wrapper });
    });
});