import { css, styled } from "@mui/material/styles";
import {
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Switch,
  TimePicker,
} from "antd";
import cn from "classnames";
import dayjs from "dayjs";
import React from "react";
import DarkInput from "src/components/base/DarkInput";
import DarkTextarea from "src/components/base/DarkTextarea";
import { formatWithThousandSeparators } from "src/util/common";
export interface DefaultValueFieldProps {
  fieldType: string;
  dataType?: string;
  value: any;
  onChange: (val: any) => void;
  readonly: boolean;
}
const StyleRoot = styled("div")(
  () => css`
    .custom-radio {
      .ant-radio-disabled .ant-radio-inner {
        background: #e5e5e5 !important;
        .dark & {
          border-color: #333333 !important;
          background: #0d0d0d !important;
          &::after {
            background: #666666 !important;
          }
        }
      }
    }
  `
);

type ModeType = "year" | "month" | "date";
const configMap: Record<
  string,
  {
    label: string;
    id: string;
    input: (
      value: any,
      onChange: (val: any) => void,
      readonly: boolean,
      extraProps?: {
        panelMonth: dayjs.Dayjs;
        setPanelMonth: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
        mode: string;
        setMode: React.Dispatch<React.SetStateAction<ModeType>>;
      }
    ) => React.ReactNode;
  }
> = {
  DATE_PICKER: {
    label: "Set Default Value (Optional)",
    id: "default-date",
    input: (value, onChange, readonly, extraProps) => (
      <DatePicker
        id="default-date"
        className={cn(
          "w-full rounded-lg",
          "border-light-divide-base dark:border-dark-divide-base",
          "bg-light-container-layer dark:bg-dark-container-layer",
          "[&_.ant-picker-suffix]:text-light-divide-base dark:[&_.ant-picker-suffix]:text-dark-divide-base",
          "[&_input]:!text-light-input-text dark:[&_input]:text-dark-input-text",
          "[&_input]:placeholder:text-light-placeholder-text dark:[&_input]:placeholder:text-dark-placeholder-text",
          "[&.ant-picker-disabled]:cursor-not-allowed",
          "[&.ant-picker-disabled]:bg-light-solid-disabled dark:[&.ant-picker-disabled]:bg-dark-solid-disabled",
          "[&.ant-picker-disabled]:border-light-secondary-disabled dark:[&.ant-picker-disabled]:border-dark-secondary-disabled",
          "[&.ant-picker-disabled_input]:!text-light-input-text dark:[&.ant-picker-disabled_input]:text-dark-input-text",
          "[&.ant-picker-disabled_input]:cursor-not-allowed",
          "[&.ant-picker-disabled_.ant-picker-suffix]:text-light-secondary-disabled dark:[&.ant-picker-disabled_.ant-picker-suffix]:text-dark-secondary-disabled"
        )}
        onPanelChange={(date, mode) => {
          if (mode === "year" || mode === "month" || mode === "date") {
            extraProps?.setMode(mode);
          }
          if (mode === "month" || mode === "date") {
            extraProps?.setPanelMonth(date);
          }
        }}
        value={value ? dayjs(value) : null}
        onChange={(_, dateString) => onChange(dateString)}
        allowClear
        format="YYYY-MM-DD"
        popupClassName="rounded-xl shadow-lg"
        inputReadOnly
        disabledDate={(currentDate) => {
          // if in year panel or month panel, don't involve the disable logic
          if (!extraProps?.panelMonth || extraProps?.mode !== "date") {
            return false;
          }
          return (
            currentDate.year() !== extraProps?.panelMonth.year() ||
            currentDate.month() !== extraProps?.panelMonth.month()
          );
        }}
        defaultPickerValue={extraProps?.panelMonth || dayjs()}
        disabled={readonly}
      />
    ),
  },
  TIME_PICKER: {
    label: "Set Default Value (Optional)",
    id: "default-time",
    input: (value, onChange, readonly) => (
      <TimePicker
        id="default-time"
        className={cn(
          "w-full rounded-lg",
          "border-light-divide-base dark:border-dark-divide-base",
          "bg-light-container-layer dark:bg-dark-container-layer",
          "[&_.ant-picker-suffix]:text-light-divide-base dark:[&_.ant-picker-suffix]:text-dark-divide-base",
          "[&_input]:text-light-input-text dark:[&_input]:text-dark-input-text",
          "[&_input]:placeholder:text-light-placeholder-text dark:[&_input]:placeholder:text-dark-placeholder-text",
          "[&.ant-picker-disabled]:cursor-not-allowed",
          "[&.ant-picker-disabled]:bg-light-solid-disabled dark:[&.ant-picker-disabled]:bg-dark-solid-disabled",
          "[&.ant-picker-disabled]:border-light-secondary-disabled dark:[&.ant-picker-disabled]:border-dark-secondary-disabled",
          "[&.ant-picker-disabled_input]:!text-light-input-text dark:[&.ant-picker-disabled_input]:!text-dark-input-text",
          "[&.ant-picker-disabled_input]:cursor-not-allowed",
          "[&.ant-picker-disabled_.ant-picker-suffix]:text-light-secondary-disabled dark:[&.ant-picker-disabled_.ant-picker-suffix]:text-dark-secondary-disabled"
        )}
        popupClassName="customize-picker-popup"
        use12Hours
        value={value ? dayjs(value, "hh:mm:ss A") : null}
        onChange={(time) => onChange(time ? time.format("hh:mm:ss A") : "")}
        disabled={readonly}
      />
    ),
  },
  INPUT: {
    label: "Set Default Value (Optional)",
    id: "default-text",
    input: (value, onChange, readonly) => (
      <div className="w-full">
        <DarkInput
          id="default-text"
          value={value || ""}
          onChange={(e) => {
            if (e.target.value.length <= 200) {
              onChange(e.target.value);
            }
          }}
          maxLength={200}
          placeholder="Enter default text"
          disabled={readonly}
        />
      </div>
    ),
  },
  TEXT_AREA: {
    label: "Set Default Value (Optional)",
    id: "default-text",
    input: (value, onChange, readonly) => (
      <DarkTextarea
        id="default-text"
        value={value || ""}
        onChange={(e) => {
          if (e.target.value.length <= 2000) {
            onChange(e.target.value);
          }
        }}
        maxLength={2000}
        placeholder="Enter default text"
        disabled={readonly}
      />
    ),
  },
  INPUT_NUMBER: {
    label: "Set Default Value (Optional)",
    id: "default-number",
    input: (value, onChange, readonly) => {
      const handleRef = (inputNumberRef: any) => {
        if (!inputNumberRef) return;
        // Get the internal input DOM element
        const inputEl = inputNumberRef.input as HTMLInputElement;
        if (!inputEl) return;

        // Prevent pasting invalid characters
        inputEl.addEventListener("paste", (e) => {
          e.preventDefault();
          const pasteData = e.clipboardData?.getData("text") || "";
          const cleaned = pasteData.replace(/[^\d.]/g, "");
          // Ensure only one decimal point
          const parts = cleaned.split(".");
          const result =
            parts.length > 1
              ? parts[0] + "." + parts.slice(1).join("")
              : cleaned;
          document.execCommand("insertText", false, result);
        });

        // Prevent dropping invalid characters
        inputEl.addEventListener("drop", (e) => {
          e.preventDefault();
          const dropData = e.dataTransfer?.getData("text") || "";
          const cleaned = dropData.replace(/[^\d.]/g, "");
          document.execCommand("insertText", false, cleaned);
        });
      };

      return (
        <InputNumber
          ref={handleRef}
          id="default-number"
          value={value === undefined || value === null ? null : value}
          step={1}
          stringMode
          formatter={(displayValue) =>
            formatWithThousandSeparators(displayValue)
          }
          parser={(displayValue) => (displayValue || "").replace(/,/g, "")}
          className={cn(
            "w-full rounded-lg",
            "border-light-divide-base dark:border-dark-divide-base",
            "bg-light-container-layer dark:bg-dark-container-layer",
            "[&_input]:text-light-input-text dark:[&_input]:text-dark-input-text",
            "[&_input]:placeholder:text-light-placeholder-text dark:[&_input]:placeholder:text-dark-placeholder-text",
            "[&.ant-input-number-disabled]:cursor-not-allowed",
            "[&.ant-input-number-disabled]:text-light-input-text dark:[&.ant-input-number-disabled]:text-dark-input-text",
            "[&.ant-input-number-disabled]:bg-light-solid-disabled dark:[&.ant-input-number-disabled]:bg-dark-solid-disabled",
            "[&.ant-input-number-disabled]:border-light-secondary-disabled dark:[&.ant-input-number-disabled]:border-dark-secondary-disabled"
          )}
          placeholder="Enter default number"
          // 1. Intercept keyboard input
          onKeyDown={(e) => {
            const allowedKeys = [
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Tab",
              "Home",
              "End",
            ];
            // Allow numeric keys, decimal point, and function keys
            if (
              !/^\d$/.test(e.key) &&
              e.key !== "." &&
              !allowedKeys.includes(e.key) &&
              !e.ctrlKey && // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+Z, etc.
              !e.metaKey // Allow Mac Cmd key
            ) {
              e.preventDefault();
            }
            // Prevent multiple decimal points
            const inputEl = e.target as HTMLInputElement;
            if (e.key === "." && inputEl.value.includes(".")) {
              e.preventDefault();
            }
          }}
          // 2. Prevent input from IME (e.g. Chinese, Japanese)
          onCompositionStart={(e) => {
            // Block input when IME starts
            (e.target as HTMLInputElement).setAttribute(
              "data-composing",
              "true"
            );
          }}
          onCompositionEnd={(e) => {
            const inputEl = e.target as HTMLInputElement;
            inputEl.removeAttribute("data-composing");
            // Remove all non-numeric and non-decimal-point characters
            const cleaned = inputEl.value.replace(/[^\d.]/g, "");
            // Ensure only one decimal point
            const parts = cleaned.split(".");
            inputEl.value =
              parts.length > 1
                ? parts[0] + "." + parts.slice(1).join("")
                : cleaned;
            onChange(inputEl.value);
          }}
          // 3. Final filter in onChange
          onChange={(val) => {
            if (val === null || val === undefined) {
              onChange(null);
              return;
            }
            // Filter out non-numeric and non-decimal-point characters
            const strVal = String(val).replace(/[^\d.]/g, "");
            onChange(strVal);
          }}
          disabled={readonly}
        />
      );
    },
  },
  SWITCH: {
    label: "Set Default Value (Optional)",
    id: "default-switch",
    input: (value, onChange, readonly) => (
      <Switch
        id="default-switch"
        checked={value === true || value === "true"}
        onChange={onChange}
        className="bg-gray-200"
        disabled={readonly}
      />
    ),
  },
  RADIO: {
    label: "Set Default Value (Optional)",
    id: "default-radio-switch",
    input: (value, onChange, readonly) => {
      let displayValue: boolean | undefined;
      if (value === true || value === "true") {
        displayValue = true;
      } else if (value === false || value === "false" || value === "") {
        displayValue = false;
      } else {
        displayValue = undefined;
      }

      const toggleRadioSelection = (e: React.MouseEvent<HTMLInputElement>) => {
        const clickedValue =
          e.currentTarget.value === "true"
            ? true
            : e.currentTarget.value === "false"
            ? false
            : undefined;
        if (displayValue === clickedValue) {
          e.preventDefault();
          onChange(undefined);
        }
      };

      return (
        <Radio.Group
          id="default-radio-switch"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          className="flex gap-4 custom-radio"
          disabled={readonly}
        >
          <Radio
            value={true}
            onClick={toggleRadioSelection}
            className=" text-light-input-text dark:text-dark-input-text"
          >
            True
          </Radio>
          <Radio
            value={false}
            onClick={toggleRadioSelection}
            className=" text-light-input-text dark:text-dark-input-text"
          >
            False
          </Radio>
        </Radio.Group>
      );
    },
  },
};

export function DefaultValueField({
  fieldType,
  dataType,
  value,
  onChange,
  readonly = false,
}: DefaultValueFieldProps) {
  const [panelMonth, setPanelMonth] = React.useState(dayjs());
  const [mode, setMode] = React.useState<ModeType>("date");
  if (!fieldType) return null;

  // For Boolean type RADIO, use the same configuration as SWITCH
  let actualFieldType = fieldType;
  if (fieldType === "RADIO" && dataType === "Boolean") {
    actualFieldType = "RADIO"; // Use the RADIO config we added
  }

  const config = configMap[actualFieldType];
  if (!config) return null;
  if (fieldType === "SWITCH") {
    return (
      <StyleRoot>
        <label
          htmlFor={config.id}
          className="flex justify-between items-center w-full cursor-pointer"
        >
          <span className="text-light-content-label-text dark:text-dark-content-label-text">
            {config.label}
          </span>
          {config.input(value, onChange, readonly)}
        </label>
      </StyleRoot>
    );
  }
  return (
    <StyleRoot>
      <label
        htmlFor={config.id}
        className="block mb-2 text-light-content-label-text dark:text-dark-content-label-text"
      >
        {config.label}
      </label>
      {fieldType === "DATE_PICKER"
        ? config.input(value, onChange, readonly, {
            setPanelMonth,
            panelMonth,
            mode,
            setMode,
          })
        : config.input(value, onChange, readonly)}
    </StyleRoot>
  );
}
