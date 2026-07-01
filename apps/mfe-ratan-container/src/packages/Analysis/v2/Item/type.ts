export enum ItemType {
  Page = "Page",
  Block = "Block",
  Element = "Element",
}

export enum ItemSubType {
  button = "button",
  tab = "tab",
}

export interface IMonitorItemNode {
  name: string;
  type: ItemType;
  subType?: ItemSubType;
}

export interface IMonitorItem extends IMonitorItemNode {
  path: string;
}

export interface IMonitorItemTree {
  node: IMonitorItemNode;
  children: IMonitorItemTree[];
}
