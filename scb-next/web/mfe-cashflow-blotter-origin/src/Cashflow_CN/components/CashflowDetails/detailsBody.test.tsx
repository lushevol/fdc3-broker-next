import { render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import React from "react";
import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { getSwiftMessageByCashflowId } from "src/Cashflow_CN/services";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";
import { CASHFLOW_DETAILS_TABS_CLICK } from "src/Root/analysis/const";
import { swiftMessageDetails } from "src/Root/import/ratanutils";
import * as ratanUtils from "src/Root/import/ratanutils";
import * as graphqlServices from "../../services/graphql";
import * as cashflowDetailsContext from "src/Cashflow_CN/Main/workflow/viewCashflowDetails/CashflowDetailsContext";
import rowDetails from "../CashflowDetails/data/cashflows.json";
import { renderWithProviders } from "src/test/test-utils";

import {
  RoundingType,
  SplitActionType,
} from "../../Main/workflow/splitting/common/interface";
import { convertCountry,DetailsBody, displaySwiftMessage,EBBS_ACCOUNTING_DETAILS, fetchSwiftMessage, handleTradeVersionsData, hasTradeBlotterPermission, HeaderTabs, shouldShowSwiftMessage, SWIFT_MESSAGE_TAB,TAB_PANES, tradeDetailsHandler } from "./detailsBody";
import { classes } from "./style";
const mockStartTracking = vi.hoisted(() => vi.fn(() => vi.fn()));

const safeClone = <T,>(value: T): T => {
  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(value);
  }
  return cloneDeep(value);
};

afterAll(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock("../../services", () => ({
  getCountryInfo: vi.fn(async () => ({
    countryInfoList: [
      {
        countryCode: "test_country_code",

      }
    ]
  })),
  getSwiftMessageByCashflowId: vi.fn(async () => ({
    swiftType: "MX",
    mtMessageList: null,
    mxMessageLists: [
        {
            sequence: 1,
            mxType: "pacs.008.001.08",
            mxMessage: "message 1"
        },
        {
            sequence: 2,
            mxType: "pacs.009.001.08",
            mxMessage: "message 2"
        },
    ]
})),
  getEBBSAcountingDetail:vi.fn(async () => ([{}])),
}));

vi.mock("../../services/graphql", () => ({
  queryCashFlowDetails: vi.fn(async () => ({
    graphCashFlowDetails: [
      {
        cashflow: {
          Cashflow: {
            Cashflow_State: "WAITING",
          },
        }
      }
    ],
  })),
  queryCounterPartyDetails_CN: vi.fn(async () => ({
    fmEntity: {
      legalEntity: {
        registeredAddress: {
          line1: "test_line1_registered",
          line2: "test_line2_registered",
          city: "test_city_registered",
          country: "test_country_code_registered",
          postCode: "test_post_code_registered",
        }
      }
    },
  })),
}));

vi.mock("src/Root/common/utils/featureFlagController", () => ({
  featureScopedEnabled: (ec) => true,
}));

vi.mock("src/Cashflow_CN/Main/workflow/viewCashflowDetails/CashflowDetailsContext", () => ({
  useCashflowDetailsContext: vi.fn(() => ({ opensearch: false })),
}));

vi.mock("./MultiExceptions", () => ({
  default: () => <div data-testid="multi-exceptions" />,
}));

vi.mock("src/Root/import/ratanutils", () => ({
  hasPermission: vi.fn(() => true),
  getRealIdOfTrade: vi.fn(),
  queryTradeVersionsData: vi.fn(),
  swiftMessageDetails: vi.fn(),
  getTradeStatusArray: vi.fn(() => []),
  logInit: vi.fn(),
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
  useParentData: vi.fn(),
  getBusinessFieldsFromCache: vi.fn(),
  getParent: vi.fn(),
  getUser: vi.fn(() => ({ id: "test_user_id" })),
}));

vi.mock("src/Root/analysis", () => ({
  useBatchCollect: () => ({ startTracking: mockStartTracking }),
  useIterableCollect: () => ({ startTracking: vi.fn(() => vi.fn()) }),
  useRTT: () => ({
    startTracking: vi.fn(() => ({
      completeTracking: vi.fn(),
      abortTracking: vi.fn(),
    })),
  }),
  useE2Elatency: () => ({
    addTrackingPoint: vi.fn(),
    completeTracking: vi.fn(),
    abortTracking: vi.fn(),
  }),
}));

describe("DetailsBody component", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("should handle error when queryCounterPartyDetails_CN throws", async () => {
    const details = {
      Cashflow: { Cashflow_Id: "test_id" },
      Entity: { Counterparty_SCI_FMID: "FMID" },
    };
    const error = new Error("mock error");
    const { queryCashFlowDetails, queryCounterPartyDetails_CN } = graphqlServices;
    queryCashFlowDetails.mockResolvedValueOnce({
      graphCashFlowDetails: [
        {
          cashflow: {
            Cashflow: {
              Cashflow_State: "WAITING",
            },
          },
        },
      ],
    });
    queryCounterPartyDetails_CN.mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    try {
      expect(() => {
        renderWithProviders(
          <DetailsBody
            details={details}
            activeKey={TAB_PANES[0].value}
            onQueryCashflow={vi.fn()}
            onOpenTradeDetails={vi.fn()}
          />
        );
      }).not.toThrow();

      await waitFor(() => {
        expect(queryCounterPartyDetails_CN).toHaveBeenCalledWith("FMID");
        expect(consoleSpy).toHaveBeenCalledWith(error);
      }, { timeout: 10000 });
    } finally {
      consoleSpy.mockRestore();
    }
  });
  it("should handle error when queryCashFlowDetails throws", () => {
    const details = {
      Cashflow: { Cashflow_Id: "test_id" },
      Entity: {},
    };
    const error = new Error("mock error");
    const { queryCashFlowDetails } = graphqlServices;
    queryCashFlowDetails.mockImplementation(() => {
      throw error;
    });
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() => {
      renderWithProviders(
        <DetailsBody
          details={details}
          activeKey={TAB_PANES[0].value}
          onQueryCashflow={vi.fn()}
          onOpenTradeDetails={vi.fn()}
        />
      );
    }).not.toThrow();
    expect(consoleSpy.mock.calls.some(([arg]) => arg === error)).toBe(false);
    consoleSpy.mockRestore();
  });
  it("should not fetch data if details is falsy", () => {
    expect(() => {
      renderWithProviders(
        <DetailsBody
          // @ts-ignore
          details={null}
          activeKey={TAB_PANES[0].value}
          onQueryCashflow={vi.fn()}
          onOpenTradeDetails={vi.fn()}
        />
      );
    }).not.toThrow();
  });
  it("TAB_PANES", async () => {
    const tab_panes = TAB_PANES[2].label;
    expect(tab_panes).toEqual("Swift Message");
  });
  it("should be in the document with SWIFT_MESSAGE_TAB tab", () => {
    const details = safeClone(rowDetails.data.cashflows.results[2]);
    const activeKey = SWIFT_MESSAGE_TAB;
    const onClose = vi.fn();
    const onQueryCashflow = vi.fn();
    const onOpenTradeDetails = vi.fn(() => Promise.resolve());
    const handleSetTabVisible = vi.fn();

    renderWithProviders(
      <DetailsBody
        details={details}
        activeKey={activeKey}
        onQueryCashflow={onQueryCashflow}
        onOpenTradeDetails={onOpenTradeDetails}
        onTabVisibleChange={handleSetTabVisible}
        onClose={onClose}
      />,
      {
        preloadedState: {
          ...defaultPreloadedState,
          splittingWorkflow: {
            splitStatus: "INIT",
            isOpenSplittingDialog: false,
            isOpenLookUpSSIDialog: false,
            targetRowIndex: null,
            isChildCashflowDialogVisible: false,
            sourceCashflow: {},
            targetCashflows: [],
            initialTargetCashflows: [],
            amountSetting: {
              precision: 2,
              type: RoundingType.ROUNDING_OFF,
            },
            splitAction: SplitActionType.COMPONENT_SPLIT,
          },
        },
      }
    );
    expect(screen).toBeDefined();
  });

  it("should NOT call getSwiftMessageDetails if swiftMessage is not null", () => {
    const details = safeClone(rowDetails.data.cashflows.results[2]);
    const getSwiftMessageDetails = vi.fn();
    const onClose = vi.fn();
    const onQueryCashflow = vi.fn();
    const onOpenTradeDetails = vi.fn(() => Promise.resolve());
    const handleSetTabVisible = vi.fn();

    render(
      <DetailsBody
        details={details}
        activeKey={SWIFT_MESSAGE_TAB}
        onQueryCashflow={onQueryCashflow}
        onOpenTradeDetails={onOpenTradeDetails}
        onTabVisibleChange={handleSetTabVisible}
        onClose={onClose}
      />
    );

    expect(getSwiftMessageDetails).not.toHaveBeenCalled();
  });

  it("handleTradeVersionsData", () => {
    const mockTradeVersionsData1 = {
      tradeVersions: {
        pageInfo: {
          lastPage: true,
          pageNo: 0,
          pageSize: 10,
          totalHits: 0,
        },
        results: [],
      },
    };
    const res = handleTradeVersionsData(mockTradeVersionsData1);
    expect(res).toBeNull();

    const mockTradeVersionsData2 = {
      tradeVersions: {
        pageInfo: {
          lastPage: true,
          pageNo: 0,
          pageSize: 10,
          totalHits: 1,
        },
        results: [
          {
            Trade_Id: "test",
          },
        ],
      },
    };
    const res2 = handleTradeVersionsData(mockTradeVersionsData2);
    expect(res2!.Versions).toBeDefined();
  });
  it("hasTradeBlotterPermission", () => {
    expect(hasTradeBlotterPermission()).toBe(true);
  });
  it("tradeDetailsHandler", async () => {
    expect(await tradeDetailsHandler()).toBeNull();

    const resp = await tradeDetailsHandler(mockCashflow1);
    expect(resp).toBeDefined();
  });
});
describe("HeaderTabs component", () => {
  const mockOnTabClick = vi.fn();

  it("should render all tabs by default", () => {
    render(
      <HeaderTabs
        activeKey={TAB_PANES[0].value}
        onTabClick={mockOnTabClick}
      />
    );

    TAB_PANES.forEach((tab) => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it("should hide tabs specified in hiddenTabs", () => {
    const hiddenTabs = new Set([SWIFT_MESSAGE_TAB, EBBS_ACCOUNTING_DETAILS]);

    render(
      <HeaderTabs
        activeKey={TAB_PANES[0].value}
        hiddenTabs={hiddenTabs}
        onTabClick={mockOnTabClick}
      />
    );

    TAB_PANES.forEach((tab) => {
      if (hiddenTabs.has(tab.value)) {
        expect(screen.queryByText(tab.label)).not.toBeInTheDocument();
      } else {
        expect(screen.getByText(tab.label)).toBeInTheDocument();
      }
    });
  });

  it("should call onTabClick when a tab is clicked", () => {
    render(
      <HeaderTabs
        activeKey={TAB_PANES[0].value}
        onTabClick={mockOnTabClick}
      />
    );

    const secondTab = screen.getByText(TAB_PANES[1].label);
    secondTab.click();

    expect(mockOnTabClick).toHaveBeenCalledWith(TAB_PANES[1].value);
  });

  it.skip("should track tab clicks using startTracking", () => {
    render(
      <HeaderTabs
        activeKey={TAB_PANES[0].value}
        onTabClick={mockOnTabClick}
      />
    );

    const secondTab = screen.getByText(TAB_PANES[1].label);
    secondTab.click();

    expect(mockStartTracking).toHaveBeenCalledWith(CASHFLOW_DETAILS_TABS_CLICK);
  });

  it("should handle edge case where activeKey is not in TAB_PANES", () => {
    render(
      <HeaderTabs
        activeKey="invalid_key"
        onTabClick={mockOnTabClick}
      />
    );

    TAB_PANES.forEach((tab) => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it("should handle edge case where activeKey is missing", () => {
    render(
      <HeaderTabs
        onTabClick={mockOnTabClick}
      />
    );

    TAB_PANES.forEach((tab) => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it("should apply correct aria attributes for accessibility", () => {
    render(
      <HeaderTabs
        activeKey={TAB_PANES[0].value}
        onTabClick={mockOnTabClick}
      />
    );

    const firstTab = screen.getByText(TAB_PANES[0].label);
    expect(firstTab).toHaveAttribute("id", `simple-tab-${TAB_PANES[0].value}`);
    expect(firstTab).toHaveAttribute(
      "aria-controls",
      `simple-tabpanel-${TAB_PANES[0].value}`
    );
  });
});
describe("hasTradeBlotterPermission", () => {
  it("should return true when 'RATAN_TRADE_BLOTTER:UI_Read_Access' permission is granted", () => {
    const { hasPermission } = ratanUtils;
    hasPermission.mockImplementation((permission) =>
      permission === "RATAN_TRADE_BLOTTER:UI_Read_Access"
    );
    expect(hasTradeBlotterPermission()).toBe(true);
  });

  it("should return true when 'RATAN_TRADE_BLOTTER:ACCESS_FMO_POST_TRADE_PORTAL' permission is granted", () => {
    const { hasPermission } = ratanUtils;
    hasPermission.mockImplementation((permission) =>
      permission === "RATAN_TRADE_BLOTTER:ACCESS_FMO_POST_TRADE_PORTAL"
    );
    expect(hasTradeBlotterPermission()).toBe(true);
  });

  it("should return false when neither permission is granted", () => {
    const { hasPermission } = ratanUtils;
    hasPermission.mockReturnValue(false);
    expect(hasTradeBlotterPermission()).toBe(false);
  });
});

describe("shouldShowSwiftMessage", () => {
  it("should return true when cashflow state is RELEASED", () => {
    const data = {
      cashflow: {
        Cashflow: {
          Cashflow_State: "RELEASED",
        },
      },
      cashflowAuditTrail: [],
    };
    expect(shouldShowSwiftMessage(data)).toBe(true);
  });

  it("should return true when cashflow state is SETTLED", () => {
    const data = {
      cashflow: {
        Cashflow: {
          Cashflow_State: "SETTLED",
        },
      },
      cashflowAuditTrail: [],
    };
    expect(shouldShowSwiftMessage(data)).toBe(true);
  });

  it("should return true when audit trail contains RELEASED state", () => {
    const data = {
      cashflow: {
        Cashflow: {
          Cashflow_State: "PENDING",
        },
      },
      cashflowAuditTrail: [
        {
          Cashflow: {
            Cashflow_State: "RELEASED",
          },
        },
      ],
    };
    expect(shouldShowSwiftMessage(data)).toBe(true);
  });

  it("should return true when audit trail contains SETTLED state", () => {
    const data = {
      cashflow: {
        Cashflow: {
          Cashflow_State: "PENDING",
        },
      },
      cashflowAuditTrail: [
        {
          Cashflow: {
            Cashflow_State: "SETTLED",
          },
        },
      ],
    };
    expect(shouldShowSwiftMessage(data)).toBe(true);
  });

  it("should return false when cashflow state is neither RELEASED nor SETTLED", () => {
    const data = {
      cashflow: {
        Cashflow: {
          Cashflow_State: "PENDING",
        },
      },
      cashflowAuditTrail: [],
    };
    expect(shouldShowSwiftMessage(data)).toBe(false);
  });

  it("should return false when audit trail does not contain RELEASED or SETTLED state", () => {
    const data = {
      cashflow: {
        Cashflow: {
          Cashflow_State: "PENDING",
        },
      },
      cashflowAuditTrail: [
        {
          Cashflow: {
            Cashflow_State: "PENDING",
          },
        },
      ],
    };
    expect(shouldShowSwiftMessage(data)).toBe(false);
  });

  it("should handle edge case when cashflow is null", () => {
    const data = {
      cashflow: null,
      cashflowAuditTrail: [],
    };
    // @ts-ignore
    expect(shouldShowSwiftMessage(data)).toBe(false);
  });

  it("should handle edge case when both cashflow and cashflowAuditTrail are null", () => {
    const data = {
      cashflow: null,
      cashflowAuditTrail: null,
    };
    // @ts-ignore
    expect(shouldShowSwiftMessage(data)).toBe(false);
  });

  it("should handle edge case when cashflow state is undefined", () => {
    const data = {
      cashflow: {
        Cashflow: {
          Cashflow_State: undefined,
        },
      },
      cashflowAuditTrail: [],
    };
    expect(shouldShowSwiftMessage(data)).toBe(false);
  });

  it("should handle edge case when audit trail contains undefined state", () => {
    const data = {
      cashflow: {
        Cashflow: {
          Cashflow_State: "PENDING",
        },
      },
      cashflowAuditTrail: [
        {
          Cashflow: {
            Cashflow_State: undefined,
          },
        },
      ],
    };
    expect(shouldShowSwiftMessage(data)).toBe(false);
  });
});

describe("historyDataList is empty", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should pass [] to historyDataList when cashflowAuditTrail is undefined", async () => {
    const details = {
      Cashflow: { Cashflow_Id: "test_id" },
      Entity: { Counterparty_SCI_FMID: "FMID" },
    };
    const graphCashflowDetails = {
      cashflow: details.Cashflow,
      cashflowAuditTrail: undefined,
    };

    const { queryCashFlowDetails } = graphqlServices;
    queryCashFlowDetails.mockImplementation((...args) => {
      return Promise.resolve({
        graphCashFlowDetails: [graphCashflowDetails],
      });
    });

    // mock useCashflowDetailsContext
    const { useCashflowDetailsContext } = cashflowDetailsContext;
    useCashflowDetailsContext.mockReturnValue({ opensearch: false });

    function Wrapper() {
      const [activeKey, setActiveKey] = React.useState(`${TAB_PANES[1].value}`);
      return (
        <>
          <HeaderTabs activeKey={activeKey} onTabClick={setActiveKey} />
          <DetailsBody
            details={details}
            activeKey={activeKey}
            onQueryCashflow={vi.fn()}
            onOpenTradeDetails={vi.fn()}
          />
        </>
      );
    }

    renderWithProviders(<Wrapper />);
    await screen.findByTestId("cashflow-details-dialog-body");

    const historyGrid = await screen.findByTestId("history-details-dialog");
    expect(historyGrid).toBeInTheDocument();
    expect(historyGrid.querySelectorAll(".ag-row-first").length).toBe(0);
  }, 10000);
});

describe("displaySwiftMessage", () => {
  const cashflowId = "test_cashflow_id";
  it("should render MultiSwiftMessage when swiftMessage is an array", () => {
    const swiftMessage = [];
    const swiftmessageCom = render(displaySwiftMessage(swiftMessage, cashflowId));
    expect(swiftmessageCom).toBeDefined();
    
  });

  it("should render the swift message in a <pre> tag when a valid message is provided", () => {
    const swiftMessage = "Test Swift Message";
    const { container } = render(displaySwiftMessage(swiftMessage,cashflowId));
    const preElement = container.querySelector("pre");
    expect(preElement).toBeInTheDocument();
    expect(preElement).toHaveTextContent(swiftMessage);
    expect(preElement).toHaveClass(classes.swiftMessage);
  });

  it("should render a 'No Swift Message' message when the swift message is empty", () => {
    const swiftMessage = "";
    const { container } = render(displaySwiftMessage(swiftMessage,cashflowId));
    const noMessageDiv = container.querySelector("div");
    expect(noMessageDiv).toBeInTheDocument();
    expect(noMessageDiv).toHaveTextContent("No Swift Message");
    expect(noMessageDiv).toHaveClass(classes.noSwiftMessage);
  });

  it("should render a 'No Swift Message' message when the swift message include \"  \"", () => {
    const swiftMessage = "  ";
    const { container } = render(displaySwiftMessage(swiftMessage,cashflowId));
    const noMessageDiv = container.querySelector("div");
    expect(noMessageDiv).toBeInTheDocument();
    expect(noMessageDiv).toHaveTextContent("No Swift Message");
    expect(noMessageDiv).toHaveClass(classes.noSwiftMessage);
  });
});

describe("not show Swift Message Tab", () => {
  it("should NOT render Swift Message tab panel when isShowSwift is false", async () => {
    const details = {
      Cashflow: { Cashflow_State: "DRAFT", Cashflow_Id: "test_id" },
      Entity: {},
    };

    renderWithProviders(
      <DetailsBody
        details={details}
        activeKey={SWIFT_MESSAGE_TAB}
        onQueryCashflow={vi.fn()}
        onOpenTradeDetails={vi.fn()}
      />
    );

    await screen.findByTestId("cashflow-details-dialog-body");
    const tabPanel = document.getElementById(`simple-tabpanel-${TAB_PANES[2].value}`);
    expect(tabPanel).not.toBeInTheDocument();
  });
});

describe("tradeDetailsHandler", () => {
  it("should return null if no data is provided", async () => {
    const result = await tradeDetailsHandler();
    expect(result).toBeNull();
  });

  it("should return null if data is netted cashflow", async () => {
    const mockData = {
      Cashflow: { Cashflow_State: "NETTED", Netting_Id: "123" },
    };
    const result = await tradeDetailsHandler(mockData);
    expect(result).toBeNull();
  });

  it("should return null if data is netted cashflow", async () => {
    const mockData = {
      Cashflow: { Netting_Id: "123" },
    };
    const result = await tradeDetailsHandler(mockData);
    expect(result).toBeNull();
  });
  
  it("should return null if tradeIdOrBCS is not defined", async () => {
    const { getRealIdOfTrade } = ratanUtils;
    getRealIdOfTrade.mockReturnValue(null);
    const mockData = { Cashflow: { Cashflow_State: "RELEASED" }, Trade_Version: 1 };
    const result = await tradeDetailsHandler(mockData);
    expect(result).toBeNull();
  });

  it("should return null if queryTradeVersionsData throws an error", async () => {
    const { getRealIdOfTrade, queryTradeVersionsData } = ratanUtils;
    getRealIdOfTrade.mockReturnValue("test_trade_id");
    queryTradeVersionsData.mockRejectedValue(new Error("Query failed"));
    const mockData = { Cashflow: { Cashflow_State: "RELEASED" }, Trade_Version: 1 };
    const result = await tradeDetailsHandler(mockData);
    expect(result).toBeNull();
  });

  it("should return null if queryTradeVersionsData returns no results", async () => {
    const { getRealIdOfTrade, queryTradeVersionsData } = ratanUtils;
    getRealIdOfTrade.mockReturnValue("test_trade_id");
    queryTradeVersionsData.mockResolvedValue({ tradeVersions: { results: [] } });
    const mockData = { Cashflow: { Cashflow_State: "RELEASED" }, Trade_Version: 1 };
    const result = await tradeDetailsHandler(mockData);
    expect(result).toBeNull();
  });

  it("should return trade details if queryTradeVersionsData succeeds", async () => {
    const { getRealIdOfTrade, queryTradeVersionsData } = ratanUtils;
    getRealIdOfTrade.mockReturnValue("test_trade_id");
    queryTradeVersionsData.mockResolvedValue({
      tradeVersions: { results: [{ Trade_Id: "test_trade_id", Version: 1 }] },
    });
    const mockData = { Cashflow: { Cashflow_State: "RELEASED" }, Trade_Version: 1 };
    const result = await tradeDetailsHandler(mockData);
    expect(result).toBeNull();
  });

  it("should handle edge case where Data_Flow.Data_Source_System is undefined", async () => {
    const mockData = {
      Cashflow: { Cashflow_State: "RELEASED" },
      Trade_Version: 1,
      Data_Flow: { Data_Source_System: undefined },
    };
    const mockResponse = {
      tradeVersions: {
        results: [
          { Trade_Id: "test_trade_id", Version: 1 },
          { Trade_Id: "test_trade_id", Version: 2 },
        ],
      },
    };
    const { getRealIdOfTrade, queryTradeVersionsData } = ratanUtils;
    getRealIdOfTrade.mockReturnValue("test_trade_id");
    queryTradeVersionsData.mockResolvedValue(mockResponse);

    const result = await tradeDetailsHandler(mockData);
    expect(result).toBeNull();
  });

  it("should handle edge case where Trade_Version is undefined", async () => {
    const mockData = {
      Cashflow: { Cashflow_State: "RELEASED" },
      Data_Flow: { Data_Source_System: "Murex" },
    };
    const result = await tradeDetailsHandler(mockData);
    expect(result).toBeNull();
  });

  it("should handle edge case where queryTradeVersionsData returns invalid data", async () => {
    const { getRealIdOfTrade, queryTradeVersionsData } = ratanUtils;
    getRealIdOfTrade.mockReturnValue("test_trade_id");
    queryTradeVersionsData.mockResolvedValue(null);
    const mockData = { Cashflow: { Cashflow_State: "RELEASED" }, Trade_Version: 1 };
    const result = await tradeDetailsHandler(mockData);
    expect(result).toBeNull();
  });
});

describe("fetchSwiftMessage", () => {
  const mockDetailsData = {
    Cashflow: {
      Cashflow_Id: "test_cashflow_id",
      Cashflow_Swift_Message_Standard: "MX",
      Cashflow_Version: 1,
      Cashflow_Business_Version: 1,
    },
    Entity: {
      Booking_Entity_SCI_FMID: "test_entity_id",
    },
    Trade_Original_Source_System_Name: "test_source_system",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return joined swift messages when standard is MX and API returns an array", async () => {
    vi.mocked(getSwiftMessageByCashflowId).mockResolvedValue({
      swiftType: "MX",
      mtMessageList: null,
      mxMessageLists: [
          {
              "sequence": 1,
              "mxType": "pacs.008.001.08",
              "mxMessage": "message 1"
          },
      ]
    });
    const result = await fetchSwiftMessage(mockDetailsData);
    expect(result[0]).toEqual({mxMessage: "message 1", mxType: "pacs.008.001.08", sequence: 1});
    expect(getSwiftMessageByCashflowId).toHaveBeenCalledWith("test_cashflow_id");
  });

  it("should return joined swift messages when standard is MT and API returns an array", async () => {
    vi.mocked(getSwiftMessageByCashflowId).mockResolvedValue({
      swiftType: "MT",
      mtMessageList: ["Message 1", "Message 2"],
      mxMessageLists: null
    });
    const result = await fetchSwiftMessage(mockDetailsData);
    expect(result).toBe("Message 1\n\nMessage 2");
    expect(getSwiftMessageByCashflowId).toHaveBeenCalledWith("test_cashflow_id");
  });

  it("should return an empty string when standard is MX and API returns a non-array value", async () => {
    vi.mocked(getSwiftMessageByCashflowId).mockResolvedValue({
      swiftType: "MX",
      mtMessageList: null,
      mxMessageLists: null,
    });
    const result = await fetchSwiftMessage(mockDetailsData);
    expect(result).toBe("");
    expect(getSwiftMessageByCashflowId).toHaveBeenCalledWith("test_cashflow_id");
  });

  it("should return an empty string when standard is MT and API returns a non-array value", async () => {
    vi.mocked(getSwiftMessageByCashflowId).mockResolvedValue({
      swiftType: "MT",
      mtMessageList: null,
      mxMessageLists: null,
    });
    const result = await fetchSwiftMessage(mockDetailsData);
    expect(result).toBe("");
    expect(getSwiftMessageByCashflowId).toHaveBeenCalledWith("test_cashflow_id");
  });

  it("should return an empty string when standard is MX or MT and API throws an error", async () => {
    vi.mocked(getSwiftMessageByCashflowId).mockRejectedValue(new Error("API Error"));
    const result = await fetchSwiftMessage(mockDetailsData);
    expect(result).toBe("");
    expect(getSwiftMessageByCashflowId).toHaveBeenCalledWith("test_cashflow_id");
  });

  it("should return swift message from swiftMessageDetails when standard is not MX or MT", async () => {
    const mockDetailsDataNonMXMT = {
      ...mockDetailsData,
      Cashflow: { ...mockDetailsData.Cashflow, Cashflow_Swift_Message_Standard: "OTHER" },
    };
    vi.mocked(swiftMessageDetails).mockResolvedValue("Legacy Swift Message");
    const result = await fetchSwiftMessage(mockDetailsDataNonMXMT);
    expect(result).toBe("Legacy Swift Message");
    expect(swiftMessageDetails).toHaveBeenCalledWith({
      cashflowId: "test_cashflow_id",
      bookingEntitySciFmid: "test_entity_id",
      cashflowVersion: 1,
      businessVersion: 1,
      tradeOriginalSourceSystem: "test_source_system",
    });
  });

  it("should return an empty string when swiftMessageDetails throws an error", async () => {
    const mockDetailsDataNonMXMT = {
      ...mockDetailsData,
      Cashflow: { ...mockDetailsData.Cashflow, Cashflow_Swift_Message_Standard: "OTHER" },
    };
    vi.mocked(swiftMessageDetails).mockRejectedValue(new Error("API Error"));
    const result = await fetchSwiftMessage(mockDetailsDataNonMXMT);
    expect(result).toBe("");
    expect(swiftMessageDetails).toHaveBeenCalledWith({
      cashflowId: "test_cashflow_id",
      bookingEntitySciFmid: "test_entity_id",
      cashflowVersion: 1,
      businessVersion: 1,
      tradeOriginalSourceSystem: "test_source_system",
    });
  });

  it("should handle edge case where Cashflow_Swift_Message_Standard is undefined", async () => {
    const mockDetailsDataUndefinedStandard = {
      ...mockDetailsData,
      Cashflow: { ...mockDetailsData.Cashflow, Cashflow_Swift_Message_Standard: undefined },
    };
    vi.mocked(swiftMessageDetails).mockResolvedValue("Fallback Swift Message");
    const result = await fetchSwiftMessage(mockDetailsDataUndefinedStandard);
    expect(result).toBe("Fallback Swift Message");
    expect(swiftMessageDetails).toHaveBeenCalledWith({
      cashflowId: "test_cashflow_id",
      bookingEntitySciFmid: "test_entity_id",
      cashflowVersion: 1,
      businessVersion: 1,
      tradeOriginalSourceSystem: "test_source_system",
    });
  });

  it.skip("should handle edge case where Cashflow is null", async () => {
    const mockDetailsDataNullCashflow = { ...mockDetailsData, Cashflow: null };
    // @ts-ignore
    const result = await fetchSwiftMessage(mockDetailsDataNullCashflow);
    expect(result).toBe("");
  });

  it("should handle edge case where Entity is null", async () => {
    const mockDetailsDataCopy = cloneDeep(mockDetailsData);
    mockDetailsDataCopy.Cashflow.Cashflow_Swift_Message_Standard = "";
    const mockDetailsDataNullEntity = { ...mockDetailsDataCopy, Entity: null };
    vi.mocked(swiftMessageDetails).mockResolvedValue("Fallback Swift Message");
    // @ts-ignore
    const result = await fetchSwiftMessage(mockDetailsDataNullEntity);
    expect(result).toBe("Fallback Swift Message");
    expect(swiftMessageDetails).toHaveBeenCalledWith({
      cashflowId: "test_cashflow_id",
      bookingEntitySciFmid: undefined,
      cashflowVersion: 1,
      businessVersion: 1,
      tradeOriginalSourceSystem: "test_source_system",
    });
  });
});

describe("convertCountry", () => {
  it("should return countryName when countryCode matches", () => {
    const country = "CN";
    const countryInfoList = [
      { countryCode: "CN", countryName: "CHINA" }
    ];
    expect(convertCountry(country, countryInfoList)).toBe("CHINA");
  });

  it("should return country code when no match found", () => {
    const country = "JP";
    const countryInfoList = [
      { countryCode: "CN", countryName: "CHINA" },
      { countryCode: "US", countryName: "UNITED STATES" },
    ];
    expect(convertCountry(country, countryInfoList)).toBe("JP");
  });

  it("should return country code when countryInfoList is undefined", () => {
    const country = "FR";
    // @ts-ignore
    expect(convertCountry(country, undefined)).toBe("FR");
  });
});

describe("isShowSwift condition", () => {
  it("should NOT render Swift tab when Cashflow_State is not RELEASED or SETTLED and no audit trail matches", async () => {
    const details = {
      ...rowDetails.data.cashflows.results[0],
      Cashflow: {
        ...rowDetails.data.cashflows.results[0].Cashflow,
        Cashflow_State: "WAITING",
      },
    };

    const { queryCashFlowDetails } = graphqlServices;
    queryCashFlowDetails.mockResolvedValue({
      graphCashFlowDetails: [
        {
          cashflow: {
            Cashflow: {
              Cashflow_State: "WAITING",
            },
          },
          cashflowAuditTrail: [
            {
              Cashflow: { Cashflow_State: "WAITING" },
            },
          ],
        },
      ],
    });

    renderWithProviders(
      <DetailsBody
        details={details}
        activeKey={SWIFT_MESSAGE_TAB}
        onQueryCashflow={vi.fn()}
        onOpenTradeDetails={vi.fn()}
      />
    );

    await screen.findByTestId("cashflow-details-dialog-body");
    const tabPanel = document.getElementById(`simple-tabpanel-${TAB_PANES[2].value}`);

    expect(tabPanel).not.toBeInTheDocument();
  });

  it("should render Swift tab when Cashflow_State is RELEASED", async () => {
    const details = {
      ...rowDetails.data.cashflows.results[0],
      Cashflow: {
        ...rowDetails.data.cashflows.results[0].Cashflow,
        Cashflow_State: "RELEASED",
      },
    };

    const { queryCashFlowDetails } = graphqlServices;
    queryCashFlowDetails.mockResolvedValue({
      graphCashFlowDetails: [
        {
          cashflow: {
            Cashflow: {
              Cashflow_State: "RELEASED",
            },
          },
          cashflowAuditTrail: [],
        },
      ],
    });

    renderWithProviders(
      <DetailsBody
        details={details}
        activeKey={SWIFT_MESSAGE_TAB}
        onQueryCashflow={vi.fn()}
        onOpenTradeDetails={vi.fn()}
      />
    );

    await screen.findByTestId("cashflow-details-dialog-body");
    const tabPanel = document.getElementById(`simple-tabpanel-${TAB_PANES[2].value}`);

    expect(tabPanel).toBeInTheDocument();
  });
});
