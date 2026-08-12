export interface RatanRawFieldConfig {
  valueList: string;
  indexedTerm: string;
  businessTerm?: string;
  dataType: string;
  subSelection?: string;
}
export interface FilterRecord {
  rowKey: string;
  name: string;
  body: string;
  owner: string;
  type: string;
  isPublic: boolean;
  creator: string;
  assignee: string;
  assigneeList: string;
  moduleOwner?: string;
  updateFlag?: string;
}
export type RatanFieldType =
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "time"
  | "datetime";
export type ValueList = {
  label: string;
  title: string;
  value: string;
  name: string;
  [x: string]: any;
};

export interface RatanFieldConfig
  extends Omit<RatanRawFieldConfig, "valueList"> {
  valueList: ValueList[];
  dataType: RatanFieldType;
}

export type QueryFilterList = () => Promise<FilterRecord[]>;
export type QueryFilterListAPI = (payload: {
  type: string;
  owner?: string;
  creator?: string;
  assignee?: string;
  moduleOwner?: string;
  searchAll: boolean;
}) => Promise<FilterRecord[]>;

export type QueryFilterDetails = (
  filter: FilterRecord
) => Promise<FilterRecord>;
export type QueryFilterDetailsAPI = (
  rowKey: string,
  type: string
) => Promise<FilterRecord>;

export type CreateFilter = (filter: FilterRecord) => Promise<FilterRecord>;
export type CreateFilterAPI = (f: FilterRecord) => Promise<FilterRecord>;

export type SaveFilter = (filter: FilterRecord) => Promise<FilterRecord>;
export type SaveFilterAPI = (
  rowKey: string,
  f: FilterRecord
) => Promise<FilterRecord>;

export type DeleteFilter = (filter: FilterRecord) => Promise<void>;
export type DeleteFilterAPI = (rowKey: string, type: string) => Promise<void>;
