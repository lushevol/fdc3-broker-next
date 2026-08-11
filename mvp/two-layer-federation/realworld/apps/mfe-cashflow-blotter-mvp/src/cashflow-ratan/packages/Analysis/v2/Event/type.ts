import { MonitorItem } from "../Item";
import { MonitorUser } from "../User";

export enum MonitorEventType {
  PAGE_VIEW = "PageView",
  ELEMENT_VIEW = "ElementView",
  EVENT = "Event",
  PERF = "Perf",
  RESOURCE = "Resource",
  ACTION = "Action",
  FETCH = "Fetch",
  CODE_ERROR = "CodeError",
  CONSOLE = "Console",
  CUSTOMER = "Customer",
}

export enum MonitorEventSubType {
  Start = "Start",
  End = "End",
  Click = "Click",
  DoubleClick = "DoubleClick",
  DisplayResolution = "DisplayResolution",
  RTT = "RTT",
  E2E_Latency = "E2E_Latency",
}

export type MonitorPayload = {
  tag: string;
  value: string;
};

export interface IPredefinedEvent {
  name: string;
  type: MonitorEventType;
  subType?: MonitorEventSubType;
  item?: MonitorItem;
}

export interface IMonitorEvent extends IPredefinedEvent {
  id: string;
  createdAt: number;
  createdAtDT: string;
  payloads: MonitorPayload[];
  user: MonitorUser;
}
