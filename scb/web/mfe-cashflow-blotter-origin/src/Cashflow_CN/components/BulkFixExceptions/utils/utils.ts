import { MessageArgsProps } from "antd";
import cloneDeep from "lodash/cloneDeep";
import { ExceptionBundleActionResult } from "src/Cashflow_CN/services/type";

import {
  ExceptionCategory,
  ExceptionItem,
  MultiExceptionsNames,
} from "../../CashflowDetails/MultiExceptions/common/interface";
import {
  AffirmationFormDataType,
  affirmationSubmitFormDataType,
} from "../../CashflowDetails/MultiExceptions/components/Affirmation/interface";
import { ExtraFormSubmitFormDataType } from "../hooks/useBulkExtraForm";
import { submitResultStatistic } from "./statistic";

export const submitResultFeedback = (
  results: ExceptionBundleActionResult[]
): MessageArgsProps => {
  const { success, failed } = submitResultStatistic(results);
  const message = [
    success.length ? `${success.length} cashflows succeed !` : "",
    failed.length ? `${failed.length} cashflows failed !` : "",
  ];
  const type: MessageArgsProps["type"] = getFeedbackType(success, failed);
  return {
    content: message.filter(Boolean).join("\n"),
    type,
  };
};

export const getFeedbackType = (
  success: string[],
  failed: string[]
): MessageArgsProps["type"] => {
  if (success.length === 0) return "error";
  return failed.length === 0 ? "success" : "warning";
};

export const convertAffirmationFormData2RatanAffirmation = (
  formData: affirmationSubmitFormDataType | null
): AffirmationFormDataType => {
  return {
    Affirmed_At: formData?.affirmedAt,
    Affirmed_By: formData?.affirmedBy,
    Phone_Email: formData?.phone_email,
  };
};

export const handlePayload = (
  exceptions: ExceptionItem[],
  formPayload: ExtraFormSubmitFormDataType | undefined
) => {
  const formPayloadCopy = cloneDeep(formPayload);
  if (!formPayloadCopy) return formPayloadCopy;

  exceptions.forEach((exp) => {
    const { Exception_Category } = exp;
    if (
      Exception_Category === ExceptionCategory.AFFIRMATION &&
      exp.Stashing?.Maker_Request_Body
    ) {
      try {
        formPayloadCopy[MultiExceptionsNames.Affirmation] = JSON.parse(
          exp.Stashing.Maker_Request_Body
        );
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  });
  return formPayloadCopy;
};
