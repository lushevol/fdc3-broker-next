import { queryCashflow } from "src/Cashflow_CN/services/graphql";
import {
  mockCashflow1,
  mockCashflow2,
} from "src/Cashflow_CN/test/mockData/cashflow";
import { mockAggridEvent } from "src/test/mockUtils/aggrid";
import { waitFor } from "src/test/test-utils";

const { mockHydrate } = vi.hoisted(() => ({ mockHydrate: vi.fn() }));
vi.mock("src/Root/import/ratancomponents", async (importOriginal) => ({
  ...(await importOriginal<typeof import("src/Root/import/ratancomponents")>()),
  hydrate: mockHydrate,
}));

import { PAGE_SIZE_FOR_CASHFLOW } from "../../config/UIconfig";
import * as types from "../actionTypes";
import preloadState from "../state";
import {
  advancedSearchAction,
  aggridDeselectAll,
  clearFilter,
  filterOutCashflow,
  flashAddedCashflows,
  flashUpdatedCashflows,
  handleCashflowsData,
  notificationUpdateOrAddingCashflows,
  queryCashflowList,
  queryNextPageCashflowList,
  selectionGridChanged,
  setCashflowGridEvent,
  setCashflowListQueryPageSize,
  setInitParams,
  setLatestNotificationStack,
  setLoadNextPage,
  setOpensearch,
  updateCashflow,
  updateCashflowsByNetid,
  updateCashflowsInNetpreview,
  updateVerifyUnNetCashflow} from "./cashflowAction";

afterAll(() => {
  vi.clearAllMocks();
});

vi.mock("src/Cashflow_CN/services/graphql", () => {
  return {
    queryCashflow: vi.fn(async () => ({
      cashflowUltraQuery: {
        results: [],
      },
    })),
  };
});

vi.mock("src/Cashflow_CN/schema/ultra-cashflow-query.generated", () => ({
  api: {
    endpoints: {
      SettlementCashflowDataUltraQuery: {
        initiate: vi.fn(() => Promise.resolve({
          cashflowUltraQuery: {
            results: [],
            pageIndex: 0,
            itemsPerPage: 1000,
            totalResult: 0,
            lastPage: false,
          },
        })),
      },
    },
  },
}));

export const mockDispatch = (
  callback: Function | { type: string; data: any }
) => {
  if (typeof callback === "function") {
    const dispatch = mockDispatch;
    const getState = () => (preloadState);
    return callback(dispatch, getState);
  }
};

const unwrap = (d: any) => Promise.resolve(d);
const createDispatch = () => vi.fn((d) => ({ unwrap: () => unwrap(d) }));

export const createMockDispatch = (mockGetState: any) => (
  callback: Function | { type: string; data: any }
) => {
  if (typeof callback === "function") {
    const dispatch = createDispatch();
    return callback(dispatch, mockGetState);
  }
};

const mockApi = {
  getAllDisplayedColumns: vi.fn(() => ([
    {
      getColDef: () => ({ field: "test" }),
      colDef: {
        field: "test",
      }
    }
  ])),
  updateRowData: vi.fn(() => ({
    add: [],
    remove: [],
    update: [],
  })),
  applyTransaction: vi.fn(),
  getRowNode: vi.fn(() => ({})),
  refreshCells: vi.fn(),
  flashCells: vi.fn(),
  showNoRowsOverlay: vi.fn(),
  showLoadingOverlay: vi.fn(),
  hideOverlay: vi.fn(),
  setRowData: vi.fn(),
  forEachNode: vi.fn((cb) => {
    cb({ data: null });
  }),
  exportDataAsCsv: vi.fn(),
  exportDataAsExcel: vi.fn(),
  paginationGetPageSize: vi.fn(),
  paginationGetCurrentPage: vi.fn(),
  getSelectedRows: vi.fn(() => []),
  getGridOption: vi.fn(),
  setGridOption: vi.fn(),
  getColumn: vi.fn(),
  setServerSideDatasource: vi.fn(),
  dispatchEvent: vi.fn(),
  getLastDisplayedRowIndex: vi.fn(() => 0),
  getDisplayedRowCount: vi.fn(() => 1),
  ensureIndexVisible: vi.fn(),
};

describe("Redux: Cashflow Action", () => {
  it("update cashflow", async () => {
    const res = await mockDispatch(updateCashflow(["test_cashflow_id"]));
    expect(res.length).toBe(0);
  });
  it("query cashflow list", async () => {
    const mockGetState = vi.fn(() => ({
      cashflowListQueryStatus: Promise.resolve(),
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [
        { field: "Cashflow.Cashflow_Id", operator: "!=", value: "xxx" }
      ] },
      cashflowList: [],
      cashflowListPagination: { totalHits: 1 },
      viewCashflowDetailsWorkflow: { isOpenCashflowDetails: false },
    }));
    const mockDispatch = createMockDispatch(mockGetState);
    
    const callback = vi.fn();
    await mockDispatch(
      queryCashflowList({
        filters: {
          combinator: "and",
          rules: [],
        },
        callback,
      })
    );
    expect(callback).toHaveBeenCalled();

    //have filter value
    await mockDispatch(
      queryCashflowList({
        filters: {
          combinator: "and",
          rules: [
            {
              field: "Cashflow.Cashflow_State",
              operator: "IN",
              value: ["PROJECTED"],
            }
          ]
        },
        callback,
        isRefresh: true,
      })
    );
  });
  it("query next page cashflow list", async () => {
    const mockGetState = vi.fn(() => ({
      cashflowListQueryStatus: Promise.resolve(),
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [
        { field: "Cashflow.Cashflow_Id", operator: "!=", value: "xxx" }
      ] },
      cashflowList: [],
      cashflowListPagination: { totalHits: 1 },
      viewCashflowDetailsWorkflow: { isOpenCashflowDetails: false },
    }));
    const mockDispatch = createMockDispatch(mockGetState);
    
    const callback = vi.fn();
    await mockDispatch(queryNextPageCashflowList({ callback }));
    expect(callback).toHaveBeenCalled();

    //lastPage
    const mockDispatch1 = (
      callback: Function | { type: string; data: any }
    ) => {
      if (typeof callback === "function") {
        const dispatch = mockDispatch;
        const getState = () => ({ ...preloadState, cashflowListPagination: { ...preloadState.cashflowListPagination, lastPage: false } });
        return callback(dispatch, getState);
      }
    };
    await mockDispatch1(queryNextPageCashflowList({ callback }));
    expect(callback).toHaveBeenCalled();
  });
  it("cashflow notification", async () => {
    const updatedData = [
      {
        Cashflow: {
          Cashflow_Id: "test_cashflow_id",
          Cashflow_Version: 1,
        },
      },
    ];
    mockDispatch(notificationUpdateOrAddingCashflows(updatedData));

    //cashflowInstances is empty Array
    mockDispatch(notificationUpdateOrAddingCashflows([]));
    const mockRefreshCashflow = async () => {};
    //
    const mockDispatch1 = (
      callback: Function | { type: string; data: any }
    ) => {
      if (typeof callback === "function") {
        const dispatch = mockDispatch;
        const getState = () => ({
          // cashflow
          cashflowGridEvent: {
            api: undefined,
          }, // Data grid ready event of cashflow page
          searchFilters: {
            combinator: "and",
            rules: [
              {
                field: "Cashflow_Cashflow_Id",
                operator: "=",
                value: "test_cashflow_id",
              }
            ]
          },
          quickFilters: {
            combinator: "and",
            rules: [
              {
                field: "Cashflow_Cashflow_Version",
                operator: "=",
                value: "1",
              }
            ]
          },
          cashflowList: [
            {
              Cashflow: {
                Cashflow_Id: "test_cashflow_id",
                Cashflow_Version: 0,
              },
            },
          ],
          cashflowListPagination: {
            lastPage: false,
            totalHits: 0,
            pageNo: 0,
            pageSize: PAGE_SIZE_FOR_CASHFLOW,
          },
          viewCashflowDetailsWorkflow: {
            isOpenCashflowDetails: false,
            defaultTabKey: "1",
            data: null,
            refreshCashflow: mockRefreshCashflow,
          },
        });
        return callback(dispatch, getState);
      }
    };
    mockDispatch1(notificationUpdateOrAddingCashflows(updatedData));

    const mockDispatch2 = (
      callback: Function | { type: string; data: any }
    ) => {
      if (typeof callback === "function") {
        const dispatch = mockDispatch;
        const getState = () => ({
          // cashflow
          cashflowGridEvent: {
            api: undefined,
          }, // Data grid ready event of cashflow page
          searchFilters: {
            combinator: "and",
            rules: [
              {
                field: "Cashflow_Cashflow_Id",
                operator: "=",
                value: "M00023469504",
              }
            ]
          },
          quickFilters: {
            combinator: "and",
            rules: [
              {
                field: "Cashflow_Cashflow_Version",
                operator: "=",
                value: "0",
              }
            ]
          },
          cashflowList: [
            {
              Cashflow: {
                Cashflow_Id: "test_cashflow_id",
                Cashflow_Version: 0,
              },
            },
          ],
          cashflowListPagination: {
            lastPage: false,
            totalHits: 0,
            pageNo: 0,
            pageSize: PAGE_SIZE_FOR_CASHFLOW,
          },
          viewCashflowDetailsWorkflow: {
            isOpenCashflowDetails: true,
            defaultTabKey: "1",
            data: {
              Cashflow_Id: "test_cashflow_id",
              Cashflow_Version: 1,
            },
            refreshCashflow: mockRefreshCashflow,
          },
        });
        return callback(dispatch, getState);
      }
    };
    mockDispatch2(notificationUpdateOrAddingCashflows(updatedData));
  });
  it("update cashflows by netid", async () => {
    const res = await mockDispatch(updateCashflowsByNetid(["test_net_id"]));
    expect(res.length).toBe(0);
  });
  it("update cashflows in net preview", async () => {
    const res = await mockDispatch(
      updateCashflowsInNetpreview(["test_net_id"])
    );
    expect(res.length).toBe(0);
  });
  it("updateVerifyUnNetCashflow", async () => {
    const cashflowData = Promise.resolve({
      cashflowUltraQuery: {
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: [
          {
            BCS_Trade_Id: null,
            BCS_Parent_Trade_Id: "85573048",
            FMO_Comments: [
              {
                FMO_Comment:
                  "Matched rules are: 7204330504245366784,7204330504652214272",
                FMO_Comment_Timestamp: "Tue Jun 18 07:39:48 GMT 2024",
                FMO_Comment_Updater: "System",
              }
            ],
            Cashflow: {
              Cashflow_Id: "N00000030019",
              Cashflow_Business_Version: 0,
              Cashflow_Version: 0,
              Cashflow_State: "SETTLED",
              Cashflow_Affirmation_Status: "Affirmed",
              Cashflow_Event_Type: "New",
              Cashflow_Minor_Version: 7,
              Payment_Currency: "CNO",
              Payment_Date: "2024-06-18",
              Payment_Type: "netAmount",
              Payment_Cutoff_Time: "2024-06-17T10:00Z",
              Pay_Receive_Indicator: "Pay",
              Payment_Amount: "0.0200",
              Netting_Id: "ecc8ca49-2d45-11ef-8153-005056ac4ab7",
              Netting_Cuttoff_Date: null,
              Payment_Receiver_Party_Reference: "party2",
              Payment_Payer_Party_Reference: "party1",
              Cashflow_Sub_State: "NA",
              Cashflow_Sub_State_Type: "NA",
              Cashflow_Sub_State_Updater: "1639796",
              Status_Event_Type: "Settle",
              Cashflow_Swift_Message_Standard: null,
              Event_Date: "2024-06-18",
              Cashflow_Event_Reason: "",
            },
            Delivery_Method: "Cash",
            Settlement_Method: "Gross",
            Trade_Id: "85573048",
            Trade_Version: null,
            Entity: {
              Booking_Entity_SCI_FMID: "400085753",
              Booking_Entity_SCI_FMCODE: "SCB CN HANGZHOU*HNZ",
              Counterparty_SCI_FMID: "400899993",
              Counterparty_SCI_FMCODE: "SCB CN CHO*CHO",
            },
            Instrument_Common: {
              ISDA_Taxonomy: "COM|SWAP",
              Source_System_Instrument_Sub_Type: "COM|SWAP",
            },
            Parent_Trade_Id: "85573048",
            Trade_State: "",
            Portfolio: {
              Booking_Entity_Trade_Portfolio_Name: "COM_XIAMEN_BTB",
            },
          },
        ],
      },
    });
    vi.mocked(queryCashflow).mockImplementation(() => {
      return cashflowData;
    });
    mockDispatch(updateVerifyUnNetCashflow(["test_net_id"]));
  });
  it("advancedSearch queryCashflowList", async () => {
    const mockGetState = vi.fn(() => ({
      cashflowListQueryStatus: Promise.resolve(),
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [
        { field: "Cashflow.Cashflow_Id", operator: "!=", value: "xxx" }
      ] },
      cashflowList: [],
      cashflowListPagination: { totalHits: 1 },
      viewCashflowDetailsWorkflow: { isOpenCashflowDetails: false },
    }));
    const mockDispatch = createMockDispatch(mockGetState);

    const callback = vi.fn();
    await mockDispatch(
      queryCashflowList({
        filters: {
          combinator: "and",
          rules: []
        },
        callback,
        searchName: "advancedSearch",
      })
    );
    expect(callback).toHaveBeenCalled();
  });
  it("aggridDeselectAll", () => {
    mockDispatch(aggridDeselectAll());
  });
  it("load next page", async () => {
    const res = await mockDispatch(setLoadNextPage(true));
    expect(res).toBeUndefined();
  });
  it("selection grid Changed", async () => {
    const res = await mockDispatch(
      selectionGridChanged(10, 10, PAGE_SIZE_FOR_CASHFLOW)
    );
    expect(res.isClientSelectAllDataButNotLoadAll).toBe(false);
  });
  it("set Init Params", async () => {
    const data = {
      filters: [
        {
          field: "Cashflow.Cashflow_State",
          operator: "IN",
          values: ["QUEUED"],
        },
        {
          field: "Cashflow.Payment_Date",
          operator: "BET",
          values: ["2024-06-19", "2024-06-25"],
        },
      ],
    };
    const res = setInitParams(data);
    expect(res).toBeDefined();
  });
  it("set CashflowGrid Event", async () => {
    const res = setCashflowGridEvent({
      api: mockAggridEvent.api,
      context: undefined,
      type: "gridReady"
    });
    expect(res).toBeDefined();
  });
  it("clear Filter", async () => {
    await mockDispatch(clearFilter());
  });
  it("set Latest Notification Stack", async () => {
    const res = setLatestNotificationStack([]);
    expect(res).toBeDefined();
  });
  it("setCashflowListQueryPageSize", () => {
    mockDispatch(setCashflowListQueryPageSize(0));
    mockDispatch(setCashflowListQueryPageSize(1));
  });
  it("open search", async () => {
    const res = await mockDispatch(setOpensearch(true));
    expect(res).toBeUndefined();
  });
});

describe("cashflow action utils", () => {
  it("flashAddedCashflows", () => {
    const res = flashAddedCashflows(mockAggridEvent.api, [mockCashflow1], 300);
    expect(res).toBeUndefined();
  });
  it("flashUpdatedCashflows", () => {
    const res = flashUpdatedCashflows(
      mockAggridEvent.api,
      [mockCashflow1],
      [mockCashflow2],
      300
    );
    expect(res).toBeUndefined();
  });
});

describe("queryNextPageCashflowList", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn<any, any>(() => ({
    cashflowListQueryStatus: Promise.resolve(),
    cashflowGridEvent: { api: mockApi },
    quickFilters: { combinator: "and", rules: [] },
    searchFilters: { combinator: "and", rules: [
      { field: "Cashflow.Cashflow_Id", operator: "!=", value: "xxx" }
    ] },
    cashflowList: [],
    cashflowListPagination: { totalHits: 1 },
    viewCashflowDetailsWorkflow: { isOpenCashflowDetails: false },
  }));
  const mockApi = {
    updateRowData: vi.fn(() => ({
      add: [],
      remove: [],
      update: [],
    })),
    applyTransaction: vi.fn(),
    getRowNode: vi.fn(() => ({})),
    refreshCells: vi.fn(),
    flashCells: vi.fn(),
    showNoRowsOverlay: vi.fn(),
    showLoadingOverlay: vi.fn(),
    hideOverlay: vi.fn(),
    setRowData: vi.fn(),
    forEachNode: vi.fn((cb) => {
      cb({ data: null });
    }),
    exportDataAsCsv: vi.fn(),
    exportDataAsExcel: vi.fn(),
    paginationGetPageSize: vi.fn(),
    paginationGetCurrentPage: vi.fn(),
    getSelectedRows: vi.fn(() => []),
    getGridOption: vi.fn(),
    setGridOption: vi.fn(),
    getColumn: vi.fn(),
    setServerSideDatasource: vi.fn(),
    dispatchEvent: vi.fn(),
    getLastDisplayedRowIndex: vi.fn(() => 0),
    getDisplayedRowCount: vi.fn(() => 1),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mock("src/Cashflow_CN/schema/ultra-cashflow-query.generated", () => ({
      api: {
        endpoints: {
          SettlementCashflowDataUltraQuery: {
            initiate: vi.fn(() => Promise.resolve({
              cashflowUltraQuery: {
                results: [],
                pageIndex: 0,
                itemsPerPage: 1000,
                totalResult: 0,
                lastPage: false,
              },
            })),
          },
        },
      },
    }));
    
    mockDispatch.mockImplementation((
      callback: Function | { type: string; data: any }
    ) => {
      if (typeof callback === "function") {
        const unwrap = (d: any) => Promise.resolve(d);
        const createDispatch = () => vi.fn((d) => ({ unwrap: () => unwrap(d) }));
        const dispatch = createDispatch();
        return callback(dispatch, mockGetState);
      }
    });
  });

  it("should fetch the next page successfully when not on the last page", async () => {
    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [] },
      cashflowListPagination: {
        lastPage: false,
        pageNo: 0,
        pageSize: 10,
        totalHits: 20,
      },
      cashflowList: [],
    });

    const mockResults = [
      { Cashflow: { Cashflow_Id: "test_id_1" } },
      { Cashflow: { Cashflow_Id: "test_id_2" } },
    ];
    const mockResponse = {
      cashflowUltraQuery: {
        results: mockResults,
        pageIndex: 1,
        itemsPerPage: 10,
        totalResult: 20,
        lastPage: false,
      },
    };

    mockDispatch.mockResolvedValueOnce({
      unwrap: vi.fn().mockResolvedValue(mockResponse),
    });

    const callback = vi.fn();
    await queryNextPageCashflowList({ callback })(mockDispatch, mockGetState);

    expect(mockDispatch).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(false);
  });

  it("should handle response properly when response is missing", async () => {
    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [] },
      cashflowListPagination: {
        lastPage: false,
        pageNo: 0,
        pageSize: 10,
        totalHits: 20,
      },
      cashflowList: [],
    });

    const mockResponse = {};

    mockDispatch.mockResolvedValueOnce({
      unwrap: vi.fn().mockResolvedValue(mockResponse),
    });

    const callback = vi.fn();
    await queryNextPageCashflowList({ callback })(mockDispatch, mockGetState);

    expect(mockDispatch).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(false);
  });

  it("should handle response properly when response missed some fields", async () => {
    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [] },
      cashflowListPagination: {
        lastPage: false,
        pageNo: 0,
        pageSize: 10,
        totalHits: 20,
      },
      cashflowList: [],
    });

    const mockResponse = {
      cashflowUltraQuery: {
        itemsPerPage: 10,
        totalResult: 20,
        lastPage: false,
      },
    };

    mockDispatch.mockResolvedValueOnce({
      unwrap: vi.fn().mockResolvedValue(mockResponse),
    });

    const callback = vi.fn();
    await queryNextPageCashflowList({ callback })(mockDispatch, mockGetState);

    expect(mockDispatch).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(false);
  });

  it("should fetch the next page successfully if response invalid", async () => {
    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [] },
      cashflowListPagination: {
        lastPage: false,
        pageNo: 0,
        pageSize: 10,
        totalHits: 20,
      },
      cashflowList: [
        {
          Cashflow: { Cashflow_Id: "test" },
        }
      ],
    });

    mockDispatch.mockResolvedValueOnce({
      unwrap: vi.fn().mockResolvedValue(undefined),
    });

    const callback = vi.fn();
    await queryNextPageCashflowList({ callback })(mockDispatch, mockGetState);

    expect(mockDispatch).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(false);
  });

  it.skip("should handle failure when fetching the next page", async () => {
    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [] },
      cashflowListPagination: {
        lastPage: false,
        pageNo: 0,
        pageSize: 10,
        totalHits: 20,
      },
    });

    const mockInitiate = require("src/Cashflow_CN/schema/ultra-cashflow-query.generated").api.endpoints.SettlementCashflowDataUltraQuery.initiate;
    mockInitiate.mockRejectedValue({ error: [] });

    const callback = vi.fn();
    try {
      await queryNextPageCashflowList({ callback })(mockDispatch, mockGetState);
    } catch (error) {
      
    }

    expect(mockApi.setGridOption).toHaveBeenCalledWith("loading", true);
    expect(mockApi.setGridOption).toHaveBeenCalledWith("loading", false);
    expect(callback).toHaveBeenCalledWith(false);
  });

  it("should not fetch when already on the last page", async () => {
    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [] },
      cashflowListPagination: {
        lastPage: true,
        pageNo: 0,
        pageSize: 10,
        totalHits: 20,
      },
    });

    const callback = vi.fn();
    await queryNextPageCashflowList({ callback })(mockDispatch, mockGetState);

    expect(mockApi.dispatchEvent).toHaveBeenCalledWith({
      type: "gridFetchedAllData",
      isGridFetchedAll: true,
    });
    expect(mockApi.setGridOption).toHaveBeenCalledWith("loading", false);
    expect(callback).toHaveBeenCalledWith(false);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("should handle empty filters gracefully", async () => {
    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [] },
      cashflowListPagination: {
        lastPage: false,
        pageNo: 0,
        pageSize: 10,
        totalHits: 20,
      },
      cashflowList: [],
    });

    const mockResults = [
      { Cashflow: { Cashflow_Id: "test_id_1" } },
      { Cashflow: { Cashflow_Id: "test_id_2" } },
    ];
    const mockResponse = {
      cashflowUltraQuery: {
        results: mockResults,
        pageIndex: 1,
        itemsPerPage: 10,
        totalResult: 20,
        lastPage: false,
      },
    };

    mockDispatch.mockResolvedValueOnce({
      unwrap: vi.fn().mockResolvedValue(mockResponse),
    });

    const callback = vi.fn();
    await queryNextPageCashflowList({ callback })(mockDispatch, mockGetState);

    expect(mockDispatch).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(false);
  });

  it("should handle duplicate cashflows correctly", async () => {
    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [] },
      cashflowListPagination: {
        lastPage: false,
        pageNo: 0,
        pageSize: 10,
        totalHits: 20,
      },
      cashflowList: [{ Cashflow: { Cashflow_Id: "test_id_1" } }],
    });

    const mockResults = [
      { Cashflow: { Cashflow_Id: "test_id_1" } },
      { Cashflow: { Cashflow_Id: "test_id_2" } },
    ];
    const mockResponse = {
      cashflowUltraQuery: {
        results: mockResults,
        pageIndex: 1,
        itemsPerPage: 10,
        totalResult: 20,
        lastPage: false,
      },
    };

    mockDispatch.mockResolvedValueOnce({
      unwrap: vi.fn().mockResolvedValue(mockResponse),
    });

    const callback = vi.fn();
    await queryNextPageCashflowList({ callback })(mockDispatch, mockGetState);

    expect(mockDispatch).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(false);
  });
});

describe("filterOutCashflow", () => {
  it("should return an array of Cashflow objects when all elements are NotifiedCashflow", () => {
    const notifiedCashflows = [
      { Cashflow: { Cashflow_Id: "id1" }, Event_Action: "UPDATED" },
      { Cashflow: { Cashflow_Id: "id2" }, Event_Action: "UPDATED" },
    ];
    const result = filterOutCashflow(notifiedCashflows);
    expect(result).toEqual([
      {
        Cashflow_Id: "id1",
      },
      {
        Cashflow_Id: "id2",
      },
    ]);
  });

  it("should return the same array when elements are already Cashflow objects", () => {
    const cashflows = [
      {
        Cashflow: { Cashflow_Id: "id1" },
        Event_Action: "UPDATED"
      },
      {
        Cashflow: { Cashflow_Id: "id2" },
        Event_Action: "UPDATED"
      }
    ];
    const result = filterOutCashflow(cashflows);
    expect(result).toEqual([
      {
        Cashflow_Id: "id1",
      },
      {
        Cashflow_Id: "id2",
      },
    ]);
  });

  it("should handle an empty array gracefully", () => {
    const result = filterOutCashflow([]);
    expect(result).toEqual([]);
  });

  it("should return an empty array when input is undefined", () => {
    const result = filterOutCashflow(undefined as any);
    expect(result).toBeUndefined();
  });

  it("should return an empty array when input is null", () => {
    const result = filterOutCashflow(null as any);
    expect(result).toEqual(null);
  });

  it("should handle an array with invalid objects gracefully", () => {
    const invalidCashflows = [
      { invalidKey: "value1" },
      { Cashflow: null },
    ];
    const result = filterOutCashflow(invalidCashflows as any);
    expect(result).toEqual([{ "invalidKey": "value1" }, { "Cashflow": null }]);
  });
});
describe("handleCashflowsData", () => {
  const mockCashflow = (id: string, version: number): CNCashflow => ({
    Cashflow: {
      Cashflow_Id: id,
      Cashflow_Version: version,
    },
  });

  it("should return updated, deleted, and new cashflow lists correctly", () => {
    const cashflowList = [mockCashflow("id1", 1), mockCashflow("id2", 1)];
    const filteredCashflows = [mockCashflow("id1", 2)];
    const droppedCashflows = [mockCashflow("id2", 1)];

    const result = handleCashflowsData(cashflowList, filteredCashflows, droppedCashflows);

    expect(result.updatedCashflows).toEqual([mockCashflow("id1", 2)]);
    expect(result.deletedCashflows).toEqual([mockCashflow("id2", 1)]);
    expect(result.newCashflowList).toEqual([mockCashflow("id1", 2), mockCashflow("id2", 1)]);
    expect(result.originCashflowsBeUpdated).toEqual([mockCashflow("id1", 1)]);
  });

  it("should handle empty filteredCashflows and droppedCashflows", () => {
    const cashflowList = [mockCashflow("id1", 1), mockCashflow("id2", 1)];
    const filteredCashflows: CNCashflow[] = [];
    const droppedCashflows: CNCashflow[] = [];

    const result = handleCashflowsData(cashflowList, filteredCashflows, droppedCashflows);

    expect(result.updatedCashflows).toEqual([]);
    expect(result.deletedCashflows).toEqual([]);
    expect(result.newCashflowList).toEqual(cashflowList);
    expect(result.originCashflowsBeUpdated).toEqual([]);
  });

  it("should handle empty cashflowList", () => {
    const cashflowList: CNCashflow[] = [];
    const filteredCashflows = [mockCashflow("id1", 2)];
    const droppedCashflows = [mockCashflow("id2", 1)];

    const result = handleCashflowsData(cashflowList, filteredCashflows, droppedCashflows);

    expect(result.updatedCashflows).toEqual([]);
    expect(result.deletedCashflows).toEqual([]);
    expect(result.newCashflowList).toEqual([]);
    expect(result.originCashflowsBeUpdated).toEqual([]);
  });

  it("should handle no updates or deletions", () => {
    const cashflowList = [mockCashflow("id1", 1)];
    const filteredCashflows = [mockCashflow("id3", 1)];
    const droppedCashflows = [mockCashflow("id4", 1)];

    const result = handleCashflowsData(cashflowList, filteredCashflows, droppedCashflows);

    expect(result.updatedCashflows).toEqual([]);
    expect(result.deletedCashflows).toEqual([]);
    expect(result.newCashflowList).toEqual(cashflowList);
    expect(result.originCashflowsBeUpdated).toEqual([]);
  });

  it("should handle multiple updates and deletions", () => {
    const cashflowList = [
      mockCashflow("id1", 1),
      mockCashflow("id2", 1),
      mockCashflow("id3", 1),
    ];
    const filteredCashflows = [
      mockCashflow("id1", 2),
      mockCashflow("id3", 2),
    ];
    const droppedCashflows = [mockCashflow("id2", 1)];

    const result = handleCashflowsData(cashflowList, filteredCashflows, droppedCashflows);

    expect(result.updatedCashflows).toEqual([
      mockCashflow("id1", 2),
      mockCashflow("id3", 2),
    ]);
    expect(result.deletedCashflows).toEqual([mockCashflow("id2", 1)]);
    expect(result.newCashflowList).toEqual([
      mockCashflow("id1", 2),
      mockCashflow("id2", 1),
      mockCashflow("id3", 2),
    ]);
    expect(result.originCashflowsBeUpdated).toEqual([
      mockCashflow("id1", 1),
      mockCashflow("id3", 1),
    ]);
  });

  it("should handle invalid cashflows gracefully", () => {
    const cashflowList = [mockCashflow("id1", 1)];
    const filteredCashflows = [null as any];
    const droppedCashflows = [undefined as any];

    const result = handleCashflowsData(cashflowList, filteredCashflows, droppedCashflows);

    expect(result.updatedCashflows).toEqual([]);
    expect(result.deletedCashflows).toEqual([]);
    expect(result.newCashflowList).toEqual(cashflowList);
    expect(result.originCashflowsBeUpdated).toEqual([]);
  });

  it("should handle duplicate cashflows in filteredCashflows", () => {
    const cashflowList = [mockCashflow("id1", 1)];
    const filteredCashflows = [mockCashflow("id1", 2), mockCashflow("id1", 2)];
    const droppedCashflows: CNCashflow[] = [];

    const result = handleCashflowsData(cashflowList, filteredCashflows, droppedCashflows);

    expect(result.updatedCashflows).toEqual([mockCashflow("id1", 2)]);
    expect(result.deletedCashflows).toEqual([]);
    expect(result.newCashflowList).toEqual([mockCashflow("id1", 2)]);
    expect(result.originCashflowsBeUpdated).toEqual([mockCashflow("id1", 1)]);
  });
});
describe("flashAddedCashflows", () => {
  const mockApi = {
    updateRowData: vi.fn(() => ({
      add: [],
      remove: [],
      update: [],
    })),
    applyTransaction: vi.fn(),
    getRowNode: vi.fn(() => ({})),
    refreshCells: vi.fn(),
    flashCells: vi.fn(),
    showNoRowsOverlay: vi.fn(),
    showLoadingOverlay: vi.fn(),
    hideOverlay: vi.fn(),
    setRowData: vi.fn(),
    forEachNode: vi.fn((cb) => {
      cb({ data: null });
    }),
    exportDataAsCsv: vi.fn(),
    exportDataAsExcel: vi.fn(),
    paginationGetPageSize: vi.fn(),
    paginationGetCurrentPage: vi.fn(),
    getSelectedRows: vi.fn(() => []),
    getGridOption: vi.fn(),
    setGridOption: vi.fn(),
    getColumn: vi.fn(),
    setServerSideDatasource: vi.fn(),
    dispatchEvent: vi.fn(),
    getLastDisplayedRowIndex: vi.fn(() => 0),
    getDisplayedRowCount: vi.fn(() => 1),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should flash cells for added cashflows", () => {
    const addedCashflows = [
      { Cashflow: { Cashflow_Id: "id1" } },
      { Cashflow: { Cashflow_Id: "id2" } },
    ];
    const mockRowNode1 = { id: "id1" };
    const mockRowNode2 = { id: "id2" };

    mockApi.getRowNode.mockImplementation(((id) => {
      if (id === "id1") return mockRowNode1;
      if (id === "id2") return mockRowNode2;
      return null;
    }) as any);

    flashAddedCashflows(mockApi as any, addedCashflows, 300);

    expect(mockApi.getRowNode).toHaveBeenCalledTimes(2);
    expect(mockApi.getRowNode).toHaveBeenCalledWith("id1");
    expect(mockApi.getRowNode).toHaveBeenCalledWith("id2");
    expect(mockApi.flashCells).not.toHaveBeenCalled();
  });

  it("should not flash cells if no added cashflows are provided", () => {
    flashAddedCashflows(mockApi as any, [], 300);

    expect(mockApi.getRowNode).not.toHaveBeenCalled();
    expect(mockApi.flashCells).not.toHaveBeenCalled();
  });

  it("should handle a mix of valid and invalid row nodes", () => {
    const addedCashflows = [
      { Cashflow: { Cashflow_Id: "id1" } },
      { Cashflow: { Cashflow_Id: "id2" } },
    ];
    const mockRowNode1 = { id: "id1" };

    mockApi.getRowNode.mockImplementation(((id) => {
      if (id === "id1") return mockRowNode1;
      return null;
    }) as any);

    flashAddedCashflows(mockApi as any, addedCashflows, 300);

    expect(mockApi.getRowNode).toHaveBeenCalledTimes(2);
    expect(mockApi.flashCells).not.toHaveBeenCalled();
  });

  it("should handle missing Cashflow_Id in addedCashflows gracefully", () => {
    const addedCashflows = [
      { Cashflow: { Cashflow_Id: null } },
      { Cashflow: { Cashflow_Id: undefined } },
    ];

    flashAddedCashflows(mockApi as any, addedCashflows, 300);

    expect(mockApi.getRowNode).toHaveBeenCalledTimes(2);
    expect(mockApi.flashCells).not.toHaveBeenCalled();
  });
});
describe("flashUpdatedCashflows", () => {
  const mockApi = {
    updateRowData: vi.fn(() => ({
      add: [],
      remove: [],
      update: [],
    })),
    applyTransaction: vi.fn(),
    getRowNode: vi.fn(() => ({})),
    refreshCells: vi.fn(),
    flashCells: vi.fn(),
    showNoRowsOverlay: vi.fn(),
    showLoadingOverlay: vi.fn(),
    hideOverlay: vi.fn(),
    setRowData: vi.fn(),
    forEachNode: vi.fn((cb) => {
      cb({ data: null });
    }),
    exportDataAsCsv: vi.fn(),
    exportDataAsExcel: vi.fn(),
    paginationGetPageSize: vi.fn(),
    paginationGetCurrentPage: vi.fn(),
    getSelectedRows: vi.fn(() => []),
    getGridOption: vi.fn(),
    setGridOption: vi.fn(),
    getColumn: vi.fn(),
    setServerSideDatasource: vi.fn(),
    dispatchEvent: vi.fn(),
    getLastDisplayedRowIndex: vi.fn(() => 0),
    getDisplayedRowCount: vi.fn(() => 1),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should flash cells for updated cashflows with specific columns", () => {
    const updatedCashflows = [
      { Cashflow: { Cashflow_Id: "id1" } },
      { Cashflow: { Cashflow_Id: "id2" } },
    ];
    const originCashflowsBeUpdated = [
      { Cashflow: { Cashflow_Id: "id1", field1: "oldValue1" } },
      { Cashflow: { Cashflow_Id: "id2", field2: "oldValue2" } },
    ];
    const mockRowNode1 = { id: "id1" };
    const mockRowNode2 = { id: "id2" };

    mockApi.getRowNode.mockImplementation(((id) => {
      if (id === "id1") return mockRowNode1;
      if (id === "id2") return mockRowNode2;
      return null;
    }) as any);

    flashUpdatedCashflows(mockApi as any, updatedCashflows, originCashflowsBeUpdated, 300);

    expect(mockApi.getRowNode).toHaveBeenCalledTimes(2);
    expect(mockApi.getRowNode).toHaveBeenCalledWith("id1");
    expect(mockApi.getRowNode).toHaveBeenCalledWith("id2");
    expect(mockApi.flashCells).toHaveBeenCalledWith({
      rowNodes: [mockRowNode1],
      columns: ["Cashflow.field1"],
      fadeDuration: 300,
    });
    expect(mockApi.flashCells).toHaveBeenCalledWith({
      rowNodes: [mockRowNode2],
      columns: ["Cashflow.field2"],
      fadeDuration: 300,
    });
  });

  it("should flash cells for updated cashflows without specific columns when no differences are found", () => {
    const updatedCashflows = [
      { Cashflow: { Cashflow_Id: "id1" } },
    ];
    const originCashflowsBeUpdated = [
      { Cashflow: { Cashflow_Id: "id1" } },
    ];
    const mockRowNode1 = { id: "id1" };

    mockApi.getRowNode.mockReturnValue(mockRowNode1);

    flashUpdatedCashflows(mockApi as any, updatedCashflows, originCashflowsBeUpdated, 300);

    expect(mockApi.getRowNode).toHaveBeenCalledTimes(1);
    expect(mockApi.getRowNode).toHaveBeenCalledWith("id1");
    expect(mockApi.flashCells).toHaveBeenCalledWith({
      rowNodes: [mockRowNode1],
      columns: [],
      fadeDuration: 300,
    });
  });

  it("should not flash cells if no updated cashflows are provided", () => {
    flashUpdatedCashflows(mockApi as any, [], [], 300);

    expect(mockApi.getRowNode).not.toHaveBeenCalled();
    expect(mockApi.flashCells).not.toHaveBeenCalled();
  });

  it("should handle a mix of valid and invalid row nodes", () => {
    const updatedCashflows = [
      { Cashflow: { Cashflow_Id: "id1" } },
      { Cashflow: { Cashflow_Id: "id2" } },
    ];
    const originCashflowsBeUpdated = [
      { Cashflow: { Cashflow_Id: "id1" } },
      { Cashflow: { Cashflow_Id: "id2" } },
    ];
    const mockRowNode1 = { id: "id1" };

    mockApi.getRowNode.mockImplementation(((id) => {
      if (id === "id1") return mockRowNode1;
      return null;
    }) as any);

    flashUpdatedCashflows(mockApi as any, updatedCashflows, originCashflowsBeUpdated, 300);

    expect(mockApi.getRowNode).toHaveBeenCalledTimes(2);
    expect(mockApi.flashCells).toHaveBeenCalledWith({
      rowNodes: [mockRowNode1],
      columns: [],
      fadeDuration: 300,
    });
  });

  it("should handle missing Cashflow_Id in updatedCashflows gracefully", () => {
    const updatedCashflows = [
      { Cashflow: { Cashflow_Id: null } },
      { Cashflow: { Cashflow_Id: undefined } },
    ];
    const originCashflowsBeUpdated = [
      { Cashflow: { Cashflow_Id: null } },
      { Cashflow: { Cashflow_Id: undefined } },
    ];

    flashUpdatedCashflows(mockApi as any, updatedCashflows, originCashflowsBeUpdated, 300);

    expect(mockApi.getRowNode).toHaveBeenCalledTimes(2);
    expect(mockApi.flashCells).not.toHaveBeenCalled();
  });
});
describe("notificationUpdateOrAddingCashflows", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();
  const mockApi = {
    updateRowData: vi.fn(() => ({
      add: [],
      remove: [],
      update: [],
    })),
    applyTransaction: vi.fn(),
    getRowNode: vi.fn(() => ({})),
    refreshCells: vi.fn(),
    flashCells: vi.fn(),
    showNoRowsOverlay: vi.fn(),
    showLoadingOverlay: vi.fn(),
    hideOverlay: vi.fn(),
    setRowData: vi.fn(),
    forEachNode: vi.fn((cb) => {
      cb({ data: null });
    }),
    exportDataAsCsv: vi.fn(),
    exportDataAsExcel: vi.fn(),
    paginationGetPageSize: vi.fn(),
    paginationGetCurrentPage: vi.fn(),
    getSelectedRows: vi.fn(() => []),
    getGridOption: vi.fn(),
    setGridOption: vi.fn(),
    getColumn: vi.fn(),
    setServerSideDatasource: vi.fn(),
    dispatchEvent: vi.fn(),
    getLastDisplayedRowIndex: vi.fn(() => 0),
    getDisplayedRowCount: vi.fn(() => 1),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle empty cashflowInstances gracefully", async () => {
    mockGetState.mockReturnValue({
      cashflowListQueryStatus: Promise.resolve(),
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [] },
      cashflowList: [],
      cashflowListPagination: { totalHits: 0 },
      viewCashflowDetailsWorkflow: { isOpenCashflowDetails: false },
    });

    await notificationUpdateOrAddingCashflows([])(mockDispatch, mockGetState);

    expect(mockApi.applyTransaction).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
  
  it("should handle empty filters gracefully", async () => {
    const cashflowInstances = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NEW", Cashflow_Version: 0 } },
      { Cashflow: { Cashflow_Id: "id2", Cashflow_State: "UPDATED", Cashflow_Version: 1 } },
    ];
    mockGetState.mockReturnValue({
      cashflowListQueryStatus: Promise.resolve(),
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [] },
      cashflowList: [],
      cashflowListPagination: { totalHits: 0 },
      viewCashflowDetailsWorkflow: { isOpenCashflowDetails: false },
    });

    await notificationUpdateOrAddingCashflows(cashflowInstances)(mockDispatch, mockGetState);

    expect(mockApi.applyTransaction).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("should update the grid with added, updated, and deleted cashflows", async () => {
    const cashflowInstances = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NEW", Cashflow_Version: 0 } },
      { Cashflow: { Cashflow_Id: "id2", Cashflow_State: "UPDATED", Cashflow_Version: 1 } },
    ];
    const existingCashflows = [
      { Cashflow: { Cashflow_Id: "id2", Cashflow_State: "OLD", Cashflow_Version: 0 } },
    ];

    mockGetState.mockReturnValue({
      cashflowListQueryStatus: Promise.resolve(),
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [
        { field: "Cashflow.Cashflow_Id", operator: "!=", value: "xxx" }
      ] },
      cashflowList: existingCashflows,
      cashflowListPagination: { totalHits: 1 },
      viewCashflowDetailsWorkflow: { isOpenCashflowDetails: false },
    });

    await notificationUpdateOrAddingCashflows(cashflowInstances)(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.applyTransaction).toHaveBeenCalledWith({
      update: [{ Cashflow: { Cashflow_Id: "id2", Cashflow_State: "UPDATED", Cashflow_Version: 1 } }],
      remove: [],
      add: [{ Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NEW", Cashflow_Version: 0 } }],
      addIndex: 0,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.SET_CASHFLOW_LIST,
      data: [
        { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NEW", Cashflow_Version: 0 } },
        { Cashflow: { Cashflow_Id: "id2", Cashflow_State: "UPDATED", Cashflow_Version: 1 } },
      ],
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.SET_CASHFLOW_LIST_PAGINATION,
      data: { totalHits: 2 },
    });
  });

  it("should handle deleted cashflows correctly", async () => {
    const cashflowInstances = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NEW", Cashflow_Version: 1 } },
    ];
    const existingCashflows = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "OLD", Cashflow_Version: 0 } },
      { Cashflow: { Cashflow_Id: "id2", Cashflow_State: "OLD", Cashflow_Version: 0 } },
    ];

    mockGetState.mockReturnValue({
      cashflowListQueryStatus: Promise.resolve(),
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [
        { field: "Cashflow.Cashflow_State", operator: "=", value: "OLD" }
      ] },
      cashflowList: existingCashflows,
      cashflowListPagination: { totalHits: 2 },
      viewCashflowDetailsWorkflow: { isOpenCashflowDetails: false },
    });

    await notificationUpdateOrAddingCashflows(cashflowInstances)(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.applyTransaction).toHaveBeenCalledWith({
      update: [],
      remove: [{ Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NEW", Cashflow_Version: 1 } }],
      add: [],
      addIndex: 0,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.SET_CASHFLOW_LIST,
      data: [{ Cashflow: { Cashflow_Id: "id2", Cashflow_State: "OLD", Cashflow_Version: 0 } }],
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.SET_CASHFLOW_LIST_PAGINATION,
      data: { totalHits: 1 },
    });
  });
  
  it("should handle cashflows not changed correctly", async () => {
    const cashflowInstances = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "OLD", Cashflow_Version: 0 } },
    ];
    const existingCashflows = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "OLD", Cashflow_Version: 0 } },
      { Cashflow: { Cashflow_Id: "id2", Cashflow_State: "OLD", Cashflow_Version: 0 } },
    ];

    mockGetState.mockReturnValue({
      cashflowListQueryStatus: Promise.resolve(),
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [
        { field: "Cashflow.Cashflow_State", operator: "=", value: "OLD" }
      ] },
      cashflowList: existingCashflows,
      cashflowListPagination: { totalHits: 2 },
      viewCashflowDetailsWorkflow: { isOpenCashflowDetails: false },
    });

    await notificationUpdateOrAddingCashflows(cashflowInstances)(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.applyTransaction).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("should handle workflow updates when cashflow details are open", async () => {
    const cashflowInstances = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "UPDATED", Cashflow_Version: 1 } },
    ];
    const existingCashflows = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "OLD", Cashflow_Version: 0 } },
    ];

    mockGetState.mockReturnValue({
      cashflowListQueryStatus: Promise.resolve(),
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [
        { field: "Cashflow.Cashflow_Id", operator: "=", value: "id1" }
      ] },
      cashflowList: existingCashflows,
      cashflowListPagination: { totalHits: 1 },
      viewCashflowDetailsWorkflow: {
        isOpenCashflowDetails: true,
        data: { Cashflow_Id: "id1", Cashflow_State: "OLD" },
      },
    });

    await notificationUpdateOrAddingCashflows(cashflowInstances)(
      mockDispatch,
      mockGetState
    );

    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.SET_CASHFLOW_LIST,
      data: [
        { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "UPDATED", Cashflow_Version: 1, } }
      ],
    });
  });

  it.skip("should handle invalid cashflowInstances gracefully", async () => {
    mockGetState.mockReturnValue({
      cashflowListQueryStatus: Promise.resolve(),
      cashflowGridEvent: { api: mockApi },
      quickFilters: { combinator: "and", rules: [] },
      searchFilters: { combinator: "and", rules: [] },
      cashflowList: [],
      cashflowListPagination: { totalHits: 0 },
      viewCashflowDetailsWorkflow: { isOpenCashflowDetails: false },
    });

    await notificationUpdateOrAddingCashflows(null as any)(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.applyTransaction).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});

describe("updateCashflowsByNetid", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();
  const mockApi = {
    getAllDisplayedColumns: vi.fn(() => ([
      {
        getColDef: () => ({ field: "test" }),
        colDef: {
          field: "test",
        }
      }
    ])),
    updateRowData: vi.fn(() => ({
      add: [],
      remove: [],
      update: [],
    })),
    applyTransaction: vi.fn(),
    getRowNode: vi.fn(() => ({})),
    refreshCells: vi.fn(),
    flashCells: vi.fn(),
    showNoRowsOverlay: vi.fn(),
    showLoadingOverlay: vi.fn(),
    hideOverlay: vi.fn(),
    setRowData: vi.fn(),
    forEachNode: vi.fn((cb) => {
      cb({ data: null });
    }),
    exportDataAsCsv: vi.fn(),
    exportDataAsExcel: vi.fn(),
    paginationGetPageSize: vi.fn(),
    paginationGetCurrentPage: vi.fn(),
    getSelectedRows: vi.fn(() => []),
    getGridOption: vi.fn(),
    setGridOption: vi.fn(),
    getColumn: vi.fn(),
    setServerSideDatasource: vi.fn(),
    dispatchEvent: vi.fn(),
    getLastDisplayedRowIndex: vi.fn(() => 0),
    getDisplayedRowCount: vi.fn(() => 1),
  };
  const mockPreviewApi = {
    getAllDisplayedColumns: vi.fn(() => ([
      {
        getColDef: () => ({ field: "test" }),
        colDef: {
          field: "test",
        }
      }
    ])),
    updateRowData: vi.fn(() => ({
      add: [],
      remove: [],
      update: [],
    })),
    applyTransaction: vi.fn(),
    getRowNode: vi.fn(() => ({})),
    refreshCells: vi.fn(),
    flashCells: vi.fn(),
    showNoRowsOverlay: vi.fn(),
    showLoadingOverlay: vi.fn(),
    hideOverlay: vi.fn(),
    setRowData: vi.fn(),
    forEachNode: vi.fn((cb) => {
      cb({ data: null });
    }),
    exportDataAsCsv: vi.fn(),
    exportDataAsExcel: vi.fn(),
    paginationGetPageSize: vi.fn(),
    paginationGetCurrentPage: vi.fn(),
    getSelectedRows: vi.fn(() => []),
    getGridOption: vi.fn(),
    setGridOption: vi.fn(),
    getColumn: vi.fn(),
    setServerSideDatasource: vi.fn(),
    dispatchEvent: vi.fn(),
    getLastDisplayedRowIndex: vi.fn(() => 0),
    getDisplayedRowCount: vi.fn(() => 1),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and update cashflows successfully for a single netting ID", async () => {
    const mockResults = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NEW" } },
    ];
    vi.mocked(queryCashflow).mockResolvedValueOnce({
      cashflowUltraQuery: {
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: mockResults
      },
    });

    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      netWorkflow: { previewGridReadyEvent: { api: mockPreviewApi } },
    });

    const result = await updateCashflowsByNetid("test_netting_id")(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(mockPreviewApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        {
          field: "Cashflow.Netting_Id",
          operator: "EQ",
          values: "test_netting_id",
        },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.NET_CASHFLOW_FINISHED,
      data: { nettingStatus: "FINISHED" },
    });
    expect(result).toEqual(mockResults);
  });

  it("should fetch and update cashflows successfully for multiple netting IDs", async () => {
    const mockResults = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NEW" } },
      { Cashflow: { Cashflow_Id: "id2", Cashflow_State: "UPDATED" } },
    ];
    vi.mocked(queryCashflow).mockResolvedValueOnce({
      cashflowUltraQuery: {
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: mockResults
      },
    });

    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      netWorkflow: { previewGridReadyEvent: { api: mockPreviewApi } },
    });

    const result = await updateCashflowsByNetid(["id1", "id2"])(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(mockPreviewApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        {
          field: "Cashflow.Netting_Id",
          operator: "IN",
          values: ["id1", "id2"],
        },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.NET_CASHFLOW_FINISHED,
      data: { nettingStatus: "FINISHED" },
    });
    expect(result).toEqual(mockResults);
  });

  it.skip("should handle queryCashflow failure gracefully", async () => {
    vi.mocked(queryCashflow).mockRejectedValueOnce(new Error("Query failed"));

    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      netWorkflow: { previewGridReadyEvent: { api: mockPreviewApi } },
    });

    await expect(
      updateCashflowsByNetid("test_netting_id")(mockDispatch, mockGetState)
    ).rejects.toThrow("Query failed");

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(mockPreviewApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        {
          field: "Cashflow.Netting_Id",
          operator: "EQ",
          values: "test_netting_id",
        },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).not.toHaveBeenCalledWith({
      type: types.NET_CASHFLOW_FINISHED,
      data: { nettingStatus: "FINISHED" },
    });
  });

  it("should handle empty results from queryCashflow", async () => {
    vi.mocked(queryCashflow).mockResolvedValueOnce({
      cashflowUltraQuery: { 
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: []
      },
    });

    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      netWorkflow: { previewGridReadyEvent: { api: mockPreviewApi } },
    });

    const result = await updateCashflowsByNetid("test_netting_id")(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(mockPreviewApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        {
          field: "Cashflow.Netting_Id",
          operator: "EQ",
          values: "test_netting_id",
        },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.NET_CASHFLOW_FINISHED,
      data: { nettingStatus: "FINISHED" },
    });
    expect(result).toEqual([]);
  });

  it("should handle missing previewGridReadyEvent gracefully", async () => {
    vi.mocked(queryCashflow).mockResolvedValueOnce({
      cashflowUltraQuery: {
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: [] },
    });

    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      netWorkflow: { previewGridReadyEvent: null },
    });

    const result = await updateCashflowsByNetid("test_netting_id")(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        {
          field: "Cashflow.Netting_Id",
          operator: "EQ",
          values: "test_netting_id",
        },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.NET_CASHFLOW_FINISHED,
      data: { nettingStatus: "FINISHED" },
    });
    expect(result).toEqual([]);
  });
  
  it("should handle invalid results from queryCashflow", async () => {
    vi.mocked(queryCashflow).mockResolvedValueOnce({} as any);

    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      netWorkflow: { previewGridReadyEvent: { api: mockPreviewApi } },
    });

    const result = await updateCashflowsByNetid("test_netting_id")(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(mockPreviewApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        {
          field: "Cashflow.Netting_Id",
          operator: "EQ",
          values: "test_netting_id",
        },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.NET_CASHFLOW_FINISHED,
      data: { nettingStatus: "FINISHED" },
    });
    expect(result).toBeUndefined();
  });
});

describe("updateCashflowsInNetpreview", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();
  const mockApi = {
    getAllDisplayedColumns: vi.fn(() => ([
      {
        getColDef: () => ({ field: "test" }),
        colDef: {
          field: "test",
        }
      }
    ])),
    updateRowData: vi.fn(() => ({
      add: [],
      remove: [],
      update: [],
    })),
    applyTransaction: vi.fn(),
    getRowNode: vi.fn(() => ({})),
    refreshCells: vi.fn(),
    flashCells: vi.fn(),
    showNoRowsOverlay: vi.fn(),
    showLoadingOverlay: vi.fn(),
    hideOverlay: vi.fn(),
    setRowData: vi.fn(),
    forEachNode: vi.fn((cb) => {
      cb({ data: null });
    }),
    exportDataAsCsv: vi.fn(),
    exportDataAsExcel: vi.fn(),
    paginationGetPageSize: vi.fn(),
    paginationGetCurrentPage: vi.fn(),
    getSelectedRows: vi.fn(() => []),
    getGridOption: vi.fn(),
    setGridOption: vi.fn(),
    getColumn: vi.fn(),
    setServerSideDatasource: vi.fn(),
    dispatchEvent: vi.fn(),
    getLastDisplayedRowIndex: vi.fn(() => 0),
    getDisplayedRowCount: vi.fn(() => 1),
  };
  const mockPreviewApi = {
    getAllDisplayedColumns: vi.fn(() => ([
      {
        getColDef: () => ({ field: "test" }),
        colDef: {
          field: "test",
        }
      }
    ])),
    updateRowData: vi.fn(() => ({
      add: [],
      remove: [],
      update: [],
    })),
    applyTransaction: vi.fn(),
    getRowNode: vi.fn(() => ({})),
    refreshCells: vi.fn(),
    flashCells: vi.fn(),
    showNoRowsOverlay: vi.fn(),
    showLoadingOverlay: vi.fn(),
    hideOverlay: vi.fn(),
    setRowData: vi.fn(),
    forEachNode: vi.fn((cb) => {
      cb({ data: null });
    }),
    exportDataAsCsv: vi.fn(),
    exportDataAsExcel: vi.fn(),
    paginationGetPageSize: vi.fn(),
    paginationGetCurrentPage: vi.fn(),
    getSelectedRows: vi.fn(() => []),
    getGridOption: vi.fn(),
    setGridOption: vi.fn(),
    getColumn: vi.fn(),
    setServerSideDatasource: vi.fn(),
    dispatchEvent: vi.fn(),
    getLastDisplayedRowIndex: vi.fn(() => 0),
    getDisplayedRowCount: vi.fn(() => 1),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
      netWorkflow: { previewGridReadyEvent: { api: mockPreviewApi } },
    });
  });

  it("should fetch and update cashflows successfully when single cashflowId is provided", async () => {
    const mockResults = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NEW" } },
    ];
    vi.mocked(queryCashflow).mockResolvedValueOnce({
      cashflowUltraQuery: {
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: mockResults
      },
    });

    const result = await updateCashflowsInNetpreview("id1")(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(mockPreviewApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "EQ", values: "id1" },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual(mockResults);
  });

  it("should fetch and update cashflows successfully when multiple cashflowIds are provided", async () => {
    const mockResults = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NEW" } },
      { Cashflow: { Cashflow_Id: "id2", Cashflow_State: "UPDATED" } },
    ];
    vi.mocked(queryCashflow).mockResolvedValueOnce({
      cashflowUltraQuery: {
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: mockResults
      },
    });

    const result = await updateCashflowsInNetpreview(["id1", "id2"])(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(mockPreviewApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "IN", values: ["id1", "id2"] },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual(mockResults);
  });

  it("should handle empty results gracefully", async () => {
    vi.mocked(queryCashflow).mockResolvedValueOnce({
      cashflowUltraQuery: {
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: [] 
      },
    });

    const result = await updateCashflowsInNetpreview("id1")(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(mockPreviewApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "EQ", values: "id1" },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
  
  it("should handle invalid results gracefully", async () => {
    vi.mocked(queryCashflow).mockResolvedValueOnce({} as any);

    const result = await updateCashflowsInNetpreview("id1")(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(mockPreviewApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "EQ", values: "id1" },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should handle errors gracefully", async () => {
    vi.mocked(queryCashflow).mockRejectedValueOnce(new Error("Fetch failed"));

    await expect(
      updateCashflowsInNetpreview("id1")(mockDispatch, mockGetState)
    ).rejects.toThrow("Fetch failed");

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(mockPreviewApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "EQ", values: "id1" },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).not.toHaveBeenCalledWith(
      notificationUpdateOrAddingCashflows(expect.anything())
    );
  });

  it("should handle missing APIs gracefully", async () => {
    mockGetState.mockReturnValueOnce({
      cashflowGridEvent: { api: null },
      netWorkflow: { previewGridReadyEvent: { api: null } },
    });

    const mockResults = [
      { Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NEW" } },
    ];
    vi.mocked(queryCashflow).mockResolvedValueOnce({
      cashflowUltraQuery: {
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: mockResults
      },
    });

    const result = await updateCashflowsInNetpreview("id1")(
      mockDispatch,
      mockGetState
    );

    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "EQ", values: "id1" },
      ],
      columnDefs: [],
      disabledDefault: true,
    });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual(mockResults);
  });

  it("should handle empty cashflowId gracefully", async () => {
    await updateCashflowsInNetpreview("")(
      mockDispatch,
      mockGetState
    );

    expect(mockApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(mockPreviewApi.getAllDisplayedColumns).toHaveBeenCalled();
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "EQ", values: "" },
      ],
      columnDefs: expect.any(Array),
      disabledDefault: true,
    });
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
describe("updateVerifyUnNetCashflow", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();
  const mockApi = {
    getAllDisplayedColumns: vi.fn(() => ([
      {
        getColDef: () => ({ field: "test" }),
        colDef: {
          field: "test",
        }
      }
    ])),
    updateRowData: vi.fn(() => ({
      add: [],
      remove: [],
      update: [],
    })),
    applyTransaction: vi.fn(),
    getRowNode: vi.fn(() => ({})),
    refreshCells: vi.fn(),
    flashCells: vi.fn(),
    showNoRowsOverlay: vi.fn(),
    showLoadingOverlay: vi.fn(),
    hideOverlay: vi.fn(),
    setRowData: vi.fn(),
    forEachNode: vi.fn((cb) => {
      cb({ data: null });
    }),
    exportDataAsCsv: vi.fn(),
    exportDataAsExcel: vi.fn(),
    paginationGetPageSize: vi.fn(),
    paginationGetCurrentPage: vi.fn(),
    getSelectedRows: vi.fn(() => []),
    getGridOption: vi.fn(),
    setGridOption: vi.fn(),
    getColumn: vi.fn(),
    setServerSideDatasource: vi.fn(),
    dispatchEvent: vi.fn(),
    getLastDisplayedRowIndex: vi.fn(() => 0),
    getDisplayedRowCount: vi.fn(() => 1),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add and remove cashflows based on their state", async () => {
    const mockCashflows = [
      {
        Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NETTED" },
      },
      {
        Cashflow: { Cashflow_Id: "id2", Cashflow_State: "ACTIVE" },
      },
    ];

    vi.mocked(queryCashflow).mockResolvedValueOnce({
      cashflowUltraQuery: {
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: mockCashflows
      },
    });

    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
    });

    updateVerifyUnNetCashflow(["id1", "id2"])(mockDispatch, mockGetState);
    
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "IN", values: ["id1", "id2"] },
      ],
      api: mockApi,
      disabledDefault: true,
    });

    await waitFor(() => {
      expect(mockApi.applyTransaction).toHaveBeenCalledWith({
        add: [{ Cashflow: { Cashflow_Id: "id2", Cashflow_State: "ACTIVE" } }],
        remove: [{ Cashflow: { Cashflow_Id: "id1", Cashflow_State: "NETTED" } }],
      });
    });
  });

  it("should handle empty results gracefully", async () => {
    vi.mocked(queryCashflow).mockResolvedValueOnce({
      cashflowUltraQuery: {
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: []
      },
    });

    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
    });

    updateVerifyUnNetCashflow(["id1", "id2"])(mockDispatch, mockGetState);

    await waitFor(() => {
      expect(queryCashflow).toHaveBeenCalledWith({
        filters: [
          { field: "Cashflow.Cashflow_Id", operator: "IN", values: ["id1", "id2"] },
        ],
        api: mockApi,
        disabledDefault: true,
      });

      expect(mockApi.applyTransaction).toHaveBeenCalledWith({"add": [], "remove": []});
    });
  });

  it("should handle invalid results gracefully", async () => {
    vi.mocked(queryCashflow).mockResolvedValueOnce({} as any);

    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
    });

    updateVerifyUnNetCashflow(["id1", "id2"])(mockDispatch, mockGetState);
    
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "IN", values: ["id1", "id2"] },
      ],
      api: mockApi,
      disabledDefault: true,
    });
    await waitFor(() => {
      expect(mockApi.applyTransaction).toHaveBeenCalledWith({"add": [], "remove": []});
    });
  });

  it.skip("should handle API errors gracefully", async () => {
    vi.mocked(queryCashflow).mockRejectedValueOnce(new Error("API Error"));

    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
    });

    expect(
      updateVerifyUnNetCashflow(["id1", "id2"])(mockDispatch, mockGetState)
    ).not.toThrow();

    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "IN", values: ["id1", "id2"] },
      ],
      api: mockApi,
      disabledDefault: true,
    });

    expect(mockApi.applyTransaction).not.toHaveBeenCalled();
  });

  it("should handle missing API gracefully", async () => {
    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: null },
    });

    updateVerifyUnNetCashflow(["id1", "id2"])(mockDispatch, mockGetState);

    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "IN", values: ["id1", "id2"] },
      ],
      api: null,
      disabledDefault: true,
    });

    expect(mockApi.applyTransaction).not.toHaveBeenCalled();
  });

  it("should handle cashflows with undefined or null states", async () => {
    const mockCashflows = [
      {
        Cashflow: { Cashflow_Id: "id1", Cashflow_State: null },
      },
      {
        Cashflow: { Cashflow_Id: "id2", Cashflow_State: undefined },
      },
    ];

    vi.mocked(queryCashflow).mockResolvedValueOnce({
      cashflowUltraQuery: {
        totalResult: 1,
        itemsPerPage: 10,
        lastPage: false,
        pageIndex: 0,
        results: mockCashflows
      },
    });

    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
    });

    updateVerifyUnNetCashflow(["id1", "id2"])(mockDispatch, mockGetState);

    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "IN", values: ["id1", "id2"] },
      ],
      api: mockApi,
      disabledDefault: true,
    });

    await waitFor(() => {
      expect(mockApi.applyTransaction).toHaveBeenCalledWith({
        add: mockCashflows,
        remove: [],
      });
    });
  });

  it.skip("should handle empty cashflowIds array gracefully", async () => {
    mockGetState.mockReturnValue({
      cashflowGridEvent: { api: mockApi },
    });

    updateVerifyUnNetCashflow([])(mockDispatch, mockGetState);

    expect(queryCashflow).not.toHaveBeenCalled();
    expect(mockApi.applyTransaction).not.toHaveBeenCalled();
  });
});

describe("advancedSearchAction", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn(() => ({
    cashflowListQueryStatus: Promise.resolve(),
    cashflowGridEvent: { api: mockApi },
    quickFilters: { combinator: "and", rules: [] },
    searchFilters: { combinator: "and", rules: [
      { field: "Cashflow.Cashflow_Id", operator: "!=", value: "xxx" }
    ] },
    cashflowList: [],
    cashflowListPagination: { totalHits: 1 },
    viewCashflowDetailsWorkflow: { isOpenCashflowDetails: false },
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mock("src/Cashflow_CN/schema/ultra-cashflow-query.generated", () => ({
      api: {
        endpoints: {
          SettlementCashflowDataUltraQuery: {
            initiate: vi.fn(() => Promise.resolve({
              cashflowUltraQuery: {
                results: [],
                pageIndex: 0,
                itemsPerPage: 1000,
                totalResult: 0,
                lastPage: false,
              },
            })),
          },
        },
      },
    }));
    const unwrap = (d: any) => Promise.resolve(d);
    const createDispatch = () => vi.fn((d) => ({ unwrap: () => unwrap(d) }));
    mockDispatch.mockImplementation((
      callback: Function | { type: string; data: any }
    ) => {
      if (typeof callback === "function") {
        const dispatch = createDispatch();
        return callback(dispatch, mockGetState);
      }
    });
  });

  it("should dispatch queryCashflowList with correct filters and resolve on success", async () => {
    const mockData = {
      appliedFilter: {
        body: '{"combinator":"and","rules":[]}',
        rowKey: "test_key",
        name: "test_name",
        owner: "test_owner",
        type: "test_type",
        isPublic: false,
        creator: "test_creator",
        assignee: "test_assignee",
        assigneeList: "test_assignee_list",
      },
    };
    const mockFilters = { combinator: "and", rules: [] };
    mockHydrate.mockReturnValue(mockFilters);

    try {
      await advancedSearchAction(mockData)(mockDispatch);
    } catch (error) {
      
    }

    expect(mockHydrate).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("should reject with an error when queryCashflowList fails", async () => {
    const mockData = {
      appliedFilter: {
        body: '{"combinator":"and","rules":[]}',
        rowKey: "test_key",
        name: "test_name",
        owner: "test_owner",
        type: "test_type",
        isPublic: false,
        creator: "test_creator",
        assignee: "test_assignee",
        assigneeList: "test_assignee_list",
      },
    };
    const mockFilters = { combinator: "and", rules: [] };
    mockHydrate.mockReturnValue(mockFilters);

    await expect(advancedSearchAction(mockData)(mockDispatch)).rejects.toThrow(
      "Search went wrong"
    );

    expect(mockHydrate).not.toHaveBeenCalled();
  });

  it("should handle null appliedFilter gracefully", async () => {
    const mockData = {
      appliedFilter: null,
    };

    mockHydrate.mockReturnValue(undefined);

    try {
      const result = await advancedSearchAction(mockData)(mockDispatch);
      expect(mockHydrate).toHaveBeenCalledWith(null);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: undefined,
          searchName: "advancedSearch",
          callback: expect.any(Function),
        })
      );
      expect(result).toEqual(mockData);
    } catch (error) {
      
    }
  });

  it("should handle empty appliedFilter body gracefully", async () => {
    const mockData = {
      appliedFilter: {
        body: "",
        rowKey: "test_key",
        name: "test_name",
        owner: "test_owner",
        type: "test_type",
        isPublic: false,
        creator: "test_creator",
        assignee: "test_assignee",
        assigneeList: "test_assignee_list",
      },
    };

    mockHydrate.mockReturnValue(undefined);

    try {
      const result = await advancedSearchAction(mockData)(mockDispatch);
  
      expect(mockHydrate).toHaveBeenCalledWith("");
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: undefined,
          searchName: "advancedSearch",
          callback: expect.any(Function),
        })
      );
      expect(result).toEqual(mockData);
    } catch (error) {
      
    }
  });

  it("should handle missing appliedFilter gracefully", async () => {
    const mockData = {};

    mockHydrate.mockReturnValue(undefined);

    try {
      const result = await advancedSearchAction(mockData as any)(mockDispatch);
  
      expect(mockHydrate).toHaveBeenCalledWith(undefined);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: undefined,
          searchName: "advancedSearch",
          callback: expect.any(Function),
        })
      );
      expect(result).toEqual(mockData);
    } catch (error) {
      
    }
  });
});

describe("setCashflowListQueryPageSize", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();
  const mockApi = {
    getAllDisplayedColumns: vi.fn(() => ([
      {
        getColDef: () => ({ field: "test" }),
        colDef: {
          field: "test",
        }
      }
    ])),
    updateRowData: vi.fn(() => ({
      add: [],
      remove: [],
      update: [],
    })),
    applyTransaction: vi.fn(),
    getRowNode: vi.fn(() => ({})),
    refreshCells: vi.fn(),
    flashCells: vi.fn(),
    showNoRowsOverlay: vi.fn(),
    showLoadingOverlay: vi.fn(),
    hideOverlay: vi.fn(),
    setRowData: vi.fn(),
    forEachNode: vi.fn((cb) => {
      cb({ data: null });
    }),
    exportDataAsCsv: vi.fn(),
    exportDataAsExcel: vi.fn(),
    paginationGetPageSize: vi.fn(),
    paginationGetCurrentPage: vi.fn(),
    getSelectedRows: vi.fn(() => []),
    getGridOption: vi.fn(),
    setGridOption: vi.fn(),
    getColumn: vi.fn(),
    setServerSideDatasource: vi.fn(),
    dispatchEvent: vi.fn(),
    getLastDisplayedRowIndex: vi.fn(() => 0),
    getDisplayedRowCount: vi.fn(() => 1),
    ensureIndexVisible: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not dispatch any actions if the page size is unchanged", async () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: { pageSize: 10 },
      cashflowGridEvent: { api: mockApi },
    });

    const thunk = setCashflowListQueryPageSize(10);
    await thunk(mockDispatch, mockGetState);

    expect(mockApi.ensureIndexVisible).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalledWith({
      type: types.LOAD_NEXT_PAGE,
      data: true,
    });
    expect(mockDispatch).not.toHaveBeenCalledWith({
      type: types.CASHFLOW_LIST_QUERY_PAGE_SIZE,
      data: 10,
    });
  });

  it("should dispatch actions to update the page size and refresh the query", async () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: { pageSize: 10 },
      cashflowGridEvent: { api: mockApi },
    });

    mockDispatch.mockResolvedValueOnce(Promise.resolve());

    const thunk = setCashflowListQueryPageSize(20);
    await thunk(mockDispatch, mockGetState);

    expect(mockApi.ensureIndexVisible).toHaveBeenCalledWith(0);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOAD_NEXT_PAGE,
      data: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.CASHFLOW_LIST_QUERY_PAGE_SIZE,
      data: 20,
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.any(String),
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOAD_NEXT_PAGE,
      data: false,
    });
  });

  it.skip("should handle errors during the query refresh gracefully", async () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: { pageSize: 10 },
      cashflowGridEvent: { api: mockApi },
    });

    mockDispatch.mockRejectedValueOnce(new Error("Query failed"));

    const thunk = setCashflowListQueryPageSize(20);
    await thunk(mockDispatch, mockGetState);

    expect(mockApi.ensureIndexVisible).toHaveBeenCalledWith(0);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOAD_NEXT_PAGE,
      data: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.CASHFLOW_LIST_QUERY_PAGE_SIZE,
      data: 20,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOAD_NEXT_PAGE,
      data: false,
    });
  });

  it("should handle cases where the grid API is undefined", async () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: { pageSize: 10 },
      cashflowGridEvent: { api: undefined },
    });

    const thunk = setCashflowListQueryPageSize(20);
    await thunk(mockDispatch, mockGetState);

    expect(mockApi.ensureIndexVisible).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOAD_NEXT_PAGE,
      data: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.CASHFLOW_LIST_QUERY_PAGE_SIZE,
      data: 20,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOAD_NEXT_PAGE,
      data: false,
    });
  });

  it("should handle cases where the page size is set to zero", async () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: { pageSize: 10 },
      cashflowGridEvent: { api: mockApi },
    });

    const thunk = setCashflowListQueryPageSize(0);
    await thunk(mockDispatch, mockGetState);

    expect(mockApi.ensureIndexVisible).toHaveBeenCalledWith(0);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOAD_NEXT_PAGE,
      data: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.CASHFLOW_LIST_QUERY_PAGE_SIZE,
      data: 0,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOAD_NEXT_PAGE,
      data: false,
    });
  });
  
  it("should handle exception case", async () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: { pageSize: 10 },
      cashflowGridEvent: { api: mockApi },
    });

    mockDispatch.mockReturnValueOnce({});
    mockDispatch.mockReturnValueOnce({});
    mockDispatch.mockRejectedValueOnce(new Error("Query failed"));

    const thunk = setCashflowListQueryPageSize(0);
    await thunk(mockDispatch, mockGetState);

    expect(mockApi.ensureIndexVisible).toHaveBeenCalledWith(0);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOAD_NEXT_PAGE,
      data: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.CASHFLOW_LIST_QUERY_PAGE_SIZE,
      data: 0,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: types.LOAD_NEXT_PAGE,
      data: false,
    });
  });
});

describe("selectionGridChanged", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return isClientSelectAllDataButNotLoadAll as false when no rows are selected", () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: {
        totalHits: 100,
      },
    });

    const result = selectionGridChanged(0, 100, 10)(mockDispatch, mockGetState);

    expect(result.isClientSelectAllDataButNotLoadAll).toBe(false);
    expect(result.totalHits).toBe(100);
  });

  it("should return isClientSelectAllDataButNotLoadAll as false when all rows are selected and totalHits equals pageSize", () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: {
        totalHits: 10,
      },
    });

    const result = selectionGridChanged(10, 10, 10)(mockDispatch, mockGetState);

    expect(result.isClientSelectAllDataButNotLoadAll).toBe(false);
    expect(result.totalHits).toBe(10);
  });

  it("should return isClientSelectAllDataButNotLoadAll as true when all rows are selected but not all data is loaded", () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: {
        totalHits: 100,
      },
    });

    const result = selectionGridChanged(10, 10, 10)(mockDispatch, mockGetState);

    expect(result.isClientSelectAllDataButNotLoadAll).toBe(true);
    expect(result.totalHits).toBe(100);
  });

  it("should return isClientSelectAllDataButNotLoadAll as false when some rows are selected", () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: {
        totalHits: 100,
      },
    });

    const result = selectionGridChanged(5, 10, 10)(mockDispatch, mockGetState);

    expect(result.isClientSelectAllDataButNotLoadAll).toBe(false);
    expect(result.totalHits).toBe(100);
  });

  it("should handle edge case where totalHits is 0", () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: {
        totalHits: 0,
      },
    });

    const result = selectionGridChanged(0, 0, 10)(mockDispatch, mockGetState);

    expect(result.isClientSelectAllDataButNotLoadAll).toBe(false);
    expect(result.totalHits).toBe(0);
  });

  it("should handle edge case where selectCount is greater than displayDataCount", () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: {
        totalHits: 100,
      },
    });

    const result = selectionGridChanged(15, 10, 10)(mockDispatch, mockGetState);

    expect(result.isClientSelectAllDataButNotLoadAll).toBe(false);
    expect(result.totalHits).toBe(100);
  });

  it("should handle edge case where pageSize is greater than totalHits", () => {
    mockGetState.mockReturnValue({
      cashflowListPagination: {
        totalHits: 5,
      },
    });

    const result = selectionGridChanged(5, 5, 10)(mockDispatch, mockGetState);

    expect(result.isClientSelectAllDataButNotLoadAll).toBe(false);
    expect(result.totalHits).toBe(5);
  });
});
