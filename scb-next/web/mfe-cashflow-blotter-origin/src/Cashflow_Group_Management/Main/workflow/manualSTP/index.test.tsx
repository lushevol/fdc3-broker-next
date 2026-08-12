import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { message } from "antd";
import { mockMenuActionParams } from "src/test/mockUtils/aggrid";
import { mockAntdModal } from "src/test/mockUtils/antd-modal";

import { postManualSTP } from "../../../services";
import { WorkflowActionExtraOptions } from "../../common/interface";
import {
  manualSTPRightMenu,
  processManualSTPResult
} from "./index";

const mockData = {
  Id: "1680820512538075136",
  Group_Id: "1680820266944798720",
  Trade_Id: "85522598",
  Cashflow_Id: "M00055071708",
  Group_Event: "NA",
  Group_Status: "PENDING",
  Booking_System_Event: "",
  Cashflow_Event_Reason: "",
  Status: "PENDING",
  Cashflow_Count: 3,
  Cashflow_Sequence: 2,
  Create_At: "2023-07-17T06:03:32.981161",
  Update_At: "2023-07-17T06:03:32.981161",
  Is_Group_Locked: false,
  Major_Version: 2,
  Cashflow_Status: "READY",
  Business_Event: "New",
  Business_Version: 0,
  Updated_By: "System",
  Is_Trade_Validated: true,
  Mxg_Trade_Id: "55369396",
  Booking_Entity_Id: "10075222",
  Counterparty_Fm_Id: "300040964",
  Commodity_Flag: null,
  ISDA_Taxonomy: "CURR|FXD|FXD",
  Pay_Direction: "Pay",
  Value_Date: "2025-09-01"
};

const mockCallback = vi.fn();


afterAll(() => {
  vi.clearAllMocks();
});

vi.mock("../../../services", () => {
  return {
    postManualSTP: vi.fn(async () => ([])),
  };
});

describe("Manual STP Right Menu", () => {
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
    const menu = manualSTPRightMenu(
      mockAggridContextMenuItemParams as unknown as GetContextMenuItemsParams,
      mockWorkflowActionExtraOptions,
      vi.fn()
    );
    expect(menu).not.toBeNull();
    const { name, action } = menu as MenuItemDef;
    expect(name).toBe("Manual STP");
    expect(action).toBeDefined();
    action!(mockMenuActionParams());
  });
  it("should return an empty string when param is falsy", () => {
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      messageApi: message,
      modalApi: mockAntdModal(),
    };
    const result = manualSTPRightMenu(null as unknown as GetContextMenuItemsParams, mockWorkflowActionExtraOptions, vi.fn());
    expect(result).toBe("");
  });

  it("should return an empty string when selectedRows length is 0", () => {
    const param = {
      node: {
        data: {
          Id: "1680820512538075136",
          Cashflow_Id: "M00055071708",
          Status: "WAITING",
        },
      },
    };
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      messageApi: message,
      modalApi: mockAntdModal(),
    };
    const result = manualSTPRightMenu(param as GetContextMenuItemsParams, mockWorkflowActionExtraOptions, vi.fn());
    expect(result).toBe("");
  });

  it("should return empty string if selectedRows not all PENDING or ERROR", () => {
    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      messageApi: message,
      modalApi: mockAntdModal(),
    };
    const param = {
      node: { data: mockData },
      api: { getSelectedRows: () => [mockData] },
    };
    const result = manualSTPRightMenu(
      param as unknown as GetContextMenuItemsParams,
      mockWorkflowActionExtraOptions,
      vi.fn()
    );
    const { name } = result as MenuItemDef;
    expect(name).toBe("Manual STP");
  });
  it("should pop error message as not all cashflow in pending trade validation group status", () => {
    const dispatch = vi.fn();

    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: mockAntdModal(),
    };

    const mockData2 = {
      ...mockData,
      Group_Status: "PENDING_TRADE_VALIDATION"
    };
    const param = {
      node: { data: mockData },
      api: { getSelectedRows: () => [mockData, mockData2] },
    };
    const result = manualSTPRightMenu(
      param as unknown as GetContextMenuItemsParams,
      mockWorkflowActionExtraOptions,
      vi.fn()
    );
    const { name, action } = result as MenuItemDef;
    expect(name).toBe("Manual STP");
    expect(action).toBeDefined();
    action!(mockMenuActionParams());
    expect(dispatch).not.toBeCalled();

  });
  it("should can process bulk stp as  all cashflow in pending trade validation group status", () => {
    const dispatch = vi.fn();

    const mockWorkflowActionExtraOptions: WorkflowActionExtraOptions = {
      dispatch,
      messageApi: message,
      modalApi: mockAntdModal(),
    };

    const mockData2 = {
      ...mockData,
      Group_Status: "PENDING_TRADE_VALIDATION"
    };


    const param = {
      node: { data: mockData2 },
      api: { getSelectedRows: () => [mockData2, mockData2] },
    };
    const result = manualSTPRightMenu(
      param as unknown as GetContextMenuItemsParams,
      mockWorkflowActionExtraOptions,
      vi.fn()
    );
    const { name, action } = result as MenuItemDef;
    expect(name).toBe("Manual STP");
    expect(action).toBeDefined();
  });
});

describe("processManualSTPResult", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call success and callback when all succeeded", async () => {
    vi.mocked(postManualSTP).mockResolvedValueOnce(
      { errorCode: 200, errorMessage: "ok", data: [mockData, mockData] });
    const selectedData = [mockData, mockData];
    await processManualSTPResult(
      selectedData,
      postManualSTP,
      message,
      mockCallback
    );
    expect(mockCallback).toHaveBeenCalledWith(selectedData);
  });

  it("should call error and not callback when all failed", async () => {
    vi.mocked(postManualSTP).mockResolvedValueOnce(
      { errorCode: 400, errorMessage: "Not eligible", data: mockData });
    const selectedData = [mockData, mockData];
    await processManualSTPResult(
      selectedData,
      postManualSTP,
      message,
      mockCallback
    );
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("should handle non-array response", async () => {
    vi.mocked(postManualSTP).mockResolvedValueOnce("not-an-array");
    await processManualSTPResult(
      [mockData],
      postManualSTP,
      message,
      mockCallback
    );
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("should handle thrown error", async () => {
    vi.mocked(postManualSTP).mockRejectedValueOnce(new Error("network error"));
    await processManualSTPResult(
      [mockData],
      postManualSTP,
      message,
      mockCallback
    );
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
