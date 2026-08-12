import { GetContextMenuItemsParams, IMenuActionParams } from "ag-grid-community";
import { message, Modal } from "antd";
import _merge from "lodash/merge";
import * as ratanUtils from "src/Root/import/ratanutils";

import { WorkflowActionExtraOptions } from "../../common/interface";
import { SplitActionType, SplitCashflowState } from "./common/interface";
import { canBeAmendSplitting, canBeSplitting, canBeUnSplitting, isSplitStartCashflow, splittingCashflow, splittingCashflowRightMenu } from "./SplittingCashflowRightMenu";

describe("canBeSplitting", () => {
  const baseCashflow = {
    Cashflow: {
      Cashflow_State: SplitCashflowState.WAITING,
      Splitting_Id: undefined,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });



  it("should return true when has permission, state is available, and Splitting_Id is empty", () => {
    expect(canBeSplitting({ ...baseCashflow, Cashflow: { ...baseCashflow.Cashflow, Cashflow_Event_Type: "New" } })).toBe(true);
    expect(
      canBeSplitting({
        Cashflow: { Cashflow_State: SplitCashflowState.READY, Splitting_Id: "", Cashflow_Event_Type: "New" },
      })
    ).toBe(true);
  });

  it("should return false when no permission", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockReturnValue(false);
    expect(canBeSplitting({ ...baseCashflow })).toBe(false);
  });

  it("should return false when Splitting_Id is not empty", () => {
    expect(
      canBeSplitting({
        Cashflow: { Cashflow_State: SplitCashflowState.WAITING, Splitting_Id: "NOT_EMPTY" },
      })
    ).toBe(false);
  });
  it("should return false when Cashflow Event Type is not New", () => {
    expect(
      canBeSplitting({
        Cashflow: { Cashflow_State: SplitCashflowState.WAITING, Splitting_Id: "NOT_EMPTY", Cashflow_Event_Type: "Old" },
      })
    ).toBe(false);
  });
});

describe("canBeUnSplitting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return false when has permission and Splitting_Id exists", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockReturnValue(true);

    expect(
      canBeUnSplitting({
        Cashflow: { Splitting_Id: "SPLIT_ID" },
      })
    ).toBe(false);
  });

  it("should return true when has permission and Splitting_Id exists and Cashflow_Event_Type is New", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockReturnValue(true);

    expect(
      canBeUnSplitting({
        Cashflow: { Splitting_Id: "SPLIT_ID", Cashflow_Event_Type: "New" },
      })
    ).toBe(true);
  });

  it("should return false when no permission", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockReturnValue(false);
    expect(
      canBeUnSplitting({
        Cashflow: { Splitting_Id: "SPLIT_ID" },
      })
    ).toBe(false);
  });

  it("should return false when Splitting_Id is empty", () => {
    expect(
      canBeUnSplitting({
        Cashflow: { Splitting_Id: "" },
      })
    ).toBeFalsy();
  });
  it("should return false when Cashflow_State is in blacklist", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockReturnValue(true);

    const cashflow = {
      Cashflow: {
        Splitting_Id: "SPLIT_ID",
        Cashflow_State: SplitCashflowState.RELEASED,
      },
    };
    expect(canBeUnSplitting(cashflow)).toBe(false);
  });
  it("should return false when Cashflow_State is not in blacklist", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockReturnValue(true);

    const cashflow = {
      Cashflow: {
        Splitting_Id: "SPLIT_ID",
        Cashflow_State: SplitCashflowState.WAITING,
      },
    };
    expect(canBeUnSplitting(cashflow)).toBe(false);
  });
  it("should return true when Cashflow_State is not in blacklist and cashflow event type is new", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockReturnValue(true);

    const cashflow = {
      Cashflow: {
        Splitting_Id: "SPLIT_ID",
        Cashflow_State: SplitCashflowState.WAITING,
        Cashflow_Event_Type: "New"
      },
    };
    expect(canBeUnSplitting(cashflow)).toBe(true);
  });
});


describe("canBeAmendSplitting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return false when has permission, state is WAITING, and Splitting_Id exists", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockReturnValue(true);

    expect(
      canBeAmendSplitting({
        Cashflow: {
          Cashflow_State: SplitCashflowState.WAITING,
          Splitting_Id: "SPLIT_ID",
        },
      })
    ).toBe(false);
  });

  it("should return true when has permission, state is WAITING, and Splitting_Id exists and event type is new", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockReturnValue(true);

    expect(
      canBeAmendSplitting({
        Cashflow: {
          Cashflow_State: SplitCashflowState.WAITING,
          Splitting_Id: "SPLIT_ID",
          Cashflow_Event_Type: "New"
        },
      })
    ).toBe(true);
  });

  it("should return false when no permission", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockReturnValue(false);
    expect(
      canBeAmendSplitting({
        Cashflow: {
          Cashflow_State: SplitCashflowState.WAITING,
          Splitting_Id: "SPLIT_ID",
        },
      })
    ).toBe(false);
  });

  it("should return false when state is not WAITING", () => {

    expect(
      canBeAmendSplitting({
        Cashflow: {
          Cashflow_State: SplitCashflowState.READY,
          Splitting_Id: "SPLIT_ID",
        },
      })
    ).toBe(false);
  });

  it("should return false when Splitting_Id is empty", () => {
    expect(
      canBeAmendSplitting({
        Cashflow: {
          Cashflow_State: SplitCashflowState.WAITING,
          Splitting_Id: "",
        },
      })
    ).toBe(false);
  });
});

describe("splitCashflowRightMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return split menu when all selected rows can be split and user has permission", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockImplementation((permission) => {
      return permission === "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Perform_Ad_Hoc_Netting";
    });
    const dispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };

    const makerCashflowData = {
      Cashflow: {
        Cashflow_State: SplitCashflowState.WAITING,
        Splitting_Id: undefined,
        Cashflow_Event_Type: "New",
        Trade_Original_Source_System_Name: "",
        Netting_Id: ""
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: makerCashflowData as CNCashflow,
      },
      api: {
        getSelectedRows: () => [
          makerCashflowData
        ],
      },
    };

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

    const menu =
      splittingCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      );

    const { name, action } = menu[0];
    expect(name).toBe("Split Cashflow");

    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();

  });

  it("should return split menu when all selected rows can be amend split and user has permission", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockImplementation((permission) => {
      return permission === "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Perform_Ad_Hoc_Netting";
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

    const dispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };

    const makerCashflowData = {
      Cashflow: {
        Cashflow_State: SplitCashflowState.WAITING,
        Splitting_Id: "123",
        Cashflow_Event_Type: "New",
        Trade_Original_Source_System_Name: "",
        Netting_Id: "",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: makerCashflowData,
      },
      api: {
        getSelectedRows: () => [
          makerCashflowData
        ],
      },
    };



    const menu =
      splittingCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      );

    const { name, action } = menu[0];
    expect(name).toBe("Amend Split Amount");

    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();

  });
  it("should return split menu when all selected rows can be un split and user has permission", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockImplementation((permission) => {
      return permission === "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Perform_Un_Net_Initiate";
    });
    const dispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };

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

    const makerCashflowData = {
      Cashflow: {
        Cashflow_State: SplitCashflowState.WAITING,
        Splitting_Id: "123",
        Cashflow_Event_Type: "New",
        Trade_Original_Source_System_Name: "",
        Netting_Id: "",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: makerCashflowData,
      },
      api: {
        getSelectedRows: () => [
          makerCashflowData
        ],
      },
    };

    const menu =
      splittingCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      );

    const { name, action } = menu[0];
    expect(name).toBe("Un-Split Cashflow");

    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();

  });
  it("should return split menu when all selected rows can be un split and user has permission", () => {
    vi.spyOn(ratanUtils, "hasPermission").mockImplementation((permission) => {
      return permission === "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Perform_Un_Net_Initiate";
    });
    const dispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };

    const makerCashflowData = {
      Cashflow: {
        Cashflow_State: SplitCashflowState.WAITING,
        Splitting_Id: "123",
        Cashflow_Event_Type: "New",
        Trade_Original_Source_System_Name: "",
        Netting_Id: "",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: [],
      },
      api: {
        getSelectedRows: () => [],
      },
    };

    const menu =
      splittingCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      );

    expect(menu).toEqual([]);
  });
});

describe("isSplitStartCashflow", () => {
  it("should return true if Cashflow_Id starts with S", () => {
    const data = { Cashflow: { Cashflow_Id: "S123456" } };
    expect(isSplitStartCashflow(data)).toBe(true);
  });

  it("should return false if Cashflow_Id does not start with S", () => {
    const data = { Cashflow: { Cashflow_Id: "A123456" } };
    expect(isSplitStartCashflow(data)).toBe(false);
  });
});

describe("splittingCashflow", () => {
  it("should dispatch splitingCashflowAction with correct payload", async () => {
    const mockDispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch: mockDispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const mockData = { Cashflow: { Cashflow_Id: "S123" } };

    await splittingCashflow(mockData, mockWorkflowActionExtraOptions, SplitActionType.MANUAL_SPLIT);

    expect(mockDispatch).toHaveBeenCalled();
  });
});
