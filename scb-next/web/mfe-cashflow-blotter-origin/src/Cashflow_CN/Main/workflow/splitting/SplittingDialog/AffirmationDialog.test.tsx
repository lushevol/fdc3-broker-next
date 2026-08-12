import { fireEvent,render, screen } from "@testing-library/react";
import React from "react";
import { mockFormInstance } from "src/test/mockUtils/antd-form";

import { AffirmationDialog } from "./AffirmationDialog";

vi.mock("antd", () => {
    const Button = vi.fn(() => <button data-testid="button" />);
    const DatePicker = vi.fn(() => <input type="date" data-testid="date-picker" />);
    const Descriptions = vi.fn(() => <div data-testid="descriptions"></div>);
    Descriptions["Item"] = vi.fn(({ children }) => <div data-testid="descriptions-item">{children}</div>);
    const Form = vi.fn((props) => {
        const { onValuesChange, children } = props;
        return (
            <>
                <form data-testid="mock-form-item">
                    {children}
                    <button type="submit" data-testid="test-onValuesChange-button" onClick={() => {
                        onValuesChange({ businessFlow: "TRADE_VALIDATION" })
                    }}>Submit</button>
                </form>
            </>
        )
    });
    Form["useForm"] = vi.fn();
    Form["Item"] = vi.fn(({ children }) => <div data-testid="form-item">{children}</div>);

    const Input = vi.fn(() => <input data-testid="input" />);
    Input["TextArea"] = vi.fn(() => <textarea data-testid="input-textarea" />);
    const Popconfirm = vi.fn(() => <div data-testid="popconfirm" />);
    const Select = vi.fn(() => <select data-testid="select" />);
    const Space = vi.fn(() => <div data-testid="space" />);
    const Table = vi.fn(() => <table data-testid="table" />);
    const Typography = vi.fn(() => <div data-testid="typography" />);
    Typography["Title"] = vi.fn(({ children }) => <h1 data-testid="typography-title">{children}</h1>);
    const message = {
        useMessage: vi.fn()
    };
    const Modal = {
        useModal: vi.fn()
    }

    return {
        Button,
        DatePicker,
        Descriptions,
        Form,
        Input,
        Popconfirm,
        Select,
        Space,
        Table,
        Typography,
        message,
        Modal
    }
});

describe("AffirmationDialog", () => {
    const form = mockFormInstance();
    it("should render dialog with correct title and fields", () => {

        const { getByTestId } = render(
            <AffirmationDialog
                open={true}
                onClose={vi.fn()}
                form={form}
                loading={false}
                onSubmit={vi.fn()}
            />
        );
        const dialog = getByTestId("mui-dialog");
        expect(dialog).toBeInTheDocument();
    });

    it("should call onSubmit when submit button is clicked", () => {
        const onSubmit = vi.fn();
        render(
            <AffirmationDialog
                open={true}
                onClose={vi.fn()}
                form={form}
                loading={false}
                onSubmit={onSubmit}
            />
        );
        fireEvent.click(screen.getByTestId("CASHFLOW_BLOTTER_SPLITTING_DIALOG_NET_SUBMIT_BTN"));
        expect(onSubmit).toHaveBeenCalled();
    });
});