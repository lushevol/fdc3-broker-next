import { renderHook } from "@testing-library/react";
import { FormInstance } from "antd";

import { useDetailsFormItems } from "./useDetailsFormItems";

// Mock CurrencyList
jest.mock("src/Cashflow_CN/Main/config/ratanConfig/local/cashflowQuickSearchConfig", () => ({
  CurrencyList: ["USD", "CNY", "EUR"],
}));

describe("useDetailsFormItems", () => {
  let form: Partial<FormInstance>;

  beforeEach(() => {
    form = {
      getFieldValue: jest.fn(),
    };
  });

  it("should return currencyOptions based on CurrencyList", () => {
    const { result } = renderHook(() => useDetailsFormItems(form as FormInstance));
    expect(result.current.currencyOptions).toEqual([
      { label: "USD", value: "USD" },
      { label: "CNY", value: "CNY" },
      { label: "EUR", value: "EUR" },
    ]);
  });

  it("validateAmount: should reject if value is not a number", async () => {
    const { result } = renderHook(() => useDetailsFormItems(form as FormInstance));
    await expect(result.current.validateAmount({}, NaN)).rejects.toThrow("Amount must be a number");
  });

  it("validateAmount: should reject if value >= threshold", async () => {
    (form.getFieldValue as jest.Mock).mockImplementation((key) =>
      key === "threshold" ? 100 : undefined
    );
    const { result } = renderHook(() => useDetailsFormItems(form as FormInstance));
    await expect(result.current.validateAmount({}, 100)).rejects.toThrow("Amount must be less than Threshold");
  });

  it("validateAmount: should reject if value >= limitation", async () => {
    (form.getFieldValue as jest.Mock).mockImplementation((key) =>
      key === "limitation" ? 50 : undefined
    );
    const { result } = renderHook(() => useDetailsFormItems(form as FormInstance));
    await expect(result.current.validateAmount({}, 50)).rejects.toThrow("Amount must be less than Limitation");
  });

  it("validateAmount: should resolve if value is valid", async () => {
    (form.getFieldValue as jest.Mock).mockReturnValue(undefined);
    const { result } = renderHook(() => useDetailsFormItems(form as FormInstance));
    await expect(result.current.validateAmount({}, 10)).resolves.toBeUndefined();
  });

  it("validateLimitation: should reject if value is not a number", async () => {
    const { result } = renderHook(() => useDetailsFormItems(form as FormInstance));
    await expect(result.current.validateLimitation({}, NaN)).rejects.toThrow("Amount must be a number");
  });

  it("validateLimitation: should reject if value >= threshold", async () => {
    (form.getFieldValue as jest.Mock).mockImplementation((key) =>
      key === "threshold" ? 20 : undefined
    );
    const { result } = renderHook(() => useDetailsFormItems(form as FormInstance));
    await expect(result.current.validateLimitation({}, 20)).rejects.toThrow("Amount must be less than Threshold");
  });

  it("validateLimitation: should resolve if value is valid", async () => {
    (form.getFieldValue as jest.Mock).mockReturnValue(undefined);
    const { result } = renderHook(() => useDetailsFormItems(form as FormInstance));
    await expect(result.current.validateLimitation({}, 10)).resolves.toBeUndefined();
  });

});