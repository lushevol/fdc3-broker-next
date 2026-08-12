import random from "lodash/random";
import numbro from "numbro";
import { RawValue, Numbro, NumbroFormat } from "../types";

export const isBigNumber = (n: number) => {
  return n >= Number.MAX_SAFE_INTEGER;
};

export class Num {
  private _rawValue: RawValue;
  private _value: Numbro = numbro();
  constructor(v: RawValue | Numbro) {
    if (numbro.isNumbro(v)) {
      this._rawValue = v.value();
      this._value = v;
    } else {
      this._rawValue = v;
      this._value = numbro(v);
    }
  }

  static num(input: RawValue | Numbro) {
    return new Num(input);
  }

  static parse(input: string, format?: string | NumbroFormat) {
    return num(Num.parseToNumber(input, format));
  }

  static parseToNumber(input: string, format?: string | NumbroFormat) {
    return numbro.unformat(input, format);
  }

  static random(lower: number = 0, uppper: number = 1, floating?: boolean) {
    return random(lower, uppper, floating);
  }

  static round(input: string | number, precision: number = 0): number {
    return Num.parseToNumber(num(input).format({ mantissa: precision }));
  }

  getRawValue() {
    return this._rawValue;
  }

  toString() {
    return this.format();
  }

  format(params?: string | NumbroFormat) {
    return this._value.format(params);
  }

  value() {
    return this._value.value();
  }

  add(other: number) {
    return Num.num(this._value.add(other));
  }

  subtract(other: number) {
    return Num.num(this._value.subtract(other));
  }

  multiply(other: number) {
    return Num.num(this._value.multiply(other));
  }

  divide(other: number) {
    return Num.num(this._value.divide(other));
  }
}

export const num = Num.num;
