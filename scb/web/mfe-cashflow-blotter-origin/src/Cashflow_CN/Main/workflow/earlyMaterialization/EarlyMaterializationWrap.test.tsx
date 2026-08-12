import { GetContextMenuItemsParams,IMenuActionParams } from "ag-grid-community";
import { message, Modal } from "antd";
import cloneDeep from "lodash/cloneDeep";
import _merge from "lodash/merge";
import { get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN } from "src/Root/analysis/const";
import { renderWithProviders, userEvent } from "src/test/test-utils";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import { mockCashflow1 } from "../../../test/mockData/cashflow";
import { WorkflowActionExtraOptions } from "../../common/interface";
import preloadState from "../../store/state";
import {
  adhocCommentRightMenu,
  earlyMaterializationRightMenu,
  EarlyMaterializationWrap,
} from "./EarlyMaterializationWrap";

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock("src/Root/common/utils/featureFlagController", () => ({
  featureScopedEnabled: (ec) => true,
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

describe("Early Materialization Right Menu", () => {

  it("Early Materialization branch", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
        ],
      },
    };
    const { name, action } =
      earlyMaterializationRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Early Materialization");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("ReInstate branch", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "FAILED",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
        ],
      },
    };
    const { name, action } =
      earlyMaterializationRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("ReInstate");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("Settle As Gross branch", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
        Cashflow_Sub_State_Type: "Pending Netting",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
        ],
      },
    };
    const { name, action } =
      earlyMaterializationRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Settle As Gross");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("Status Write Back branch", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "RELEASED",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
        ],
      },
    };
    const { name, action } =
      earlyMaterializationRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Status Write Back");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("Resend To Razor branch", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "READY",
        Cashflow_Sub_State_Type: "Pending Ack",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
        ],
      },
    };
    const { name, action } =
      earlyMaterializationRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Resend To Razor");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("Early Release branch", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "READY",
        Cashflow_Sub_State: "NA",
        Cashflow_Sub_State_Type: "NA",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
        ],
      },
    };
    const { name, action } =
      earlyMaterializationRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Early Release");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("Update Affirmation branch", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
        Cashflow_Sub_State_Type: "Pending Exception",
        Cashflow_Affirmation_Status: "Unaffirmed",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
        ],
      },
    };
    const { name, action } =
      earlyMaterializationRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Update Affirmation");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("Multiple Update Affirmation branch", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
        Cashflow_Sub_State_Type: "Pending Exception",
        Cashflow_Affirmation_Status: "Unaffirmed",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
          _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
        ],
      },
    };
    const res =
      earlyMaterializationRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(res).toEqual({});
  });
  it("if api is undefined", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "WAITING",
        Cashflow_Sub_State_Type: "Pending Exception",
        Cashflow_Affirmation_Status: "Unaffirmed",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
      }
    };
    const { name, action } =
      earlyMaterializationRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Update Affirmation");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("Comment branch", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const earlyMaterialCashflowData = {
      Cashflow: {},
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
        ],
      },
    };
    const { name, action } =
      adhocCommentRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Comment");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("Comment branch if param is null", async () => {
    expect(adhocCommentRightMenu(
      null as unknown as GetContextMenuItemsParams,
      {
        dispatch: undefined,
        modalApi: undefined,
        messageApi: undefined
      } as unknown as WorkflowActionExtraOptions
    )).toBeNull();
  });
  it("ReGenerate Swift branch", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "READY",
        Cashflow_Sub_State_Type: "Pending Ack",
        Cashflow_Swift_Message_Standard: "STRATEGIC",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData),
        ],
      },
    };
    const { name, action } =
      earlyMaterializationRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Regenerate Swift");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
});

describe("Early Materialization Dialog", () => {
  it("should be in the document", () => {
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <EarlyMaterializationWrap />,
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          earlyMaterializationWorkflow: {
            isOpenDialog: true,
            action: "Materialize",
            data: [_merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData)],
          },
        },
      }
    );
    expect(queryByTestId("early_materialization")).toBeInTheDocument();
    userEvent.type(queryByTestId("addCommentText")!, "test comment");
    const submitBtn = queryByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN("early_materialization"));
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);
  });
  it("ManualAffirmed", () => {    
    const earlyMaterialCashflowData = {
      Cashflow: {
        Cashflow_State: "PROJECTED",
      },
    };
    const { queryByTestId } = renderWithProviders(
      <ThemeProvider>
        <EarlyMaterializationWrap />,
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          earlyMaterializationWorkflow: {
            isOpenDialog: true,
            action: "ManualAffirmed",
            data: [_merge(cloneDeep(mockCashflow1), earlyMaterialCashflowData)],
          },
        },
      }
    );
    expect(queryByTestId("update_affirmation")).toBeInTheDocument();
    userEvent.type(queryByTestId("addCommentText")!, "test comment");
    const submitBtn = queryByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN("update_affirmation"));
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn!);
  });
});
