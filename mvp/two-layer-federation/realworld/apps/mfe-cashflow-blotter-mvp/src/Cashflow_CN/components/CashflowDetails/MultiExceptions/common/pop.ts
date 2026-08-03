import { VostroFormDetails } from "../components/Vostro/interface";

// is POP: Purpose of Payment
// #8267534
export const isPOP = (data: VostroFormDetails) =>
  data &&
  data.swiftType === "MT103" &&
  data.entity === "5" &&
  data.tradingCurrency !== "AED" &&
  data.settlementMeans === "NOS" &&
  data.settlementAccount.includes("MAIN") &&
  data.accountWithInstitutionBic !== "SUPPRESSXXX";
