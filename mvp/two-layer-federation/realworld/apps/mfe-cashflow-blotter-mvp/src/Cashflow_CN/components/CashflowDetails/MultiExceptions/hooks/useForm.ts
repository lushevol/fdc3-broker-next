import dayjs from "dayjs";
import { MutableRefObject, RefObject, useCallback, useRef } from "react";

import {
  AntFormCustomValidate,
  CommonExceptionsNames,
  FormErrorType,
  FormRef,
  MultiExceptionsNames,
  RefStructType,
} from "../common/interface";
import {
  DateFormat,
  isMissingNostroException,
  isSSIGoodStamping,
  isVostroFormDataEmpty,
  TimeFormat,
} from "../common/utils";
import type {
  affirmationSubmitFormDataType,
  affirmationSubmitFormRawDataType,
} from "../components/Affirmation/interface";
import { ClassifiedCommonExceptionsType, FormSubmitResult } from "./interface";

export const submitForm = async (
  name: string,
  formRef: MutableRefObject<FormRef | null>,
  skipValidate?: boolean
) => {
  const form = formRef?.current?.getForm();
  if (!form) {
    return { name, isValid: false, error: [], data: {} };
  }
  formRef?.current?.clearValidateStatus?.();
  if (skipValidate !== true) {
    try {
      await form.validateFields();
    } catch (error) {
      console.info(error);
    }
  }
  const formValidateError = form.getFieldsError();
  const formFieldsValue = form.getFieldsValue();

  const isValid = !formValidateError.some((e) => !!e.errors.length);
  return {
    name,
    isValid,
    error: formValidateError,
    data: formFieldsValue,
  };
};

export const precheckVostroDataBeforeSubmit = (
  formRef: MutableRefObject<FormRef | null>
) => {
  const form = formRef?.current?.getForm();
  if (form) {
    const beneficiaryBic = form.getFieldValue("beneficiaryBic");
    if (!beneficiaryBic) form.setFieldValue("beneficiaryBic", "");
    const beneficiaryName = form.getFieldValue("beneficiaryName");
    if (!beneficiaryName) form.setFieldValue("beneficiaryName", "");
  }
};

export const handleFormSubmitable = (
  classifiedCommonExceptions: ClassifiedCommonExceptionsType,
  isReject: boolean,
  isAdhocing: boolean,
  isFixingMissingNostro: boolean,
  vostroCanEmptyWhenFixingMissingNostro: boolean,
  vostroFormRef: RefObject<RefStructType>
) => {
  const shouldGetFormData_SkipValid: {
    [n: CommonExceptionsNames]: boolean;
  } = {};
  const shouldGetFormData = Object.entries(classifiedCommonExceptions).reduce<
    Record<CommonExceptionsNames, boolean>
  >((res, cur) => {
    const [expName, expList] = cur;
    // if reject, no form is mandatory valid except comment.
    res[expName] = !!expList.length;
    shouldGetFormData_SkipValid[expName] = false;
    if (expName === MultiExceptionsNames.Vostro && expList.length === 1) {
      if (isSSIGoodStamping(expList[0])) res[expName] = isAdhocing;
      else if (isMissingNostroException(expList[0])) {
        if (vostroCanEmptyWhenFixingMissingNostro) {
          const vostroForm = vostroFormRef.current?.getForm();
          const vostroData = vostroForm?.getFieldsValue();
          // when we receive and vostro is empty (user don't touch it), allow submit empty.
          shouldGetFormData_SkipValid[MultiExceptionsNames.Vostro] =
            isVostroFormDataEmpty(vostroData);
        }
        res[expName] = isFixingMissingNostro; // also submit nostro form
      }
    }
    if (isReject) shouldGetFormData_SkipValid[expName] = true;
    return res;
  }, {});
  return { shouldGetFormData, shouldGetFormData_SkipValid };
};

export const coverVostroData = (data: PlainObject) => {
  if (!data.isThirdPartyPayment) data.isThirdPartyPayment = "N";
  if (!data.coveredPayment) data.coveredPayment = "N";
  if (data.orderingCustomerFields) delete data.orderingCustomerFields;
  if (data.beneficiaryFields) delete data.beneficiaryFields;
  if (data.entity) delete data.entity;
  if (data.tradingCurrency) delete data.tradingCurrency;
  return data;
};

export const coverNostroData = (data: PlainObject) => {
  if (!data.noticeToReceive) data.noticeToReceive = "N";
  if (data.nostroType === "DEFAULT") data.dedicatedPortfolio = null;
  return data;
};

export const coverAffirmation = (
  data: affirmationSubmitFormRawDataType
): affirmationSubmitFormDataType => {
  return {
    ...data,
    affirmedAt: (data.affirmedAt instanceof dayjs
      ? data.affirmedAt.format(`${DateFormat}T${TimeFormat}`)
      : data.affirmedAt) as string,
  };
};

export const coverBackvalue = (data: any) => {
  if (data.swiftPaymentDate instanceof dayjs) {
    data.swiftPaymentDate = data.swiftPaymentDate.format(DateFormat);
  }
  return data;
};

export const handleSubmitFormData = (name: string, data: any) => {
  switch (name) {
    case MultiExceptionsNames.Vostro:
      return coverVostroData(data);

    case MultiExceptionsNames.Nostro:
      return coverNostroData(data);

    case MultiExceptionsNames.Affirmation:
      return coverAffirmation(data);

    case MultiExceptionsNames.Backvalue:
      return coverBackvalue(data);

    default:
      break;
  }
  return data;
};

// double validate form in case form validation rule loading issue.
// #8177675
export const doubleValidation = (fulfilledValue: {
  name: string;
  isValid: boolean;
  data: any;
}) => {
  let { name, data } = fulfilledValue;
  // affirmation exception 3 fields should be mandatory
  if (name === MultiExceptionsNames.Affirmation && !data.affirmedAt) {
    return {
      ...fulfilledValue,
      isValid: false,
    };
  }

  return fulfilledValue;
};

const useForm = () => {
  const vostroFormRef = useRef<RefStructType>(null);
  const nostroFormRef = useRef<RefStructType>(null);
  const affirmationFormRef = useRef<FormRef>(null);
  const backvalueFormRef = useRef<FormRef>(null);
  const commentsFormRef = useRef<FormRef>(null);

  const formNameRefMap = (
    name: string
  ): React.RefObject<FormRef> | React.RefObject<RefStructType> | undefined => {
    switch (name) {
      case MultiExceptionsNames.Vostro:
        return vostroFormRef;
      case MultiExceptionsNames.Nostro:
        return nostroFormRef;
      case MultiExceptionsNames.Affirmation:
        return affirmationFormRef;
      case MultiExceptionsNames.Backvalue:
        return backvalueFormRef;
      case MultiExceptionsNames.Comment:
        return commentsFormRef;
      default:
        return;
    }
  };

  const allFormsSubmit = useCallback(
    async ({
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
    }) => {
      const { shouldGetFormData, shouldGetFormData_SkipValid } =
        handleFormSubmitable(
          classifiedCommonExceptions,
          isReject,
          isAdhocing,
          isFixingMissingNostro,
          vostroCanEmptyWhenFixingMissingNostro,
          vostroFormRef
        );
      if (shouldGetFormData[MultiExceptionsNames.Vostro])
        precheckVostroDataBeforeSubmit(vostroFormRef);

      const validFormList = [
        submitForm(MultiExceptionsNames.Comment, commentsFormRef, !isReject),
        ...(shouldGetFormData[MultiExceptionsNames.Backvalue]
          ? [
              submitForm(
                MultiExceptionsNames.Backvalue,
                backvalueFormRef,
                shouldGetFormData_SkipValid[MultiExceptionsNames.Backvalue]
              ),
            ]
          : []),
        ...(shouldGetFormData[MultiExceptionsNames.Affirmation]
          ? [submitForm(MultiExceptionsNames.Affirmation, affirmationFormRef)]
          : []),
        ...(shouldGetFormData[MultiExceptionsNames.Vostro]
          ? [
              submitForm(MultiExceptionsNames.Nostro, nostroFormRef),
              submitForm(
                MultiExceptionsNames.Vostro,
                vostroFormRef,
                shouldGetFormData_SkipValid[MultiExceptionsNames.Vostro]
              ),
            ]
          : []),
        // seems no single nostro fixing now, can remove below
        ...(shouldGetFormData[MultiExceptionsNames.Nostro]
          ? [
              submitForm(
                MultiExceptionsNames.Nostro,
                nostroFormRef,
                shouldGetFormData_SkipValid[MultiExceptionsNames.Nostro]
              ),
            ]
          : []),
      ];

      const result = await Promise.allSettled(validFormList);
      return result.reduce<FormSubmitResult>(
        (res, i) => {
          if (i.status === "fulfilled") {
            let { name, isValid, data } = doubleValidation(i.value);
            res.valid &&= isValid;
            res.data[name] = handleSubmitFormData(name, data);
          } else res.valid = false;
          return res;
        },
        {
          valid: true,
          data: {},
        }
      );
    },
    []
  );

  const setFormValidateStatus = useCallback((formErrors: FormErrorType[]) => {
    const transformedValidateStatus = formErrors.reduce<{
      [section: string]: { [field: string]: AntFormCustomValidate };
    }>((res, cur) => {
      if (cur.type === "form") {
        if (!res[cur.section]) res[cur.section] = {};
        res[cur.section][cur.field] = {
          help: cur.errorMsg ?? "",
          validateStatus: cur.errorType,
          hasFeedback: true,
        };
      }
      return res;
    }, {});
    Object.keys(transformedValidateStatus).forEach((section) => {
      const formRef = formNameRefMap(section);
      formRef?.current?.setValidateStatus(transformedValidateStatus[section]);
    });
  }, []);

  const clearFormValidateStatus = useCallback((formName?: string) => {
    if (!formName) {
      [
        MultiExceptionsNames.Vostro,
        MultiExceptionsNames.Nostro,
        MultiExceptionsNames.Affirmation,
        MultiExceptionsNames.Backvalue,
      ].forEach((name) => clearFormValidateStatus(name));
    } else {
      const formRef = formNameRefMap(formName);
      formRef?.current?.clearValidateStatus();
    }
  }, []);

  const onResetFormValidationStatus = useCallback((n: string, payload: any) => {
    if (n === MultiExceptionsNames.Vostro) {
      const formRef = formNameRefMap(n);
      (
        formRef as React.RefObject<RefStructType>
      ).current?.forceRefreshValidation?.(payload);
    }
  }, []);

  return {
    vostroFormRef,
    nostroFormRef,
    affirmationFormRef,
    backvalueFormRef,
    commentsFormRef,
    allFormsSubmit,
    setFormValidateStatus,
    clearFormValidateStatus,
    formNameRefMap,
    onResetFormValidationStatus,
  };
};

export default useForm;
