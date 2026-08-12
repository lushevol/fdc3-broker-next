import { renderHook } from "@testing-library/react";

import {
  CashflowSubStateTypes,
  ExceptionCategory,
  ExceptionStatusTypes,
  Maker,
  MultiExceptionsNames} from "../common/interface";
import useController, { isDisableAffirmation, isSSIGoodStampingException, renderTitle, setAffirmationDetails } from "./useController";

describe("useController", () => {
  it("renderTitle - has exception", () => {
    expect(renderTitle({ title: "test", hasException: true })).toBe("test Exception");
  });
  it("renderTitle - no exception", () => {
    expect(renderTitle({ title: "test", hasException: false })).toBe("test");
  });
  it("isDisableAffirmation", () => {
    expect(isDisableAffirmation(true, true, "Maker")).toBe(true);
    expect(isDisableAffirmation(false, false, "Maker")).toBe(true);
    expect(isDisableAffirmation(false, true, "Checker")).toBe(true);
    expect(isDisableAffirmation(false, true, "Maker")).toBe(false);
  });
  it("setAffirmationDetails", () => {
    expect(setAffirmationDetails({
      affirmation: []
    })).toEqual({
      hasAffirmationException: false,
      affirmationTitle: "Cashflow Affirmation"
    });

    expect(setAffirmationDetails({
      affirmation: [{ Exception_Code: "test" }]
    })).toEqual({
      hasAffirmationException: true,
      affirmationTitle: "test"
    });
  });
  it("isSSIGoodStampingException", () => {
    expect(isSSIGoodStampingException(true, false)).toBe(true);
    expect(isSSIGoodStampingException(false, true)).toBe(false);
  });
});

describe("test useController", () => {
  it("should push EDIT to nostroAvailableActions when hasSSIException and not isMakerReviewing", () => {
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [
        { Exception_Code: "E001" }
      ],
      [MultiExceptionsNames.Nostro]: [],
      [MultiExceptionsNames.Affirmation]: [],
      [MultiExceptionsNames.Backvalue]: [],
      [MultiExceptionsNames.NSTP]: [],
      [MultiExceptionsNames.Other]: [],
      [MultiExceptionsNames.Comment]: [],
    };

    const { result } = renderHook(() =>
      useController({
        classifiedCommonExceptions,
        userRole: "Maker",
        cashflowSubState: "Pending Operator",
        isSubmitByYou: false, // isMakerReviewing = false
        disableAllActions: false,
        isAdhocing: false,
        isFixingMissingNostro: false,
      })
    );

    // Nostro availableActions should contain EDIT
    expect(result.current.layoutSetting[MultiExceptionsNames.Nostro].availableActions).toContain("Edit");
  });
  it("should hasSSIException and missing nostro exception", () => {
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [
        { Exception_Category: ExceptionCategory.SSI, Exception_Code: "RATAN-201000005" }
      ],
      [MultiExceptionsNames.Nostro]: [],
      [MultiExceptionsNames.Affirmation]: [],
      [MultiExceptionsNames.Backvalue]: [],
      [MultiExceptionsNames.NSTP]: [],
      [MultiExceptionsNames.Other]: [],
      [MultiExceptionsNames.Comment]: [],
    };

    const { result } = renderHook(() =>
      useController({
        classifiedCommonExceptions,
        userRole: "Maker",
        cashflowSubState: "Pending Operator",
        isSubmitByYou: false, // isMakerReviewing = false
        disableAllActions: false,
        isAdhocing: false,
        isFixingMissingNostro: false,
      })
    );

    // Nostro availableActions should contain EDIT
    expect(result.current.layoutSetting[MultiExceptionsNames.Nostro].availableActions).toContain("Edit ");
  });
  it("should hasSSIException and missing nostro exception with fix exception true", () => {
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [
        { Exception_Category: ExceptionCategory.SSI, Exception_Code: "RATAN-201000005" }
      ],
      [MultiExceptionsNames.Nostro]: [],
      [MultiExceptionsNames.Affirmation]: [],
      [MultiExceptionsNames.Backvalue]: [],
      [MultiExceptionsNames.NSTP]: [],
      [MultiExceptionsNames.Other]: [],
      [MultiExceptionsNames.Comment]: [],
    };
    const { result } = renderHook(() =>
      useController({
        classifiedCommonExceptions,
        userRole: "Maker",
        cashflowSubState: "Pending Operator",
        isSubmitByYou: false, // isMakerReviewing = false
        disableAllActions: false,
        isAdhocing: false,
        isFixingMissingNostro: true,
      })
    );
    // Nostro availableActions should contain EDIT
    expect(result.current.layoutSetting[MultiExceptionsNames.Nostro].availableActions).toContain("Edit ");
  });
  it("should handle isSSIGoodStampingException and set ADHOC action for Maker", () => {
    //mock good stamping data
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [
        { Exception_Category: ExceptionCategory.SSI, Exception_Code: "RATAN-201000010", Status: ExceptionStatusTypes.INACTIVE },
      ],
      [MultiExceptionsNames.Nostro]: [],
      [MultiExceptionsNames.Affirmation]: [],
      [MultiExceptionsNames.Backvalue]: [],
      [MultiExceptionsNames.NSTP]: [],
      [MultiExceptionsNames.Other]: [],
      [MultiExceptionsNames.Comment]: [],
    };

    const { result } = renderHook(() =>
      useController({
        classifiedCommonExceptions,
        userRole: Maker,
        cashflowSubState: CashflowSubStateTypes.PendingVerification,
        isSubmitByYou: false, // isMakerReviewing = false
        disableAllActions: false,
        isAdhocing: false,
        isFixingMissingNostro: false,
      })
    );
    expect(result.current.layoutSetting[MultiExceptionsNames.Vostro].availableActions).toContain("Edit (Adhoc SSI)");
    expect(result.current.layoutSetting[MultiExceptionsNames.Vostro].title).toContain("Vostro SI Information");
  });
  it("should handle isSSIGoodStampingException and is adhocing", () => {
    //mock good stamping data
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [
        { Exception_Category: ExceptionCategory.SSI, Exception_Code: "RATAN-201000010", Status: ExceptionStatusTypes.INACTIVE },
      ],
      [MultiExceptionsNames.Nostro]: [],
      [MultiExceptionsNames.Affirmation]: [],
      [MultiExceptionsNames.Backvalue]: [],
      [MultiExceptionsNames.NSTP]: [],
      [MultiExceptionsNames.Other]: [],
      [MultiExceptionsNames.Comment]: [],
    };

    const { result } = renderHook(() =>
      useController({
        classifiedCommonExceptions,
        userRole: Maker,
        cashflowSubState: CashflowSubStateTypes.PendingVerification,
        isSubmitByYou: false, // isMakerReviewing = false
        disableAllActions: false,
        isAdhocing: true, // should be true
        isFixingMissingNostro: false,
      })
    );
    expect(result.current.layoutSetting[MultiExceptionsNames.Vostro].title).toContain("Adhoc SSI - Vostro");
  });
})