import { LoadingButton } from "src/Root/import";

import { useBulkAction } from "../hooks/useBulkAction";
import { useBulkActionController } from "../hooks/useBulkActionController";
import { useBulkDialogController } from "../hooks/useBulkDialogController";
import { useBulkDialogData } from "../hooks/useBulkDialogData";
import { useBulkExtraForm } from "../hooks/useBulkExtraForm";
import { useNotificationHandler } from "../hooks/useNotificationHandler";
import { classes, StyledMuiDialog } from "../styles/DialogStyle";
import { BulkSelectionStatistic } from "./BulkSelectionStatistic";
import CashflowDisplayTable from "./CashflowDisplayTable";
import { ExtraForm } from "./ExtraForm";
import { BulkDialogLayout } from "./Layout";

export const BulkDialog = () => {
  const {
    isOpenDialog,
    closeDialog,
    dialogTitle,
    messageApi,
    MessageContextHolder,
    modalApi,
    ModalContextHolder,
    userType,
  } = useBulkDialogController();
  const {
    classifiedCashflows,
    cashflowIdsWithAfirmationException,
    cashflowIdsWithBackValueDateException,
    isClassifyLoading,
    onActionResultHandler,
    onNotificationCashflowUpdateHandler,
  } = useBulkDialogData();
  const { extraFormRef, submitExtraForm, validateExtraForm } =
    useBulkExtraForm();
  const {
    submit,
    precheckBeforeSubmit,
    isSubmitting,
    selectedCashflows,
    selectedCashflowIds,
    selectAllSelectableRows,
    onSelectedCashflowIds,
    showAffirmationForm,
    showBackValueDateForm,
  } = useBulkAction({
    classifiedCashflows,
    isClassifyLoading,
    submitExtraForm,
    validateExtraForm,
    cashflowIdsWithAfirmationException,
    cashflowIdsWithBackValueDateException,
  });
  useNotificationHandler({
    onNotificationComes: onNotificationCashflowUpdateHandler,
  });
  const { availableActions, onClickAction } = useBulkActionController({
    modalApi,
    messageApi,
    selectedCashflowIds,
    submit,
    precheckBeforeSubmit,
    onActionResultHandler,
    closeDialog,
  });

  return (
    <StyledMuiDialog
      open={isOpenDialog}
      onClose={closeDialog}
      title={dialogTitle}
      width="90vw"
      height="700px"
      enableResize
      actions={
        <div className={classes.bottom}>
          <div className={classes.statistic}>
            <BulkSelectionStatistic selectedCashflows={selectedCashflows} />
          </div>
          <div className={classes.btnsWrap}>
            {availableActions.map(({ action, buttonProps, dataTestid }) => (
              <LoadingButton
                className={classes.submitBtn}
                onClick={() => onClickAction(action)}
                disabled={!selectedCashflowIds.length || isSubmitting}
                loading={isSubmitting}
                size="medium"
                data-Testid={dataTestid}
                {...buttonProps}
              >
                {action}
              </LoadingButton>
            ))}
          </div>
        </div>
      }
    >
      <BulkDialogLayout classifiedCashflows={classifiedCashflows}>
        <CashflowDisplayTable
          isEligibleTable
          isLoading={isClassifyLoading}
          userType={userType}
          selectedRowKeys={selectedCashflowIds}
          onSelectedRowKeysChange={onSelectedCashflowIds}
          onSelectAllSelectableRows={selectAllSelectableRows}
          data={classifiedCashflows.eligibleForBulk.cashflows}
        />
        <ExtraForm
          showAffirmationForm={showAffirmationForm}
          showBackValueDateForm={showBackValueDateForm}
          visible={selectedCashflowIds.length > 0}
          disabled={isSubmitting}
          ref={extraFormRef}
        />
        <CashflowDisplayTable
          selectedRowKeys={[]}
          userType={userType}
          isLoading={isClassifyLoading}
          data={classifiedCashflows.insufficientForBulk.cashflows}
        />
      </BulkDialogLayout>
      {MessageContextHolder}
      {ModalContextHolder}
    </StyledMuiDialog>
  );
};
