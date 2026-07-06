import { useContainerDispatcher } from 'Import/index';
import { useFDC3 } from 'ratan-fdc3-agent';
import {
  type CashflowSearchAgent,
  type CashflowSearchTarget,
  raiseCashflowSearchIntent,
} from 'src/Root/fdc3/cashflowInterop';

import { AdvancedSearchCriteria, SearchCriteria } from '../store/interface';
import { convertAdvancedSearch2Filters, convertQuickFilter2Filters } from '../store/utils';
import { useAppSelector } from '../store-redux';
import { TILE_MENU } from '../common/interface';

const combineFilters = (
  predefinedFilters: Filter[],
  quickSearch: SearchCriteria,
  advancedSearch: AdvancedSearchCriteria,
) => {
  const filters = [...predefinedFilters];
  let extraFilters: Filter[] = [];
  if (Object.keys(quickSearch).length > 0) {
    extraFilters = convertQuickFilter2Filters(quickSearch);
  } else if (advancedSearch.appliedFilter) {
    extraFilters = convertAdvancedSearch2Filters(advancedSearch);
  }
  return [
    ...filters.filter((item) => !extraFilters.find((ef) => ef.field === item.field)),
    ...extraFilters,
  ];
};

const useController = () => {
  const { dispacthOpenCashflow } = useContainerDispatcher();
  const fdc3 = useFDC3() as CashflowSearchAgent;
  const { quickSearch, advancedSearch } = useAppSelector((state) => state.dashboardSearch);
  return {
    openCashflowBlotterByFilter: async (filters: Filter[], tileMenu: string) => {
      const combinedFilters = combineFilters(filters, quickSearch, advancedSearch);
      const target: CashflowSearchTarget =
        tileMenu === TILE_MENU.CASHFLOW_GROUP_MANAGEMENT
          ? 'cashflow_group_management'
          : 'cashflow_cn';

      try {
        await raiseCashflowSearchIntent(fdc3, combinedFilters, target);
      } catch (error) {
        console.warn(
          '[Cashflow FDC3] Falling back to direct cashflow open after SearchCashflows failed',
          error,
        );
        dispacthOpenCashflow(combinedFilters, tileMenu);
      }
    },
  };
};

export default useController;
