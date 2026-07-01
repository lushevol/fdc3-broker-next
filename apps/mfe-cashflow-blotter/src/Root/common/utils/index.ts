import { RatanRawFieldConfig } from "src/Cashflow_CN/components/AdvancedSearch/types";
import { CommonUtil } from "src/Root/import";

export const generateUUID = () => {
  return CommonUtil.uuidv4();
};

export const round = (number: number, precision: number = 0) => {
  // @ts-ignore
  return Math.round(+number + "e" + precision) / Math.pow(10, precision);
};

type FieldsCache = {
  fields: RatanRawFieldConfig[];
  version?: {
    fields: string;
    fieldsConfig: string;
  };
};

const storageKey = "businessFieldsCashflowCN";
export const getFieldsVersion = (): FieldsCache["version"] => {
  try {
    const { getLocalStorage } = CommonUtil;
    const localFields: FieldsCache = JSON.parse(
      getLocalStorage().getItem(storageKey) as string
    );
    return (
      localFields?.version ?? {
        fields: "",
        fieldsConfig: "",
      }
    );
  } catch (error) {
    console.error(error);
    return {
      fields: "",
      fieldsConfig: "",
    };
  }
};

export const getHostName = () => {
  const { hostname } = getLocation();
  return hostname;
};

export const getLocation = () => {
  const { location } = window;
  return location;
};

export const getEnv = () => {
  const hostname = getHostName();
  switch (hostname) {
    case "localhost":
      return "LOCAL";
    case "fmo-mfe-dev.uk.dev.net":
      return "DEV";
    case "fmo-mfe.uk.dev.net":
    case "uklvadapp1344.uk.dev.net":
    case "uklvadapp1346.uk.dev.net":
    case "fmo-mfe-fmrp1.pi.dev.net":
    case "fmo-mfe-fmrp2.pi.dev.net":
      return "UAT";
    case "uklvadapp1342.uk.dev.net":
      return "UAT2";
    case "fmo-mfe-preprod.pi.dev.net":
      return "PRE-PROD";
    case "ratan-aws-app-fmo-mfe.ir.standardchartered.com":
      return "EKS";
    case "ratan-aws-sit-ns4-fmo-mfe.ir.standardchartered.com":
      return "SIT";
    default:
      return "PROD";
  }
};

export const BreakPoint = {
  Monitor: 1921,
  Middle: 1550,
  Laptop: 1281,
};
