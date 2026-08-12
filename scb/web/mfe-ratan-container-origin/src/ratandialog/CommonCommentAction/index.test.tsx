import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommonCommentAction from "./index";
import { MuiDialog } from "../../ratancomponents/Dialog/indexMuiV1";
import userEvent from '@testing-library/user-event';

jest.mock("../../ratancomponents/Dialog/indexMuiV1", () => {
    const MuiDialog = jest.fn();
    return {
      MuiDialog,
    };
  });

  jest.mocked(MuiDialog).mockImplementation((props) => {
      const actions = props.actions;
      const children = props.children;

      return (
      <div>
        {children}
        {actions}
      </div>)
    });

describe("CommonCommentAction", () => {
  it("should be in document", async () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = ()=>Promise.resolve();
    const mockOnReject = ()=>Promise.resolve();
    const { queryByTestId } = render(<CommonCommentAction open={true} title={"test title"} submitText={"Submit"} onClose={mockOnClose} onSubmit={mockOnSubmit}  onReject={mockOnReject}/>);
    expect(screen).toBeDefined();
    const dialog = screen.getByTestId("common-comment-action-dialog-body");
    expect(dialog).toBeInTheDocument();

    const input = await screen.findByTestId("addCommentText");
    expect(input).toBeInTheDocument();
    userEvent.type(input,"comment");

    const submitBtn =  screen.getByTestId("common-comment-action-submit");
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);

  });
  it("should reject comment", async () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = ()=>Promise.resolve();
    const mockOnReject = ()=>Promise.resolve();
    const { queryByTestId } = render(<CommonCommentAction open={true} title={"test title"} submitText={"Submit"} onClose={mockOnClose} onSubmit={mockOnSubmit}  onReject={mockOnReject}/>);
    expect(screen).toBeDefined();
    const dialog = screen.getByTestId("common-comment-action-dialog-body");
    expect(dialog).toBeInTheDocument();

    const input = await screen.findByTestId("addCommentText");
    expect(input).toBeInTheDocument();
    userEvent.type(input,"comment");

    const rejectBtn = screen.getByTestId("common-comment-action-reject");
    expect(rejectBtn).toBeInTheDocument();
    fireEvent.click(rejectBtn);

  });

  it("should show error message when comment is empty", async () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = ()=>Promise.resolve();
    const mockOnReject = ()=>Promise.resolve();
    const { queryByTestId } = render(<CommonCommentAction open={true} title={"test title"} submitText={"Submit"} onClose={mockOnClose} onSubmit={mockOnSubmit}  onReject={mockOnReject}/>);
    expect(screen).toBeDefined();
    const dialog = screen.getByTestId("common-comment-action-dialog-body");
    expect(dialog).toBeInTheDocument();

    const submitBtn =  screen.getByTestId("common-comment-action-submit");
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);

    const rejectBtn = screen.getByTestId("common-comment-action-reject");
    expect(rejectBtn).toBeInTheDocument();
    fireEvent.click(rejectBtn);
  });
  it("should catch error when submit", async () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = ()=>Promise.reject();
    const mockOnReject = ()=>Promise.reject();
    const { queryByTestId } = render(<CommonCommentAction open={true} title={"test title"} submitText={"Submit"} onClose={mockOnClose} onSubmit={mockOnSubmit}  onReject={mockOnReject}/>);
    expect(screen).toBeDefined();
    const dialog = screen.getByTestId("common-comment-action-dialog-body");
    expect(dialog).toBeInTheDocument();

    const input = await screen.findByTestId("addCommentText");
    expect(input).toBeInTheDocument();
    userEvent.type(input,"comment");

    const submitBtn =  screen.getByTestId("common-comment-action-submit");
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);

  });
  it("should catch error when reject", async () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = ()=>Promise.reject();
    const mockOnReject = ()=>Promise.reject();
    const { queryByTestId } = render(<CommonCommentAction open={true} title={"test title"} submitText={"Submit"} onClose={mockOnClose} onSubmit={mockOnSubmit}  onReject={mockOnReject}/>);
    expect(screen).toBeDefined();
    const dialog = screen.getByTestId("common-comment-action-dialog-body");
    expect(dialog).toBeInTheDocument();

    const input = await screen.findByTestId("addCommentText");
    expect(input).toBeInTheDocument();
    userEvent.type(input,"comment");

    const rejectBtn = screen.getByTestId("common-comment-action-reject");
    expect(rejectBtn).toBeInTheDocument();
    fireEvent.click(rejectBtn);

  });
});
