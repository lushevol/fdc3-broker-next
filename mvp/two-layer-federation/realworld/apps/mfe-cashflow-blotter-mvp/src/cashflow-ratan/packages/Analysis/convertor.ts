import { AnalyticsData, MAX_ATTRIBUTES_COUNT } from "./base";
import {
  CollectedData,
  FinalRatanAnalyicsData,
  RatanAnalyticsData,
  TraceSubTypes,
  TraceTypes,
} from "./type";
import { MonitorEvent } from "./v2/Event";
import {
  MonitorEventType,
  MonitorEventSubType,
  IPredefinedEvent,
  MonitorPayload,
} from "./v2/Event/type";
import { ItemType } from "./v2/Item/type";
import { parsePath } from "./v2/Item/utils";

export const RatanAnalysis2SingleUIBffAnalyze = (
  data: FinalRatanAnalyicsData
): AnalyticsData => {
  const {
    traceId,
    createdAt,
    type,
    subType,
    datas,
    userName,
    userRatanProfile,
    userUID,
    userTimezoneOffset,
    userCountry,
    itemType,
    itemPath,
    ...rest
  } = data;
  let attributeIndex = 1;
  const attributes = (datas?.reduce((res, cur) => {
    if (attributeIndex > MAX_ATTRIBUTES_COUNT) return res;
    if (typeof cur === "object") {
      res["attribute" + attributeIndex] = cur.tag + "";
      res["attribute" + (attributeIndex + 1)] = cur.value + "";
      attributeIndex += 2;
    } else {
      res["attribute" + attributeIndex] = cur + "";
      attributeIndex++;
    }
    return res;
  }, {}) ?? {}) as { [s: string]: string };
  return {
    ...rest,
    ...attributes,
    event: type + (subType ? "/" + subType : ""),
    key: traceId,
    value: createdAt,
    attribute20: userName,
    attribute19: userUID,
    attribute18: userRatanProfile,
    attribute17: userTimezoneOffset,
    attribute16: itemPath,
    attribute15: itemType,
    attribute14: type,
    attribute13: subType,
    attribute12: userCountry,
  };
};

export const v2EventTov1Event = (e: MonitorEvent): FinalRatanAnalyicsData => {
  return {
    traceId: e.id,
    type: e.type as unknown as TraceTypes,
    subType: e.subType as unknown as TraceSubTypes,
    name: e.name,
    datas: e.payloads,
    itemPath: e.item?.path,
    itemType: e.item?.type,
    container: parsePath(e.item?.path ?? "")[0],
    tile: parsePath(e.item?.path ?? "")[1],
    createdAt: e.createdAt + "",
    userName: e.user.name,
    userUID: e.user.uid,
    userRatanProfile: e.user.profile,
    userTimezoneOffset: e.user.tzos,
    userCountry: e.user.country,
  };
};

export const v1EventTov2Event = (
  data: RatanAnalyticsData
): IPredefinedEvent => {
  return {
    name: data.name + "",
    type: data.type as unknown as MonitorEventType,
    subType: data.subType as unknown as MonitorEventSubType,
    item: {
      name: "",
      path: data.itemPath + "",
      type: ItemType.Element,
    },
  };
};

export const v1PayloadTov2Payload = (
  payload: CollectedData[]
): MonitorPayload[] => {
  const mp: MonitorPayload[] = [];
  payload.forEach((p) => {
    if (typeof p !== "object") {
      mp.push({
        tag: "",
        value: p + "",
      });
    } else {
      mp.push({
        tag: p.tag + "",
        value: p.value + "",
      });
    }
  });

  return mp;
};
