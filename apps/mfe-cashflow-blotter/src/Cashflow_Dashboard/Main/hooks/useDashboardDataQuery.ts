import { useCallback, useEffect, useMemo } from "react";
import { RuleGroupType } from "react-querybuilder";
import {
  combineRuleGroups,
  convertRuleGroup2RatanUltraQueryFilters,
  filterOutDuplicateFieldsQuery,
} from "src/Cashflow_CN/Main/utils/query-convertor";
import { useLazySettlementCashflowDataUltraQueryCountQuery } from "src/Cashflow_CN/schema/ultra-cashflow-query-count.generated";
import { StatusList } from "src/Cashflow_Dashboard/components/StatusIndicator";
import { convertFilter2GroupSearchCriteria } from "src/Cashflow_Group_Management/Main/common/utils";
import { useLazySettlementGroupMessageCountQuery } from "src/Cashflow_Group_Management/schema/group-message-query.generated";
import {
  convertRuleGroup2LegacyFilters,
  legacyFilters2Query,
} from "src/Root/common/utils/query";

import { parseAdvancedSearch, parseQuickFilter } from "../store/utils";
import { useAppDispatch, useAppSelector } from "../store-redux";
import {
  setAllStatusLoading,
  setStatusLoadingByPath,
  setStatusValueByPath,
} from "../store-redux/slice/dashboard-data";
import { setIsSearching } from "../store-redux/slice/dashboard-search";

export const useDashboardDataQuery = () => {
  const { advancedSearch, quickSearch } = useAppSelector(
    (state) => state.dashboardSearch
  );

  const globalQuery = useMemo(() => {
    return combineRuleGroups(
      parseAdvancedSearch(advancedSearch),
      parseQuickFilter(quickSearch)
    );
  }, [advancedSearch, quickSearch]);

  const { triggerQuery } = useDashboardDataQueryAPI(globalQuery);

  useFilterChangeAutoRequery(globalQuery, triggerQuery);

  return {
    triggerQuery,
  };
};

export const useDashboardDataQueryAPI = (globalQuery: RuleGroupType) => {
  const dispatch = useAppDispatch();
  const [queryCashflowCount] =
    useLazySettlementCashflowDataUltraQueryCountQuery();
  const [queryGroupCount] = useLazySettlementGroupMessageCountQuery();

  const triggerQuery = useCallback(async () => {
    dispatch(setIsSearching(true));
    dispatch(setAllStatusLoading(true));
    for (const statusConfig of StatusList) {
      const { key, getfilters } = statusConfig;
      try {
        dispatch(setStatusLoadingByPath({ path: key, isLoading: true }));
        if (key.toLowerCase().startsWith("group")) {
          const panelFilters = legacyFilters2Query(getfilters());
          const finalFilters = convertFilter2GroupSearchCriteria(
            convertRuleGroup2LegacyFilters(
              filterOutDuplicateFieldsQuery(
                combineRuleGroups(globalQuery, panelFilters)
              )
            )
          );
          const {
            groupMessages: {
              pageInfo: { totalHits },
            },
          } = await queryGroupCount({
            filter: finalFilters,
            pageNo: 0,
            pageSize: 100,
          }).unwrap();

          dispatch(setStatusValueByPath({ path: key, value: totalHits }));
        } else {
          const panelFilters = legacyFilters2Query(getfilters());
          const finalFilters = filterOutDuplicateFieldsQuery(
            combineRuleGroups(globalQuery, panelFilters)
          );
          const {
            cashflowUltraQueryCount: { count },
          } = await queryCashflowCount({
            payload: {
              filters: convertRuleGroup2RatanUltraQueryFilters(finalFilters),
            },
          }).unwrap();

          dispatch(setStatusValueByPath({ path: key, value: count }));
        }
      } catch (error) {
      } finally {
        dispatch(setStatusLoadingByPath({ path: key, isLoading: false }));
      }
    }
    dispatch(setIsSearching(false));
  }, [globalQuery]);

  return {
    triggerQuery,
  };
};

const useFilterChangeAutoRequery = (
  filters: RuleGroupType,
  query: () => Promise<void>
) => {
  useEffect(() => {
    query();
  }, [filters, query]);
};
