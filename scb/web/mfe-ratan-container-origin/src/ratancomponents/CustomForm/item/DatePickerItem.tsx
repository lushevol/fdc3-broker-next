import React, { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import DatePicker from "../../../LazyAntd/DatePicker";

export const DatePickerItem: FC<any> = ({ disabled, field, ...rest }: any) => {
  return <NewDatePickerItem disabled={disabled} field={field} {...rest} />;
};

interface NewDatePickerItemProps {
  field: string;
  value?: any;
  onChange?: (value: any) => void;
  defaultValue?: any;
  disabled: boolean;
  disabledDate?: Function;
}

export const NewDatePickerItem: FC<NewDatePickerItemProps> = ({
  field,
  value,
  onChange,
  defaultValue,
  disabled,
  disabledDate,
}) => {
  const dateUTCFormat = "YYYY-MM-DD";
  const [date, setDate] = useState<any>(value);

  const change = (_dates: any, dateStrings: string) => {
    onChange && onChange(dateStrings);
    setDate(dateStrings);
  };

  useEffect(() => {
    let initValue = "";
    if (value) {
      initValue = dayjs(value).format("YYYY-MM-DD");
    } else if (defaultValue) {
      initValue = dayjs(defaultValue).format("YYYY-MM-DD");
    }
    onChange && onChange(initValue);
  }, []);

  const showDefaultValue = () => {
    return defaultValue ? dayjs(defaultValue, "YYYY-MM-DD") : undefined;
  };

  const showValue = () => {
    return date ? dayjs(date, "YYYY-MM-DD") : undefined;
  };

  return (
    <DatePicker
      format={dateUTCFormat}
      disabled={disabled}
      defaultValue={showDefaultValue()}
      value={showValue()}
      data-testid={field}
      onChange={change}
      disabledDate={(e) => disabledDate && disabledDate(e)}
    />
  );
};
