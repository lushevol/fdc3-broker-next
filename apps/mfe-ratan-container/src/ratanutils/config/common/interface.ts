import { ColDef } from "ag-grid-community";
export interface FieldsType {
  [key: string]: {
    businessTerm?: string;
    displayStyle?: string;
    operators?: string;
    valueList?: string | string[];
    colDefs?: ColDef;
    disabledView?: boolean | string[];
    disabledFilter?: boolean | string[];
    detailsFixed?: boolean;
    detailsGroup?: string;
    dynamicList?: boolean;
    context?: string;
    index?: number;
  };
}

export type GroupFilterOption = {
  label: string;
  options: FilterOptionItem[];
};

export type FilterOptionItem = {
  label: string;
  value: string;
  children?: string;
};
