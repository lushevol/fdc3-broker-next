import { fireEvent, renderWithProviders,userEvent } from "@Test/test-utils";
import { GetContextMenuItemsParams, IMenuActionParams } from "ag-grid-community";
import { message, Modal } from "antd";
import _cloneDeep from "lodash/cloneDeep";
import _merge from "lodash/merge";
import { useDispatch } from "react-redux";
import { get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN } from "src/Root/analysis/const";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import { mockCashflow1 } from "../../../test/mockData/cashflow";
import { WorkflowActionExtraOptions } from "../../common/interface";
import preloadState from "../../store/state";
import {
  manualSettleRightMenu,
  ManualSettleWrap,
} from "./index";
import { SettleUserType } from "./interface";

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock("src/Cashflow_CN/services/graphql", () => {
  return {
    queryCashflow: jest.fn(async () => ({
      cashflowUltraQuery: {
        results: [],
      },
    })),
  };
});

jest.mock("../../../services", () => {
  return {
    getSettleSwiftStatus: jest.fn(async () => [
      "AMH Error",
      "Check in FMSGW",
      "Check in FMSRE",
      "FMSGW Deleted",
      "FMSGW Error",
      "FMSRE Deleted",
      "FMSRE Error",
      "Manual Delete",
      "SCPAY Error",
    ]),
    postSettleChecker: jest.fn(),
    postSettleMaker: jest.fn(),
  }
});

const mockIMenuActionParams: IMenuActionParams = {
  api: {
    getSelectedRows: jest.fn(() => [{ id: 1, name: 'Row 1' }]),
    dispatchEvent: jest.fn(),
    getGridId: jest.fn(),
    destroy: jest.fn(),
    isDestroyed: jest.fn(),
  } as any,
  context: {},

  column: {
    getColId: jest.fn(() => 'mockColumnId'),
    getDefinition: jest.fn(() => ({ headerName: 'Mock Column' })),
  } as any,

  node: {
    data: { id: 1, name: 'Row 1' },
    rowIndex: 0,
    setSelected: jest.fn(),
  } as any,

  value: 'Mock Value',
};

jest.mock("../../store/actions", () => ({
  manualSettleWorkflowAction: jest.fn(),
  updateCashflow: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("Manual Settle Right Menu", () => {
  it("should be in the document", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const manualSettleMakerCashflowData = {
      Cashflow: {
        Cashflow_State: "RELEASED",
        Cashflow_Swift_Status: "SCPAY Error",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(_cloneDeep(mockCashflow1), manualSettleMakerCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(_cloneDeep(mockCashflow1), manualSettleMakerCashflowData),
        ],
      },
    };
    const rm =
      manualSettleRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      );
    expect(rm).not.toBeNull();
    const { name, action } = rm!;
    expect(name).toBe("Manual Settle");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("validate manual settle action", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const manualSettleMakerCashflowData = {
      Cashflow: {
        Cashflow_State: "RELEASED",
        Cashflow_Sub_State_Type: "Manual Settle",
        Cashflow_Sub_State: "Pending Verification",
        Cashflow_Sub_State_Updater: "123456",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(_cloneDeep(mockCashflow1), manualSettleMakerCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(_cloneDeep(mockCashflow1), manualSettleMakerCashflowData),
        ],
      },
    };
    const rm =
      manualSettleRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      );
    expect(rm).not.toBeNull();
    const { disabled } = rm!;
    expect(disabled).toBe(true);
  });
});

describe("Manual Settle Dialog", () => {
  let dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(dispatch);
  });

  it("should be in the document", async () => {
    const manualSettleMakerCashflowData = {
      Cashflow: {
        Cashflow_State: "RELEASED",
      },
    };
    const { queryByTestId, getByTestId } = renderWithProviders(
      <ThemeProvider>
        <ManualSettleWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          manualSettleWorkflow: {
            isOpenDialog: true,
            data: [_merge(_cloneDeep(mockCashflow1), manualSettleMakerCashflowData)],
            role: SettleUserType.Maker,
          },
        },
      }
    );
    expect(queryByTestId("manual_settle")).toBeInTheDocument();
    userEvent.type(getByTestId("addCommentText"), "settle test");
    const submitBtn = getByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN("manual_settle"));
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);
    const closeIcon = getByTestId("MuiDialog-close-btn");
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
  });
  it("checker approve action", async () => {
    const manualSettleMakerCashflowData = {
      Cashflow: {
        Cashflow_State: "RELEASED",
        Cashflow_Sub_State_Type: "Manual Settle",
        Cashflow_Sub_State: "Pending Verification",
        Cashflow_Sub_State_Updater: "123456",
      },
    };
    const { queryByTestId, getByTestId } = renderWithProviders(
      <ThemeProvider>
        <ManualSettleWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          manualSettleWorkflow: {
            isOpenDialog: true,
            data: [_merge(_cloneDeep(mockCashflow1), manualSettleMakerCashflowData)],
            role: SettleUserType.Checker,
          },
        },
      }
    );
    expect(queryByTestId("manual_settle")).toBeInTheDocument();
    userEvent.type(getByTestId("addCommentText"), "settle test");
    const approveBtn = getByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN("manual_settle"));
    expect(approveBtn).toBeInTheDocument();
    fireEvent.click(approveBtn);
  });
});

describe("Verify Settle Right Menu", () => {
  it("should be in the document", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const manualSettlecheckerCashflowData = {
      Cashflow: {
        Cashflow_State: "RELEASED",
        Cashflow_Sub_State_Type: "Manual Settle",
        Cashflow_Sub_State: "Pending Verification",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(_cloneDeep(mockCashflow1), manualSettlecheckerCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(_cloneDeep(mockCashflow1), manualSettlecheckerCashflowData),
        ],
      },
    };
    const rm =
      manualSettleRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      );
    expect(rm).not.toBeNull();
    const { name, action } = rm!;
    expect(name).toBe("Verify Settle");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
});
