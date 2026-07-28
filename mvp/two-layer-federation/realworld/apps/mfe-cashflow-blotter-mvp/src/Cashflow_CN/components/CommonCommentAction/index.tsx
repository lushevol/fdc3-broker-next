import { Box, Button, css, styled } from "@mui/material";
import { Form, Input, message } from "antd";
import { FC, PropsWithChildren, useCallback, useState } from "react";
import {
  get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_REJECT_BTN,
  get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN,
} from "src/Root/analysis/const";
import { MuiDialog } from "src/Root/import/ratancomponents";

const StyledMuiDialog = styled(MuiDialog)(
  () => css`
    .MuiDialogActions-root {
      padding-bottom: 10px;
    }
  `
);

interface CommonCommentActionDialogProps {
  open: boolean;
  width?: string;
  height?: string;
  title: string | React.ReactNode;
  submitText?: string;
  commentMaxLength?: number;
  showCommentLabel?: boolean;
  commentRows?: number;
  labelColSpan?: number;
  wrapperColSpan?: number;
  testId?: string;
  onClose: (refresh: boolean) => void;
  onSubmit: (comment: string) => Promise<boolean>;
  onReject?: (comment: string) => Promise<boolean>;
  customWarning?: React.ReactNode;
}

const CommonCommentActionDialog: FC<
  PropsWithChildren<CommonCommentActionDialogProps>
> = ({
  open,
  title,
  width = "550px",
  height = "300px",
  submitText = "Submit",
  commentMaxLength = 500,
  showCommentLabel = false,
  commentRows = 9,
  labelColSpan,
  wrapperColSpan,
  onClose,
  onSubmit,
  onReject,
  testId = "common-comment-action",
  customWarning,
  children,
}) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [messageApi, messageContextHolder] = message.useMessage();

  const submit = useCallback(async () => {
    await form.validateFields();
    const { comment } = form.getFieldsValue();
    const comments = (comment as string)?.trim();
    if (comments) {
      try {
        setSubmitLoading(true);
        const res = await onSubmit(comments);
        res && onClose(true);
      } catch (error: any) {
        const { errorMessage, message } = error || {};
        messageApi.error(errorMessage || message || error);
      } finally {
        setSubmitLoading(false);
      }
    }
  }, []);

  const reject = useCallback(async () => {
    await form.validateFields();
    const { comment } = form.getFieldsValue();
    const comments = (comment as string)?.trim();
    if (comments) {
      try {
        setSubmitLoading(true);
        const res = await onReject!(comments);
        res && onClose(true);
      } catch (error: any) {
        const { errorMessage, message } = error || {};
        messageApi.error(errorMessage || message || error);
      } finally {
        setSubmitLoading(false);
      }
    }
  }, []);

  return (
    <StyledMuiDialog
      className="common-comment-action-dialog"
      title={title}
      destoryWhenHidden={!open}
      open={open}
      onClose={onClose}
      testId={testId}
      width={width}
      height={height}
      actions={
        <>
          <Button
            onClick={submit}
            data-testid={get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN(
              testId
            )}
            disabled={submitLoading}
            color="primary"
            variant="contained"
          >
            {submitText}
          </Button>
          {onReject && (
            <Button
              onClick={reject}
              data-testid={get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_REJECT_BTN(
                testId
              )}
              disabled={submitLoading}
              color="error"
              variant="outlined"
            >
              Reject
            </Button>
          )}
        </>
      }
    >
      {customWarning && <>{customWarning}</>}
      <Box
        className="common-comment-action-dialog-body"
        data-testid="common-comment-action-dialog-body"
        sx={{ pt: 1, pb: 1 }}
      >
        {children}
        <Form
          form={form}
          labelCol={{ span: labelColSpan }}
          wrapperCol={{ span: wrapperColSpan }}
        >
          <Form.Item
            label={showCommentLabel ? "Comment" : undefined}
            name="comment"
            rules={[{ required: true, message: "Please input comment" }]}
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea
              className="add-comment-area"
              rows={commentRows}
              maxLength={commentMaxLength}
              disabled={submitLoading}
              data-testid="addCommentText"
              placeholder="Please type in comment."
            />
          </Form.Item>
        </Form>
        {messageContextHolder}
      </Box>
    </StyledMuiDialog>
  );
};

export default CommonCommentActionDialog;
