import { fn, render, userEvent } from "@Test/test-utils";
import { ACCOUNTING_DETAILS_REPUBLISH_BTN } from "src/Root/analysis/const";

import { AccountingActionCell, shouldRenderRepublishButton } from "./ActionCell";
import { AccountTableData } from "./type";

describe('Accounting Details', () => {
  it("shouldRenderRepublishButton - MISSING_INFO", () => {
    const mockAccountingData: AccountTableData = {
        accountNumber: "test",
        transactionNature: "test",
        externalSystemKey: "test",
        updatedAt: "test",
        taskStatus: "MISSING_INFO",
        reason: "",
        transactionAmount: "100",
        currency: "USD",
        action: "Pastdue",
        createdAt: "2026-03-02T14:00:12.757033",
    }
    const mockRepublish = fn();
    const mockProps = {
      data: mockAccountingData,
      node: fn() as any,
      rowIndex: 1,
      triggerRepublish: mockRepublish,
    };
    expect(shouldRenderRepublishButton(mockProps)).toBe(true);
  });
  it("ActionCell - happy case", () => {
    const mockAccountingData = {
        accountNumber: "test",
        transactionNature: "test",
        externalSystemKey: "test",
        updatedAt: "test",
        taskStatus: "REJECTED",
        reason: "",
        canRepublish: true,
        transactionAmount: "100",
        currency: "USD",
        action: "Pastdue",
        createdAt: "2026-03-02T14:00:12.757033",
    }
    const mockRepublish = fn();
    const { queryByTestId } = render(<AccountingActionCell data={mockAccountingData} node={fn() as any} rowIndex={0} triggerRepublish={mockRepublish} />);
    const republishBtn = queryByTestId(ACCOUNTING_DETAILS_REPUBLISH_BTN);
    expect(republishBtn).toBeInTheDocument();
    userEvent.click(republishBtn!);
    expect(mockRepublish).toHaveBeenCalled();
  });
  it("ActionCell - no render", () => {
    const mockAccountingData: AccountTableData = {
        accountNumber: "test",
        transactionNature: "test",
        externalSystemKey: "test",
        updatedAt: "test",
        taskStatus: "DISABLED",
        reason: "",
        transactionAmount: "100",
        currency: "USD",
        action: "Pastdue",
        createdAt: "2026-03-02T14:00:12.757033",
    }
    const mockRepublish = fn();
    const { queryByTestId } = render(<AccountingActionCell data={mockAccountingData} node={fn() as any} rowIndex={0} triggerRepublish={mockRepublish} />);
    const republishBtn = queryByTestId(ACCOUNTING_DETAILS_REPUBLISH_BTN);
    expect(republishBtn).not.toBeInTheDocument();
  });
});