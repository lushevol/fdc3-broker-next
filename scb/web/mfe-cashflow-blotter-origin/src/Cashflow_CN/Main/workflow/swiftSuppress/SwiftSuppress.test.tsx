/*
 * @Date: 2023-05-22 16:34:02
 * @LastEditors: Shuai,Lu
 * @LastEditTime: 2023-10-26 13:33:46
 */
import { fireEvent, renderWithProviders,userEvent } from "@Test/test-utils";
import { GetContextMenuItemsParams, IMenuActionParams } from "ag-grid-community";
import { message, Modal } from "antd";
import dayjs from "dayjs";
import _merge from "lodash/merge";
import { useDispatch } from "react-redux";
import { get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN } from "src/Root/analysis/const";
import { getUser } from "src/Root/import/ratanutils";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import { mockCashflow1 } from "../../../test/mockData/cashflow";
import { WorkflowActionExtraOptions } from "../../common/interface";
import preloadState from "../../store/state";
import { ActionType } from "./interface";
import {
  actionNameMapping,
  checkRightMenuActionValidate,
  isChecker,
  isSuppressionForFailed,
  StyledAlert,
  swiftSuppressRightMenu,
  SwiftSuppressWrap,
} from "./SwiftSuppress";

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
  aggridDeselectAll: jest.fn(),
  suppressWorkflowAction: jest.fn(),
  updateCashflow: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));
jest.mock("src/Cashflow_CN/services/graphql", () => {
  return {
    queryCashflow: jest.fn(async () => ({
      cashflowUltraQuery: {
        results: [],
      },
    })),
  };
});

describe("Swift Suppress Right Menu", () => {
  it("should be in the document", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const swiftSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, swiftSuppressCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(mockCashflow1, swiftSuppressCashflowData),
        ],
      },
    };
    const rm =
      swiftSuppressRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || [];
    const { name, action } = rm[0];
    expect(name).toBe("Swift Suppression");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
});

describe("Swift Suppress Dialog", () => {
  let dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(dispatch);
  });
  it("should be in the document", async () => {
    const swiftSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const { queryByTestId, getByTestId } = renderWithProviders(
      <ThemeProvider>
        <SwiftSuppressWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          suppressWorkflow: {
            isOpenDialog: true,
            action: "SwiftSuppressionMaker",
            data: [_merge(mockCashflow1, swiftSuppressCashflowData)],
          },
        },
      }
    );
    expect(queryByTestId("swift_suppression")).toBeInTheDocument();
    userEvent.type(getByTestId("addCommentText"), "suppress");
    const submitBtn = getByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN("swift_suppression"));
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);
    const closeIcon = getByTestId("MuiDialog-close-btn");
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
  });
});

describe("Verify Swift Suppression Right Menu", () => {
  it("should be in the document", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const verifySwiftSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
        Cashflow_Sub_State: "Pending Verification",
        Cashflow_Sub_State_Type: "Swift Suppression",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, verifySwiftSuppressCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(mockCashflow1, verifySwiftSuppressCashflowData),
        ],
      },
    };
    const rm =
      swiftSuppressRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || [];
    const { name, action } = rm[0];
    expect(name).toBe("Verify Swift Suppression");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
});

describe("Undo Swift Suppression Right Menu", () => {
  it("should be in the document", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const undoSwiftSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "SWIFT_SUPPRESSED",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, undoSwiftSuppressCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(mockCashflow1, undoSwiftSuppressCashflowData),
        ],
      },
    };
    const rm =
      swiftSuppressRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || [];
    const { name, action } = rm[0];
    expect(name).toBe("Undo Swift Suppression");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
});

describe("Verify Undo Swift Suppression Right Menu", () => {
  it("should be in the document", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const undoSwiftSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
        Cashflow_Sub_State: "Pending Verification",
        Cashflow_Sub_State_Type: "Undo Swift Suppression",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, undoSwiftSuppressCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(mockCashflow1, undoSwiftSuppressCashflowData),
        ],
      },
    };
    const rm =
      swiftSuppressRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || [];
    const { name, action } = rm[0];
    expect(name).toBe("Verify Undo Swift Suppression");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
});

describe("Confirm Suppression Right Menu", () => {
  it("should be in the document", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const undoSwiftSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
        Cashflow_Sub_State_Type: "Cashflow Suppression",
        Cashflow_Sub_State: "Pending Verification",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, undoSwiftSuppressCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(mockCashflow1, undoSwiftSuppressCashflowData),
        ],
      },
    };
    const rm =
      swiftSuppressRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || [];
    const { name, action } = rm[0];
    expect(name).toBe("Confirm Suppression");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
});

describe("Un-Suppress Cashflow Right Menu", () => {
  it("should be in the document", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const unSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "CASHFLOW_SUPPRESSED",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, unSuppressCashflowData),
      },
      api: {
        getSelectedRows: () => [_merge(mockCashflow1, unSuppressCashflowData)],
      },
    };
    const rm =
      swiftSuppressRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || [];
    const { name, action } = rm[0];
    expect(name).toBe("Un-Suppress Cashflow");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
});

describe("Confirm Un-Suppression Right Menu", () => {
  it("should be in the document", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const confirmUnSuppressCashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
        Cashflow_Sub_State_Type: "Undo Cashflow Suppression",
        Cashflow_Sub_State: "Pending Verification",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, confirmUnSuppressCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(mockCashflow1, confirmUnSuppressCashflowData),
        ],
      },
    };
    const rm =
      swiftSuppressRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || [];
    const { name, action } = rm[0];
    expect(name).toBe("Confirm Un-Suppression");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
});

it("when different payment type", async () => {
  const dispatch = jest.fn();
  const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
    dispatch,
    messageApi: message,
    modalApi: Modal,
  };
  const confirmUnSuppressCashflowData = {
    Cashflow: {
      Cashflow_State: "WAITING",
      Cashflow_Sub_State_Type: "Undo Cashflow Suppression",
      Cashflow_Sub_State: "Pending Verification",
    },
  };
  const swiftSuppressCashflowData = {
    Cashflow: {
      Cashflow_State: "PROJECTED",
    },
  };
  const mockAggridContextMenuItemParams = {
    node: {
      data: _merge(mockCashflow1, confirmUnSuppressCashflowData),
    },
    api: {
      getSelectedRows: () => [
        _merge(mockCashflow1, confirmUnSuppressCashflowData),
        _merge(mockCashflow1, swiftSuppressCashflowData),
      ],
    },
  };
  const rm =
    swiftSuppressRightMenu(
      mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
      mockWorkflowActionExtraOptions
    ) || [];
  expect(rm).toEqual([]);
});

describe("isSuppressionForFailed", () => {
  it("should return true if Cashflow_State is FAILED and Payment_Date is before today", () => {
    const cashflow = {
      Cashflow: {
        Cashflow_State: "FAILED",
        Payment_Date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
      },
    };
    expect(isSuppressionForFailed(cashflow)).toBe(true);
  });

  it("should return false if Cashflow_State is FAILED but Payment_Date is today", () => {
    const cashflow = {
      Cashflow: {
        Cashflow_State: "FAILED",
        Payment_Date: dayjs().format("YYYY-MM-DD"),
      },
    };
    expect(isSuppressionForFailed(cashflow)).toBe(false);
  });

  it("should return false if Cashflow_State is FAILED but Payment_Date is in the future", () => {
    const cashflow = {
      Cashflow: {
        Cashflow_State: "FAILED",
        Payment_Date: dayjs().add(1, "day").format("YYYY-MM-DD"),
      },
    };
    expect(isSuppressionForFailed(cashflow)).toBe(false);
  });

  it("should return false if Cashflow_State is not FAILED but Payment_Date is before today", () => {
    const cashflow = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
        Payment_Date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
      },
    };
    expect(isSuppressionForFailed(cashflow)).toBe(false);
  });

  it("should return false if Cashflow_State is not FAILED and Payment_Date is today", () => {
    const cashflow = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
        Payment_Date: dayjs().format("YYYY-MM-DD"),
      },
    };
    expect(isSuppressionForFailed(cashflow)).toBe(false);
  });

  it("should return false if Cashflow_State is not FAILED and Payment_Date is in the future", () => {
    const cashflow = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
        Payment_Date: dayjs().add(1, "day").format("YYYY-MM-DD"),
      },
    };
    expect(isSuppressionForFailed(cashflow)).toBe(false);
  });

  it("should return false if Cashflow object is undefined", () => {
    const cashflow = {};
    expect(isSuppressionForFailed(cashflow as any)).toBe(false);
  });

  it("should return false if Payment_Date is undefined", () => {
    const cashflow = {
      Cashflow: {
        Cashflow_State: "FAILED",
      },
    };
    expect(isSuppressionForFailed(cashflow as any)).toBe(false);
  });

  it("should return false if Cashflow_State is undefined", () => {
    const cashflow = {
      Cashflow: {
        Payment_Date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
      },
    };
    expect(isSuppressionForFailed(cashflow as any)).toBe(false);
  });
});

describe("actionNameMapping", () => {
  it("should return 'Swift Suppression' for 'SwiftSuppressionMaker'", () => {
    expect(actionNameMapping("SwiftSuppressionMaker")).toBe("Swift Suppression");
  });

  it("should return 'Verify Swift Suppression' for 'SwiftSuppressionChecker'", () => {
    expect(actionNameMapping("SwiftSuppressionChecker")).toBe("Verify Swift Suppression");
  });

  it("should return 'Undo Swift Suppression' for 'UndoSwiftSuppressionMaker'", () => {
    expect(actionNameMapping("UndoSwiftSuppressionMaker")).toBe("Undo Swift Suppression");
  });

  it("should return 'Verify Undo Swift Suppression' for 'UndoSwiftSuppressionChecker'", () => {
    expect(actionNameMapping("UndoSwiftSuppressionChecker")).toBe("Verify Undo Swift Suppression");
  });

  it("should return 'Suppress Cashflow' for 'CashflowSuppressionMaker'", () => {
    expect(actionNameMapping("CashflowSuppressionMaker")).toBe("Suppress Cashflow");
  });

  it("should return 'Confirm Suppression' for 'CashflowSuppressionChecker'", () => {
    expect(actionNameMapping("CashflowSuppressionChecker")).toBe("Confirm Suppression");
  });

  it("should return 'Un-Suppress Cashflow' for 'CashflowUnSuppressionMaker'", () => {
    expect(actionNameMapping("CashflowUnSuppressionMaker")).toBe("Un-Suppress Cashflow");
  });

  it("should return 'Confirm Un-Suppression' for 'CashflowUnSuppressionChecker'", () => {
    expect(actionNameMapping("CashflowUnSuppressionChecker")).toBe("Confirm Un-Suppression");
  });

  it("should return an empty string for an unknown action type", () => {
    expect(actionNameMapping("UnknownAction" as any)).toBe("");
  });

  it("should return an empty string for an undefined action type", () => {
    expect(actionNameMapping(undefined as any)).toBe("");
  });

  it("should return an empty string for a null action type", () => {
    expect(actionNameMapping(null as any)).toBe("");
  });

  it("should return an empty string for an empty string action type", () => {
    expect(actionNameMapping("" as any)).toBe("");
  });
});

describe("isChecker", () => {
  it("should return true if all actions are checker actions", () => {
    const actions: ActionType[] = [
      "UndoSwiftSuppressionChecker",
      "SwiftSuppressionChecker",
      "CashflowUnSuppressionChecker",
      "CashflowSuppressionChecker",
    ];
    expect(isChecker(actions)).toBe(true);
  });

  it("should return false if any action is not a checker action", () => {
    const actions: ActionType[] = [
      "UndoSwiftSuppressionChecker",
      "SwiftSuppressionChecker",
      "CashflowUnSuppressionChecker",
      "SwiftSuppressionMaker",
    ];
    expect(isChecker(actions)).toBe(false);
  });

  it("should return false if the actions array is empty", () => {
    const actions: ActionType[] = [];
    expect(isChecker(actions)).toBe(false);
  });

  it("should return false if the actions array contains undefined values", () => {
    const actions: ActionType[] = [
      "UndoSwiftSuppressionChecker",
      undefined as any,
    ];
    expect(isChecker(actions)).toBe(false);
  });

  it("should return false if the actions array contains null values", () => {
    const actions: ActionType[] = [
      "UndoSwiftSuppressionChecker",
      null as any,
    ];
    expect(isChecker(actions)).toBe(false);
  });

  it("should return false if the actions array contains an empty string", () => {
    const actions: ActionType[] = [
      "UndoSwiftSuppressionChecker",
      "" as any,
    ];
    expect(isChecker(actions)).toBe(false);
  });

  it("should return false if the actions array contains an invalid action type", () => {
    const actions: ActionType[] = [
      "UndoSwiftSuppressionChecker",
      "InvalidAction" as any,
    ];
    expect(isChecker(actions)).toBe(false);
  });

  it("should return true if all actions are valid checker actions, even with duplicates", () => {
    const actions: ActionType[] = [
      "UndoSwiftSuppressionChecker",
      "UndoSwiftSuppressionChecker",
      "SwiftSuppressionChecker",
    ];
    expect(isChecker(actions)).toBe(true);
  });
});

describe("checkRightMenuActionValidate", () => {
  it("should return disabled as true and a tooltip if maker and checker are the same account", () => {
    const mockCashflow = [
      {
        Cashflow: {
          Cashflow_Id: "123",
          Cashflow_Sub_State_Updater: getUser().id,
          Cashflow_State: "WAITING",
          Cashflow_Sub_State_Type: "Swift Suppression",
          Cashflow_Sub_State: "Pending Verification",
        },
      },
    ];
    const result = checkRightMenuActionValidate(mockCashflow as any);
    expect(result.disabled).toBe(true);
    expect(result.tooltip).toBe(
      "For Cashflow 123, Maker and checker cannot be the same account"
    );
  });

  it("should return disabled as false if maker and checker are not the same account", () => {
    const mockCashflow = [
      {
        Cashflow: {
          Cashflow_Id: "123",
          Cashflow_Sub_State_Updater: "differentUserId",
          Cashflow_State: "WAITING",
          Cashflow_Sub_State_Type: "Swift Suppression",
          Cashflow_Sub_State: "Pending Verification",
        },
      },
    ];
    const result = checkRightMenuActionValidate(mockCashflow as any);
    expect(result.disabled).toBe(false);
    expect(result.tooltip).toBeUndefined();
  });

  it("should return disabled as false if no cashflows are provided", () => {
    const result = checkRightMenuActionValidate([]);
    expect(result.disabled).toBe(false);
    expect(result.tooltip).toBeUndefined();
  });

  it("should return disabled as false if no maker-checker conflict exists", () => {
    const mockCashflow = [
      {
        Cashflow: {
          Cashflow_Id: "123",
          Cashflow_Sub_State_Updater: "differentUserId",
          Cashflow_State: "PROJECTED",
        },
      },
    ];
    const result = checkRightMenuActionValidate(mockCashflow as any);
    expect(result.disabled).toBe(false);
    expect(result.tooltip).toBeUndefined();
  });

  it("should handle multiple cashflows with mixed maker-checker conflicts", () => {
    const mockCashflow = [
      {
        Cashflow: {
          Cashflow_Id: "123",
          Cashflow_Sub_State_Updater: getUser().id,
          Cashflow_State: "WAITING",
          Cashflow_Sub_State_Type: "Swift Suppression",
          Cashflow_Sub_State: "Pending Verification",
        },
      },
      {
        Cashflow: {
          Cashflow_Id: "456",
          Cashflow_Sub_State_Updater: "differentUserId",
          Cashflow_State: "PROJECTED",
        },
      },
    ];
    const result = checkRightMenuActionValidate(mockCashflow as any);
    expect(result.disabled).toBe(true);
    expect(result.tooltip).toBe(
      "For Cashflow 123, Maker and checker cannot be the same account"
    );
  });

  it("should return disabled as false if no actions are checker actions", () => {
    const mockCashflow = [
      {
        Cashflow: {
          Cashflow_Id: "123",
          Cashflow_Sub_State_Updater: getUser().id,
          Cashflow_State: "PROJECTED",
        },
      },
    ];
    const result = checkRightMenuActionValidate(mockCashflow as any);
    expect(result.disabled).toBe(false);
    expect(result.tooltip).toBeUndefined();
  });

  it("should return disabled as false if Cashflow_Sub_State_Updater is undefined", () => {
    const mockCashflow = [
      {
        Cashflow: {
          Cashflow_Id: "123",
          Cashflow_Sub_State_Updater: undefined,
          Cashflow_State: "WAITING",
          Cashflow_Sub_State_Type: "Swift Suppression",
          Cashflow_Sub_State: "Pending Verification",
        },
      },
    ];
    const result = checkRightMenuActionValidate(mockCashflow as any);
    expect(result.disabled).toBe(false);
    expect(result.tooltip).toBeUndefined();
  });

  it("should return disabled as false if Cashflow_State is undefined", () => {
    const mockCashflow = [
      {
        Cashflow: {
          Cashflow_Id: "123",
          Cashflow_Sub_State_Updater: getUser().id,
          Cashflow_State: undefined,
        },
      },
    ];
    const result = checkRightMenuActionValidate(mockCashflow as any);
    expect(result.disabled).toBe(false);
    expect(result.tooltip).toBeUndefined();
  });

  it("should return disabled as false if Cashflow_Sub_State_Type is undefined", () => {
    const mockCashflow = [
      {
        Cashflow: {
          Cashflow_Id: "123",
          Cashflow_Sub_State_Updater: getUser().id,
          Cashflow_State: "WAITING",
          Cashflow_Sub_State_Type: undefined,
        },
      },
    ];
    const result = checkRightMenuActionValidate(mockCashflow as any);
    expect(result.disabled).toBe(false);
    expect(result.tooltip).toBeUndefined();
  });

  it("should return disabled as false if Cashflow_Sub_State is undefined", () => {
    const mockCashflow = [
      {
        Cashflow: {
          Cashflow_Id: "123",
          Cashflow_Sub_State_Updater: getUser().id,
          Cashflow_State: "WAITING",
          Cashflow_Sub_State: undefined,
        },
      },
    ];
    const result = checkRightMenuActionValidate(mockCashflow as any);
    expect(result.disabled).toBe(false);
    expect(result.tooltip).toBeUndefined();
  });
});

describe("StyledAlert Component", () => {
  it("should display the correct message", () => {
    const { getByText } = renderWithProviders(
      <ThemeProvider>
        <StyledAlert message="This is a test message" type="error" />
      </ThemeProvider>
    );
    expect(getByText("This is a test message")).toBeInTheDocument();
  });

  it("should render without crashing when no additional props are provided", () => {
    const { container } = renderWithProviders(
      <ThemeProvider>
        <StyledAlert message="Default Alert" type="error" />
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it("should apply additional styles passed via props", () => {
    const { getByRole } = renderWithProviders(
      <ThemeProvider>
        <StyledAlert
          message="Styled Alert"
          type="error"
          style={{ marginBottom: "20px" }}
        />
      </ThemeProvider>
    );
    const alert = getByRole("alert");
    expect(alert).toHaveStyle("margin-bottom: 20px");
  });

  it.skip("should not render if no message is provided", () => {
    const { queryByRole } = renderWithProviders(
      <ThemeProvider>
        <StyledAlert message="" type="error" />
      </ThemeProvider>
    );
    expect(queryByRole("alert")).not.toBeInTheDocument();
  });

  it.skip("should render with the correct type attribute", () => {
    const { getByRole } = renderWithProviders(
      <ThemeProvider>
        <StyledAlert message="Error Alert" type="error" />
      </ThemeProvider>
    );
    const alert = getByRole("alert");
    expect(alert).toHaveAttribute("type", "error");
  });
});


