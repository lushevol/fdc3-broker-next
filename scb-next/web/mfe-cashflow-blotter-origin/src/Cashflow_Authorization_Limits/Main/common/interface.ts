import { TileProps } from "../../../Root/routing/common/interface";

export interface MainProps extends TileProps {}

export enum LimitationActionType {
  VIEW = "View",
  EDIT = "Edit",
  CREATE = "Create",
  DELETE = "Delete",
  APPROVE_ADD = "Approve Add",
  REJECT_ADD = "Reject Add",
  APPROVE_EDIT = "Approve Edit",
  REJECT_EDIT = "Reject Edit",
  APPROVE_DELETE = "Approve Delete",
  REJECT_DELETE = "Reject Delete",
}

export interface LimitationRecordKeyInfo {
  profile: string;
  currency: "USD";
  limitation: number;
}

export interface LimitationRecord extends LimitationRecordKeyInfo {
  limitationId: string;
  status: RecordStatus;
  version: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deleted: boolean;
}

export interface LimitationSearchParams {
  profiles: string[];
  currencies: string[];
}

export enum RecordStatusTypes {
  ADD_PENDING = "ADD_PENDING",
  EDIT_PENDING = "EDIT_PENDING",
  CONFIRMED = "CONFIRMED",
  ADD_REJECTED = "ADD_REJECTED",
  DELETE_PENDING = "DELETE_PENDING",
}

export type RecordStatus = `${RecordStatusTypes}`;

export type UserRole = "Checker" | "Maker" | "Visitor";
