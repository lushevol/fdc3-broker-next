import { Checkbox, Input, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { ApiOutlined } from "@ant-design/icons";

type RegExpFlagType = {
  ignoreCase: boolean;
};

const IGNORE_CASE_PREFIX = "(?i)";

const removePrefix = (value: string, pattern: string) => {
  if (value.startsWith(pattern)) return value.slice(pattern.length);
  return value;
};

export const RegExpInput = ({
  value,
  title,
  className,
  disabled,
  placeholder,
  onChange,
  allowClear,
}: {
  value: string;
  title?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: (val: string) => void;
  allowClear?: boolean;
}) => {
  const [regExpFlags, setRegExpFlags] = useState<RegExpFlagType>({
    ignoreCase: value?.startsWith(IGNORE_CASE_PREFIX),
  });
  useEffect(() => {
    const noPrefixValue = removePrefix(value, IGNORE_CASE_PREFIX);
    onChange(
      (regExpFlags.ignoreCase ? IGNORE_CASE_PREFIX : "") + noPrefixValue
    );
  }, [regExpFlags, value]);
  return (
    <Input
      value={value}
      title={title}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      allowClear={allowClear}
      data-testid="regexp-input"
      suffix={
        <RegExpFlagSelector
          regexp={value}
          value={regExpFlags}
          disabled={disabled}
          onChange={(flags) => setRegExpFlags(flags)}
        />
      }
    />
  );
};

export const RegExpFlagSelector = ({
  regexp,
  value,
  onChange,
  disabled,
}: {
  regexp: string;
  value: RegExpFlagType;
  onChange: (f: RegExpFlagType) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      open={open}
      placement="topRight"
      trigger="click"
      title={
        <div style={{ display: "flex" }} data-testid="regexp-flags">
          <Checkbox
            disabled={disabled}
            checked={value.ignoreCase}
            onChange={(e) =>
              onChange({
                ...value,
                ignoreCase: e.target.checked,
              })
            }
          >
            Ignore Case
          </Checkbox>
        </div>
      }
      onOpenChange={(o) => {
        setOpen(o);
      }}
    >
      <ApiOutlined onClick={() => setOpen(true)} data-testid="regexp-icon" />
    </Tooltip>
  );
};
