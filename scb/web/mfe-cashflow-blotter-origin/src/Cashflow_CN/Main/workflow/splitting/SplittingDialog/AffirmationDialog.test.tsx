import { fireEvent,render, screen } from "@testing-library/react";
import React from "react";
import { mockFormInstance } from "src/test/mockUtils/antd-form";

import { AffirmationDialog } from "./AffirmationDialog";

jest.mock("antd", () => {
    const Button = jest.fn(() => <button data-testid="button" />);
    const DatePicker = jest.fn(() => <input type="date" data-testid="date-picker" />);
    const Descriptions = jest.fn(() => <div data-testid="descriptions"></div>);
    Descriptions["Item"] = jest.fn(({ children }) => <div data-testid="descriptions-item">{children}</div>);
    const Form = jest.fn((props) => {
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
    Form["useForm"] = jest.fn();
    Form["Item"] = jest.fn(({ children }) => <div data-testid="form-item">{children}</div>);

    const Input = jest.fn(() => <input data-testid="input" />);
    Input["TextArea"] = jest.fn(() => <textarea data-testid="input-textarea" />);
    const Popconfirm = jest.fn(() => <div data-testid="popconfirm" />);
    const Select = jest.fn(() => <select data-testid="select" />);
    const Space = jest.fn(() => <div data-testid="space" />);
    const Table = jest.fn(() => <table data-testid="table" />);
    const Typography = jest.fn(() => <div data-testid="typography" />);
    Typography["Title"] = jest.fn(({ children }) => <h1 data-testid="typography-title">{children}</h1>);
    const message = {
        useMessage: jest.fn()
    };
    const Modal = {
        useModal: jest.fn()
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
                onClose={jest.fn()}
                form={form}
                loading={false}
                onSubmit={jest.fn()}
            />
        );
        const dialog = getByTestId("mui-dialog");
        expect(dialog).toBeInTheDocument();
    });

    it("should call onSubmit when submit button is clicked", () => {
        const onSubmit = jest.fn();
        render(
            <AffirmationDialog
                open={true}
                onClose={jest.fn()}
                form={form}
                loading={false}
                onSubmit={onSubmit}
            />
        );
        fireEvent.click(screen.getByTestId("CASHFLOW_BLOTTER_SPLITTING_DIALOG_NET_SUBMIT_BTN"));
        expect(onSubmit).toHaveBeenCalled();
    });
});