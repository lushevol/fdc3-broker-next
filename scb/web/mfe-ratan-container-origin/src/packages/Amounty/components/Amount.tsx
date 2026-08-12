import { memo } from "react";
import assign from "lodash/assign";
import {
  type AmountProps,
  useAmount,
  defaultAmountFormatOptions,
  defaultValue,
} from "../hooks/useAmount";
import { Tooltip } from "@mui/material";

export const SimpleAmount = memo(
  ({
    value,
    formatOptions = defaultAmountFormatOptions,
    customDisplayValue = defaultValue,
  }: AmountProps) => {
    const { formatValue, rawValue } = useAmount({
      value,
      formatOptions: assign(defaultAmountFormatOptions, formatOptions),
    });

    if (rawValue === "") {
      return <span>{customDisplayValue}</span>;
    }
    return (
      <span>
        <Tooltip title={rawValue} placement="top">
          <span>{formatValue}</span>
        </Tooltip>
      </span>
    );
  }
);
