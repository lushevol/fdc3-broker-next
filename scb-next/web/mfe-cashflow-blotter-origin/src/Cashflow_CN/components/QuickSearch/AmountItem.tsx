import { InputNumber } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { DynamickFieldLabel } from "Import/ratancomponents";
import { FC, memo, useEffect, useState } from "react";
import ratanConfig from "src/Cashflow_CN/Main/config/ratanConfig";
import useMap from "src/Root/common/utils/useMap";
import { formatePrice, isNumber } from "src/Root/import/ratanutils";

const items = [
  { label: "Amount Range (Is)", field: "EQ" },
  { label: "Amount Range (Between)", field: "BET" },
  { label: "Amount Range (Greater Than)", field: "GTE" },
  { label: "Amount Range (Less Than)", field: "LTE" },
];

const isIntegerAmount = (operator: OperatorType, result) => {
  return (
    (operator.field === "BET" &&
      (!Number.isInteger(result.valueStart) ||
        !Number.isInteger(result.valueEnd))) ||
    (operator.field === "GTE" && !Number.isInteger(result.value)) ||
    (operator.field === "LTE" && !Number.isInteger(result.value))
  );
};

type OperatorType = { label: string; field: string };

interface AmountItemProps {
  labelWidth?: string | number;
  size?: SizeType;
  filter: any;
  onResult: ({ isOk, msg }: { isOk: boolean; msg: any }) => void;
  isClear?: boolean;
}

export const AmountItem: FC<AmountItemProps> = memo(
  ({ size, labelWidth, filter, onResult, isClear = false }) => {
    const [operator, setOperator] = useState<OperatorType>(items[0]);
    const [result, { set, reset }] = useMap<any>();

    useEffect(() => {
      if (!result.value && !result.valueStart && !result.valueEnd) {
        onResult({ isOk: true, msg: null });
      } else if (isIntegerAmount(operator, result)) {
        onResult({
          isOk: false,
          msg: "Please input amount which must be an integer!",
        });
      } else if (
        operator.field === "BET" &&
        result.valueEnd <= result.valueStart
      ) {
        onResult({
          isOk: false,
          msg: "The maximum amount should be greater than the minimum amount!",
        });
      } else if (
        (result.value || (result.valueStart && result.valueEnd)) &&
        !filter["Cashflow.Payment_Currency"]
      ) {
        onResult({ isOk: false, msg: "Please select a currency!" });
      } else if (operator.field === "BET") {
        onResult({
          isOk: true,
          msg: [
            {
              field: "Cashflow.Payment_Amount",
              operator: "BET",
              values: [
                result.valueStart.toString(),
                result.valueEnd.toString(),
              ],
            },
          ],
        });
      } else {
        onResult({
          isOk: true,
          msg: [
            {
              field: "Cashflow.Payment_Amount",
              operator: operator.field,
              values: result.value.toString(),
            },
          ],
        });
      }
    }, [operator, result, filter]);

    useEffect(() => {
      isClear && reset();
    }, [isClear]);

    return (
      <DynamickFieldLabel
        className="item"
        config={items}
        active={operator}
        labelWidth={labelWidth ?? ratanConfig.cashflow.quickSearchLabelWidth}
        formWidth={ratanConfig.cashflow.quickSearchFormWidth}
        onChange={(operator) => {
          setOperator(operator);
          reset();
        }}
      >
        {(!operator || operator.field === "EQ") && (
          <InputNumber
            className="value-amount"
            size={size}
            placeholder="Input Amount"
            width={ratanConfig.cashflow.quickSearchFormWidth}
            formatter={(value) =>
              isNumber(value) ? formatePrice(value, 0) : ""
            }
            parser={(value) => value!.replace(/(,*)/g, "")}
            value={result.value}
            controls={false}
            onChange={(value) => {
              set("value", value);
            }}
            data-testid="amountValueEQ"
          />
        )}
        {(operator.field === "GTE" || operator.field === "LTE") && (
          <InputNumber
            className="value-amount"
            size={size}
            placeholder="Input Amount"
            width={ratanConfig.cashflow.quickSearchFormWidth}
            decimalSeparator="0"
            formatter={(value) =>
              isNumber(value) ? formatePrice(value, 0) : ""
            }
            parser={(value) => value!.replace(/(,*)/g, "")}
            value={result.value}
            controls={false}
            onChange={(value) => {
              set("value", value);
            }}
            data-testid="amountValueLaterOrBefore"
          />
        )}
        {operator.field === "BET" && (
          <>
            <InputNumber
              className="value-amount-half"
              size={size}
              placeholder="Minimum"
              formatter={(value) =>
                isNumber(value) ? formatePrice(value, 0) : ""
              }
              parser={(value) => value!.replace(/(,*)/g, "")}
              width={ratanConfig.cashflow.quickSearchFormWidth}
              value={result.valueStart}
              controls={false}
              onChange={(value) => {
                set("valueStart", value);
              }}
              data-testid="amountStart"
            />
            <span className="line-icon"></span>
            <InputNumber
              className="value-amount-half"
              size={size}
              placeholder="Maximum"
              formatter={(value) =>
                isNumber(value) ? formatePrice(value, 0) : ""
              }
              width={ratanConfig.cashflow.quickSearchFormWidth}
              parser={(value) => value!.replace(/(,*)/g, "")}
              value={result.valueEnd}
              controls={false}
              onChange={(value) => {
                set("valueEnd", value);
              }}
              data-testid="amountEnd"
            />
          </>
        )}
      </DynamickFieldLabel>
    );
  }
);
