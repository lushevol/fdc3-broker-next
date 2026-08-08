import React, { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import TimePicker from "../../../LazyAntd/TimePicker";

export const TimePickerItem: FC<any> = ({ disabled, field, ...rest }: any) => {
  return <NewTimePickerItem disabled={disabled} field={field} {...rest} />;
};

interface NewTimePickerItemProps {
  field: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled: boolean;
}

const NewTimePickerItem: FC<NewTimePickerItemProps> = ({
  field,
  value = "00:00:00",
  onChange,
  disabled,
}) => {
  const [time, setTime] = useState(value);

  const change = (_time: any, timeString: string) => {
    onChange && onChange(timeString);
    setTime(timeString);
  };

  useEffect(() => {
    onChange && onChange(value);
  }, []);

  return (
    <TimePicker
      disabled={disabled}
      value={dayjs(time, "HH:mm:ss")}
      data-testid={field}
      clearIcon={<></>}
      onChange={change}
    />
  );
};
