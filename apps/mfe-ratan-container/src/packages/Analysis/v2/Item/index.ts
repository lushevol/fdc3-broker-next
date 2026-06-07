import { IMonitorItem, ItemSubType, ItemType } from "./type";

export class MonitorItem implements IMonitorItem {
  name: string;
  path: string;
  type: ItemType;
  subType?: ItemSubType;
  constructor(i: IMonitorItem) {
    this.name = i.name;
    this.path = i.path;
    this.type = i.type;
    this.subType = i.subType;
  }
}
