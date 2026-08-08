import React, { FC } from "react";
import Input from "../../../LazyAntd/Input";
export const InputItem: FC<any> = ({
  disabled,
  field,
  data,
  form,
  configs,
  onChange,
  update,
}: any) => {
  const onChangeFun = async (e: any) => {
    if (typeof onChange === "function") {
      const newConfig = await onChange(e.target.value, configs, form, data);
      if (Array.isArray(newConfig)) {
        update(newConfig);
      }
    }
  };

  return (
    <Input disabled={disabled} data-testid={field} onChange={onChangeFun} />
  );
};
