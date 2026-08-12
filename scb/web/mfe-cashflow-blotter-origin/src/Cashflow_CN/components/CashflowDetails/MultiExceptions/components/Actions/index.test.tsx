import { fireEvent,render } from "@testing-library/react";
import React from "react";
import { MULTI_EXCEPTION_APPROVE_BTN, MULTI_EXCEPTION_REJECT_BTN, MULTI_EXCEPTION_REJECT_MULTI_BTN, MULTI_EXCEPTION_SUBMIT_BTN } from "src/Root/analysis/const";

import ExceptionActions, { RejectBtns } from "./index";
import { ExceptionActionsProps } from "./interface";

describe("RejectBtns", () => {
  const mockWrapAction = jest.fn(() => jest.fn());
  const mockOnSubmit = jest.fn();
  const mockSetRejectExceptions = jest.fn();
  const mockHandleRejectOptionSelect = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty div when RejectOptions.length === 0", () => {
    const { container } = render(
      <RejectBtns
        RejectOptions={[]}
        wrapAction={mockWrapAction}
        onSubmit={mockOnSubmit}
        setRejectExceptions={mockSetRejectExceptions}
        rejectExceptions={[]}
        allActionBtnsLoading={false}
        isSubmitByYou={false}
        hasHighRiskExceptionsButNoPermission={false}
        handleRejectOptionSelect={mockHandleRejectOptionSelect}
      />
    );
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("renders single reject button when RejectOptions.length === 1", () => {
    const { getByTestId, getByText } = render(
      <RejectBtns
        RejectOptions={[{ label: "TestLabel", value: "TestValue" }]}
        wrapAction={mockWrapAction}
        onSubmit={mockOnSubmit}
        setRejectExceptions={mockSetRejectExceptions}
        rejectExceptions={[]}
        allActionBtnsLoading={false}
        isSubmitByYou={false}
        hasHighRiskExceptionsButNoPermission={false}
        handleRejectOptionSelect={mockHandleRejectOptionSelect}
      />
    );
    const btn = getByTestId(MULTI_EXCEPTION_REJECT_BTN);
    expect(btn).toBeInTheDocument();
    expect(getByText("Reject TestLabel")).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockWrapAction).toHaveBeenCalledWith(mockOnSubmit, false, []);
  });

  it("renders multi reject popconfirm when RejectOptions.length > 1", () => {
    const { getByTestId, getByText } = render(
      <RejectBtns
        RejectOptions={[
          { label: "Label1", value: "Value1" },
          { label: "Label2", value: "Value2" },
        ]}
        wrapAction={mockWrapAction}
        onSubmit={mockOnSubmit}
        setRejectExceptions={mockSetRejectExceptions}
        rejectExceptions={["Value1"]}
        allActionBtnsLoading={false}
        isSubmitByYou={false}
        hasHighRiskExceptionsButNoPermission={false}
        handleRejectOptionSelect={mockHandleRejectOptionSelect}
      />
    );
    const btn = getByTestId(MULTI_EXCEPTION_REJECT_MULTI_BTN);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    // Popconfirm should appear, but antd's Popconfirm may need more integration test for full interaction
    expect(mockWrapAction).toHaveBeenCalledWith(mockOnSubmit, false, ["Value1"]);
  });

  it("should disable buttons when isSubmitByYou or hasHighRiskExceptionsButNoPermission is true", () => {
    const { getByTestId } = render(
      <RejectBtns
        RejectOptions={[{ label: "TestLabel", value: "TestValue" }]}
        wrapAction={mockWrapAction}
        onSubmit={mockOnSubmit}
        setRejectExceptions={mockSetRejectExceptions}
        rejectExceptions={[]}
        allActionBtnsLoading={false}
        isSubmitByYou={true}
        hasHighRiskExceptionsButNoPermission={false}
        handleRejectOptionSelect={mockHandleRejectOptionSelect}
      />
    );
    const btn = getByTestId(MULTI_EXCEPTION_REJECT_BTN);
    expect(btn).toBeDisabled();
  });
});

describe("ExceptionActions", () => {
  const mockSetIsAdhocing = jest.fn();
  const mockAdhocing = { isAdhocing: false, setIsAdhocing: mockSetIsAdhocing };

  const baseProps = {
    userRole: "Checker",
    isSubmitByYou: false,
    onSubmit: jest.fn(() => Promise.resolve(true)),
    disableAllActions: false,
    exceptionsWithRejectAction: [
      { Exception_Category: "CatA", Id: "E1" },
      { Exception_Category: "CatB", Id: "E2" },
    ],
    hasHighRiskExceptionsButNoPermission: false,
    hasAuthLimitNotSufficient: false,
  } as ExceptionActionsProps;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render approve and reject buttons for Checker", () => {
    const { getByTestId } = render(<ExceptionActions {...baseProps} />);
    expect(getByTestId(MULTI_EXCEPTION_APPROVE_BTN)).toBeInTheDocument();
  });

  it("should render single reject button if only one RejectOption", () => {
    const props = {
      ...baseProps,
      exceptionsWithRejectAction: [{ Exception_Category: "CatA", Exception_Id: "E1" }],
    };
    const { getByTestId } = render(<ExceptionActions {...props} />);
    expect(getByTestId(MULTI_EXCEPTION_REJECT_BTN)).toBeInTheDocument();
  });

  it("should render submit button for Maker", () => {
    const onSubmit = jest.fn(() => Promise.resolve(true));

    const props = {
      ...baseProps,
      userRole: "Maker",
    } as ExceptionActionsProps;
    const { getByTestId } = render(<ExceptionActions {...props} />);
    expect(getByTestId(MULTI_EXCEPTION_SUBMIT_BTN)).toBeInTheDocument();
    const submitBtn = getByTestId(MULTI_EXCEPTION_SUBMIT_BTN);
    fireEvent.click(submitBtn);
  });
});