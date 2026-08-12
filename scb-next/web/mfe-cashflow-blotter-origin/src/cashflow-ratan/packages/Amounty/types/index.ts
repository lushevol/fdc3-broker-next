import numbro from "numbro";

export type RawValue = number | string;

export type IntlFormatOptions = {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

export type Numbro = numbro.Numbro;
export type NumbroFormat = numbro.Format;
