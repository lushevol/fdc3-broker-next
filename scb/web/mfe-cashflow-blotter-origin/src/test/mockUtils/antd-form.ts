import { FormInstance } from "antd";

import { fn } from "../test-utils";

export const mockFormInstance = jest.fn<FormInstance, []>(() => {
  return {
    getFieldValue: fn(),
    getFieldsValue: fn(),
    getFieldError: fn(),
    getFieldsError: fn(),
    getFieldWarning: fn(),
    isFieldsTouched: fn(),
    isFieldTouched: fn(),
    isFieldValidating: fn(),
    isFieldsValidating: fn(),
    resetFields: fn(),
    setFields: fn(),
    setFieldValue: fn(),
    setFieldsValue: fn(),
    validateFields: fn(),
    submit: fn(),
    scrollToField: fn(),
    getFieldInstance: fn(),
  };
});
