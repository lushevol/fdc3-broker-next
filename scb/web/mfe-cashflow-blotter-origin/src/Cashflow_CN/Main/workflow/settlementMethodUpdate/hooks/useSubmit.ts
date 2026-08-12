import { useCallback, useState } from "react";
import { postSettlementMethodUpdate } from "src/Cashflow_CN/services";

import {
  CashflowEligibleResult,
  ExtraFormSubmitFormDataType,
  SettlementMethodUpdateResponse,
} from "../type";
import { handlePayload } from "../utils/utils";

export const useSubmit = ({
  classifiedCashflows,
  submitExtraForm,
}: {
  classifiedCashflows: CashflowEligibleResult;
  submitExtraForm: () => ExtraFormSubmitFormDataType | undefined;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = useCallback(async (): Promise<
    SettlementMethodUpdateResponse[]
  > => {
    setIsSubmitting(true);
    try {
      const formPayload = submitExtraForm();
      if (!formPayload) {
        throw new Error(
          "Form payload is missing. Please complete the form before submitting."
        );
      }
      const postBody = handlePayload(
        classifiedCashflows.eligibleForUpdate.cashflows,
        formPayload
      );
      const resp = await postSettlementMethodUpdate(postBody);
      return resp;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [classifiedCashflows, submitExtraForm]);

  return {
    submit,
    isSubmitting,
  };
};
