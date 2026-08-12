import { renderHook } from "@testing-library/react";
import { useAmount } from "./useAmount";

describe("useAmount", () => {
  it("should show formatValue", () => {
    const value = "123456.7890";
    const { result } = renderHook(() =>
      useAmount({
        value,
        formatOptions: { thousandSeparated: true, mantissa: 2 },
      }),
    );
    expect(result.current.formatValue).toBe("123,456.79");
  });
});

describe("isEmptyString", () => {
  it("should return empty formatValue when value is empty string", () => {
    const { result } = renderHook(() => useAmount({ value: "" }));
    expect(result.current.formatValue).toBe("");
  });

  it("should return empty rawValue when value is empty string", () => {
    const { result } = renderHook(() => useAmount({ value: "" }));
    expect(result.current.rawValue).toBe("");
  });
});