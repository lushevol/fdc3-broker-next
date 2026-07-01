import { css, styled } from "@mui/material";
import { Form } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { LoadingButton } from "Import/index";
import { MuiDialog } from "Import/ratancomponents";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/Cashflow_CN/Main/store/interface";

import { SplitActionType } from "../common/interface";
import { useSplittingActions } from "../common/SplitCashflowDialogUtils";
import { AffirmationDialog } from "./AffirmationDialog";
import { SplittingPreviewComponent } from "./SplittingPreviewComponen";

const StyledMuiDialog = styled(MuiDialog)(
  () => css`
    .component-cashflow-dialog-body {
      padding: 10px 20px;
      display: flex;
      flex-direction: column;
      height: 98%;
    }
    .update-affirmation-status {
      padding-top: 20px;
    }
    .bottom-btn {
      padding: 10px;
      .btn {
        & + .btn {
          margin-left: 10px;
        }
      }
    }
  `
);

interface SplittingComponentProps {
  onClose: (refresh: boolean) => void;
  messageApi: MessageInstance;
}

export const SplittingComponentDialog: FC<SplittingComponentProps> = ({
  onClose,
  messageApi,
}) => {
  const { splitAction, isOpenSplittingDialog } = useSelector(
    (state: RootState) => state.splittingWorkflow
  );
  const [form] = Form.useForm();
  const [openAffirmation, setOpenAffirmation] = useState(false);
  const [proceedSplitting, setProceedSplitting] = useState(false);
  const { handleSplitFinalSubmit, handleAffirmationAction } =
    useSplittingActions({
      form,
      setOpenAffirmation,
      messageApi,
      setProceedSplitting,
    });

  const generateSplitTitle = () => {
    switch (splitAction) {
      case SplitActionType.MANUAL_SPLIT:
        return "Split Cashflow Preview";
      case SplitActionType.AMEND_SPLIT:
        return "Amend Split Amount";
      case SplitActionType.UN_SPLIT:
        return "Un-Split Cashflow Preview";
      case SplitActionType.COMPONENT_SPLIT:
        return "View Child Cashflow";
      default:
        return "";
    }
  };

  const closeAffirmation = () => {
    setOpenAffirmation(false);
    form.resetFields();
  };

  const renderSubmitBtn = () => {
    let btnText = "";
    let testId = "";

    switch (splitAction) {
      case SplitActionType.MANUAL_SPLIT:
        btnText = "Split Cashflow With Affirmation";
        testId = "open-affirmation-btn";
        break;
      case SplitActionType.AMEND_SPLIT:
        btnText = "Confirm Amendment";
        testId = "confirm-amendment-btn";
        break;
      case SplitActionType.UN_SPLIT:
        btnText = "Un-Split All Cashflow";
        testId = "confirm-amendment-btn";
        break;
      default:
        return <></>;
    }

    return (
      <LoadingButton
        loading={proceedSplitting}
        className="btn"
        variant="contained"
        size="medium"
        onClick={handleSplitFinalSubmit}
        data-testid={testId}
      >
        {btnText}
      </LoadingButton>
    );
  };

  return (
    <>
      <StyledMuiDialog
        open={isOpenSplittingDialog}
        onClose={onClose}
        title={generateSplitTitle()}
        width="1260px"
        height="750px"
        enableResize
        actions={<div className="bottom-btn">{renderSubmitBtn()}</div>}
      >
        <SplittingPreviewComponent messageApi={messageApi} />
      </StyledMuiDialog>
      <AffirmationDialog
        open={openAffirmation}
        onClose={closeAffirmation}
        form={form}
        loading={proceedSplitting}
        onSubmit={handleAffirmationAction}
      />
    </>
  );
};
