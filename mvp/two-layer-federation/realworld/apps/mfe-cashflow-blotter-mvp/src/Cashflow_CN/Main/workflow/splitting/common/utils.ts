import { isEmpty, Num, num } from "Import/ratanutils";
import eq from "lodash/eq";
import gt from "lodash/gt";
import isNumber from "lodash/isNumber";

import {
  InputStatusType,
  SplitActionType,
  SplitCashflowState,
} from "../common/interface";
import { canAmendSplittingState } from "../SplittingCashflowRightMenu";
import { SplittingTargetCashflowType } from "./interface";

export const customizeStateStyle = (
  state: string,
  splitAction: SplitActionType
) => {
  const writeListUnSplitStateArr = [
    SplitCashflowState.QUEUED,
    SplitCashflowState.WAITING,
    SplitCashflowState.READY,
    SplitCashflowState.HOLD,
    SplitCashflowState.FAILED,
    SplitCashflowState.CASHFLOW_SUPPRESSED,
    SplitCashflowState.SWIFT_SUPPRESSED,
  ];
  if (
    (splitAction === SplitActionType.UN_SPLIT &&
      !writeListUnSplitStateArr.includes(state as SplitCashflowState)) ||
    (!canAmendSplittingState.includes(state as SplitCashflowState) &&
      splitAction === SplitActionType.AMEND_SPLIT)
  ) {
    return { color: "var(--theme-status-color-red)" };
  }
};

export const checkIsNumber = (value: number) => {
  return isNumber(value);
};

export const checkIsZero = (value: number) => eq(Number(value), 0);

export const checkGreaterThanSource = (value: number, sourceAmount: number) => {
  return gt(Number(value), sourceAmount);
};

export const checkDecimalPrecision = (value: number, precision: number) => {
  const decimalPart = value.toString().split(".")[1];
  return decimalPart && decimalPart.length > precision;
};

export const checkAmendSplit = (value: number, maxThreshold: number) => {
  return Number(value) <= 0 || Number(value) > maxThreshold;
};

export const checkManualSplit = (value: number, validationMaxInput: number) => {
  return Number(value) <= 0 || Number(value) > validationMaxInput;
};

export const checkOtherValidation = (newArr: any[]) => {
  return newArr.every((item) => item.inputStatus !== InputStatusType.ERROR);
};

/**
 * Ensure high-precision calculation of data and avoid JS floating-point errors
 */
export const amountAMinusBNumber = (
  a: number,
  b: number,
  precision: number
): number => {
  const minusRes = num(a).subtract(b).value();
  const formatted = num(minusRes).format({
    mantissa: precision,
    roundingFunction: Math.floor,
  });
  return Num.parseToNumber(formatted);
};

/**
 * format string amount with precision
 * eg: expect amount 0.1, precision 3 => return 0.100
 * expect amount 0.1235, precision 3 => return 0.123
 */
export const formatAmountToStrByPrecision = (
  amount: number | string,
  precision: number
): string => {
  const resultNum = Num.num(amount).format({
    mantissa: precision,
    roundingFunction: Math.floor,
  });
  return resultNum;
};

/**
 * format and return number
 * expect amount 0.1235, precision 3 => return 0.123
 */
export const formatAndParseNumberByPrecision = (
  amount: number | string,
  precision: number
): number => {
  const resultNum = Num.num(amount).format({
    mantissa: precision,
    roundingFunction: Math.floor,
  });
  return Num.parseToNumber(resultNum);
};

/**
 * amountA plus amountB by num, and keep precision not changeed
 * if amount params precision more than precision param, will round down
 */
export const amountAPlusBNumber = (
  arr: SplittingTargetCashflowType,
  getter: (
    item: SplitTargetCashflow | null | undefined
  ) => number | string | undefined | null,
  precision: number
): number => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return 0;
  let sum = Num.num(0);
  for (const item of arr) {
    let val = getter(item);

    if (isEmpty(val) || val === undefined || val === null) {
      val = 0;
    }
    if (typeof val === "string" && isNaN(Number(val))) {
      val = 0;
    }
    sum = sum.add(num(val));
  }

  const formatter = num(sum).format({
    mantissa: precision,
    roundingFunction: Math.floor,
  });

  return Num.parseToNumber(formatter);
};

/**
 * judge amount A whether equal amount B by num
 * amount params should be string or number
 */
export const isAmountAEqualB = (
  amountA: number | string,
  amountB: number | string
): boolean => {
  const numA = Num.num(amountA).value();
  const numB = Num.num(amountB).value();
  return numA === numB;
};
