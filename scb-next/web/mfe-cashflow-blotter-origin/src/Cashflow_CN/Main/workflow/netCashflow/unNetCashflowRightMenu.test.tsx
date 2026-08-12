import { GetContextMenuItemsParams, IMenuActionParams } from "ag-grid-community";
import { message, Modal } from "antd";
import _merge from "lodash/merge";

import { mockCashflow1 } from "../../../test/mockData/cashflow";
import { WorkflowActionExtraOptions } from "../../common/interface";
import {SplitCashflowState} from "../splitting/common/interface";
import {
  unNetCashflowRightMenu,
} from "./unNetCashflowRightMenu";
afterAll(() => {
  vi.clearAllMocks();
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
describe("Net Cashflow Right Menu", () => {
  it("should be in the document", async () => {
    const dispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const makerCashflowData = {
      Cashflow: {
        Netting_Id: "123",
        Cashflow_State: "WAITING",
        Cashflow_Sub_State: "Pending Operator",
      },
      Delivery_Method: "Gross",
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
      unNetCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe("Un-Net Cashflow");
    expect(action).toBeDefined();
    action!(mockIMenuActionParams);
    expect(dispatch).toHaveBeenCalled();
  });
     it("should be in the document", async () => {
    const dispatch = vi.fn();
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: Modal,
    };
    const makerCashflowData = {
      Cashflow: {
        Netting_Id: "123",
        Cashflow_State: SplitCashflowState.SPLIT,
        Cashflow_Sub_State: "Pending Operator",
      },
      Delivery_Method: "Gross",
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
      unNetCashflowRightMenu(
        mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
        mockWorkflowActionExtraOptions
      ) || {};
    expect(name).toBe(undefined);
  });
});
