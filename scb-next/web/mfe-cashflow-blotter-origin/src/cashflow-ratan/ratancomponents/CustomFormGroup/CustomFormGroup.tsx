import React, {
  useState,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
  PropsWithChildren,
} from "react";
import { Form, message } from "antd";
import cn from "classnames";
import { useValidation } from "../CustomForm/validationRules";
import { StyleRoot } from "./style";
import {
  CustomFormProps,
  RefStructType,
  AntFormCustomValidate,
  CustomFormGroupConfigProps,
} from "./interface";

import FormSkeleton from "../CustomForm/FormSkeleton";
import {
  OnPreButton,
  OnSubmitButton,
  OnNextButton,
  OnResetButton,
  OnRejectButton,
  OnConditionDivider,
} from "../CustomForm/formControlButtons";
import FormItemsBuilderGroup from "./FormItemsBuilderGroup";
import useController from "./common/useControllerGroup";

const defaultLayout = {
  labelCol: {},
  wrapperCol: {},
};

const CustomFormGroup = forwardRef<
  RefStructType,
  PropsWithChildren<CustomFormProps>
>((props, ref) => {
  const {
    formConfig,
    className,
    defaultData,
    initialValues,
    editable = true,
    layout = defaultLayout,
    onChange,
    onSubmit,
    onReject,
    onNext,
    onPre,
    enableReset = true,
    validationRuleName = "",
    customRules = [],
    data = {},
    formName,
    isCashflowSettlementCN,
    validationRules = [],
    children,
    populateRules,
  } = props;
  const [form] = Form.useForm();
  const {
    onFinish,
    onFinishFailed,
    onReset,
    reject,
    error,
    setError,
    enable,
    set,
    reset,
    newFormConfig,
    setFormConfig,
  } = useController(props, form);
  const customClassName = cn("custom-form-group", className);
  const {
    rulesObj,
    isRequiredObj,
    isReady,
    resetValidation,
    valuesChange,
    forceRefreshValidation,
    autoInputValues,
  } = useValidation({
    entity: validationRuleName,
    form,
    editable,
    btnSet: set,
    onFormChange: onChange,
    isCashflowSettlementCN,
    validationRules,
    populateRules,
  });
  const [customValidateStatus, setCustomValidateStatus] = useState<{
    [n: string]: AntFormCustomValidate;
  }>({});
  const [messageApi, messageContextHolder] = message.useMessage();

  useImperativeHandle(
    ref,
    () => {
      return {
        getForm() {
          return form;
        },
        setValidateStatus(vs: { [n: string]: AntFormCustomValidate }) {
          setCustomValidateStatus(vs);
        },
        clearValidateStatus() {
          setCustomValidateStatus({});
        },
        forceRefreshValidation(data: any) {
          forceRefreshValidation(data);
        },
        setFormConfig(config: CustomFormGroupConfigProps[]) {
          setFormConfig(config);
        },
        valuesChange(obj: any, all?: any) {
          valuesChange(obj, all);
        },
      };
    },
    [form, forceRefreshValidation, setFormConfig]
  );

  const Items = useMemo(() => {
    return (
      <FormItemsBuilderGroup
        enable={enable}
        editable={editable}
        error={error}
        isRequiredObj={isRequiredObj}
        newFormConfig={newFormConfig}
        customValidateStatus={customValidateStatus}
        messageApi={messageApi}
        customRules={customRules}
        rulesObj={rulesObj}
        data={data}
        form={form}
        onUpdate={(configs: CustomFormGroupConfigProps[]) => {
          setFormConfig(configs);
        }}
      />
    );
  }, [
    enable,
    editable,
    error,
    isRequiredObj,
    newFormConfig,
    customValidateStatus,
    messageApi,
  ]);

  useEffect(() => {
    const newData = defaultData || {};
    form.setFieldsValue({ ...data, ...newData });
    set("showForm", true);
  }, [defaultData, form]);

  useEffect(() => {
    if (Object.keys(data).length && isReady) {
      valuesChange(data);
    }
  }, [isReady, data]);

  useEffect(() => {
    if (Object.keys(error).length && editable) {
      form.validateFields();
    }
  }, [error]);

  useEffect(() => {
    return () => {
      form.resetFields();
      resetValidation();
      reset();
      setError({});
    };
  }, []);

  useEffect(() => {
    form.setFieldsValue(autoInputValues);
  }, [autoInputValues]);

  return (
    <StyleRoot>
      {enable.showForm ? (
        <Form
          className={customClassName}
          {...layout}
          form={form}
          name={formName}
          size="small"
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={valuesChange}
        >
          <div className="custom-form-body">{Items}</div>
          <div className="custom-form-bottom">
            <OnConditionDivider
              onReject={onReject}
              enableReset={enableReset}
              editable={editable}
              onSubmit={onSubmit}
            />
            {<div className="extra-actions">{children}</div>}
            <OnPreButton onPre={onPre} />
            <OnRejectButton
              onReject={onReject}
              enable={enable}
              reject={reject}
            />
            <OnResetButton
              enableReset={enableReset}
              editable={editable}
              enable={enable}
              onReset={onReset}
            />
            <OnSubmitButton
              onSubmit={onSubmit}
              enable={enable}
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
            />
            <OnNextButton
              onNext={onNext}
              enable={enable}
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
            />
            {messageContextHolder}
          </div>
        </Form>
      ) : (
        <FormSkeleton repeat={Math.ceil((formConfig?.length || 0) / 10)} />
      )}
    </StyleRoot>
  );
});

export default CustomFormGroup;
