import { renderWithProviders, screen } from "@Test/test-utils";
import userEvent from "@testing-library/user-event";
import { GetContextMenuItemsParams, IMenuActionParams } from "ag-grid-community";
import { message, Modal } from "antd";
import _merge from "lodash/merge";
import { useDispatch } from "react-redux";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import { mockCashflow1 } from "../../../test/mockData/cashflow";
import { WorkflowActionExtraOptions } from "../../common/interface";
import preloadState from "../../store/state";
import {
  failedRightMenu,
  FailedWrap,
  onClickAction
} from "./FailedWrap";

jest.mock("src/Cashflow_CN/components/CommonCommentAction", () => {
  const mockComponent = ({
    children,
    title,
    testId,
    onSubmit,
    onReject,
    onClose,
  }) => {
    return <div data-testid={testId}>
      <span>{title}</span>
      <button data-testid="test-submit" onClick={(_e) => onSubmit?.("test")}>submit</button>
      <button data-testid="test-reject" onClick={(_e) => onReject?.()} >submit</button>
      <button data-testid="test-close" onClick={(_e) => onClose(true)} >close</button>
      <div>{children}</div>
    </div>
  }
  return {
    __esModule: true,
    default: mockComponent,
  }
});

jest.mock("../../store/actions", () => ({
  aggridDeselectAll: jest.fn(),
  commonCommentActionWorkflowAction: jest.fn(),
  updateCashflow: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

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
jest.mock("src/Cashflow_CN/services/graphql", () => {
  return {
    queryCashflow: jest.fn(async () => ({
      cashflowUltraQuery: {
        results: [],
      },
    })),
  };
});

describe("Manual Failed Right Menu", () => {
  it("should be in the document", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const cashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge({}, mockCashflow1, cashflowData),
      },
      api: {
        getSelectedRows: () => [_merge({}, mockCashflow1, cashflowData)],
      },
    };
    const { name, action } =
      failedRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions,
      ) || {};
    expect(name).toBe("Manual Fail");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("cashflow Can Be Failed In Suppression", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const cashflowData = {
      Cashflow: {
        Cashflow_State: "SWIFT_SUPPRESSED",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, cashflowData),
      },
      api: {
        getSelectedRows: () => [_merge(mockCashflow1, cashflowData)],
      },
    };
    const { name, action } =
      failedRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions,
      ) || {};

    expect(name).toBe("Manual Fail");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("selectedRows more than 1 allow do bulk for Manual Fail ", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const cashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
      },
    };
    const cashflowData1 = {
      Cashflow: {
        Cashflow_Id: "008623638511",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, cashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge({}, mockCashflow1, cashflowData),
          _merge({}, mockCashflow1, cashflowData1),
        ],
      },
    };
    const { name } =
      failedRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions,
      ) || {};

    expect(name).toBe("Manual Fail");
  });
  it("should return hoverRow data when no rows are selected", () => {
    const cashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
      },
    };
    const param = {
      node: {
        data: _merge(mockCashflow1, cashflowData),
      },
    };
    const options: WorkflowActionExtraOptions = {
      dispatch: jest.fn(),
      messageApi: message,
      modalApi: Modal,
    };
    const { name } = failedRightMenu(param as unknown as GetContextMenuItemsParams, options) || {};
    expect(name).toBe("Manual Fail");
  });
  it("Not all selectRows can do failed action", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const cashflowData = {
      Cashflow: {
        Cashflow_State: "NETTED",
      },
    };
    const cashflowData1 = {
      Cashflow: {
        Cashflow_Id: "008623638511",
        Cashflow_State: "WAITING",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge({}, mockCashflow1, cashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge({}, mockCashflow1, cashflowData),
          _merge({}, mockCashflow1, cashflowData1),
        ],
      },
    };
    const menu =
      failedRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions,
      ) || [];
    expect(menu).toEqual([]);
  });
});

describe("Manual Failed Dialog", () => {
    let dispatch = jest.fn();
  
    beforeEach(() => {
      jest.clearAllMocks();
      (useDispatch as jest.Mock).mockReturnValue(dispatch);
    });
  it("should be in the document", async () => {
    const cashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
      },
    };
    const cashflowData2 = {
      Cashflow: {
        Cashflow_State: "WAITING",
      },
    };
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <FailedWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          commonCommentActionWorkflow: {
            isOpenDialog: true,
            action: "Failed",
            data: [_merge({}, mockCashflow1, cashflowData), cashflowData2],
          },
        },
      }
    );
    expect(queryByTestId("manual_fail")).toBeInTheDocument();
  });
  it("should only dispaly Manual Fail title", async () => {
    const { queryByText } = renderWithProviders(
      <ThemeProvider>
        <FailedWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          commonCommentActionWorkflow: {
            isOpenDialog: true,
            action: "Failed",
            data: [],
          },
        },
      }
    );
    expect(queryByText("cashflows selected")).not.toBeInTheDocument();
  });
  it("Manual Faild Maker should be in the document", async () => {
    const cashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
      },
    };
    const cashflowData2 = {
      Cashflow: {
        Cashflow_State: "WAITING",
      },
    };
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <FailedWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          commonCommentActionWorkflow: {
            isOpenDialog: true,
            action: "Failed",
            data: [_merge({}, mockCashflow1, cashflowData), cashflowData2],
          },
        },
      }
    );
    expect(queryByTestId("manual_fail")).toBeInTheDocument();

    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);


    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);

  });
  it("Manual Faild Checker Approve", async () => {
    const cashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
      },
    };
    const cashflowData2 = {
      Cashflow: {
        Cashflow_State: "WAITING",
      },
    };
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <FailedWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          commonCommentActionWorkflow: {
            isOpenDialog: true,
            action: "ConfirmFailed",
            data: [_merge({}, mockCashflow1, cashflowData), cashflowData2],
          },
        },
      }
    );
    expect(queryByTestId("manual_fail")).toBeInTheDocument();

    const submitBtn = queryByTestId("test-submit");
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);


    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);

  });
  it("Manual Faild Checker Reject", async () => {
    const cashflowData = {
      Cashflow: {
        Cashflow_Sub_State_Type: "Pending Manual Fail",
        Cashflow_Sub_State: "Pending Verification"
      },
    };
    const cashflowData2 = {
      Cashflow: {
        Cashflow_Sub_State_Type: "Pending Manual Fail",
        Cashflow_Sub_State: "Pending Verification"
      },
    };
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <FailedWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          commonCommentActionWorkflow: {
            isOpenDialog: true,
            action: "ConfirmFailed",
            data: [_merge({}, mockCashflow1, cashflowData), cashflowData2],
          },
        },
      }
    );
    expect(queryByTestId("manual_fail")).toBeInTheDocument();

    const rejectBtn = queryByTestId("test-reject");
    expect(rejectBtn).toBeInTheDocument();
    userEvent.click(rejectBtn!);


    const closeBtn = queryByTestId("test-close");
    expect(closeBtn).toBeInTheDocument();
    userEvent.click(closeBtn!);

  });

  it("should show error if selectedRows exceeds MAX_FAIL_COUNT", () => {
    const tooManyRows = Array(1001).fill(mockCashflow1);
    const mockDispatch = jest.fn();
    const menuName = "Manual Fail";
    onClickAction(tooManyRows, menuName, ["Failed"], mockDispatch, message);
    expect(screen).toBeDefined();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

});
