import { GetContextMenuItemsParams, IMenuActionParams } from "ag-grid-community";
import { message, Modal } from "antd";

import { WorkflowActionExtraOptions } from "../../common/interface";
import { actionMapping, actionNameMapping, earlyMaterializationRightMenu } from "./EarlyMaterializationWrap";

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

describe("actionMapping", () => {
  const mockCashflow = (overrides: Partial<CNCashflow["Cashflow"]> = {}) => ({
    Cashflow: {
      Cashflow_State: "",
      Cashflow_Sub_State: "",
      Cashflow_Sub_State_Type: "",
      Cashflow_Affirmation_Status: "",
      Cashflow_Swift_Message_Standard: "",
      ...overrides,
    },
  });

  it("should return 'Materialize' for PROJECTED state", () => {
    const cashflow = mockCashflow({ Cashflow_State: "PROJECTED" });
    expect(actionMapping(cashflow)).toBe("Materialize");
  });

  it("should return 'ReInstate' for FAILED state", () => {
    const cashflow = mockCashflow({ Cashflow_State: "FAILED" });
    expect(actionMapping(cashflow)).toBe("ReInstate");
  });

  it("should return 'ReInstate' for QUEUED state with Pending Exception sub-state type", () => {
    const cashflow = mockCashflow({
      Cashflow_State: "QUEUED",
      Cashflow_Sub_State_Type: "Pending Exception",
    });
    expect(actionMapping(cashflow)).toBe("ReInstate");
  });

  it("should return 'SettleAsGross' for WAITING state with Pending Netting sub-state type", () => {
    const cashflow = mockCashflow({
      Cashflow_State: "WAITING",
      Cashflow_Sub_State_Type: "Pending Netting",
    });
    expect(actionMapping(cashflow)).toBe("SettleAsGross");
  });

  it("should return 'SettleAsGross' for WAITING state with Pending Another Leg sub-state type and NA sub-state", () => {
    const cashflow = mockCashflow({
      Cashflow_State: "WAITING",
      Cashflow_Sub_State_Type: "Pending Another Leg",
      Cashflow_Sub_State: "NA",
    });
    expect(actionMapping(cashflow)).toBe("SettleAsGross");
  });

  it("should return 'ReplayStatusWriteBack' for RELEASED state", () => {
    const cashflow = mockCashflow({ Cashflow_State: "RELEASED" });
    expect(actionMapping(cashflow)).toBe("ReplayStatusWriteBack");
  });

  it("should return 'ResendToRazor' for READY state with Pending Ack sub-state type", () => {
    const cashflow = mockCashflow({
      Cashflow_State: "READY",
      Cashflow_Sub_State_Type: "Pending Ack",
    });
    expect(actionMapping(cashflow)).toBe("ResendToRazor");
  });

  it("should return 'EarlyRelease' for READY state with NA sub-state and sub-state type", () => {
    const cashflow = mockCashflow({
      Cashflow_State: "READY",
      Cashflow_Sub_State: "NA",
      Cashflow_Sub_State_Type: "NA",
    });
    expect(actionMapping(cashflow)).toBe("EarlyRelease");
  });

  it("should return 'ManualAffirmed' for WAITING state with Pending Exception sub-state type and Unaffirmed affirmation status", () => {
    const cashflow = mockCashflow({
      Cashflow_State: "WAITING",
      Cashflow_Sub_State_Type: "Pending Exception",
      Cashflow_Affirmation_Status: "Unaffirmed",
    });
    expect(actionMapping(cashflow)).toBe("ManualAffirmed");
  });

  it("should return 'ReGenerateSwift' for READY state with Pending Ack sub-state type and STRATEGIC swift message standard", () => {
    const cashflow = mockCashflow({
      Cashflow_State: "READY",
      Cashflow_Sub_State_Type: "Pending Ack",
      Cashflow_Swift_Message_Standard: "STRATEGIC",
    });
    expect(actionMapping(cashflow)).toBe("ReGenerateSwift");
  });

  it("should return an empty string for unmatched conditions", () => {
    const cashflow = mockCashflow({
      Cashflow_State: "UNKNOWN",
      Cashflow_Sub_State_Type: "UNKNOWN",
    });
    expect(actionMapping(cashflow)).toBe("");
  });

  it("should return an empty string for empty cashflow data", () => {
    const cashflow = mockCashflow();
    expect(actionMapping(cashflow)).toBe("");
  });

  it.skip("should handle edge case with null or undefined cashflow", () => {
    expect(actionMapping({} as CNCashflow)).toBe("");
    expect(actionMapping(null as unknown as CNCashflow)).toBe("");
  });
});

describe("actionNameMapping", () => {
  it("should return 'Early Materialization' for 'Materialize'", () => {
    expect(actionNameMapping("Materialize")).toBe("Early Materialization");
  });

  it("should return 'ReInstate' for 'ReInstate'", () => {
    expect(actionNameMapping("ReInstate")).toBe("ReInstate");
  });

  it("should return 'Settle As Gross' for 'SettleAsGross'", () => {
    expect(actionNameMapping("SettleAsGross")).toBe("Settle As Gross");
  });

  it("should return 'Status Write Back' for 'ReplayStatusWriteBack'", () => {
    expect(actionNameMapping("ReplayStatusWriteBack")).toBe("Status Write Back");
  });

  it("should return 'Resend To Razor' for 'ResendToRazor'", () => {
    expect(actionNameMapping("ResendToRazor")).toBe("Resend To Razor");
  });

  it("should return 'Early Release' for 'EarlyRelease'", () => {
    expect(actionNameMapping("EarlyRelease")).toBe("Early Release");
  });

  it("should return 'Update Affirmation' for 'ManualAffirmed'", () => {
    expect(actionNameMapping("ManualAffirmed")).toBe("Update Affirmation");
  });

  it("should return 'Comment' for 'Comment'", () => {
    expect(actionNameMapping("Comment")).toBe("Comment");
  });

  it("should return 'Regenerate Swift' for 'ReGenerateSwift'", () => {
    expect(actionNameMapping("ReGenerateSwift")).toBe("Regenerate Swift");
  });

  it("should return an empty string for an unknown action", () => {
    expect(actionNameMapping("UnknownAction")).toBe("");
  });

  it("should return an empty string for an empty action", () => {
    expect(actionNameMapping("")).toBe("");
  });

  it("should return an empty string for a null action", () => {
    expect(actionNameMapping(null as unknown as string)).toBe("");
  });

  it("should return an empty string for an undefined action", () => {
    expect(actionNameMapping(undefined as unknown as string)).toBe("");
  });
});

describe("earlyMaterializationRightMenu", () => {
  const mockDispatch = jest.fn();
  const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
    dispatch: mockDispatch,
    messageApi: message,
    modalApi: Modal,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return null if no rows are selected and hoverRow has no valid action", () => {
    const mockParams = {
      node: { data: { Cashflow: { Cashflow_State: "UNKNOWN" } } },
      api: { getSelectedRows: () => [] },
    } as unknown as GetContextMenuItemsParams;

    const result = earlyMaterializationRightMenu(mockParams, mockWorkflowActionExtraOptions);
    expect(result).toBeNull();
  });

  it("should return null if selected rows have different actions", () => {
    const mockParams = {
      node: { data: { Cashflow: { Cashflow_State: "PROJECTED" } } },
      api: {
        getSelectedRows: () => [
          { Cashflow: { Cashflow_State: "PROJECTED" } },
          { Cashflow: { Cashflow_State: "FAILED" } },
        ],
      },
    } as unknown as GetContextMenuItemsParams;

    const result = earlyMaterializationRightMenu(mockParams, mockWorkflowActionExtraOptions);
    expect(result).toBeNull();
  });

  it("should return null if selected rows have no valid actions", () => {
    const mockParams = {
      node: { data: { Cashflow: { Cashflow_State: "UNKNOWN" } } },
      api: {
        getSelectedRows: () => [
          { Cashflow: { Cashflow_State: "UNKNOWN" } },
          { Cashflow: { Cashflow_State: "UNKNOWN" } },
        ],
      },
    } as unknown as GetContextMenuItemsParams;

    const result = earlyMaterializationRightMenu(mockParams, mockWorkflowActionExtraOptions);
    expect(result).toBeNull();
  });

  it("should return the correct action for valid selected rows", () => {
    const mockParams = {
      node: { data: { Cashflow: { Cashflow_State: "PROJECTED" } } },
      api: {
        getSelectedRows: () => [
          { Cashflow: { Cashflow_State: "PROJECTED" } },
          { Cashflow: { Cashflow_State: "PROJECTED" } },
        ],
      },
    } as unknown as GetContextMenuItemsParams;

    const result = earlyMaterializationRightMenu(mockParams, mockWorkflowActionExtraOptions);
    expect(result).toEqual({
      name: "Early Materialization",
      action: expect.any(Function),
    });
  });

  it("should dispatch the correct action when the returned action is invoked", () => {
    const mockParams = {
      node: { data: { Cashflow: { Cashflow_State: "PROJECTED" } } },
      api: {
        getSelectedRows: () => [
          { Cashflow: { Cashflow_State: "PROJECTED" } },
        ],
      },
    } as unknown as GetContextMenuItemsParams;

    const result = earlyMaterializationRightMenu(mockParams, mockWorkflowActionExtraOptions);
    expect(result).not.toBeNull();
    result!.action!(mockIMenuActionParams);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          isOpenDialog: true,
          action: "Materialize",
          data: expect.any(Array),
        },
        type: "EARLY_MATERIALIZATION_WORKFLOW",
      })
    );
  });

  it("should return null if allActions length does not match selectedRows length", () => {
    const mockParams = {
      node: { data: { Cashflow: { Cashflow_State: "PROJECTED" } } },
      api: {
        getSelectedRows: () => [
          { Cashflow: { Cashflow_State: "PROJECTED" } },
          { Cashflow: { Cashflow_State: "FAILED" } },
        ],
      },
    } as unknown as GetContextMenuItemsParams;

    const result = earlyMaterializationRightMenu(mockParams, mockWorkflowActionExtraOptions);
    expect(result).toBeNull();
  });

  it("should return null if allActions contains multiple unique actions", () => {
    const mockParams = {
      node: { data: { Cashflow: { Cashflow_State: "PROJECTED" } } },
      api: {
        getSelectedRows: () => [
          { Cashflow: { Cashflow_State: "PROJECTED" } },
          { Cashflow: { Cashflow_State: "FAILED" } },
        ],
      },
    } as unknown as GetContextMenuItemsParams;

    const result = earlyMaterializationRightMenu(mockParams, mockWorkflowActionExtraOptions);
    expect(result).toBeNull();
  });

  it.skip("should handle edge case where param is null", () => {
    const result = earlyMaterializationRightMenu(null as unknown as GetContextMenuItemsParams, mockWorkflowActionExtraOptions);
    expect(result).toBeNull();
  });

  it("should handle edge case where selectedRows is empty and hoverRow is valid", () => {
    const mockParams = {
      node: { data: { Cashflow: { Cashflow_State: "PROJECTED" } } },
      api: { getSelectedRows: () => [] },
    } as unknown as GetContextMenuItemsParams;

    const result = earlyMaterializationRightMenu(mockParams, mockWorkflowActionExtraOptions);
    expect(result).toEqual({
      name: "Early Materialization",
      action: expect.any(Function),
    });
  });
});

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));