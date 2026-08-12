import { useContainerDispatcher } from "Import/index";

import { AdvancedSearchCriteria, SearchCriteria } from "../store/interface";
import {
  convertAdvancedSearch2Filters,
  convertQuickFilter2Filters,
} from "../store/utils";
import { useAppSelector } from "../store-redux";

const combineFilters = (
  predefinedFilters: Filter[],
  quickSearch: SearchCriteria,
  advancedSearch: AdvancedSearchCriteria
) => {
  const filters = [...predefinedFilters];
  let extraFilters: Filter[] = [];
  if (Object.keys(quickSearch).length > 0) {
    extraFilters = convertQuickFilter2Filters(quickSearch);
  } else if (advancedSearch.appliedFilter) {
    extraFilters = convertAdvancedSearch2Filters(advancedSearch);
  }
  return [
    ...filters.filter(
      (item) => !extraFilters.find((ef) => ef.field === item.field)
    ),
    ...extraFilters,
  ];
};

const useController = () => {
  const { dispacthOpenCashflow } = useContainerDispatcher();
  const { quickSearch, advancedSearch } = useAppSelector(
    (state) => state.dashboardSearch
  );
  return {
    openCashflowBlotterByFilter: (filters: Filter[], tileMenu: string) => {
      dispacthOpenCashflow(
        combineFilters(filters, quickSearch, advancedSearch),
        tileMenu
      );
    },
  };
};

export default useController;
