import { Button, DatePicker, Popover } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { css, styled } from "@mui/material/styles";
import cn from "classnames";
import { generateDatePickerFormat } from "../Function";
import { CustomDatePickerSelect } from "./CustomDatePickerSelect";
import { CustomDateTimeSelect } from "./CustomDateTimeSelect";

dayjs.extend(utc);

const Root = styled("div")(
  () =>
    css`
      flex: 1;
      display: flex;
      .custom-variable {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
      }
      .ant-btn {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
      }
    `
);

export const CustomContent = ({
  variableList,
  inputTypeCoerced,
  customChange,
  value,
}) => {
  if (inputTypeCoerced === "date") {
    return (
      <CustomDatePickerSelect
        data={value}
        variableList={variableList}
        onChange={customChange}
      />
    );
  } else if (inputTypeCoerced === "datetime") {
    return (
      <CustomDateTimeSelect
        data={value}
        variableList={variableList}
        onChange={customChange}
      />
    );
  }
  return <></>;
};

export const CustomDatePacker = ({
  className,
  value,
  disabled,
  placeHolderText,
  variableList,
  inputTypeCoerced,
  operator,
  staticFormat,
  handleOnChange,
}: any) => {
  const [open, setOpen] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [thisValue, setThisValue] = useState<any>();
  const enableVariable = variableList.length > 0;

  const change = (d) => {
    handleOnChange(d ? dayjs(d).format(staticFormat) : "");
  };

  const customChange = (value) => {
    setOpen(false);
    handleOnChange(value);
  };

  useEffect(() => {
    try {
      if (dayjs(value).isValid()) {
        setThisValue(dayjs(value, staticFormat));
      } else if (value) {
        setThisValue(dayjs(new Date()));
      } else {
        setThisValue(undefined);
      }
    } catch (error) {
      setThisValue(undefined);
    }
  }, [value]);

  return (
    <Root>
      <DatePicker
        value={thisValue}
        showTime={["datetime-local", "datetime"].includes(inputTypeCoerced)}
        className={cn(className, { "custom-variable": enableVariable })}
        disabled={disabled}
        placeholder={placeHolderText}
        onChange={change}
        onOpenChange={(open) => {
          setOpenPicker(open);
          if (value && !dayjs(value).isValid())
            if (open) {
              setThisValue(undefined);
            } else if (!open) {
              setThisValue(dayjs(new Date()));
            }
        }}
        allowClear
        format={(dateValue) => {
          if (openPicker) {
            return generateDatePickerFormat(staticFormat)(thisValue, dateValue);
          } else {
            return generateDatePickerFormat(staticFormat)(value, dateValue);
          }
        }}
        data-testid={"datetime-local"}
      />
      {enableVariable && (
        <Popover
          open={open}
          onOpenChange={setOpen}
          content={CustomContent({
            variableList,
            inputTypeCoerced,
            customChange,
            value,
          })}
          trigger="click"
          placement="bottom"
        >
          <Button
            disabled={disabled}
            style={{ padding: "2px 5px 0" }}
            icon={<DownOutlined style={{ fontSize: "12px" }} />}
            onClick={() => setOpen(true)}
            data-testid="open-popover"
          ></Button>
        </Popover>
      )}
    </Root>
  );
};
