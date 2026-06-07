import React, { FC, useState, useCallback } from "react";
import { message } from "antd";
import { TextArea } from "../../LazyAntd/Input";
import Button from "@mui/material/Button";
import { MuiDialog } from "../../ratancomponents/Dialog/indexMuiV1";
import { removeSpacesFromStrings } from "../../ratanutils/utils";
import { Box } from "@mui/material";

interface CommonCommentActionDialogProps {
  open: boolean;
  title: string;
  submitText?: string;
  onClose: (r: boolean) => void;
  onSubmit: (comment: string) => Promise<void>;
  onReject?: (comment: string) => Promise<void>;
}

const CommonCommentAction: FC<CommonCommentActionDialogProps> = ({
  open,
  title,
  submitText = "Submit",
  onClose,
  onSubmit,
  onReject,
}) => {
  const [comments, setComments] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [messageApi, messageContextHolder] = message.useMessage();

  const submit = useCallback(async () => {
    const comment = removeSpacesFromStrings(comments);
    if (comment) {
      try {
        setSubmitLoading(true);
        await onSubmit(comment);
        onClose(true);
      } catch (error: any) {
        const { errorMessage, message } = error || {};
        messageApi.error(errorMessage || message || error);
      } finally {
        setSubmitLoading(false);
      }
    } else {
      messageApi.error("Comment cannot be empty!");
    }
  }, [comments]);

  const reject = useCallback(async () => {
    const comment = removeSpacesFromStrings(comments);
    if (comment) {
      try {
        setSubmitLoading(true);
        await onReject!(comment);
        onClose(true);
      } catch (error: any) {
        const { errorMessage, message } = error || {};
        messageApi.error(errorMessage || message || error);
      } finally {
        setSubmitLoading(false);
      }
    } else {
      messageApi.error("Comment cannot be empty!");
    }
  }, [comments, onReject]);

  return (
    <MuiDialog
      className="common-comment-action-dialog"
      title={title}
      destoryWhenHidden={!open}
      open={open}
      onClose={onClose}
      testId="close-common-comment-action-dialog"
      width="550px"
      height="360px"
      actions={
        <>
          <Button
            onClick={submit}
            data-testid="common-comment-action-submit"
            disabled={submitLoading}
            color="primary"
            variant="contained"
          >
            {submitText}
          </Button>
          {onReject && (
            <Button
              onClick={reject}
              data-testid="common-comment-action-reject"
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
      <Box
        className="common-comment-action-dialog-body"
        data-testid="common-comment-action-dialog-body"
        sx={{ p: 2 }}
      >
        {messageContextHolder}
        <TextArea
          className="add-comment-area"
          rows={10}
          maxLength={500}
          onChange={(e) => setComments(e.target.value)}
          data-testid="addCommentText"
        />
      </Box>
    </MuiDialog>
  );
};

export default CommonCommentAction;
