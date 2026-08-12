import { FilterRecord } from "src/Cashflow_Dashboard/components/CustomSearchView/types";

export interface SearchCriteria {
  [n: string]: string | number | string[];
}
export interface AdvancedSearchCriteria {
  appliedFilter: FilterRecord | null;
}
