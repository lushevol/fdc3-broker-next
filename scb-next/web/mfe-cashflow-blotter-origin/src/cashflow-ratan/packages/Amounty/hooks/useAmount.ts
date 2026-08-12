import { Num, num } from "../functions/num";
import { RawValue, NumbroFormat } from "../types";

export const defaultAmountFormatOptions: NumbroFormat = {
  thousandSeparated: true,
};

export type AmountProps = {
  value: RawValue;
  formatOptions?: NumbroFormat;
  customDisplayValue?: string;
};
type UseAmountResult = {
  formatValue: string;
  rawValue: string;
  instance?: Num | null;
};
export const defaultValue: string = "";

const isEmptyString = (value: RawValue) => value === "";
/**
 * - If the value is empty (empty string), it returns default values.
 * - The `num` function is used to create an instance for formatting the value.
 * - The `numbro` library does not accept empty strings as input. Valid inputs are: number, null, undefined, or valid numeric strings like "123".
 */
export const useAmount = ({
  value,
  formatOptions = defaultAmountFormatOptions,
}: AmountProps): UseAmountResult => {
  const res: UseAmountResult = {
    formatValue: "",
    rawValue: "",
    instance: null,
  };
  if (!isEmptyString(value)) {
    const instance = num(value);
    res.instance = instance;
    res.formatValue = instance.format(formatOptions);
    res.rawValue = value + "";
  }
  return res;
};
