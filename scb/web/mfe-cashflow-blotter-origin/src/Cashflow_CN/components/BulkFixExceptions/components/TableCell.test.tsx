import { render, screen } from "@testing-library/react";
import { mockMultipleGraphqlDetails1 } from "src/Cashflow_CN/test/mockData/cashflowDetails";

import { ExceptionCategory } from "../../CashflowDetails/MultiExceptions/common/interface";
import { mockCashflowDisplay } from "../test/mockData/cashflows";
import { BulkResultStatus, CashflowDisplay } from "../type";
import { BulkActionResultCell, ExceptionsCell, getChipProps } from "./TableCell";

const cashflowDetails = {
  cashflowId: "test_cashflow_id",
  exceptions: [...(mockMultipleGraphqlDetails1[0].ratanException ?? [])],
  hasInsufficientException: false,
  isSubmitByYou: false,
  rawCashflow: mockMultipleGraphqlDetails1[0],
};

describe('TableCell', () => {
  it("ExceptionsCell should return probably", () => {
    const ExceptionsCellComponent = ExceptionsCell(null, mockCashflowDisplay, 0);
    expect(ExceptionsCellComponent).toBeDefined();
  });
  it("ExceptionsCell sort when exceptionsNames is affirmation", () => {
    const mockCashflowDisplay1: CashflowDisplay = {
      exceptions: [
        ...(mockMultipleGraphqlDetails1[0].ratanException ?? []),
        {
          Exception_Code: "Adhoc Netting FMCODE",
          Exception_Category: "AFFIRMATION",
          Bulk_Eligible: true,
        },
        {
          Exception_Code: "Adhoc Netting FMCODE",
          Exception_Category: "HIGH_RISK_NSTP",
          Bulk_Eligible: false,
        },
      ],
      hasInsufficientException: false,
      isSubmitByYou: false,
      rawCashflow: mockMultipleGraphqlDetails1[0],
      bulkActionResult: {
        status: BulkResultStatus.NotificationUpdated,
        message: "Status Updated",
      },
    };
    const ExceptionsCellComponent = ExceptionsCell(null, mockCashflowDisplay1, 0);
    expect(ExceptionsCellComponent).toBeDefined();
  });
  it("should render error chip with ErrorIcon for HARD_BLOCKER", () => {
    const record = {
      exceptions: [
        {
          Exception_Code: "HB1",
          Exception_Category: ExceptionCategory.HARD_BLOCKER,
          Bulk_Eligible: true,
          Description: "Hard Blocker Exception",
        },
      ],
    };
    render(<>{ExceptionsCell(null, record as any, 0)}</>);
    expect(screen.getByText("HB1")).toBeInTheDocument();
    expect(screen.getByTitle("Hard Blocker Exception")).toBeInTheDocument();
  });
  it("BulkActionResultCell should return probably", () => {
    const BulkActionResultCellComponent = BulkActionResultCell(null, mockCashflowDisplay, 0);
    expect(BulkActionResultCellComponent).toBeDefined();
  });
  it("BulkActionResultCell renders success tag when status is SubmitSuccess", () => {
    const mockCashflowDisplay2: CashflowDisplay = {
      ...cashflowDetails,
      bulkActionResult: {
        status: BulkResultStatus.SubmitSuccess,
        message: "Success",
      },
    };
    render(BulkActionResultCell(null, mockCashflowDisplay2, 0));
    const successTag = screen.getByText("success");
    expect(successTag).toBeInTheDocument();
  });
  it("BulkActionResultCell renders error tag when status is SubmitFailed", () => {
    const mockCashflowDisplay3: CashflowDisplay = {
      ...cashflowDetails,
      bulkActionResult: {
        status: BulkResultStatus.SubmitFailed,
        message: "Failed",
      },
    };
    render(BulkActionResultCell(null, mockCashflowDisplay3, 0));
    const errorTag = screen.getByText("failed");
    expect(errorTag).toBeInTheDocument();
  });
  it("BulkActionResultCell renders processing tag when status is Submiting", () => {
    const mockCashflowDisplay4: CashflowDisplay = {
      ...cashflowDetails,
      bulkActionResult: {
        status: BulkResultStatus.Submiting,
        message: "Processing",
      },
    };
    render(BulkActionResultCell(null, mockCashflowDisplay4, 0));
    const processingTag = screen.getByText("processing");
    expect(processingTag).toBeInTheDocument();
  });
  it("BulkActionResultCell renders default tag when status is NotificationUpdated", () => {
    const mockCashflowDisplay5: CashflowDisplay = {
      ...cashflowDetails,
      bulkActionResult: {
        status: BulkResultStatus.NotificationUpdated,
        message: "Status Updated",
      },
    };
    render(BulkActionResultCell(null, mockCashflowDisplay5, 0));
    const defaultTag = screen.getByText("Status Updated");
    expect(defaultTag).toBeInTheDocument();
  });
  it("should return error chip for HIGH_RISK_NSTP", () => {
    const props = {
      Exception_Code: "CODE1",
      Exception_Category: ExceptionCategory.HIGH_RISK_NSTP,
      Bulk_Eligible: true,
    };
    const chipProps = getChipProps(props);
    expect(chipProps.color).toBe("error");
    expect(chipProps.icon).toBeTruthy();
    expect(chipProps.label).toBe("CODE1");
  });

  it("should return error chip for HARD_BLOCKER", () => {
    const props = {
      Exception_Code: "CODE2",
      Exception_Category: ExceptionCategory.HARD_BLOCKER,
      Bulk_Eligible: true,
    };
    const chipProps = getChipProps(props);
    expect(chipProps.color).toBe("error");
    expect(chipProps.icon).toBeTruthy();
    expect(chipProps.label).toBe("CODE2");
  });

});