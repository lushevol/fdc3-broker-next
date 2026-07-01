import { FC, memo, useEffect } from "react";
import { Input, InputNumber } from "antd";
// Input Component
interface FunInputProps {
  value: undefined | string;
  config: any;
  field: string;
  disabled: boolean;
  onChange: (field: string, value: undefined | string) => void;
}
const FunInput: FC<FunInputProps> = memo(
  ({ value, config, field, disabled = false, onChange }) => {
    useEffect(() => {
      onChange(field, value);
    }, []);
    const change = (e) => {
      onChange(field, e.target.value);
    };

    return (
      <Input
        size={"middle"}
        defaultValue={value}
        allowClear={true}
        placeholder={config.placeholder}
        disabled={disabled}
        onChange={change}
        style={{ width: "150px" }}
        data-testid={`${field}-input`}
      />
    );
  }
);

// InputNumber Component
interface FunInputNumberProps {
  value: number | undefined;
  config: any;
  field: string;
  disabled: boolean;
  onChange: (field: string, value: undefined | number) => void;
}
const FunInputNumber: FC<FunInputNumberProps> = memo(
  ({ value, config, field, disabled = false, onChange }) => {
    useEffect(() => {
      onChange(field, value);
    }, []);

    const change = (value) => {
      onChange(field, value);
    };

    return (
      <InputNumber
        size={"middle"}
        value={value}
        placeholder={config.placeholder}
        disabled={disabled}
        onChange={change}
        style={{ width: "150px" }}
        data-testid={`${field}-input-number`}
      />
    );
  }
);

const components: MapType = {
  FunInput,
  FunInputNumber,
};

interface ItemsComponentProps {
  config: any;
  field: string;
  initValue: any;
  disabled: boolean | undefined;
  onChange: (field: string, value: undefined | string | number) => void;
}
export default function FunItemsComponent({
  config,
  field,
  initValue,
  disabled = false,
  onChange,
}: ItemsComponentProps) {
  const ItemDom = components[config.renderComp];

  if (!ItemDom) {
    return <></>;
  }

  return (
    <ItemDom
      value={initValue}
      field={field}
      config={config}
      disabled={disabled}
      onChange={onChange}
    />
  );
}
