import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper } from "@Test/test-utils";
import { render } from "@testing-library/react";
import { MessageInstance } from "antd/es/message/interface";
import React from "react";

import { InputStatusType, RoundingType, SplitActionType } from "../common/interface";
import { SplittingComponentDialog } from "./SplittingComponentDialog";

vi.mock("./AffirmationDialog", () => ({
    AffirmationDialog: (props: any) => (
        <div data-testid="affirmation-dialog" {...props} />
    ),
}));
vi.mock("antd", () => ({
    Form: {
        useForm: () => [{}, { resetFields: vi.fn() }],
    },
    message: {
        info: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        loading: vi.fn(),
        open: vi.fn(),
        destroy: vi.fn(),
    } as MessageInstance,
    Table: () => <div>Table</div>,
    InputNumber: () => <div>InputNumber</div>,
    Input: () => <div>Input</div>,
    Select: () => <div>Select</div>,
    Modal: () => <div>Modal</div>,
    Radio: () => <div>Radio</div>,
    Checkbox: () => <div>Checkbox</div>,
    Tooltip: () => <div>Tooltip</div>,
    Popover: () => <div>Popover</div>,
    Button: () => <div>Button</div>,
}));


describe("SplittingComponentDialog", () => {
    const messageApi = { error: vi.fn(), success: vi.fn() };
    const onClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders dialog and preview component", () => {

        const store = configureStore({
            reducer: {
                splittingWorkflow: createReducer({
                    splitStatus: "INIT",
                    isOpenSplittingDialog: false,
                    isOpenLookUpSSIDialog: false,
                    targetRowIndex: null,
                    isChildCashflowDialogVisible: false,
                    sourceCashflow: {},
                    targetCashflows: [{ Cashflow_Id: "123", vostroAccount: { settlementMeans: "test" } }],
                    initialTargetCashflows: [],
                    amountSetting: {
                        precision: 2,
                        type: RoundingType.ROUNDING_OFF,
                    },
                    splitAction: SplitActionType.AMEND_SPLIT,
                }, () => { }),
                splittingValidation: createReducer({
                    isValid: true,
                    message: "test",
                    validationArr: [{
                        cashflowId: "1",
                        rowId: "0",
                        inputStatus: InputStatusType.SUCCESS,
                        prefixMessage: "none"
                    }, {
                        cashflowId: "2",
                        rowId: "1",
                        inputStatus: InputStatusType.ERROR,
                        prefixMessage: "error"
                    },
                    {
                        cashflowId: "3",
                        rowId: "2",
                        inputStatus: InputStatusType.WAITING,
                        prefixMessage: "input"
                    }
                    ]
                }, () => { }),
                cashflowGridEvent: createReducer({
                    api: {
                        applyTransaction: vi.fn(),
                        redrawRows: vi.fn(),
                        getRowNode: vi.fn(),
                        getAllDisplayedColumns: vi.fn()
                    },
                },
                    (builder) => builder,
                ),
            },
        });
        const wrapper = ReduxProviderWrapper(store);

        const { getByTestId } = render(
            <SplittingComponentDialog onClose={onClose} messageApi={messageApi as any} />, { wrapper }
        );
        expect(getByTestId("mui-dialog")).toBeInTheDocument();
    });
    it("renders dialog  with Manual split and preview component", () => {

        const store = configureStore({
            reducer: {
                splittingWorkflow: createReducer({
                    splitStatus: "INIT",
                    isOpenSplittingDialog: false,
                    isOpenLookUpSSIDialog: false,
                    targetRowIndex: null,
                    isChildCashflowDialogVisible: false,
                    sourceCashflow: {},
                    targetCashflows: [{ Cashflow_Id: "123", vostroAccount: { settlementMeans: "test" } }],
                    initialTargetCashflows: [],
                    amountSetting: {
                        precision: 2,
                        type: RoundingType.ROUNDING_OFF,
                    },
                    splitAction: SplitActionType.MANUAL_SPLIT,
                }, () => { }),
                splittingValidation: createReducer({
                    isValid: true,
                    message: "test",
                    validationArr: [{
                        cashflowId: "1",
                        rowId: "0",
                        inputStatus: InputStatusType.SUCCESS,
                        prefixMessage: "none"
                    }, {
                        cashflowId: "2",
                        rowId: "1",
                        inputStatus: InputStatusType.ERROR,
                        prefixMessage: "error"
                    },
                    {
                        cashflowId: "3",
                        rowId: "2",
                        inputStatus: InputStatusType.WAITING,
                        prefixMessage: "input"
                    }
                    ]
                }, () => { }),
                cashflowGridEvent: createReducer({
                    api: {
                        applyTransaction: vi.fn(),
                        redrawRows: vi.fn(),
                        getRowNode: vi.fn(),
                        getAllDisplayedColumns: vi.fn()
                    },
                },
                    (builder) => builder,
                ),
            },
        });
        const wrapper = ReduxProviderWrapper(store);

        const { getByTestId } = render(
            <SplittingComponentDialog onClose={onClose} messageApi={messageApi as any} />, { wrapper }
        );
        expect(getByTestId("mui-dialog")).toBeInTheDocument();
    });
    it("renders dialog with un split and preview component", () => {

        const store = configureStore({
            reducer: {
                splittingWorkflow: createReducer({
                    splitStatus: "INIT",
                    isOpenSplittingDialog: false,
                    isOpenLookUpSSIDialog: false,
                    targetRowIndex: null,
                    isChildCashflowDialogVisible: false,
                    sourceCashflow: {},
                    targetCashflows: [{ Cashflow_Id: "123", vostroAccount: { settlementMeans: "test" } }],
                    initialTargetCashflows: [],
                    amountSetting: {
                        precision: 2,
                        type: RoundingType.ROUNDING_OFF,
                    },
                    splitAction: SplitActionType.UN_SPLIT,
                }, () => { }),
                splittingValidation: createReducer({
                    isValid: true,
                    message: "test",
                    validationArr: [{
                        cashflowId: "1",
                        rowId: "0",
                        inputStatus: InputStatusType.SUCCESS,
                        prefixMessage: "none"
                    }, {
                        cashflowId: "2",
                        rowId: "1",
                        inputStatus: InputStatusType.ERROR,
                        prefixMessage: "error"
                    },
                    {
                        cashflowId: "3",
                        rowId: "2",
                        inputStatus: InputStatusType.WAITING,
                        prefixMessage: "input"
                    }
                    ]
                }, () => { }),
                cashflowGridEvent: createReducer({
                    api: {
                        applyTransaction: vi.fn(),
                        redrawRows: vi.fn(),
                        getRowNode: vi.fn(),
                        getAllDisplayedColumns: vi.fn()
                    },
                },
                    (builder) => builder,
                ),
            },
        });
        const wrapper = ReduxProviderWrapper(store);

        const { getByTestId } = render(
            <SplittingComponentDialog onClose={onClose} messageApi={messageApi as any} />, { wrapper }
        );
        expect(getByTestId("mui-dialog")).toBeInTheDocument();
    });
});

