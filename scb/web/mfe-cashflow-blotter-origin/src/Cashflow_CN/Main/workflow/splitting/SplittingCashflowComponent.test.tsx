import { fireEvent,render } from "@testing-library/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    aggridDeselectAll,
    updateCashflow,
} from "src/Cashflow_CN/Main/store/actions";

import { mockCashflow1 } from "../../../test/mockData/cashflow";
import { SplittingWrap } from "./SplittingCashflowComponent";


// Mock antd message
jest.mock("antd", () => {
    const antd = jest.requireActual("antd");
    return {
        ...antd,
        message: {
            useMessage: () => [jest.fn(), <div key="msg" data-testid="msg" />],
        },
    };
});
// Mock redux
jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

// Mock actions
jest.mock("src/Cashflow_CN/Main/store/actions", () => ({
    aggridDeselectAll: jest.fn(() => ({ type: "aggridDeselectAll" })),
    updateCashflow: jest.fn(async (ids) => Promise.resolve(mockCashflow1)),
}));

jest.mock("../../store/actions", () => ({
    splitingCashflowAction: jest.fn((payload) => ({ type: "splitingCashflowAction", payload })),
}));

// Mock SplittingComponentDialog
jest.mock("./SplittingDialog/SplittingComponentDialog", () => ({
    SplittingComponentDialog: ({ onClose, messageApi }: any) => (
        <div data-testid="dialog">
            <button data-testid="close-btn" onClick={() => onClose(true)}>
                Close
            </button>
            <span>{typeof messageApi}</span>
        </div>
    ),
}));

describe("SplittingWrap", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    });

    it("should not render dialog if isOpenSplittingDialog is false", () => {
        (useSelector as jest.Mock).mockImplementation((cb) =>
            cb({ splittingWorkflow: { isOpenSplittingDialog: false, sourceCashflow: null } })
        );
        const { queryByTestId } = render(<SplittingWrap />);
        expect(queryByTestId("dialog")).toBeNull();
    });
    it("should render dialog if isOpenSplittingDialog is true", () => {
        (useSelector as jest.Mock).mockImplementation((cb) =>
            cb({ splittingWorkflow: { isOpenSplittingDialog: true, sourceCashflow: { Cashflow: { Cashflow_Id: "CF001" } } } })
        );
        const { getByTestId } = render(<SplittingWrap />);
        expect(getByTestId("dialog")).toBeInTheDocument();
        expect(getByTestId("msg")).toBeInTheDocument();
    });
});

