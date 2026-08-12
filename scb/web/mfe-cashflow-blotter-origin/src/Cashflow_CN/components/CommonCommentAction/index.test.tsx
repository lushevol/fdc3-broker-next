import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_REJECT_BTN, get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN } from "src/Root/analysis/const";

import CommonCommentActionDialog from "./index";
jest.mock("src/Root/import/ratancomponents", () => {
  return {
    __esModule: true,
    MuiDialog: (props) => {
      const {
        children,
        destoryWhenHidden,
        open,
        onClose,
        testId = "mui-dialog",
        ...rest
      } = props;
      return (
        <section
          {...rest}
          open={true}
          data-testid={testId}
        >
          <button data-testid="MuiDialog-close-btn" onClick={onClose} />
          {children}
          {props.actions && <div>{props.actions}</div>}
        </section>
      );
    },
  }
});
describe("Common Comment Action Dialog", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should be in the document", async () => {
    const { queryByTestId } = render(
      <CommonCommentActionDialog
        open={true}
        title={"test"}
        onClose={() => { }}
        onSubmit={() => Promise.resolve(true)}
        onReject={() => Promise.resolve(true)}
        showCommentLabel
      />
    );
    const comment = queryByTestId("addCommentText");
    expect(comment).toBeInTheDocument();
    userEvent.type(comment!, "test");

    const submit = queryByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN("common-comment-action"));
    expect(submit).toBeInTheDocument();

    const reject = queryByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_REJECT_BTN("common-comment-action"));
    expect(reject).toBeInTheDocument();
  });

  it("submit/reject with false", async () => {
    const { queryByTestId } = render(
      <CommonCommentActionDialog
        open={true}
        title={"test"}
        onClose={() => { }}
        onSubmit={() => Promise.resolve(false)}
        onReject={() => Promise.resolve(false)}
        showCommentLabel
      />
    );
    const comment = queryByTestId("addCommentText");
    expect(comment).toBeInTheDocument();
    userEvent.type(comment!, "test");

    const submit = queryByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN("common-comment-action"));
    expect(submit).toBeInTheDocument();
    const reject = queryByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_REJECT_BTN("common-comment-action"));
    expect(reject).toBeInTheDocument();
  });

  it("submit/reject comment is empty", async () => {
    const { queryByTestId } = render(
      <CommonCommentActionDialog
        open={true}
        title={"test"}
        onClose={() => { }}
        onSubmit={() => Promise.resolve(true)}
        onReject={() => Promise.resolve(true)}
        showCommentLabel
      />
    );

    const comment = queryByTestId("addCommentText");
    expect(comment).toBeInTheDocument();
    userEvent.type(comment!, "test");

    const submit = queryByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN("common-comment-action"));
    expect(submit).toBeInTheDocument();
    const reject = queryByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_REJECT_BTN("common-comment-action"));
    expect(reject).toBeInTheDocument();
  });

  it("submit/reject reject", async () => {
    const { queryByTestId } = render(
      <CommonCommentActionDialog
        open={true}
        title={"test"}
        onClose={() => { }}
        onSubmit={() => Promise.reject(new Error("submit failed"))}
        onReject={() => Promise.reject(new Error("reject failed"))}
        showCommentLabel
      />
    );

    const comment = queryByTestId("addCommentText");
    expect(comment).toBeInTheDocument();
    userEvent.type(comment!, "test");

    const submit = queryByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN("common-comment-action"));
    expect(submit).toBeInTheDocument();
  });

  it("as hook", async () => {
    const props = {
      open: true,
      title: "",
      onSubmit: (comment: string) => Promise.resolve(true),
      onClose: () => { },
      onReject: (comment: string) => Promise.resolve(true),
    };
    const { result } = renderHook(() => CommonCommentActionDialog(props));
    render(<div>${result.current}</div>);
    const submit = screen.getByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN("common-comment-action"));
    expect(submit).toBeInTheDocument();
    const reject = screen.getByTestId(get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_REJECT_BTN("common-comment-action"));
    expect(reject).toBeInTheDocument();
  });
  it("should trigger reject button as no mock return form comments", async () => {
    const handleReject = jest.fn();
    const mockClose = jest.fn();
    render(
      <CommonCommentActionDialog
        open={true}
        title="Test"
        onClose={jest.fn()}
        onSubmit={jest.fn().mockResolvedValue(true)}
        onReject={handleReject}
        showCommentLabel
      />
    );

    userEvent.type(screen.getByTestId("addCommentText"), "test comment");
    const rejectBtn = screen.getByTestId(
      get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_REJECT_BTN("common-comment-action")
    );
    userEvent.click(rejectBtn);
    expect(mockClose).not.toBeCalled();
  });
});
