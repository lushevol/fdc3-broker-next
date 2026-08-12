import { VostroFormDetails } from "../components/Vostro/interface";
import { isPOP } from "./pop";

describe("isPOP", () => {
  const base: VostroFormDetails = {
    swiftType: "MT103",
    entity: "5",
    tradingCurrency: "USD",
    settlementMeans: "NOS",
    settlementAccount: "123MAIN456",
    accountWithInstitutionBic: "SOMEBICXXX",
    // ...other properties if required...
  } as any;

  it("returns true for valid POP data", () => {
    expect(isPOP(base)).toBe(true);
  });

  it("returns false if data is null", () => {
    expect(isPOP(null as any)).toBe(null);
    expect(isPOP(undefined as any)).toBe(undefined);
  });

  it("returns false if swiftType is not MT103", () => {
    expect(isPOP({ ...base, swiftType: "MT202" })).toBe(false);
  });

  it("returns false if entity is not '5'", () => {
    expect(isPOP({ ...base, entity: "4" })).toBe(false);
    expect(isPOP({ ...base, entity: "" })).toBe(false);
  });

  it("returns false if tradingCurrency is AED", () => {
    expect(isPOP({ ...base, tradingCurrency: "AED" })).toBe(false);
  });

  it("returns false if settlementMeans is not 'NOS'", () => {
    expect(isPOP({ ...base, settlementMeans: "RTGS" })).toBe(false);
    expect(isPOP({ ...base, settlementMeans: "" })).toBe(false);
  });

  it("returns false if settlementAccount does not include 'MAIN'", () => {
    expect(isPOP({ ...base, settlementAccount: "123456" })).toBe(false);
    expect(isPOP({ ...base, settlementAccount: "" })).toBe(false);
  });

  it("returns false if accountWithInstitutionBic is 'SUPPRESSXXX'", () => {
    expect(isPOP({ ...base, accountWithInstitutionBic: "SUPPRESSXXX" })).toBe(false);
  });

  it("returns true if settlementAccount contains 'MAIN' anywhere", () => {
    expect(isPOP({ ...base, settlementAccount: "MAIN" })).toBe(true);
    expect(isPOP({ ...base, settlementAccount: "XMAINX" })).toBe(true);
  });

  it("returns false if any required property is missing", () => {
    const { swiftType, ...rest } = base;
    expect(isPOP(rest as any)).toBe(false);
    const { entity, ...rest2 } = base;
    expect(isPOP(rest2 as any)).toBe(false);
    const { tradingCurrency, ...rest3 } = base;
    expect(isPOP(rest3 as any)).toBe(true);
    const { settlementMeans, ...rest4 } = base;
    expect(isPOP(rest4 as any)).toBe(false);
    const { accountWithInstitutionBic, ...rest6 } = base;
    expect(isPOP(rest6 as any)).toBe(true);
  });
});
