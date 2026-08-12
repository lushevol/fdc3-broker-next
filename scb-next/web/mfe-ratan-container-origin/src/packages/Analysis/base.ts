import { CommonUtil, ReactRouterDom, Service } from "../../Root/import";
import { featureScopedEnabled } from "../FeatureFlag/controller";
import { FinalRatanAnalyicsData, RatanAnalyticsData } from "./type";
import {
  RatanAnalysis2SingleUIBffAnalyze,
  v1EventTov2Event,
  v1PayloadTov2Payload,
} from "./convertor";
import dayjs from "dayjs";
import { emit } from "./v2/export";

export const useLocation = () => {
  try {
    const location = ReactRouterDom.useLocation();
    return location;
  } catch (error) {
    return {
      pathname: "",
    };
  }
};

export interface AnalyticsData {
  container: string;
  tile: string;
  name?: string;
  value?: string;
  event: string;
  key: string;
  attribute1?: string;
  attribute2?: string;
  attribute3?: string;
  attribute4?: string;
  attribute5?: string;
  attribute6?: string;
  attribute7?: string;
  attribute8?: string;
  attribute9?: string;
  attribute10?: string;
  attribute11?: string;
  attribute12?: string;
  attribute13?: string;
  attribute14?: string;
  attribute15?: string;
  attribute16?: string;
  attribute17?: string;
  attribute18?: string;
  attribute19?: string;
  attribute20?: string;
}

export const MAX_ATTRIBUTES_COUNT = 10;

export const collectData_V1 = (data: RatanAnalyticsData) => {
  try {
    const [_, CONTAINER, TILE] = (data.itemPath ?? "").split("/");
    delete data.itemPath;
    const finalData: FinalRatanAnalyicsData = {
      container: CONTAINER,
      tile: TILE,
      createdAt: dayjs().format(),
      traceId: generateUUID(),
      ...data,
    };
    const convertedData = RatanAnalysis2SingleUIBffAnalyze(finalData);
    return Service.service.post("/api/analytics/v1/fmo/print?extend=false", {
      ...convertedData,
      singleUIAuthorization: sessionStorage.getItem("SET_TOKEN"),
    });
  } catch (error) {}
};

export const collectData_v2 = (data: RatanAnalyticsData) => {
  return emit(v1EventTov2Event(data), v1PayloadTov2Payload(data.datas ?? []));
};

export const collectData = (data: RatanAnalyticsData) => {
  if (featureScopedEnabled("PM_Client_SDK_V2")) {
    return collectData_v2(data);
  } else {
    return collectData_V1(data);
  }
};

export function generateUUID() {
  return CommonUtil.uuidv4() as string;
}
