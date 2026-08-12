import { useRef } from "react";

import { FormRef } from "../../CashflowDetails/MultiExceptions/common/interface";
import {
  affirmationSubmitFormDataType,
  affirmationSubmitFormRawDataType,
} from "../../CashflowDetails/MultiExceptions/components/Affirmation/interface";
import { BackValueFormDataType } from "../../CashflowDetails/MultiExceptions/components/BackValue/interface";
import { coverAffirmation } from "../../CashflowDetails/MultiExceptions/hooks/useForm";

export type ExtraFormRef = {
  submit: () => Promise<ExtraFormSubmitFormDataType | undefined>;
  validate: () => Promise<boolean>;
};

export type ExtraFormSubmitFormDataType = {
  affirmation?: affirmationSubmitFormDataType;
  back_value?: BackValueFormDataType;
  comment: {
    comment: string;
  };
};

export const useAffirmationAction = () => {
  const affirmRef = useRef<FormRef>(null);

  const validateAffirmationForm = async () => {
    const form = affirmRef.current?.getForm();
    if (!form) {
      throw new Error("Can't get affirmation form.");
    }
    await form.validateFields();
    return true;
  };

  const submitAffirmationForm = async () => {
    const form = affirmRef.current?.getForm();
    await validateAffirmationForm();
    const affirmationFormData =
      form!.getFieldsValue() as affirmationSubmitFormRawDataType;
    return coverAffirmation(affirmationFormData);
  };

  return {
    affirmRef,
    submitAffirmationForm,
    validateAffirmationForm,
  };
};

export const useBackValueDateAction = () => {
  const backValueDateRef = useRef<FormRef>(null);

  const validateBackValueDateForm = async () => {
    const form = backValueDateRef.current?.getForm();
    if (!form) {
      throw new Error("Can't get back value date form.");
    }
    await form.validateFields();
    return true;
  };

  const submitBackValueDateForm = async () => {
    const form = backValueDateRef.current?.getForm();
    await validateBackValueDateForm();
    const formData = form!.getFieldsValue() as BackValueFormDataType;
    return formData;
  };

  return {
    backValueDateRef,
    submitBackValueDateForm,
    validateBackValueDateForm,
  };
};

export const useBulkExtraForm = () => {
  const extraFormRef = useRef<ExtraFormRef>(null);

  const submitExtraForm = async () => {
    const extraFormData = await extraFormRef.current?.submit();
    return extraFormData;
  };

  const validateExtraForm = async () => {
    const res = await extraFormRef.current?.validate();
    return !!res;
  };

  return {
    extraFormRef,
    submitExtraForm,
    validateExtraForm,
  };
};
