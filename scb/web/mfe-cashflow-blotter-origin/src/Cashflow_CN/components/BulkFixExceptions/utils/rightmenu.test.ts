import { GetContextMenuItemsParams } from "ag-grid-community";
import { message, Modal } from "antd";
import _cloneDeep from "lodash/cloneDeep";
import _merge from "lodash/merge";
import { WorkflowActionExtraOptions } from "src/Cashflow_CN/Main/common/interface";
import { mockCashflow1, mockCashflow2, mockCashflow3 } from "src/Cashflow_CN/test/mockData/cashflow";
import { mockMenuActionParams } from "src/test/mockUtils/aggrid";
import { fn } from "src/test/test-utils";

import { BulkUserType } from "../type";
import { bulkRightMenu,bulkRightmenuAction, bulkRightmenuConsistencyValidation, getBulkActionName, getUserType } from "./rightmenu";

describe('Bulk Fix Exceptions - rightmenu', () => {
  it("getBulkActionName", () => {
    const res = getBulkActionName(BulkUserType.Maker);
    expect(res).toBe("Bulk Submit");
    const res2 = getBulkActionName(BulkUserType.Checker);
    expect(res2).toBe("Bulk Approve");
    const res3 = getBulkActionName("");
    expect(res3).toBe("Bulk Submit/Approve");
  });
  it("getUserType", () => {
    const res = getUserType(mockCashflow1);
    expect(res).toBe(BulkUserType.Checker);
  });
  it("bulkRightmenuConsistencyValidation", () => {
    const res = bulkRightmenuConsistencyValidation([
        mockCashflow1,
        mockCashflow2,
    ]);
    expect(res.valid).toBe(false);
    const mockCashflow4 = {  
      Entity: {
        Counterparty_SCI_FMCODE: "400640613",
      }
    }
    const res2 = bulkRightmenuConsistencyValidation([
      mockCashflow1,
      _merge(_cloneDeep(mockCashflow1), mockCashflow4),
    ]);
    expect(res2.valid).toBe(false);
    const mockCashflow5 = {  
      Entity: {
        Booking_Entity_SCI_FMCODE: "10075222",
      }
    }
    const res3 = bulkRightmenuConsistencyValidation([
      mockCashflow1,
      mockCashflow5,
    ]);
    expect(res3.valid).toBe(false);

    const mockCashflow6 = {  
      Entity: {
        Counterparty_SCI_FMCODE: null,
        Booking_Entity_SCI_FMCODE: "10075222",
      }
    }
    const res4 = bulkRightmenuConsistencyValidation([
      mockCashflow1,
      mockCashflow6,
    ]);
    expect(res4.valid).toBe(false);
  });
  it("bulkRightmenuAction", () => {
    const mockCallback = fn();
    const res = bulkRightmenuAction([mockCashflow1], mockCallback);
    expect(res).toBeNull();
    const res2 = bulkRightmenuAction([mockCashflow1, mockCashflow3], mockCallback);
    expect(res2).toBeDefined();
    expect(res2!.name).toBe("Bulk Approve");
    expect(res2!.disabled).toBe(false);
    res2!.action!(mockMenuActionParams());
    expect(mockCallback).toHaveBeenCalled();
    const res3 = bulkRightmenuAction([mockCashflow1,mockCashflow2], mockCallback);
    expect(res3).toBeNull();
    const mockCashflow4 = {  
      Cashflow: {
        Cashflow_Id: "008690236385",
        Cashflow_State: "WAITING",
        Cashflow_Sub_State: "Pending Exception",
        Cashflow_Sub_State_Type: "Pending Exception",
      }
    }
    const res4 = bulkRightmenuAction([mockCashflow1,mockCashflow4], mockCallback);
    expect(res4).toBeNull();
  });
  it("bulkRightMenu", () => {
    const mockParam = {
      api: {
        getSelectedRows: jest.fn().mockReturnValue([mockCashflow1, mockCashflow3]),
      },
    };
    const mockOptions: WorkflowActionExtraOptions = {
      messageApi: message,
      dispatch: jest.fn(),
      modalApi: Modal,
    };
  
    bulkRightMenu(mockParam  as unknown as GetContextMenuItemsParams, mockOptions);
  
    expect(mockParam.api?.getSelectedRows).toHaveBeenCalled();
  });
});