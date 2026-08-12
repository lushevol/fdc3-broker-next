import { Num, num } from "./num";

describe("Num", () => {
  it("create", () => {
    const n = new Num("123.456");
    expect(n).toBeDefined();

    const n2 = num("123.456");
    expect(n.value()).toBe(n2.value());
  });
  it("static - random", () => {
    const ran = Num.random(0, 10);
    expect(ran).toBeGreaterThanOrEqual(0);
    expect(ran).toBeLessThanOrEqual(10);
  });
  it("static - parseToNumber", () => {
    expect(Num.parseToNumber("10,000.123")).toBe(10000.123);
    expect(Num.parseToNumber("0.12345")).toBe(0.12345);
    expect(Num.parseToNumber("76%")).toBe(0.76);
  });
  it("static - round", () => {
    expect(Num.round("10,000.123", 2)).toBe(10000.12);
    expect(Num.round("0.12345", 4)).toBe(0.1235);
  });
  it("parse", () => {
    expect(Num.parse("10,000.123").value()).toBe(10000.123);
    expect(Num.parse("0.12345").value()).toBe(0.12345);
    expect(Num.parse("76%").value()).toBe(0.76);
  });
  it("format", () => {
    const n = num("12345678.123456");
    expect(
      n.format({ thousandSeparated: true, mantissa: 8, trimMantissa: true }),
    ).toBe("12,345,678.123456");
    expect(n.format({ thousandSeparated: true, mantissa: 8 })).toBe(
      "12,345,678.12345600",
    );
    expect(
      n.format({ thousandSeparated: true, mantissa: 4, trimMantissa: true }),
    ).toBe("12,345,678.1235");
  });
  it("toString", () => {
    const n = num("12345678.123456");
    expect(n.toString()).toBe("12345678.123456");
    expect("" + n).toBe("12345678.123456");
  });
  it("value()", () => {
    const n = num("12345678.123456");
    expect(n.value()).toBe(12345678.123456);
    expect(+n).toBe(12345678.123456);
  });
  it("manipulate - add", () => {
    expect(num(0.1).add(0.2).value()).toBe(0.3);
    expect(-num(-0.1).add(0.2)).toBe(-0.1);
  });
  it("manipulate - subtract", () => {
    expect(num(0.1).subtract(0.2).value()).toBe(-0.1);
    expect(+num(0.1).subtract(0.3)).toBe(-0.2);
  });
  it("manipulate - multiply", () => {
    expect(num(0.0527493).multiply(100).value()).toBe(5.27493);
    expect(+num(-0.1).multiply(100)).toBe(-10);
  });
  it("manipulate - divide", () => {
    expect(num(0.1).divide(100).value()).toBe(0.001);
    expect(num(0.123).divide(100).value()).toBe(0.00123);
  });
});
