import { LimitationRecord } from "../common/interface";
import { getUserRole, isSameLimitationRecord } from "./index";

describe('getUserRole', () => {
  it('should return "Checker" when the user has the "F_Input_Delete_Modify_Verify" permission', () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockImplementation((permission) => {
      return permission === "RATAN_PROFILE_LIMITS:F_Input_Delete_Modify_Verify";
    });

    expect(getUserRole()).toBe("Checker");
  });

  it('should return "Maker" when the user has the "F_Input_Delete_Modify_Initiate" permission', () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockImplementation((permission) => {
      return permission === "RATAN_PROFILE_LIMITS:F_Input_Delete_Modify_Initiate";
    });

    expect(getUserRole()).toBe("Maker");
  });

  it('should return "Visitor" when the user has neither "F_Input_Delete_Modify_Verify" nor "F_Input_Delete_Modify_Initiate" permissions', () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockImplementation(() => false);

    expect(getUserRole()).toBe("Visitor");
  });

  it('should prioritize "Checker" over "Maker" if both permissions are present', () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "hasPermission").mockImplementation((permission) => {
      return permission === "RATAN_PROFILE_LIMITS:F_Input_Delete_Modify_Verify" || 
           permission === "RATAN_PROFILE_LIMITS:F_Input_Delete_Modify_Initiate";
    });

    expect(getUserRole()).toBe("Checker");
  });
});

describe('isSameLimitationRecord', () => {
  it('should return true when both records have the same profile and currency', () => {
    const record1 = { profile: "ProfileA", currency: "USD" } as LimitationRecord;
    const record2 = { profile: "ProfileA", currency: "USD" } as LimitationRecord;

    expect(isSameLimitationRecord(record1, record2)).toBe(true);
  });

  it('should return false when profiles are different', () => {
    const record1 = { profile: "ProfileA", currency: "USD" } as LimitationRecord;
    const record2 = { profile: "ProfileB", currency: "USD" } as LimitationRecord;

    expect(isSameLimitationRecord(record1, record2)).toBe(false);
  });

  it('should return false when currencies are different', () => {
    const record1 = { profile: "ProfileA", currency: "USD" } as LimitationRecord;
    const record2 = { profile: "ProfileA", currency: "EUR" } as unknown as LimitationRecord;

    expect(isSameLimitationRecord(record1, record2)).toBe(false);
  });

  it('should return false when both profiles and currencies are different', () => {
    const record1 = { profile: "ProfileA", currency: "USD" } as LimitationRecord;
    const record2 = { profile: "ProfileB", currency: "EUR" } as unknown as LimitationRecord;

    expect(isSameLimitationRecord(record1, record2)).toBe(false);
  });

  it('should return true when both records are empty objects', () => {
    const record1 = { profile: "", currency: "" } as unknown as LimitationRecord;
    const record2 = { profile: "", currency: "" } as unknown as LimitationRecord;

    expect(isSameLimitationRecord(record1, record2)).toBe(true);
  });

  it('should handle edge cases where one or both records are missing properties', () => {
    const record1 = { profile: "ProfileA" } as LimitationRecord;
    const record2 = { profile: "ProfileA", currency: "USD" } as LimitationRecord;

    expect(isSameLimitationRecord(record1, record2)).toBe(false);

    const record3 = { currency: "USD" } as LimitationRecord;
    const record4 = { profile: "ProfileA", currency: "USD" } as LimitationRecord;

    expect(isSameLimitationRecord(record3, record4)).toBe(false);

    const record5 = {} as LimitationRecord;
    const record6 = { profile: "ProfileA", currency: "USD" } as LimitationRecord;

    expect(isSameLimitationRecord(record5, record6)).toBe(false);
  });
});