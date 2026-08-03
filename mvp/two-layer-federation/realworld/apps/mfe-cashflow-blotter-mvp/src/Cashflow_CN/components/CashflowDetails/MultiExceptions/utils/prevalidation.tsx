import { postExceptionBundleAction } from "src/Cashflow_CN/services";
import {
  DUAL_BLIND_VALID_FAILED,
  DUAL_BLIND_VALID_SUCCESS,
  EXCEPTION_FIXING_ACTION,
  RTT_MUTATION_EXCEPTION,
} from "src/Root/analysis/const";

import {
  Checker,
  ExceptionBundleStatusTypes,
  Maker,
  MultiExceptionsNames,
} from "../common/interface";
import {
  assembleSubmitRequestBody,
  dataAccuracyVerification,
  isMakerOrCheckInputFedwire,
  missingNostroSubmitPreCheck,
  trimObject,
} from "../common/utils";

type TData = { [n: string]: any };

export const validationPrepareData = (
  originalData: TData,
  context: any
): TData => {
  const data = { ...originalData };
  trimObject(data[MultiExceptionsNames.Vostro]);
  trimObject(data[MultiExceptionsNames.Nostro]);
  const {
    settlementMethod,
    userRole,
    makerSubmittedData,
    isFixingMissingNostro,
  } = context;
  if (data[MultiExceptionsNames.Vostro]) {
    data[MultiExceptionsNames.Vostro].settlementMethod = settlementMethod;
  }
  // 1. when settlement method no FEDWIRE in maker/checker input, bypass check, copy checker from maker, should be always pass in ui/be dual blind checking
  // 2. anyone of maker/checker input involve FEDWIRE, UI will compare on settlement method
  // 3. Back end no change, compare all the way
  // 4. null and "" are all CASH by default
  if (
    userRole === Checker &&
    data[MultiExceptionsNames.Vostro] &&
    makerSubmittedData[MultiExceptionsNames.Vostro] &&
    !isMakerOrCheckInputFedwire(
      data[MultiExceptionsNames.Vostro],
      makerSubmittedData[MultiExceptionsNames.Vostro]
    )
  ) {
    data[MultiExceptionsNames.Vostro].settlementMethod =
      makerSubmittedData[MultiExceptionsNames.Vostro].settlementMethod;
  }
  if (isFixingMissingNostro) {
    missingNostroSubmitPreCheck(data);
  }
  return data;
};

const checkerOnlyChecking = (targetData, context) => {
  const {
    userRole,
    next,
    setFormValidateStatus,
    showFeedback,
    action,
    makerSubmittedData,
  } = context;
  const { ok, msg } = dataAccuracyVerification(
    targetData,
    userRole === Checker ? makerSubmittedData : {}
  );
  try {
    if (userRole === Checker) {
      next(ok ? DUAL_BLIND_VALID_SUCCESS : DUAL_BLIND_VALID_FAILED);
    } else {
      // when maker, first slot should be skip.
      next("");
    }
  } catch (error) {
    console.error(error);
  }
  if (!ok) {
    setFormValidateStatus(msg);
    showFeedback({
      type: "warning",
      content: msg.map((m) => (
        <p
          key={`${m.section}_${m.field}`}
        >{`[${m.section}] ${m.field}: ${m.errorMsg}.`}</p>
      )),
    });
    next(action);
    const { complete } = next(JSON.stringify(msg));
    complete();
    return false;
  }
  return true;
};

export const hasExceptionsChecking = async (context) => {
  const {
    isReject,
    hasHardBlockerExceptions,
    hasRebookExceptions,
    showFeedback,
    next,
    modalApi,
  } = context;
  if (hasHardBlockerExceptions && !isReject) {
    showFeedback({
      type: "error",
      content:
        "This is a Swap Agent Coupon or Interim MTM cashflow, can't be released from Ratan.",
    });
    next("").abort();
    return false;
  }
  if (hasRebookExceptions) {
    const confirmed = await modalApi.confirm({
      title: "Warning",
      content: "Please confirm to procceed Rebook exception.",
      okText: "Continue",
      getContainer: false,
      centered: true,
    });
    if (!confirmed) {
      next("").abort();
      return false;
    }
  }
  return true;
};

export const validationMain = async (targetData: TData, context) => {
  const {
    isSubmit,
    userRole,
    makerSubmittedData,
    startTracking,
    setFormValidateStatus,
    showFeedback,
    hasHardBlockerExceptions,
    hasRebookExceptions,
    modalApi,
    startTrackingRTT,
    cashflowDetails,
    allAvailableCommonExceptionsData,
    clearFormValidateStatus,
    closeDialog,
    refreshCashflow,
    payload,
  } = context;
  // ready to submit/approve/reject
  let action = ExceptionBundleStatusTypes.Reject;
  // first slot: checker dual blind check success or failed
  // second slot: action
  // third slot:
  const next = startTracking(EXCEPTION_FIXING_ACTION);
  // data accuracy verification
  let flag = true;
  if (isSubmit) {
    action =
      userRole === Checker
        ? ExceptionBundleStatusTypes.Approve
        : ExceptionBundleStatusTypes.Submit;
    // checker only. double blind checking
    flag = checkerOnlyChecking(targetData, {
      userRole,
      next,
      setFormValidateStatus,
      showFeedback,
      action,
      makerSubmittedData,
    });
    if (!flag) return flag;
  } else {
    // when reject, first slot should be skip.
    next("");
  }
  // hardBlockExceptionChecking
  const isReject = !isSubmit;
  flag = await hasExceptionsChecking({
    isReject,
    hasHardBlockerExceptions,
    hasRebookExceptions,
    showFeedback,
    next,
    modalApi,
  });
  if (!flag) return flag;

  // as affirmation exception changed to maker checker
  // so checker don't have to pass affirm inform
  // UPDATED 2024-10-23
  // payload still required in checker approve to generate affirm event audits
  if (userRole === Checker && !isSubmit)
    targetData[MultiExceptionsNames.Affirmation] = null;
  const { completeTracking, abortTracking } = startTrackingRTT();
  try {
    await postExceptionBundleAction(
      assembleSubmitRequestBody({
        cashflowDetails: cashflowDetails.cashflow ?? {},
        exceptions: allAvailableCommonExceptionsData,
        payload: targetData,
        action,
        filterExceptionNames: payload,
      }),
      userRole === Checker ? Checker : Maker
    );
    completeTracking({ name: RTT_MUTATION_EXCEPTION });
  } catch (error: any) {
    showFeedback({
      type: "error",
      content: error.response?.data?.errorMessage || error.message || error,
    });
    abortTracking();
    return false;
  }
  showFeedback({
    type: "success",
    content: `${action} successfully!`,
  });
  clearFormValidateStatus();
  if (closeDialog) {
    closeDialog();
  } else {
    refreshCashflow();
  }
  try {
    const { complete } = next(action);
    complete();
  } catch (error) {
    console.error(error);
  }
  return true;
};
