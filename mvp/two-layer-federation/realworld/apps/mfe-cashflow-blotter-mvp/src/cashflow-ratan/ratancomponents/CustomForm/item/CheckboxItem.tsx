import React, { FC, useEffect, useState } from "react";
import Checkbox from "../../../LazyAntd/Checkbox";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

export const CheckboxItem: FC<NewCheckboxItemProps> = ({
  disabled,
  field,
  ...rest
}: any) => {
  return <NewCheckboxItem disabled={disabled} field={field} {...rest} />;
};

interface NewCheckboxItemProps {
  field: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled: boolean;
}

const isChecked = (i?: string) => {
  return i === "Y";
};

const NewCheckboxItem: FC<NewCheckboxItemProps> = ({
  field,
  value,
  onChange,
  disabled,
}) => {
  const [boxValue, setBoxValue] = useState(false);

  const change = (e: CheckboxChangeEvent) => {
    const thisValue = e.target.checked;
    const newValue = thisValue ? "Y" : "N";
    onChange && onChange(newValue);
    setBoxValue(thisValue);
  };

  useEffect(() => {
    const changeValue = isChecked(value);
    onChange && onChange(value || "N");
    setBoxValue(changeValue);
  }, [value]);

  return (
    <Checkbox
      disabled={disabled}
      defaultChecked={isChecked(value)}
      data-testid={field}
      onChange={change}
      checked={boxValue}
    />
  );
};
