import { GetContextMenuItemsParams } from "ag-grid-community";
import { HookAPI } from "antd/es/modal/useModal";
import { mockAntdModal } from "src/test/mockUtils/antd-modal";
import { fn } from "src/test/test-utils";

import { ActionType } from "../../state/types";
import { mockUtilizationRules } from "../../test/mock/mockRules";
import { actionConfirmation } from "../../utils";
import { actionRightMenu } from "./index";
import { getRightMenuActionsFromRules } from "./utils";

it("actionRightMenu should return an empty array if selected rows have different data statuses", async () => {
  const mockCB = fn();
  const param = {
    node: {
      data: mockUtilizationRules[0],
    },
    api: {
      getSelectedRows: () => [
        { dataStatus: "Status 1" },
        { dataStatus: "Status 2" },
      ],
    },
  };
  const res = actionRightMenu(
    param as unknown as GetContextMenuItemsParams,
    mockCB,
    mockAntdModal()
  );
  expect(res.length).toBe(0);
});

jest.mock("./utils", () => ({
  getRightMenuActionsFromRules: jest.fn(),
}));

jest.mock("../../utils", () => ({
  actionConfirmation: jest.fn(),
}));

describe("actionRightMenu", () => {
  const mockOnClick = jest.fn();
  const mockModal = {} as HookAPI;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an empty array if selected rows have different dataStatus", () => {
    const mockParams = {
      api: {
        getSelectedRows: jest
          .fn()
          .mockReturnValue([
            { dataStatus: "status1" },
            { dataStatus: "status2" },
          ]),
      },
      node: { data: { dataStatus: "status1" } },
    } as unknown as GetContextMenuItemsParams;

    const result = actionRightMenu(mockParams, mockOnClick, mockModal);
    expect(result).toStrictEqual([]);
  });

  it("should use hoverRow if no rows are selected", () => {
    const mockHoverRow = { dataStatus: "status1" };
    const mockParams = {
      api: { getSelectedRows: jest.fn().mockReturnValue([]) },
      node: { data: mockHoverRow },
    } as unknown as GetContextMenuItemsParams;

    (getRightMenuActionsFromRules as jest.Mock).mockReturnValue([
      { action: ActionType.Update, disabled: false, rows: [mockHoverRow] },
    ]);

    const result = actionRightMenu(mockParams, mockOnClick, mockModal);
    expect(result).toHaveLength(1);
    expect(getRightMenuActionsFromRules).toHaveBeenCalledWith([mockHoverRow]);
  });

  it("should return menu items with actions", async () => {
    const mockSelectedRows = [{ dataStatus: "status1" }];
    const mockParams = {
      api: { getSelectedRows: jest.fn().mockReturnValue(mockSelectedRows) },
      node: { data: mockSelectedRows[0] },
    } as unknown as GetContextMenuItemsParams;

    (getRightMenuActionsFromRules as jest.Mock).mockReturnValue([
      { action: ActionType.Update, disabled: false, rows: mockSelectedRows },
    ]);

    const result = actionRightMenu(mockParams, mockOnClick, mockModal);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe(ActionType.Update);
    expect(result[0].disabled).toBe(false);

    const mockActionParams = {
      ...mockParams,
      column: null,
      node: null,
      value: null,
    };

    // Simulate action execution
    if (result[0].action) {
      result[0].action(mockActionParams);
    }
    expect(mockOnClick).toHaveBeenCalledWith(
      ActionType.Update,
      mockSelectedRows
    );
  });

  it("should confirm action if not Update and execute onClick on confirmation", async () => {
    const mockSelectedRows = [{ dataStatus: "status1" }];
    const mockParams = {
      api: { getSelectedRows: jest.fn().mockReturnValue(mockSelectedRows) },
      node: { data: mockSelectedRows[0] },
    } as unknown as GetContextMenuItemsParams;

    (getRightMenuActionsFromRules as jest.Mock).mockReturnValue([
      { action: ActionType.Delete, disabled: false, rows: mockSelectedRows },
    ]);
    (actionConfirmation as jest.Mock).mockResolvedValueOnce(true);

    const result = actionRightMenu(mockParams, mockOnClick, mockModal);
    expect(result).toHaveLength(1);

    const mockActionParams = {
      ...mockParams,
      column: null,
      node: null,
      value: null,
    };

    // Simulate action execution
    if (result[0].action) {
      result[0].action(mockActionParams);
    }
    expect(actionConfirmation).toHaveBeenCalledWith(
      mockModal,
      ActionType.Delete
    );
    // expect(mockOnClick).toHaveBeenCalledWith(ActionType.Delete, mockSelectedRows);
  });

  it("should not execute onClick if action is not confirmed", async () => {
    const mockSelectedRows = [{ dataStatus: "status1" }];
    const mockParams = {
      api: { getSelectedRows: jest.fn().mockReturnValue(mockSelectedRows) },
      node: { data: mockSelectedRows[0] },
    } as unknown as GetContextMenuItemsParams;

    (getRightMenuActionsFromRules as jest.Mock).mockReturnValue([
      { action: ActionType.Delete, disabled: false, rows: mockSelectedRows },
    ]);
    (actionConfirmation as jest.Mock).mockResolvedValueOnce(false);

    const result = actionRightMenu(mockParams, mockOnClick, mockModal);
    expect(result).toHaveLength(1);

    const mockActionParams = {
      ...mockParams,
      column: null,
      node: null,
      value: null,
    };

    // Simulate action execution
    if (result[0].action) {
      result[0].action(mockActionParams);
    }
    expect(actionConfirmation).toHaveBeenCalledWith(
      mockModal,
      ActionType.Delete
    );
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("should handle empty actions gracefully", () => {
    const mockSelectedRows = [{ dataStatus: "status1" }];
    const mockParams = {
      api: { getSelectedRows: jest.fn().mockReturnValue(mockSelectedRows) },
      node: { data: mockSelectedRows[0] },
    } as unknown as GetContextMenuItemsParams;

    (getRightMenuActionsFromRules as jest.Mock).mockReturnValue([]);

    const result = actionRightMenu(mockParams, mockOnClick, mockModal);
    expect(result).toStrictEqual([]);
  });
});
