import { InputStatusType, SplitActionType, SplitCashflowState } from "./interface";
import * as ratanUtils from "Import/ratanutils";
import { canAmendSplittingState } from "../SplittingCashflowRightMenu";
import { SplittingTargetCashflowType } from "./interface";
import {
  amountAMinusBNumber,
  amountAPlusBNumber,
  checkAmendSplit,
  checkDecimalPrecision,
  checkGreaterThanSource,
  checkIsNumber,
  checkIsZero,
  checkManualSplit,
  checkOtherValidation,
  customizeStateStyle,
  formatAmountToStrByPrecision,
  formatAndParseNumberByPrecision,
  isAmountAEqualB} from "./utils";

describe("utils", () => {
  const allStates = Object.values(SplitCashflowState);

  it("should return red color style for UN_SPLIT and state not in writeListUnSplitStateArr", () => {
    // writeListUnSplitStateArr
    const allowedStates = [
      SplitCashflowState.QUEUED,
      SplitCashflowState.WAITING,
      SplitCashflowState.READY,
      SplitCashflowState.HOLD,
      SplitCashflowState.FAILED,
      SplitCashflowState.CASHFLOW_SUPPRESSED,
      SplitCashflowState.SWIFT_SUPPRESSED
    ];
    allStates.forEach((state) => {
      const result = customizeStateStyle(state, SplitActionType.UN_SPLIT);
      if (!allowedStates.includes(state)) {
        expect(result).toEqual({ color: "var(--theme-status-color-red)" });
      } else {
        expect(result).toBeUndefined();
      }
    });
  });

  it("should return undefined for non-UN_SPLIT action", () => {
    allStates.forEach((state) => {
      const result = customizeStateStyle(state, SplitActionType.MANUAL_SPLIT);
      expect(result).toBeUndefined();
    });
  });
  it("should return red color for state not in canAmendSplittingState when splitAction is AMEND_SPLIT", () => {
    const allStates = Object.values(SplitCashflowState);
    allStates.forEach((state) => {
      const result = customizeStateStyle(state, SplitActionType.AMEND_SPLIT);
      if (!canAmendSplittingState.includes(state)) {
        expect(result).toEqual({ color: "var(--theme-status-color-red)" });
      } else {
        expect(result).toBeUndefined();
      }
    });
  });

  it("should return undefined for state in canAmendSplittingState when splitAction is AMEND_SPLIT", () => {
    canAmendSplittingState.forEach((state) => {
      const result = customizeStateStyle(state, SplitActionType.AMEND_SPLIT);
      expect(result).toBeUndefined();
    });
  });
});

describe("checkIsNumber", () => {
  it("should return true for numbers", () => {
    expect(checkIsNumber(123)).toBe(true);
    expect(checkIsNumber(0)).toBe(true);
    expect(checkIsNumber(-1)).toBe(true);
    expect(checkIsNumber(1.23)).toBe(true);
  });
  it("should return false for non-numbers", () => {
    expect(checkIsNumber("123" as any)).toBe(false);
    expect(checkIsNumber(undefined as any)).toBe(false);
    expect(checkIsNumber(null as any)).toBe(false);
  });
});

describe("checkIsZero", () => {
  it("should return true for zero", () => {
    expect(checkIsZero(0)).toBe(true);
    expect(checkIsZero("0" as any)).toBe(true);
  });
  it("should return false for non-zero", () => {
    expect(checkIsZero(1)).toBe(false);
    expect(checkIsZero(-1)).toBe(false);
    expect(checkIsZero(0.1)).toBe(false);
  });
});

describe("checkGreaterThanSource", () => {
  it("should return true if value > sourceAmount", () => {
    expect(checkGreaterThanSource(10, 5)).toBe(true);
    expect(checkGreaterThanSource(0.2, 0.1)).toBe(true);
  });
  it("should return false if value <= sourceAmount", () => {
    expect(checkGreaterThanSource(5, 10)).toBe(false);
    expect(checkGreaterThanSource(5, 5)).toBe(false);
    expect(checkGreaterThanSource(0.1, 0.2)).toBe(false);
  });
});

describe("checkDecimalPrecision", () => {
  it("should return true if decimal precision exceeds", () => {
    expect(checkDecimalPrecision(1.234, 2)).toBe(true);
    expect(checkDecimalPrecision(1.2345, 3)).toBe(true);
  });
  it("should return false if decimal precision is within limit", () => {
    expect(checkDecimalPrecision(1.23, 2)).toBe(false);
    expect(checkDecimalPrecision(1, 2)).toBe(undefined);
    expect(checkDecimalPrecision(1.2, 2)).toBe(false);
  });
});

describe("checkAmendSplit", () => {
  it("should return true if value <= 0", () => {
    expect(checkAmendSplit(0, 10)).toBe(true);
    expect(checkAmendSplit(-1, 10)).toBe(true);
  });
  it("should return true if value > maxThreshold", () => {
    expect(checkAmendSplit(11, 10)).toBe(true);
    expect(checkAmendSplit(10.1, 10)).toBe(true);
  });
  it("should return false if value in (0, maxThreshold]", () => {
    expect(checkAmendSplit(5, 10)).toBe(false);
    expect(checkAmendSplit(10, 10)).toBe(false);
  });
});

describe("checkManualSplit", () => {
  it("should return true if value <= 0", () => {
    expect(checkManualSplit(0, 10)).toBe(true);
    expect(checkManualSplit(-1, 10)).toBe(true);
  });
  it("should return true if value > validationMaxInput", () => {
    expect(checkManualSplit(11, 10)).toBe(true);
    expect(checkManualSplit(10.1, 10)).toBe(true);
  });
  it("should return false if value in (0, validationMaxInput]", () => {
    expect(checkManualSplit(5, 10)).toBe(false);
    expect(checkManualSplit(10, 10)).toBe(false);
  });
});


describe("checkOtherValidation", () => {
  it("should return true if all items are not ERROR", () => {
    const arr = [
      { inputStatus: InputStatusType.SUCCESS },
      { inputStatus: InputStatusType.SUCCESS },
      { inputStatus: InputStatusType.WAITING },
    ];
    expect(checkOtherValidation(arr)).toBe(true);
  });

  it("should return false if any item is ERROR", () => {
    const arr = [
      { inputStatus: InputStatusType.SUCCESS },
      { inputStatus: InputStatusType.ERROR },
      { inputStatus: InputStatusType.SUCCESS },
    ];
    expect(checkOtherValidation(arr)).toBe(false);
  });

  it("should return true for empty array", () => {
    expect(checkOtherValidation([])).toBe(true);
  });
});


describe("amountAMinusBNumber", () => {
  it("should subtract two large integers accurately", () => {
    const a = 1000000000;
    const b = 999999999;
    const result = amountAMinusBNumber(a, b, 2);
    expect(result).toBe(1.00);
  });

  it("should subtract two large decimals accurately", () => {
    const a = 123456789.98765;
    const b = 98765432.12345;
    const result = amountAMinusBNumber(a, b, 5);
    expect(result).toBeCloseTo(24691357.86420, 5);
  });

  it("should subtract two large decimals accurately", () => {
    const a = 123456789.98765;
    const b = 98765432.12345;
    const result = amountAMinusBNumber(a, b, 4);
    expect(result).toBeCloseTo(24691357.86421, 4);
  });

  it("should subtract two decimals and round down to given precision", () => {
    const a = 1.234567;
    const b = 0.123456;
    const result = amountAMinusBNumber(a, b, 4);
    expect(result).toBe(1.1111); // 1.234567 - 0.123456 = 1.111111, round down to 4 decimals
  });

  it("should handle subtraction resulting in zero", () => {
    const a = 500.50;
    const b = 500.50;
    const result = amountAMinusBNumber(a, b, 2);
    expect(result).toBe(0.00);
  });

  it("should handle negative results", () => {
    const a = 100;
    const b = 200;
    const result = amountAMinusBNumber(a, b, 2);
    expect(result).toBe(-100.00);
  });

  /**
   * should correct mock container mun, and tested from container mun, passed
   */
  it("should not have JS floating point error", () => {
    const a = 0.3;
    const b = 0.2;
    const spy = vi.spyOn(ratanUtils, "num");
    amountAMinusBNumber(a, b, 2);
    expect(spy).toHaveBeenCalled();
    // expect(result).toBe(0.10); // JS will get wrong as 0.3-0.2=0.09999999999999998
  });
});

describe("amountAPlusBNumber", () => {
  it("should return 0 if arr is null", () => {
    expect(amountAPlusBNumber(null, item => item?.Cashflow?.Payment_Amount, 2)).toBe(0);
  });

  it("should return 0 if arr is undefined", () => {
    expect(amountAPlusBNumber(undefined, item => item?.Cashflow?.Payment_Amount, 2)).toBe(0);
  });

  it("should return 0 if arr is empty array", () => {
    expect(amountAPlusBNumber([], item => item?.Cashflow?.Payment_Amount, 2)).toBe(0);
  });

  /**
   *  should correct mock container mun, and tested from container mun, passed
   */
  it("should sum Payment_Amount correctly for SplitTargetCashflow[]", () => {
    const arr: SplittingTargetCashflowType = [
      { Cashflow: { Payment_Amount: "10.123" } },
      { Cashflow: { Payment_Amount: "20.456" } },
      { Cashflow: { Payment_Amount: "30.789" } },
    ];

    const spy = vi.spyOn(ratanUtils, "num");
    amountAPlusBNumber(arr, item => item?.Cashflow?.Payment_Amount, 3);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("isAmountAEqualB", () => {
  it("should return true for equal numbers", () => {
    expect(isAmountAEqualB(100, 100)).toBe(true);
    expect(isAmountAEqualB(0, 0)).toBe(true);
    expect(isAmountAEqualB(-1, -1)).toBe(true);
  });

  it("should return true for equal string numbers", () => {
    expect(isAmountAEqualB("100", "100")).toBe(true);
    expect(isAmountAEqualB("0.00", "0.00")).toBe(true);
  });

  it("should return false for different values", () => {
    expect(isAmountAEqualB(100, 101)).toBe(false);
    expect(isAmountAEqualB("100", "101")).toBe(false);
    expect(isAmountAEqualB("0.10", 0.11)).toBe(false);
  });

});

describe("formatAndParseNumberByPrecision", () => {
  it("should format number and parse to number with given precision", () => {
    expect(formatAndParseNumberByPrecision(0.1, 3)).toBe(0.1);
    expect(formatAndParseNumberByPrecision(123.4567, 2)).toBe(123.45);
    expect(formatAndParseNumberByPrecision(123, 2)).toBe(123.0);
  });

  it("should format string number and parse to number with given precision", () => {
    expect(formatAndParseNumberByPrecision("0.1", 3)).toBe(0.1);
    expect(formatAndParseNumberByPrecision("123.4567", 2)).toBe(123.45);
    expect(formatAndParseNumberByPrecision("123", 2)).toBe(123.0);
  });

  it("should handle empty string as 0", () => {
    expect(formatAndParseNumberByPrecision("", 2)).toBe(0.0);
  });
});

describe("formatAmountToStrByPrecision", () => {
  it("should format number to string with given precision", () => {
    expect(formatAmountToStrByPrecision(0.1, 3)).toBe("0.100");
    expect(formatAmountToStrByPrecision(123.4567, 2)).toBe("123.45");
    expect(formatAmountToStrByPrecision(123, 2)).toBe("123.00");
  });

  it("should format string number to string with given precision", () => {
    expect(formatAmountToStrByPrecision("0.1", 3)).toBe("0.100");
    expect(formatAmountToStrByPrecision("123.4567", 2)).toBe("123.45");
    expect(formatAmountToStrByPrecision("123", 2)).toBe("123.00");
  });
});
