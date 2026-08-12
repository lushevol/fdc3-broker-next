import { ButtonProps } from "@mui/material";
import { MessageInstance } from "antd/es/message/interface";
import { HookAPI } from "antd/es/modal/useModal";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openWithCurrentStateBulkFixExceptionDialog } from "src/Cashflow_CN/Main/store/actions";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { ExceptionBundleActionResult } from "src/Cashflow_CN/services/type";
import {
  BULK_FIX_APPROVE_BTN,
  BULK_FIX_REJECT_BTN,
  BULK_FIX_SUBMIT_BTN,
} from "src/Root/analysis/const";
import { useContainerDispatcher } from "src/Root/import";
import { submitAsyncTask } from "src/Root/NotificationCenter";

import { ExceptionBundleStatusTypes } from "../../CashflowDetails/MultiExceptions/common/interface";
import { BulkUserType } from "../type";
import { submitResultFeedback } from "../utils/utils";
import { confirmWhileRebookException } from "./useBulkAction";

export const useBulkActionController = ({
  messageApi,
  modalApi,
  selectedCashflowIds,
  submit,
  precheckBeforeSubmit,
  onActionResultHandler,
  closeDialog,
}: {
  messageApi: MessageInstance;
  modalApi: HookAPI;
  selectedCashflowIds: string[];
  submit: ({
    selectedExceptionsByCashflowIds,
    action,
    onConfirmRebookException,
  }: {
    selectedExceptionsByCashflowIds?: Map<string, string[]>;
    action: ExceptionBundleStatusTypes;
    onConfirmRebookException: (
      exceptions: RatanException[]
    ) => Promise<boolean>;
  }) => Promise<ExceptionBundleActionResult[]>;
  precheckBeforeSubmit: () => Promise<boolean>;
  onActionResultHandler: (
    selectedCashflowIds: string[],
    resultPromise: Promise<ExceptionBundleActionResult[]>
  ) => Promise<ExceptionBundleActionResult[]>;
  closeDialog: () => void;
}) => {
  const dispatch = useDispatch<any>();
  const { userType } = useSelector(
    (state: RootState) => state.bulkFixExceptions
  );
  const { dispacthLoading } = useContainerDispatcher();

  const availableActions = useMemo<
    {
      action: ExceptionBundleStatusTypes;
      buttonProps: ButtonProps;
      dataTestid: string;
    }[]
  >(() => {
    switch (userType) {
      case BulkUserType.Maker:
        return [
          {
            action: ExceptionBundleStatusTypes.Submit,
            dataTestid: BULK_FIX_SUBMIT_BTN,
            buttonProps: {
              variant: "contained",
            },
          },
        ];

      case BulkUserType.Checker:
        return [
          {
            action: ExceptionBundleStatusTypes.Approve,
            dataTestid: BULK_FIX_APPROVE_BTN,
            buttonProps: {
              variant: "contained",
              color: "success",
            },
          },
          {
            action: ExceptionBundleStatusTypes.Reject,
            dataTestid: BULK_FIX_REJECT_BTN,
            buttonProps: {
              variant: "outlined",
              color: "error",
            },
          },
        ];
      default:
        return [];
    }
  }, [userType]);

  const onConfirmRebookException = useCallback(
    (exceptions: RatanException[]) => {
      return confirmWhileRebookException(exceptions, modalApi);
    },
    []
  );

  const onClickAction = async (action: ExceptionBundleStatusTypes) => {
    try {
      await precheckBeforeSubmit();
      const bulkProcessor = onActionResultHandler(
        selectedCashflowIds,
        submit({
          action,
          onConfirmRebookException,
        })
      );
      const onClick = () => {
        dispatch(openWithCurrentStateBulkFixExceptionDialog());
      };
      submitAsyncTask({
        processor: bulkProcessor,
        notify: ({ data, isSuccess }) => {
          if (isSuccess) {
            const { type, content } = submitResultFeedback(
              data as ExceptionBundleActionResult[]
            );
            return {
              title: "Bulk Task Done",
              description: content as string,
              type,
              onClick,
            };
          } else {
            return {
              title: "Bulk Task Failed",
              onClick,
            };
          }
        },
      });
      closeDialog();
      setTimeout(() => {
        dispacthLoading(false);
      }, 100);
    } catch (error) {
      (error as Error).message && messageApi.error((error as Error).message);
    }
  };

  return {
    availableActions,
    onClickAction,
  };
};
