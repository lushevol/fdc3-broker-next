import { FormInstance } from "antd";
import { useState } from "react";
import { useMap } from "react-use";
import cloneDeep from "lodash/cloneDeep";
import { CustomFormGroupConfigProps } from "../interface";
import { CustomFormProps } from "../../CustomForm/interface";
import { copyConfig } from "../../CustomForm/item/ItemsUtils";
import {
  collectFieldsFromGroupConfig,
  findGroupConfigItemByField,
} from "./utils";

const useControllerGroup = (props: CustomFormProps, form: FormInstance) => {
  const {
    formConfig,
    defaultData,
    editable,
    onSubmit,
    onReject,
    onNext,
    data = {},
  } = props;
  const [enable, { set, reset }] = useMap({
    submiting: false,
    rejecting: false,
    showForm: false,
    ruleError: false,
  });
  const [error, setError] = useState({});
  const [newFormConfig, setFormConfig] = useState<CustomFormGroupConfigProps[]>(
    cloneDeep(formConfig)
  );

  const onFinish = (values: any) => {
    const fields = collectFieldsFromGroupConfig(formConfig);
    fields.forEach((field) => {
      if (typeof values[field] === "undefined") {
        values[field] = "";
      }
      const element = findGroupConfigItemByField(formConfig, field);
      if (element?.notSubmit) {
        delete values[field];
      }
    });

    if (onSubmit) {
      set("submiting", true);
      onSubmit(values)
        .then(() => set("submiting", false))
        .catch((err: any) => {
          err && setError(err);
          set("submiting", false);
        });
    }

    if (onNext) {
      editable ? onNext(values) : onNext(defaultData);
    }
  };
  const onFinishFailed = () => {
    setError({});
  };
  const reject = () => {
    if (onReject) {
      set("rejecting", true);
      onReject()
        .then(() => set("rejecting", false))
        .catch(() => {
          set("rejecting", false);
        });
    }
  };
  const onReset = () => {
    const resetFields: string[] = [];
    const fields = collectFieldsFromGroupConfig(formConfig);

    fields.forEach((field) => {
      if (typeof data[field] === "undefined") {
        resetFields.push(field);
      }
    });

    form.resetFields(resetFields);
    setFormConfig(copyConfig(formConfig));
  };

  return {
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
  };
};

export default useControllerGroup;
