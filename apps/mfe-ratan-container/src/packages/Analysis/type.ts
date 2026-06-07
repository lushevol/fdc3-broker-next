import { ItemType } from "./v2/Item/type";

export interface RatanAnalyticsData {
  traceId?: string; // uuid of trace log
  type: TraceTypes;
  subType?: TraceSubTypes;
  name?: string; // event name
  datas?: CollectedData[];
  itemPath?: string;
}

export type CollectedTagValueData = {
  tag?: string;
  value?: string | number | boolean;
};

export type CollectedData = CollectedTagValueData | string | number;

export interface FinalRatanAnalyicsData extends RatanAnalyticsData {
  traceId: string; // uuid of trace log
  container: string;
  tile: string;
  createdAt: string; // create at timestamp
  userName?: string;
  userUID?: string;
  userRatanProfile?: string;
  userTimezoneOffset?: string;
  userCountry?: string;
  itemType?: ItemType;
}

export enum TraceTypes {
  PAGE_VIEW = "PageView",
  EVENT = "Event",
  PERF = "Perf",
  RESOURCE = "Resource",
  ACTION = "Action",
  FETCH = "Fetch",
  CODE_ERROR = "CodeError",
  CONSOLE = "Console",
  CUSTOMER = "Customer",
}

export enum TraceSubTypes {
  Start = "Start",
  End = "End",
  Click = "Click",
  RTT = "RTT",
  E2E_Latency = "E2E_Latency",
  Count = "Count",
}
