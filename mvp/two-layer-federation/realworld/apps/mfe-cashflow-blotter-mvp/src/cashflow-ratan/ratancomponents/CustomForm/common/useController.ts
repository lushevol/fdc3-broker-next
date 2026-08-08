import { FormInstance } from "antd";
import { useState } from "react";
import { useMap } from "react-use";
import { CustomFormConfigProps } from "../FormItemComponents";
import { CustomFormProps } from "../interface";
import { copyConfig } from "../item/ItemsUtils";

const useController = (props: CustomFormProps, form: FormInstance) => {
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
  const [newFormConfig, setFormConfig] = useState<CustomFormConfigProps[]>(
    copyConfig(formConfig)
  );

  const onFinish = (values: any) => {
    formConfig.forEach((element: CustomFormConfigProps) => {
      if (typeof values[element.field] === "undefined") {
        values[element.field] = "";
      }
      if (element.notSubmit) {
        delete values[element.field];
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
    formConfig.forEach((item: CustomFormConfigProps) => {
      if (typeof data[item.field] === "undefined") {
        resetFields.push(item.field);
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

export default useController;
