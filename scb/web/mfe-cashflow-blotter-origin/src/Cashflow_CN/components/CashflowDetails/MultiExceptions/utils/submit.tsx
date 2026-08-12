import { MessageArgsProps } from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import { IterableCollectNext } from "src/Root/analysis";
import { EXCEPTION_FIXING_VALIDATION_FAILED } from "src/Root/analysis/const";

import { FormErrorType, UserType } from "../common/interface";
import { allowVostroEmptyWhenFixingMissingNostro } from "../common/utils";
import { ExceptionActionsProps } from "../components/Actions/interface";
import {
  ClassifiedCommonExceptionsType,
  FormSubmitResult,
} from "../hooks/interface";
import { validationMain, validationPrepareData } from "./prevalidation";

export const submitHelper =
  ({
    cashflowDetails,
    allFormsSubmit,
    classifiedCommonExceptions,
    isAdhocing,
    isFixingMissingNostro,
    startTracking,
    startTrackingRTT,
    userRole,
    makerSubmittedData,
    setFormValidateStatus,
    showFeedback,
    hasRebookExceptions,
    hasHardBlockerExceptions,
    modalApi,
    allAvailableCommonExceptionsData,
    clearFormValidateStatus,
    closeDialog,
    refreshCashflow,
    settlementMethod,
  }: {
    cashflowDetails: GraphqlCashflowDetails;
    allFormsSubmit: ({
      classifiedCommonExceptions,
      isReject,
      isAdhocing,
      isFixingMissingNostro,
      vostroCanEmptyWhenFixingMissingNostro,
    }: {
      classifiedCommonExceptions: ClassifiedCommonExceptionsType;
      isReject: boolean;
      isAdhocing: boolean;
      isFixingMissingNostro: boolean;
      vostroCanEmptyWhenFixingMissingNostro: boolean;
    }) => Promise<FormSubmitResult>;
    classifiedCommonExceptions: ClassifiedCommonExceptionsType;
    isAdhocing: boolean;
    isFixingMissingNostro: boolean;
    startTracking: (name: string) => IterableCollectNext;
    startTrackingRTT: (props1?: { name?: string }) => {
      completeTracking: (props2?: { name?: string }) => void;
      abortTracking: () => void;
    };
    userRole: UserType;
    makerSubmittedData: {
      [n: string]: any;
    };
    setFormValidateStatus: (formErrors: FormErrorType[]) => void;
    showFeedback: ({ content, type }: MessageArgsProps) => void;
    hasRebookExceptions: boolean;
    hasHardBlockerExceptions: boolean;
    modalApi: HookAPI;
    allAvailableCommonExceptionsData: RatanException[];
    clearFormValidateStatus: (formName?: string | undefined) => void;
    closeDialog?: () => void;
    refreshCashflow: () => Promise<any>;
    settlementMethod: string;
  }): ExceptionActionsProps["onSubmit"] =>
  async (isSubmit, payload) => {
    try {
      const { valid, data } = await allFormsSubmit({
        classifiedCommonExceptions,
        isReject: !isSubmit,
        isAdhocing,
        isFixingMissingNostro,
        vostroCanEmptyWhenFixingMissingNostro:
          allowVostroEmptyWhenFixingMissingNostro(cashflowDetails.cashflow),
      });

      // 1. when settlement method no FEDWIRE in maker/checker input, bypass check, copy checker from maker, should be always pass in ui/be dual blind checking
      // 2. anyone of maker/checker input involve FEDWIRE, UI will compare on settlement method
      // 3. Back end no change, compare all the way
      // 4. null and "" are all CASH by default

      // enrichdata
      const targetData = validationPrepareData(data, {
        settlementMethod,
        userRole,
        makerSubmittedData,
        isFixingMissingNostro,
      });

      if (valid) {
        return await validationMain(targetData, {
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
        });
      } else {
        const next = startTracking(EXCEPTION_FIXING_VALIDATION_FAILED);
        const { complete } = next("");
        complete();
        showFeedback({
          type: "warning",
          content: "Please check validation warning message before submit.",
        });
        return false;
      }
    } catch (error) {
      return false;
    }
  };
