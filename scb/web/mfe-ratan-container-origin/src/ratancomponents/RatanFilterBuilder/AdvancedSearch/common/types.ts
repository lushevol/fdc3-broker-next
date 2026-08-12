import { RuleGroupType } from "react-querybuilder";

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

export interface ShadowFilterRecord extends Omit<FilterRecord, "body"> {
  body: RuleGroupType;
}

export type QueryFilterList = () => Promise<FilterRecord[]>;

export type QueryFilterDetails = (
  filter: FilterRecord
) => Promise<FilterRecord>;

export type CreateFilter = (filter: FilterRecord) => Promise<FilterRecord>;

export type SaveFilter = (filter: FilterRecord) => Promise<FilterRecord>;

export type DeleteFilter = (filter: FilterRecord) => Promise<void>;

export type GroupFilterOption = {
  label: string;
  options: FilterOptionItem[];
};

export type FilterOptionItem = {
  label: string;
  value: string;
};
