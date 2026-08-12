import React, { FC } from "react";
import InputNumber from "../../../LazyAntd/InputNumber";
export const InputNumberItem: FC<any> = ({
  disabled,
  field,
  onChange,
  configs,
  form,
  data,
  update,
}: any) => {
  const onChangeFun = async (value) => {
    if (typeof onChange === "function") {
      const newConfigs = await onChange(value, configs, form, data);
      if (Array.isArray(newConfigs)) {
        update(newConfigs);
      }
    }
  };

  return (
    <InputNumber
      disabled={disabled}
      data-testid={field}
      precision={0}
      onChange={onChangeFun}
    />
  );
};
