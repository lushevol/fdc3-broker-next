import { MonitorItem } from "../Item";
import { getCachedMonitorUser } from "../User/utils";
import { generateUUID } from "../import";
import type {
  IMonitorEvent,
  IPredefinedEvent,
  MonitorEventSubType,
  MonitorEventType,
  MonitorPayload,
} from "./type";

export class MonitorEvent implements IMonitorEvent {
  id = generateUUID();
  createdAt = Date.now();
  createdAtDT = new Date().toISOString();
  user = getCachedMonitorUser();
  name: string;
  type: MonitorEventType;
  subType?: MonitorEventSubType;
  item?: MonitorItem;
  payloads: MonitorPayload[];
  constructor(e: IPredefinedEvent, payloads: MonitorPayload[] = []) {
    this.name = e.name;
    this.type = e.type;
    this.subType = e.subType;
    this.item = e.item;
    this.payloads = payloads;
  }
}
