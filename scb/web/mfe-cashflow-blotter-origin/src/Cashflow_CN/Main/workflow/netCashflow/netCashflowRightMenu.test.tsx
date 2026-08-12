import { GetContextMenuItemsParams, IMenuActionParams} from "ag-grid-community";
import { message, Modal } from "antd";
import _merge from "lodash/merge";
import { logger } from "src/Root/import/ratanutils";

import { CcilNettingCashflow1, CcilNettingCashflow2, mockCashflow1, mockCashflow2, mockCashflow4LoanIQ,mockCashflow5LoanIQ } from "../../../test/mockData/cashflow";
import { WorkflowActionExtraOptions } from "../../common/interface";
import { netCashflowRightMenu } from "./netCashflowRightMenu";

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

describe("Net Cashflow Right Menu", () => {
  it("Net Selected Cashflow", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const makerCashflowData = {
      Cashflow_Sub_Status: "Pending Operator",
      Cashflow_Sub_Status_Type: "NSTP Release",
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, makerCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(mockCashflow1, makerCashflowData),
          _merge(mockCashflow1, makerCashflowData),
        ],
      },
    };
    const { name, action } =
      netCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) ?? {};
    expect(name).toBe("Net Selected Cashflow");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("CCIL Net Selected Cashflow", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const mockAggridContextMenuItemParams = {
      api: {
        getSelectedRows: () => [
          CcilNettingCashflow1,
          CcilNettingCashflow2,
        ],
      },
    };
    const { name, action } =
      netCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) ?? {};
    expect(name).toBe("CCIL Net Selected Cashflow");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("Normal and CCIL cannot Netting", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const makerCashflowData = {
      Cashflow_Sub_Status: "Pending Operator",
      Cashflow_Sub_Status_Type: "NSTP Release",
    };
    const mockAggridContextMenuItemParams = {
      api: {
        getSelectedRows: () => [
          _merge(mockCashflow1, makerCashflowData),
         CcilNettingCashflow1,
        ],
      },
    };
    const { name } =
      netCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) ?? {};
    expect(name).toBe(undefined);
  });
  it("IRS Net Selected Cashflow", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const makerCashflowData = {
      Data_Flow: { Data_Source_System: "Stella" },
      Instrument_Common: {
        ISDA_Taxonomy: "InterestRate:IRSwap:FixedFloat",
        Source_System_Instrument_Sub_Type: "IRD|IRS|",
      },
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, makerCashflowData),
      },
      api: {
        getSelectedRows: () => [
          _merge(mockCashflow1, makerCashflowData),
          _merge(mockCashflow1, makerCashflowData),
        ],
      },
    };
    const { name, action } =
      netCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Net Selected Cashflow");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
  it("validation error Net Selected Cashflow", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const makerCashflowData = {
      Cashflow_Sub_Status: "Pending Operator",
      Cashflow_Sub_Status_Type: "NSTP Release",
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, makerCashflowData),
      },
      api: {
        getSelectedRows: () => [mockCashflow1, mockCashflow2],
      },
    };
    const { name, action } =
      netCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Net Selected Cashflow");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(logger.info).toHaveBeenCalled();
  });
  it("validation error CCIL Net Selected Cashflow", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const mockAggridContextMenuItemParams = {
      api: {
        getSelectedRows: () => [CcilNettingCashflow1, CcilNettingCashflow2],
      },
    };
    const { name, action } =
      netCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("CCIL Net Selected Cashflow");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(logger.info).toHaveBeenCalled();
  });
  it("validation error as LoanIQ Validation Failed for CCIL Net Selected Cashflow", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const mockAggridContextMenuItemParams = {
      api: {
        getSelectedRows: () => [CcilNettingCashflow1, mockCashflow4LoanIQ],
      },
    };
    const { name, action } =
      netCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("CCIL Net Selected Cashflow");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(logger.info).toHaveBeenCalled();
  });
  it("validation error for LoanIQ Validation Failed for Net Selected Cashflow", async () => {
    const dispatch = jest.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const makerCashflowData = {
      Cashflow_Sub_Status: "Pending Operator",
      Cashflow_Sub_Status_Type: "NSTP Release",
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: _merge(mockCashflow1, makerCashflowData),
      },
      api: {
        getSelectedRows: () => [mockCashflow1, mockCashflow5LoanIQ],
      },
    };
    const { name, action } =
      netCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Net Selected Cashflow");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(logger.info).toHaveBeenCalled();
  });
});