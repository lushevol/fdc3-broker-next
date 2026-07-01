import { AnyAction } from "@reduxjs/toolkit";
import { MessageInstance } from "antd/es/message/interface";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { openWithCurrentStateSettlementMethodUpdateDialogAction } from "src/Cashflow_CN/Main/store/actions";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { useContainerDispatcher } from "src/Root/import";
import { submitAsyncTask } from "src/Root/NotificationCenter";

import {
  CashflowEligibleResult,
  ExtraFormSubmitFormDataType,
  SettlementMethodUpdateResponse,
} from "../type";
import { submitResultFeedback } from "../utils/utils";
import { useSubmit } from "./useSubmit";

type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;

const notifyTypeGuard = (
  data: SettlementMethodUpdateResponse[] | undefined,
  isSuccess: boolean
): data is SettlementMethodUpdateResponse[] => isSuccess && data !== undefined;

/**
 * Orchestrates the settlement method update submission flow:
 *   1. Trigger the async update task via `onActionResultHandler`
 *   2. Register a notification callback to display task result (success / failure)
 *   3. Provide an "re-open dialog" action on the notification via `onClick`
 *   4. Close the dialog immediately after task submission
 *   5. Reset the container loading state after a short delay
 *   6. Catch and display errors via `messageApi.error`
 */
export const useActionController = ({
  messageApi,
  classifiedCashflows,
  submitExtraForm,
  onActionResultHandler,
  closeDialog,
}: {
  messageApi: MessageInstance;
  classifiedCashflows: CashflowEligibleResult;
  submitExtraForm: () => ExtraFormSubmitFormDataType | undefined;
  onActionResultHandler: (
    selectedCashflowIds: string[],
    resultPromise: Promise<SettlementMethodUpdateResponse[]>
  ) => Promise<SettlementMethodUpdateResponse[]>;
  closeDialog: () => void;
}) => {
  const { submit, isSubmitting } = useSubmit({
    classifiedCashflows,
    submitExtraForm,
  });
  const dispatch = useDispatch<AppDispatch>();
  const { dispacthLoading } = useContainerDispatcher();
  const updateCashflowIds = classifiedCashflows.eligibleForUpdate.cashflows.map(
    (c) => String(c.cashflowId)
  );
  const onClickAction = async () => {
    try {
      const updateProcessor = onActionResultHandler(
        updateCashflowIds,
        submit()
      );
      const onClick = () => {
        dispatch(openWithCurrentStateSettlementMethodUpdateDialogAction());
      };
      submitAsyncTask({
        processor: updateProcessor,
        notify: ({ data, isSuccess }) => {
          if (notifyTypeGuard(data, isSuccess)) {
            const { type, content } = submitResultFeedback(data);
            return {
              title: "Settlement Method Update Task Done",
              description: content as string,
              type,
              onClick,
            };
          } else {
            return {
              title: "Settlement Method Update Task Failed",
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
      const errorMessage = (error as Error).message;
      if (errorMessage) {
        messageApi.error(errorMessage);
      }
    }
  };

  return {
    onClickAction,
    isSubmitting,
  };
};
