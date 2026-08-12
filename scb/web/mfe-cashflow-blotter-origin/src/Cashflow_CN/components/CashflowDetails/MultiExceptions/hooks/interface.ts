import { CommonExceptionsNames, ExceptionItem } from "../common/interface";

export interface FormSubmitResult {
  valid: boolean;
  data: { [name: string]: any };
}

export type LayoutAvailableActions = "Edit" | "Edit (Adhoc SSI)" | "Edit ";

export interface LayoutItemProperty {
  show: boolean;
  title?: string;
  titleColor?: string;
  disable?: boolean;
  availableActions?: LayoutAvailableActions[];
}

export interface LayoutSetting {
  [name: string]: LayoutItemProperty;
}

export type ClassifiedCommonExceptionsType = Record<
  CommonExceptionsNames,
  ExceptionItem[]
>;
