import { HookAPI } from "antd/es/modal/useModal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { postBulkExceptionBundleAction } from "src/Cashflow_CN/services";
import { useBatchCollect, useRTT } from "src/Root/analysis";
import {
  BULK_FIX_EXCEPTION_CASHFLOW_COUNT,
  RTT_MUTATION_BULK_EXCEPTION,
} from "src/Root/analysis/const";

import { ExceptionBundleStatusTypes } from "../../CashflowDetails/MultiExceptions/common/interface";
import { assembleSubmitRequestBody } from "../../CashflowDetails/MultiExceptions/common/utils";
import {
  BulkResultStatus,
  BulkUserType,
  CashflowEligibleResult,
} from "../type";
import {
  hasRebookExceptions,
  presubmitBulkActionValidation,
} from "../utils/filter";
import { handlePayload } from "../utils/utils";
import { ExtraFormSubmitFormDataType } from "./useBulkExtraForm";

export const useBulkAction = ({
  classifiedCashflows,
  submitExtraForm,
  validateExtraForm,
  cashflowIdsWithAfirmationException,
  cashflowIdsWithBackValueDateException,
  isClassifyLoading,
}: {
  classifiedCashflows: CashflowEligibleResult;
  submitExtraForm: () => Promise<ExtraFormSubmitFormDataType | undefined>;
  validateExtraForm: () => Promise<boolean>;
  cashflowIdsWithAfirmationException: string[];
  cashflowIdsWithBackValueDateException: string[];
  isClassifyLoading: boolean;
}) => {
  const { userType } = useSelector(
    (state: RootState) => state.bulkFixExceptions
  );
  const [selectedCashflowIds, setSelectedCashflowIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startTracking: startTrackingRTT } = useRTT();
  const { startTracking } = useBatchCollect();

  useEffect(() => {
    if (!isClassifyLoading) {
      selectAllSelectableRows();
    }
  }, [isClassifyLoading]);

  useEffect(() => {
    // filter selected cashflows with only none succeed result
    setSelectedCashflowIds((ids) => {
      return ids.filter(
        (id) =>
          !!classifiedCashflows.eligibleForBulk.cashflows.find(
            (c) =>
              c.cashflowId === id &&
              ![
                BulkResultStatus.SubmitSuccess,
                BulkResultStatus.NotificationUpdated,
              ].includes(c.bulkActionResult.status)
          )
      );
    });
  }, [classifiedCashflows.eligibleForBulk.cashflows]);

  const selectAllSelectableRows = () => {
    setSelectedCashflowIds(
      classifiedCashflows.eligibleForBulk.cashflows
        .filter(
          (c) =>
            ![
              BulkResultStatus.SubmitSuccess,
              BulkResultStatus.NotificationUpdated,
            ].includes(c.bulkActionResult.status)
        )
        .map((c) => c.cashflowId + "")
    );
  };

  const postSubmit = useCallback(() => {
    setSelectedCashflowIds([]);
  }, []);

  const selectedCashflows =
    classifiedCashflows.eligibleForBulk.cashflows.filter((c) =>
      selectedCashflowIds.includes(c.cashflowId + "")
    );

  const precheckBeforeSubmit = async () => {
    return await validateExtraForm();
  };

  const submit = async ({
    action,
    onConfirmRebookException,
  }: {
    action: ExceptionBundleStatusTypes;
    onConfirmRebookException: (
      exceptions: RatanException[]
    ) => Promise<boolean>;
  }) => {
    try {
      setIsSubmitting(true);
      const formPayload = await submitExtraForm();
      if (!formPayload) return [];

      const validResult: {
        valid: boolean;
        message: string;
      } = {
        valid: true,
        message: "",
      };
      for (const cf of selectedCashflows) {
        const { valid, message } = await presubmitBulkActionValidation(
          cf,
          action
        );
        validResult.valid = valid && validResult.valid;
        validResult.message =
          cf.cashflowId + ": " + message + "\n" + validResult.message;
      }
      if (!validResult.valid) {
        throw new Error(validResult.message);
      }

      await onConfirmRebookException(
        selectedCashflows.flatMap((c) => c.exceptions)
      );

      const { completeTracking } = startTrackingRTT();

      const resp = await postBulkExceptionBundleAction(
        selectedCashflows.map((cashflow) =>
          assembleSubmitRequestBody({
            cashflowDetails: cashflow.rawCashflow.cashflow!,
            exceptions: cashflow.exceptions,
            payload: handlePayload(cashflow.exceptions, formPayload),
            action,
          })
        ),
        userType
      );

      completeTracking({ name: RTT_MUTATION_BULK_EXCEPTION });
      startTracking(BULK_FIX_EXCEPTION_CASHFLOW_COUNT)([
        selectedCashflows.length + "",
      ]);

      postSubmit();

      return resp;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const showAffirmationForm = useMemo(() => {
    return (
      userType === BulkUserType.Maker &&
      !!selectedCashflowIds.find((id) =>
        cashflowIdsWithAfirmationException.includes(id)
      )
    );
  }, [userType, selectedCashflowIds, cashflowIdsWithAfirmationException]);

  const showBackValueDateForm = useMemo(() => {
    return (
      userType === BulkUserType.Maker &&
      !!selectedCashflowIds.find((id) =>
        cashflowIdsWithBackValueDateException.includes(id)
      )
    );
  }, [userType, selectedCashflowIds, cashflowIdsWithBackValueDateException]);

  return {
    submit,
    precheckBeforeSubmit,
    isSubmitting,
    selectedCashflows,
    selectedCashflowIds,
    onSelectedCashflowIds: setSelectedCashflowIds,
    selectAllSelectableRows,
    showAffirmationForm,
    showBackValueDateForm,
  };
};

export const confirmWhileRebookException = async (
  exceptions: RatanException[],
  modalApi: HookAPI
) => {
  if (hasRebookExceptions(exceptions)) {
    const confirmed = await modalApi.confirm({
      title: "Warning",
      content: "Please confirm to procceed Rebook exception.",
      okText: "Continue",
      getContainer: false,
      centered: true,
    });
    return confirmed;
  }
  return true;
};
