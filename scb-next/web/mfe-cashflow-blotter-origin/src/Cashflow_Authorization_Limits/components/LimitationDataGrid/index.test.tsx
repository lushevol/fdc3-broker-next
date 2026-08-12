import { fireEvent, render } from "@testing-library/react";
import { LimitationActionType, LimitationRecord } from "src/Cashflow_Authorization_Limits/Main/common/interface";
import { AUTHORIZATION_LIMITS_BLOTTER_EDIT_BTN } from "src/Root/analysis/const";

import { useActionHandler } from "./hooks";
import LimitationDataGrid from "./index";

const mockGridData: LimitationRecord[] = [
    {
      "limitationId": "1",
      "version": 0,
      "currency": "USD",
      "profile": "FMO_OPS_BOC",
      "limitation": 30000000,
      "status": "CONFIRMED",
      "createdAt": "2023-04-11T02:15:00.465601",
      "createdBy": "Operator_Is_Blank",
      "updatedAt": "2023-04-11T02:15:00.465601",
      "updatedBy": "Operator_Is_Blank",
      "deleted": false
    },
    {
      "limitationId": "1",
      "version": 0,
      "currency": "USD",
      "profile": "FMO_OPS_BO",
      "limitation": 100000000,
      "status": "ADD_PENDING",
      "createdAt": "2023-04-11T02:15:00.465601",
      "createdBy": "Operator_Is_Blank",
      "updatedAt": "2023-04-11T02:15:00.465601",
      "updatedBy": "Operator_Is_Blank",
      "deleted": false
    },
    {
      "limitationId": "1",
      "version": 0,
      "currency": "USD",
      "profile": "FMO_OPS_BOL",
      "limitation": 1000000000,
      "status": "EDIT_PENDING",
      "createdAt": "2023-04-11T02:15:00.465601",
      "createdBy": "Operator_Is_Blank",
      "updatedAt": "2023-04-11T02:15:00.465601",
      "updatedBy": "Operator_Is_Blank",
      "deleted": false
    },
    {
      "limitationId": "1",
      "version": 0,
      "currency": "USD",
      "profile": "FMO_OPS_BOM",
      "limitation": 4000000000,
      "status": "DELETE_PENDING",
      "createdAt": "2023-04-11T02:15:00.465601",
      "createdBy": "Operator_Is_Blank",
      "updatedAt": "2023-04-11T02:15:00.465601",
      "updatedBy": "Operator_Is_Blank",
      "deleted": false
    }
];

afterAll(() => {
  vi.clearAllMocks();
});

describe("Limitation DataGrid", () => {
  it("should be in the document", async () => {
    const mockOpenDialog = vi.fn();
    const mockAction = vi.fn();
    const { container, queryByTestId } = render(
      <LimitationDataGrid gridData={mockGridData} 
        onOpenDetailsDialog={mockOpenDialog}
        onDeleteLimitation={mockAction}
        onApproveAddLimitation={mockAction}
        onRejectAddLimitation={mockAction}
        onApproveEditLimitation={mockAction}
        onRejectEditLimitation={mockAction}
        onApproveDeleteLimitation={mockAction}
        onRejectDeleteLimitation={mockAction} />
    );
    expect(container).toBeInTheDocument();
    const editBtn = queryByTestId(AUTHORIZATION_LIMITS_BLOTTER_EDIT_BTN);
    expect(editBtn).toBeInTheDocument();
    fireEvent.dblClick(editBtn!);
    expect(mockOpenDialog).toHaveBeenCalled();
  });
  it("action handler should work", async () => {
    const actions = [
      LimitationActionType.CREATE,
      LimitationActionType.DELETE,
      LimitationActionType.EDIT,
      LimitationActionType.VIEW,
      LimitationActionType.APPROVE_ADD,
      LimitationActionType.APPROVE_DELETE,
      LimitationActionType.APPROVE_EDIT,
      LimitationActionType.REJECT_ADD,
      LimitationActionType.REJECT_DELETE,
      LimitationActionType.REJECT_EDIT,
    ]
    const mockAction = vi.fn();
    const { handleAction } = useActionHandler({
      onOpenDetailsDialog: mockAction,
      onDeleteLimitation: mockAction,
      onApproveAddLimitation: mockAction,
      onRejectAddLimitation: mockAction,
      onApproveEditLimitation: mockAction,
      onRejectEditLimitation: mockAction,
      onApproveDeleteLimitation: mockAction,
      onRejectDeleteLimitation: mockAction,
      modalApi: {
        confirm: mockAction,
      },
      messageApi: {
        success: mockAction,
      },
    });
    actions.forEach((a) => {
      handleAction(a, mockGridData[0]);
    });
    expect(mockAction).toHaveBeenCalled();
  });
});