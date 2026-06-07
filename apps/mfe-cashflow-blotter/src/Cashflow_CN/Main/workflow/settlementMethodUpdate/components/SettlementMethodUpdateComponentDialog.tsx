import { LoadingButton } from "Import/index";
import { FC } from "react";
import { SETTLEMENT_METHOD_UPDATE_SUBMIT_BTN } from "src/Root/analysis/const";

import { useDialogData } from "../hooks/useDialogData";
import { classes, StyledMuiDialog } from "../style";
import { useActionController } from "./../hooks/useActionController";
import { useDialogController } from "./../hooks/useDialogController";
import { useExtraForm } from "./../hooks/useExtraForm";
import CashflowDisplayTable from "./CashflowDisplayTable";
import { ExtraForm } from "./ExtraForm";
import { DialogLayout } from "./Layout";

/**
 * Main dialog component for the Settlement Method Update workflow.
 * Responsibilities:
 * - Display eligible cashflows (can be updated) and insufficient cashflows (read-only)
 * - Provide an extra comment form for user input before submission
 * - Handle async submission via useActionController and show notifications
 */
export const SettlementMethodUpdateComponentDialog: FC = () => {
  const {
    isOpenDialog,
    closeDialog,
    title,
    isLimit,
    messageApi,
    messageContextHolder,
  } = useDialogController();
  const { classifiedCashflows, isClassifyLoading, onActionResultHandler } =
    useDialogData();
  const { extraFormRef, submitExtraForm } = useExtraForm();
  const { onClickAction, isSubmitting } = useActionController({
    messageApi,
    classifiedCashflows,
    submitExtraForm,
    onActionResultHandler,
    closeDialog,
  });

  const isSubmitDisabled =
    !classifiedCashflows.eligibleForUpdate.cashflows.length ||
    isLimit ||
    isSubmitting;

  return (
    <StyledMuiDialog
      open={isOpenDialog}
      onClose={closeDialog}
      title={title}
      width="90vw"
      height="700px"
      enableResize
      actions={
        <div className={classes.bottom}>
          <div className={classes.btnsWrap}>
            {
              <LoadingButton
                disabled={isSubmitDisabled}
                loading={isSubmitting}
                className={classes.submitBtn}
                variant="contained"
                size="medium"
                onClick={() => onClickAction()}
                data-testid={SETTLEMENT_METHOD_UPDATE_SUBMIT_BTN}
              >
                Submit
              </LoadingButton>
            }
          </div>
        </div>
      }
    >
      <DialogLayout classifiedCashflows={classifiedCashflows}>
        <CashflowDisplayTable
          isEligibleTable
          isLoading={isClassifyLoading}
          data={classifiedCashflows.eligibleForUpdate.cashflows}
        />
        <ExtraForm ref={extraFormRef} disabled={isSubmitting} />
        <CashflowDisplayTable
          isLoading={isClassifyLoading}
          data={classifiedCashflows.insufficientForUpdate.cashflows}
        />
      </DialogLayout>
      {messageContextHolder}
    </StyledMuiDialog>
  );
};
