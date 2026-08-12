import { VostroFormDetails } from "../components/Vostro/interface";

export const isSCPAY = (data: VostroFormDetails) =>
  data && data.swiftType === "MT202" && data.settlementMeans === "Over-Account";

export const mandatoryTooltipText =
  "Beneficiary Account Number is mandatory for SCPAY Markets";
