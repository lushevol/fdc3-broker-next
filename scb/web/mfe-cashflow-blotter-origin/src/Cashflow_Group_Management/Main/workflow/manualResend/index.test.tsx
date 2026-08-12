import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { message } from "antd";
import { mockMenuActionParams } from "src/test/mockUtils/aggrid";
import { mockAntdModal } from "src/test/mockUtils/antd-modal";

import { WorkflowActionExtraOptions } from "../../common/interface";
import {
  manualResendRightMenu,
} from "./index";

const mockData = {
  Id: "1680820512538075136",
  Group_Id: "1680820266944798720",
  Trade_Id: "85522598",
  Cashflow_Id: "M00055071708",
  Group_Event: "NA",
  Group_Status: "PENDING",
  Booking_System_Event: null,
  Cashflow_Event_Reason: "",
  Status: "DELIVERED",
  Cashflow_Count: 3,
  Cashflow_Sequence: 2,
  Create_At: "2023-07-17T06:03:32.981161",
  Update_At: "2023-07-17T06:03:32.981161",
  Is_Group_Locked: false,
  Major_Version: 2,
  ratanException: null,
  Cashflow_Status: "READY",
};

afterAll(() => {
  jest.clearAllMocks();
});

describe("Manual Resend Right Menu", () => {
  it("should be in the document", async () => {
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      messageApi: message,
      modalApi: mockAntdModal(),
    };
    const mockAggridContextMenuItemParams = {
      node: {
        data: mockData,
      },
      api: {
        getSelectedRows: () => [],
      },
    };
    const menu = manualResendRightMenu(
      mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
      mockWorkflowActionExtraOptions
    );
    expect(menu).not.toBeNull();
    const { name, action } = menu as MenuItemDef;
    expect(name).toBe("Resend");
    expect(action).toBeDefined();
    action!(mockMenuActionParams());
  });
});
