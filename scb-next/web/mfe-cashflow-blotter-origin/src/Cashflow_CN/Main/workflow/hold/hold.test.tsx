import userEvent from "@testing-library/user-event";
import { GetContextMenuItemsParams, GridApi, IMenuActionParams } from "ag-grid-community";
import { message, Modal } from "antd";
import { renderWithProviders } from "src/test/test-utils";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import {
  mockCashflow1,
  mockCashflowHold,
} from "../../../test/mockData/cashflow";
import { WorkflowActionExtraOptions } from "../../common/interface";
import preloadState from "../../store/state";
import { HoldActionName,HoldMenuName, holdRightMenu, HoldWrap } from "./index";

vi.mock("src/Cashflow_CN/components/CommonCommentAction", () => {
  const mockComponent = ({
    children,
    title,
    onSubmit,
    onReject,
    onClose,
  }) => {
    return <div>
      <span>{title}</span>
      <button data-testid="test-submit" onClick={() => onSubmit("test")}>submit</button>
      <button data-testid="test-reject" onClick={() => onReject?.()}>submit</button>
      <button data-testid="test-close" onClick={() => onClose(true)}>close</button>
      <div>{children}</div>
    </div>
  }
  return {
    __esModule: true,
    default: mockComponent,
  }
});

const mockIMenuActionParams: IMenuActionParams = {
  api: {
    getSelectedRows: vi.fn(() => [{ id: 1, name: 'Row 1' }]),
    dispatchEvent: vi.fn(),
    getGridId: vi.fn(),
    destroy: vi.fn(),
    isDestroyed: vi.fn(),
  } as any,
  context: {},

  column: {
    getColId: vi.fn(() => 'mockColumnId'),
    getDefinition: vi.fn(() => ({ headerName: 'Mock Column' })),
  } as any,

  node: {
    data: { id: 1, name: 'Row 1' },
    rowIndex: 0,
    setSelected: vi.fn(),
  } as any,

  value: 'Mock Value',
};
vi.mock("src/Cashflow_CN/services/graphql", () => {
  return {
    queryCashflow: vi.fn(async () => ({
      cashflowUltraQuery: {
        results: [],
      },
    })),
  };
});

describe("Hold Right Menu", () => {
  it("Hold should be called", async () => {
    const mockAggridContextMenuItemParams = {
      node: {
        data: mockCashflow1,
      },
      api: {
        getSelectedRows: () => [mockCashflow1],
      },
    };
    const dispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const rm =
      holdRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    const { name, action } = rm[0];
    expect(name).toBe(HoldMenuName.HOLD);
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("Unhold should be called", async () => {
    const mockAggridContextMenuItemParams = {
      node: {
        data: mockCashflowHold,
      },
      api: {
        getSelectedRows: () => [mockCashflowHold],
      },
    };
    const dispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const rm =
      holdRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    const { name, disabled, action } = rm[1];
    expect(name).toBe(HoldMenuName.UNHOLD);
    expect(action).toBeDefined();
    expect(disabled).toBe(true);
  });
  it("Send to Wainting should be called", async () => {
    const mockAggridContextMenuItemParams = {
      node: {
        data: mockCashflowHold,
      },
      api: {
        getSelectedRows: () => [mockCashflowHold],
      },
    };
    const dispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const rm =
      holdRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    const { name, action } = rm[0];
    expect(name).toBe(HoldMenuName.SEND_TO_WAITING);
    expect(action).toBeDefined();
  });
  it("Hold Selected Row is [] should use param data", async () => {
    const mockAggridContextMenuItemParams = {
      node: {
        data: mockCashflow1,
      },
    };
    const dispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const rm =
      holdRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    const { name, action } = rm[0];
    expect(name).toBe(HoldMenuName.HOLD);
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("Unhold by you", async () => {
    const mockAggridContextMenuItemParams = {
      node: {
        data: {
          Cashflow: {
            Cashflow_Sub_State_Updater: '123456'
          }
        },
      },
      api: {
        getSelectedRows: () => [
          {
            Cashflow: {
              Cashflow_Sub_State_Updater: '2086256',
              Cashflow_State: "HOLD"
            }
          }
        ],
      },
    };
    const dispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const rm =
      holdRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    const { disabled } = rm[1];
    expect(disabled).toBe(false);
  });
});

describe("holdRightMenu", () => {
  const mockDispatch = vi.fn();
  const mockOptions = { dispatch: mockDispatch } as unknown as WorkflowActionExtraOptions;

  const mockGetSelectedRows = vi.fn();
  const mockGetContextMenuItemsParams = (data: any, selectedRows: any[] = []) => ({
    api: { getSelectedRows: mockGetSelectedRows.mockReturnValue(selectedRows) },
    node: { data }
  } as unknown as GetContextMenuItemsParams);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 'Hold' menu item when all selected rows are in HoldAvailableState and user has hold permission", () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockImplementation((permission) => permission === "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Hold");

    const data = { Cashflow: { Cashflow_State: "QUEUED" } };
    const selectedRows = [{ Cashflow: { Cashflow_State: "READY" } }];
    const params = mockGetContextMenuItemsParams(data, selectedRows);

    const result = holdRightMenu(params, mockOptions);

    expect(result[0]).toEqual({
      name: HoldMenuName.HOLD,
      action: expect.any(Function),
    });

    result[0]?.action?.(mockIMenuActionParams);
    expect(mockDispatch).toHaveBeenCalledWith({
      data: {
        action: HoldActionName.HOLD,
        isOpenHold: true,
        data: selectedRows,
      },
      type: "HOLD_WORKFLOW",
    });
  });

  it("should return 'Unhold' menu item when all selected rows are in 'HOLD' state and user has unhold permission", () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockImplementation((permission) => true);

    const data = { Cashflow: { Cashflow_State: "HOLD" } };
    const selectedRows = [{ Cashflow: { Cashflow_State: "HOLD" } }];
    const params = mockGetContextMenuItemsParams(data, selectedRows);

    const result = holdRightMenu(params, mockOptions);

    expect(result[1]).toEqual({
      name: HoldMenuName.UNHOLD,
      disabled: false,
      tooltip: "Unhold action will send cashflow to previous status(QUEUED/WAITING/READY)",
      action: expect.any(Function),
    });

    result[1]?.action?.(mockIMenuActionParams);
    expect(mockDispatch).toHaveBeenCalledWith({
      data: {
        action: HoldActionName.UNHOLD,
        isOpenHold: true,
        data: selectedRows,
      },
      type: "HOLD_WORKFLOW",
    });
  });

  it("should return 'Send to WAITING' menu item when all selected rows are in 'HOLD' state and user has unhold permission", () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockImplementation((permission) => true);

    const data = { Cashflow: { Cashflow_State: "HOLD" } };
    const selectedRows = [{ Cashflow: { Cashflow_State: "HOLD" } }];
    const params = mockGetContextMenuItemsParams(data, selectedRows);

    const result = holdRightMenu(params, mockOptions);

    expect(result[0]).toEqual({
      name: "Send to WAITING",
      action: expect.any(Function),
    });

    result[0]?.action?.(mockIMenuActionParams);
    expect(mockDispatch).toHaveBeenCalledWith({
      data: {
        action: "Send to WAITING",
        isOpenHold: true,
        data: selectedRows,
      },
      type: "HOLD_WORKFLOW",
    });
  });

  it("should return 'Unhold' menu item with disabled state when cashflows are held by the user", () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockImplementation((permission) => true);
    vi.spyOn(require("src/Root/import/ratanutils"), "getUser").mockReturnValue({ id: "user123" });

    const data = { Cashflow: { Cashflow_State: "HOLD", Cashflow_Sub_State_Updater: "user123" } };
    const selectedRows = [data];
    const params = mockGetContextMenuItemsParams(data, selectedRows);

    const result = holdRightMenu(params, mockOptions);

    expect(result).toEqual([
      {
        name: HoldMenuName.SEND_TO_WAITING,
        action: expect.any(Function),
      },
      {
        name: HoldMenuName.UNHOLD,
        disabled: true,
        tooltip: "cashflow () held by you",
        action: expect.any(Function),
      }]);
  });

  it("should return empty array when user does not have hold or unhold permissions", () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockReturnValue(false);

    const data = { Cashflow: { Cashflow_State: "QUEUED" } };
    const params = mockGetContextMenuItemsParams(data);

    const result = holdRightMenu(params, mockOptions);

    expect(result).toStrictEqual([]);
  });

  it("should return empty array when selected rows are not in HoldAvailableState or 'HOLD' state", () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockReturnValue(true);

    const data = { Cashflow: { Cashflow_State: "SETTLED" } };
    const params = mockGetContextMenuItemsParams(data);

    const result = holdRightMenu(params, mockOptions);

    expect(result).toStrictEqual([]);
  });

  it("should return empty array when param is null", () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockReturnValue(true);

    const result = holdRightMenu(null as unknown as GetContextMenuItemsParams, mockOptions);

    expect(result).toStrictEqual([]);
  });

  it("should cover when api is undefined", () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockReturnValue(true);

    const data = { Cashflow: { Cashflow_State: "SETTLED" } };
    const params = mockGetContextMenuItemsParams(data);

    params.api = undefined as unknown as GridApi;

    const result = holdRightMenu(params, mockOptions);

    expect(result).toStrictEqual([]);
  });
});