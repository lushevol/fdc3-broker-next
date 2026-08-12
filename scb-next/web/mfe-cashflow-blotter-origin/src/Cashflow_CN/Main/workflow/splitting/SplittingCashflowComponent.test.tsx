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
vi.mock("antd", async () => {
    const antd = await vi.importActual("antd");
    return {
        ...antd,
        message: {
            useMessage: () => [vi.fn(), <div key="msg" data-testid="msg" />],
        },
    };
});
// Mock redux
vi.mock("react-redux", async () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
}));

// Mock actions
vi.mock("src/Cashflow_CN/Main/store/actions", async () => ({
    aggridDeselectAll: vi.fn(() => ({ type: "aggridDeselectAll" })),
    updateCashflow: vi.fn(async (ids) => Promise.resolve(mockCashflow1)),
}));

vi.mock("../../store/actions", async () => ({
    splitingCashflowAction: vi.fn((payload) => ({ type: "splitingCashflowAction", payload })),
}));

// Mock SplittingComponentDialog
vi.mock("./SplittingDialog/SplittingComponentDialog", async () => ({
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
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useDispatch as vi.Mock).mockReturnValue(mockDispatch);
    });

    it("should not render dialog if isOpenSplittingDialog is false", () => {
        (useSelector as vi.Mock).mockImplementation((cb) =>
            cb({ splittingWorkflow: { isOpenSplittingDialog: false, sourceCashflow: null } })
        );
        const { queryByTestId } = render(<SplittingWrap />);
        expect(queryByTestId("dialog")).toBeNull();
    });
    it("should render dialog if isOpenSplittingDialog is true", () => {
        (useSelector as vi.Mock).mockImplementation((cb) =>
            cb({ splittingWorkflow: { isOpenSplittingDialog: true, sourceCashflow: { Cashflow: { Cashflow_Id: "CF001" } } } })
        );
        const { getByTestId } = render(<SplittingWrap />);
        expect(getByTestId("dialog")).toBeInTheDocument();
        expect(getByTestId("msg")).toBeInTheDocument();
    });
});

