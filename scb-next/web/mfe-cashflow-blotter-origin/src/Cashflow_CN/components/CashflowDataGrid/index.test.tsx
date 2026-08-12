import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import { act, render } from "@testing-library/react";
import { Modal } from "antd";
import { DataGrid } from "Import/ratancomponents";
import {
  conversionColDef,
  getBusinessFieldsFromCache,
} from "Import/ratanutils";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { SettleUserType } from "src/Cashflow_CN/Main/workflow/manualSettle/interface";
import { mockAggridEvent } from "src/test/mockUtils/aggrid";

import {
  queryCashflowList,
  setCashflowGridEvent,
} from "../../Main/store/actions";
import {
  RoundingType,
  SplitActionType,
} from "../../Main/workflow/splitting/common/interface";
import { BulkUserType } from "../BulkFixExceptions/type";
import CashflowDataGrid from "./index";

vi.mock("../../Main/store/actions", () => {
  const mockAction = () => {
    return {
      type: "MOCK_ACTION",
      payload: null,
    };
  };
  return {
    queryCashflowList: vi.fn(mockAction),
    setCashflowGridEvent: vi.fn(mockAction),
    viewCashflowDetailsAction: vi.fn(mockAction),
  };
});

function handleGridReady(onGridReady) {
  if (!onGridReady) return;
  const remove = onGridReady({
    api: {
      setGridOption: vi.fn(),
      setRowData: () => {},
      forEachNode: (callback) => callback({ key: "GENERAL", setExpanded: () => {} }),
      resetRowHeights: () => {},
    },
  });
  remove?.();
}

function handleRowDoubleClicked(onRowDoubleClicked, cashflowData) {
  onRowDoubleClicked?.({ data: cashflowData });
}

function handleContextMenu(getContextMenuItems, cashflowData, rowNode, checkContextMenu) {
  if (typeof getContextMenuItems === "function") {
    const result = getContextMenuItems({
      node: { data: cashflowData },
      api: {
        getSelectedRows: () => [],
        getRowNode: () => rowNode,
        setRowData: () => {},
      },
    });
    checkContextMenu(result);
  }
}

function handleFilterChanged(onFilterChanged) {
  onFilterChanged?.({
    api: {
      getFilterModel: vi.fn(() => ({
        "Cashflow.Cashflow_State": {
          values: ["WAITING"],
          filterType: "set",
        },
      })),
      deselectAll: vi.fn(),
      getColumn: vi.fn(),
    },
  });
}

describe("CashflowDataGrid component", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("defalut render", async () => {
    vi.useFakeTimers();
    const promise = Promise.resolve({
      cashflowFields: [],
      cashflowAndTradeFields: [],
    });
    const cashflowData = {
      Trade_Id: "92060298",
      Trade_Version: null,
      Cashflow: {
        Cashflow_Id: "M00101913604",
        Cashflow_Business_Version: 0,
        Cashflow_Version: 0,
        Cashflow_State: "WAITING",
        Cashflow_Affirmation_Status: "Unaffirmed",
        Cashflow_Event_Type: "New",
        Cashflow_Minor_Version: 3,
        Payment_Currency: "USD",
        Payment_Date: "2024-02-02",
        Payment_Type: "",
        Payment_Cutoff_Time: "2024-02-01T11:00Z",
        Pay_Receive_Indicator: "Receive",
        Payment_Amount: "2386611.110000",
        Netting_Id: null,
        Netting_Cuttoff_Date: null,
        Payment_Receiver_Party_Reference: "party1",
        Payment_Payer_Party_Reference: "party2",
        Cashflow_Sub_State: "Pending Operator",
        Cashflow_Sub_State_Type: "Pending Exception",
        Cashflow_Sub_State_Updater: "System",
        Status_Event_Type: "SsiStamped",
        Event_Date: "2024-06-07",
        Cashflow_Event_Reason: "",
      },
      Entity: {
        Counterparty_Long_Name: "xxxx",
      },
      Instrument_Common: {
        ISDA_Taxonomy: "ForeignExchange:Forward",
      },
    };
    const checkContextMenu = vi.fn();
    const modalApi = {
      info: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      warning: vi.fn(),
      confirm: vi.fn(),
    };
    vi.spyOn(Modal, "useModal").mockImplementation(() => {
      return [modalApi, <></>];
    });
    jest
      .mocked(getBusinessFieldsFromCache)
      .mockImplementation((workspace, customField) => {
        return promise;
      });
    jest
      .mocked(conversionColDef)
      .mockImplementation((workspace, customField) => {
        return [
          {
            headerName: "Select",
            headerCheckboxSelection: true,
            checkboxSelection: true,
            sortable: false,
            menuTabs: [],
            resizable: false,
            maxWidth: 42,
            minWidth: 42,
            hide: false,
            pinned: "left",
            lockPosition: true,
          },
          {
            headerName: "Cashflow ID",
            field: "Cashflow_Id",
            hide: false,
          },
        ];
      });
    const rowNode = {
      setData: vi.fn(),
    };

    vi.mocked(DataGrid).mockImplementation((props) => {
      const { onGridReady, gridOptions } = props;
      const { onRowDoubleClicked, getContextMenuItems, onFilterChanged } = gridOptions;
      useEffect(() => {
        handleGridReady(onGridReady);
        handleRowDoubleClicked(onRowDoubleClicked, cashflowData);
        handleContextMenu(getContextMenuItems, cashflowData, rowNode, checkContextMenu);
        handleFilterChanged(onFilterChanged);
      }, []);
      return <section data-testid="mocked-datagrid"></section>;
    });

    const store = configureStore({
      reducer: {
        cashflowGridEvent: createReducer(
          mockAggridEvent,
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        initParams: createReducer(
          {
            cashflowId: "M00101913604",
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        adhocSSIWorkflow: createReducer(
          {
            isOpenAdhocSSIMaker: false,
            data: {},
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        adhocNostroWorkflow: createReducer(
          {
            isOpenAdhocNostro: false,
            data: {},
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        addCommentWorkflow: createReducer(
          {
            isOpenComment: false,
            data: {},
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        latestNotificationStack: createReducer(
          {
            id: "",
            pool: [],
          }, () => {}
        ),
        netWorkflow: createReducer(
          {
            isNetCashflowDialogVisible: false,
            data: {},
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        unNetWorkflow: createReducer(
          {
            isOpenComponentCashflow: false,
            data: {},
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        updateAffirmationStatusWorkflow: createReducer(
          {
            isOpenAffirmation: false,
            data: [],
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        viewCashflowDetailsWorkflow: createReducer(
          {
            isOpenCashflowDetails: false,
            defaultTabKey: "",
            data: null,
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        viewTradeDetailsWorkflow: createReducer(
          {
            isOpenTradeDetails: false,
            data: null,
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        holdWorkflow: createReducer(
          {
            isOpenHold: false,
            data: null,
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        earlyMaterializationWorkflow: createReducer(
          {
            isOpenDialog: false,
            data: null,
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        commonCommentActionWorkflow: createReducer(
          {
            isOpenDialog: false,
            data: null,
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        suppressWorkflow: createReducer(
          {
            isOpenDialog: false,
            data: null,
          },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        bulkFixExceptions: createReducer({
            isOpenDialog: true,
            cashflowsReadyToFix: [],
            userType: BulkUserType.Maker,
        }, () => {}),
        manualSettleWorkflow: createReducer({
          isOpenDialog: true,
          data: [],
          role: SettleUserType.Maker,
        }, () => {}),
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows:[],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.COMPONENT_SPLIT,
        },
          (builder) => {
            builder.addCase(createAction("INIT"), (state, action) => state);
          }
        ),
        settlementMethodUpdateWorkflow: createReducer({
          isOpenDialog: false,
          cashflowData: [],
          cashflowDataByTrade: [],
        }, () => {}),
      },
    });
    const { getAllByTestId } = render(
      <Provider store={store}>
        <CashflowDataGrid />
      </Provider>
    );
    await act(async () => {
      await promise;
    });
    expect(getAllByTestId("mocked-datagrid").length).toBeGreaterThan(0);
    expect(setCashflowGridEvent).toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(queryCashflowList).toHaveBeenCalled();
  });
});
