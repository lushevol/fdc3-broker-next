/**
 * Timestamp - Value Object
 * Represents a point in time with validation
 */
export class Timestamp {
  private readonly _value: Date;

  constructor(value: Date | string | number) {
    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid timestamp value");
    }

    this._value = date;
  }

  getValue(): Date {
    return new Date(this._value);
  }

  toISOString(): string {
    return this._value.toISOString();
  }

  toMilliseconds(): number {
    return this._value.getTime();
  }

  isBefore(other: Timestamp): boolean {
    return this._value.getTime() < other._value.getTime();
  }

  isAfter(other: Timestamp): boolean {
    return this._value.getTime() > other._value.getTime();
  }

  equals(other: Timestamp): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this._value.toISOString();
  }

  static now(): Timestamp {
    return new Timestamp(new Date());
  }
}
