import { AgEvent, GridApi, GridReadyEvent, IRowNode } from "ag-grid-community";
import { randomString } from "Import/ratanutils";
import _cloneDeep from "lodash/cloneDeep";
import _compact from "lodash/compact";
import _concat from "lodash/concat";
import _uniqBy from "lodash/uniqBy";
import { RuleGroupType } from "react-querybuilder";
import { Dispatch } from "redux";
import { matchQueries } from "src/Cashflow_CN/components/CashflowNotification/CashflowNotificationSubscriber/graphqlGroupQueryMatcher";
import {
  api as ultraCashflowQuery,
  SettlementCashflowDataUltraQueryQuery,
} from "src/Cashflow_CN/schema/ultra-cashflow-query.generated";
import { queryCashflow } from "src/Cashflow_CN/services/graphql";
import {
  PagingOption,
  RatanUltraQuery,
  ResultNew,
  ResultPageInfo,
} from "src/generated/types.generated";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import { getFieldListFromAggridApi } from "src/Root/common/utils/field-utils";
import { legacyFilters2Query } from "src/Root/common/utils/query";
import { hydrate } from "src/Root/import/ratancomponents";

import {
  isCashflowUpdated,
  isSameCashflow,
} from "../../../components/CashflowNotification/CashflowNotificationSubscriber";
import {
  areAllNotifiedCashflows,
  NotifiedCashflow,
} from "../../../components/CashflowNotification/CashflowNotificationSubscriber/interface";
import { getCashflowDefaultFilter } from "../../config/UIconfig";
import { flattenKeys, getDiff, isEmptyArray } from "../../utils";
import { addVDtoQuery, checkShouldAddVD } from "../../utils/query-checker";
import {
  combineRuleGroups,
  convertRuleGroup2RatanUltraQueryFilters,
  filterInvalidRules,
  transformAllVariableDates,
} from "../../utils/query-convertor";
import * as types from "../actionTypes";
import { RootState } from "../interface";
import {
  updateNetCashflowWorkflowStatus,
  viewCashflowDetailsAction,
} from "./workflowAction";

const statusOfExclusion = ["NETTED", "DEAD"];

export const setInitParams = (data: any) => {
  return {
    type: types.SET_INIT_PARAMS,
    data,
  };
};

export const setCashflowGridEvent = (data: GridReadyEvent) => {
  return {
    type: types.SET_CASHFLOW_GRID_EVENT,
    data: data,
  };
};

interface QueryCashflowListProps {
  filters?: RuleGroupType;
  searchName?: string;
  callback?: (f: boolean) => void;
  isRefresh?: boolean;
}
const getFiltersWithDefault = (filters?: RuleGroupType): RuleGroupType => {
  return filters ?? { combinator: "and", rules: [] };
};

export const queryCashflowList = ({
  filters,
  searchName,
  callback,
  isRefresh,
}: QueryCashflowListProps) => {
  return async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const {
      cashflowGridEvent,
      cashflowListQueryId,
      cashflowListQueryPageSize,
      quickFilters,
      searchFilters,
      opensearch,
    } = getState();
    const rid = cashflowListQueryId + 1;
    dispatch({
      type: types.CASHFLOW_LIST_QUERY_ID,
      data: rid,
    });
    const { api } = cashflowGridEvent;
    const prevFilters = combineRuleGroups(searchFilters, quickFilters);
    let newFilter = getFiltersWithDefault(filters);

    if (isRefresh) {
      newFilter = combineRuleGroups(searchFilters, quickFilters);
    } else if (searchName === "quickFilter") {
      if (featureScopedEnabled("VD_Default_Query")) {
        const shouldAddVD = checkShouldAddVD(
          combineRuleGroups(searchFilters, newFilter),
          prevFilters
        );

        const isInit =
          (!filters?.rules.length &&
            searchName === "quickFilter" &&
            !searchFilters.rules.length) ||
          (!quickFilters.rules.length &&
            !searchFilters.rules.length &&
            !filters?.rules.length);

        if (shouldAddVD && !isInit) {
          dispatch({
            type: types.ACTION_TYPE_SET_QUICK_FILTERS,
            data: addVDtoQuery(getFiltersWithDefault(filters)),
          });
          newFilter = combineRuleGroups(
            searchFilters,
            addVDtoQuery(getFiltersWithDefault(filters))
          );
        } else {
          dispatch({
            type: types.ACTION_TYPE_SET_QUICK_FILTERS,
            data: getFiltersWithDefault(filters),
          });
          newFilter = combineRuleGroups(
            searchFilters,
            getFiltersWithDefault(filters)
          );
        }
      } else {
        newFilter = combineRuleGroups(searchFilters, newFilter);
        dispatch({
          type: types.ACTION_TYPE_SET_QUICK_FILTERS,
          data: getFiltersWithDefault(filters),
        });
      }
    } else {
      /**
       * Temporarily comment out combine search bar quickFilters plus newFilter as query slowly
       * Temporarily clear quickFilters store after newFilter come in
       * newFilter = combineRuleGroups(quickFilters, newFilter);
       */

      if (featureScopedEnabled("VD_Default_Query")) {
        const isInit =
          (!filters?.rules.length &&
            searchName === "searchSection" &&
            !quickFilters.rules.length) ||
          (!quickFilters.rules.length &&
            !searchFilters.rules.length &&
            !filters?.rules.length);

        const shouldAddVD = checkShouldAddVD(newFilter, prevFilters);

        if (shouldAddVD && !isInit) {
          dispatch({
            type: types.ACTION_TYPE_SET_QUICK_FILTERS,
            data: addVDtoQuery(quickFilters),
          });
          newFilter = addVDtoQuery(newFilter);
        }
      }

      dispatch({
        type: types.ACTION_TYPE_SET_SEARCH_FILTERS,
        data: getFiltersWithDefault(filters),
      });

      dispatch({
        type: types.ACTION_TYPE_SWITCH_SEARCH,
        data: searchName ?? "",
      });
      if (searchName !== "advancedSearch") {
        dispatch({
          type: types.ACTION_TYPE_SET_ADVANCED_SEARCH,
          data: { appliedFilter: null },
        });
      }
    }

    api?.setGridOption("loading", true);

    let cashflowListQueryIsDone: (f: boolean) => void = () => {
      return;
    };
    dispatch({
      type: types.SET_CASHFLOW_LIST_QUERY_STATUS,
      data: new Promise<boolean>((resolve) => {
        cashflowListQueryIsDone = resolve;
      }),
    });
    try {
      let results: ResultNew[] = [];
      let pageInfo: ResultPageInfo = {
        totalHits: 0,
        pageNo: 0,
        pageSize: 0,
        lastPage: false,
      };
      if (newFilter.rules.length === 0)
        newFilter = legacyFilters2Query(getCashflowDefaultFilter());
      const structuredFilter = convertRuleGroup2RatanUltraQueryFilters(
        transformAllVariableDates(filterInvalidRules(newFilter))
      );
      const queryPayload: RatanUltraQuery = {
        filters: structuredFilter,
        itemsPerPage: cashflowListQueryPageSize,
        orderArgs: [],
        pageIndex: 0,
        pagingOption: PagingOption.PageIndex,
      };
      const res = (await dispatch(
        ultraCashflowQuery.endpoints.SettlementCashflowDataUltraQuery.initiate(
          {
            payload: queryPayload,
            fields: getFieldListFromAggridApi(api),
            opensearch,
          },
          {
            forceRefetch: true,
          }
        )
        // @ts-ignore
      ).unwrap()) as SettlementCashflowDataUltraQueryQuery;
      const { cashflowUltraQuery } = res ?? {};
      const {
        results: responsResults,
        pageIndex,
        itemsPerPage,
        totalResult,
        lastPage,
      } = cashflowUltraQuery ?? {};
      results = responsResults ?? [];
      pageInfo.pageNo = pageIndex ?? 0;
      pageInfo.pageSize = itemsPerPage;
      pageInfo.totalHits = totalResult;
      pageInfo.lastPage = lastPage;
      const { cashflowListQueryId } = getState();
      if (rid !== cashflowListQueryId) {
        callback?.(false);
        return;
      }
      api?.setGridOption("rowData", results);
      api?.setGridOption("loading", false);
      dispatch({
        type: types.SET_CASHFLOW_LIST,
        data: results,
      });
      dispatch({
        type: types.SET_CASHFLOW_LIST_PAGINATION,
        data: pageInfo,
      });
      callback?.(true);
      cashflowListQueryIsDone(true);
    } catch (error) {
      console.error(error);
      api?.setGridOption("rowData", []);
      api?.setGridOption("loading", false);
      api?.showNoRowsOverlay();
      callback?.(false);
      cashflowListQueryIsDone(false);
    }
  };
};

export const queryNextPageCashflowList = ({
  callback,
  pageSize,
}: {
  callback?: (f: boolean) => void;
  pageSize?: number;
}) => {
  return async (dispatch: Function, getState: () => RootState) => {
    const {
      cashflowGridEvent,
      quickFilters,
      searchFilters,
      cashflowListPagination,
      opensearch,
    } = getState();
    const { api } = cashflowGridEvent;
    let finalFilters = combineRuleGroups(searchFilters, quickFilters);

    if (!cashflowListPagination.lastPage) {
      api?.setGridOption("loading", true);
      dispatch({
        type: types.LOAD_NEXT_PAGE,
        data: true,
      });
      let cashflowListQueryIsDone: (f: boolean) => void = () => {
        return;
      };
      dispatch({
        type: types.SET_CASHFLOW_LIST_QUERY_STATUS,
        data: new Promise<boolean>((resolve) => {
          cashflowListQueryIsDone = resolve;
        }),
      });
      try {
        let results: ResultNew[] = [];
        let pageInfo: ResultPageInfo = {
          totalHits: 0,
          pageNo: 0,
          pageSize: 0,
          lastPage: false,
        };
        if (finalFilters.rules.length === 0)
          finalFilters = legacyFilters2Query(getCashflowDefaultFilter());
        const structuredFilter = convertRuleGroup2RatanUltraQueryFilters(
          transformAllVariableDates(filterInvalidRules(finalFilters))
        );

        const queryPayload: RatanUltraQuery = {
          filters: structuredFilter,
          itemsPerPage: pageSize ?? cashflowListPagination.pageSize,
          orderArgs: [],
          pageIndex: cashflowListPagination.pageNo + 1,
          pagingOption: PagingOption.PageIndex,
        };
        const res = await dispatch(
          ultraCashflowQuery.endpoints.SettlementCashflowDataUltraQuery.initiate(
            {
              payload: queryPayload,
              fields: getFieldListFromAggridApi(api),
              opensearch,
            },
            {
              forceRefetch: true,
            }
          )
        ).unwrap();
        const { cashflowUltraQuery } = res ?? {};
        const {
          results: responsResults,
          pageIndex,
          itemsPerPage,
          totalResult,
          lastPage,
        } = cashflowUltraQuery ?? {};
        results = responsResults ?? [];
        pageInfo.pageNo = pageIndex ?? 0;
        pageInfo.pageSize = itemsPerPage;
        pageInfo.totalHits = totalResult;
        pageInfo.lastPage = lastPage;
        const { cashflowList } = getState();
        const cashflowIds = new Set(
          cashflowList.map((c) => c.Cashflow.Cashflow_Id)
        );
        // filter out existing cashflow
        const allData = [
          ...cashflowList,
          ...results.filter((r) => !cashflowIds.has(r.Cashflow?.Cashflow_Id)),
        ];
        api?.setGridOption("rowData", allData);
        api?.setGridOption("loading", false);
        api?.dispatchEvent({
          type: "gridFetchedAllData",
          isGridFetchedAll: cashflowListPagination.lastPage,
        } as AgEvent);
        api?.dispatchEvent({
          type: "gridFetchingData",
          isGridFetchingData: false,
        } as AgEvent);

        dispatch({
          type: types.SET_CASHFLOW_LIST,
          data: allData,
        });

        dispatch({
          type: types.SET_CASHFLOW_LIST_PAGINATION,
          data: pageInfo,
        });
        cashflowListQueryIsDone(true);
        callback?.(true);
      } catch (error) {
        api?.setGridOption("loading", false);
        cashflowListQueryIsDone(false);
        callback?.(false);
      }
      dispatch({
        type: types.LOAD_NEXT_PAGE,
        data: false,
      });
    } else {
      api?.dispatchEvent({
        type: "gridFetchedAllData",
        isGridFetchedAll: true,
      } as AgEvent);
      api?.setGridOption("loading", false);
      callback?.(false);
    }
  };
};

export const updateCashflow = (cashflowIds: string[]) => {
  return async (
    dispatch: Dispatch,
    getState: () => RootState
  ): Promise<CNCashflow[]> => {
    const { cashflowGridEvent, opensearch } = getState();
    const { api } = cashflowGridEvent;

    const res = await queryCashflow({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "IN", values: cashflowIds },
      ],
      api,
      disabledDefault: true,
      opensearch,
    });
    const { results } = res?.cashflowUltraQuery || {};

    if (results) {
      api?.applyTransaction({ update: results });
      const nodes = _compact(
        results
          .filter((r) => r.Cashflow?.Cashflow_Id)
          .map((r) => api?.getRowNode(r.Cashflow!.Cashflow_Id!))
      );
      api?.redrawRows({ rowNodes: nodes });
    }
    return results ?? [];
  };
};

export const filterOutCashflow = (
  cashflowInstances: CNCashflow[] | NotifiedCashflow[]
): CNCashflow[] => {
  if (areAllNotifiedCashflows(cashflowInstances)) {
    return cashflowInstances.map((c) => c.Cashflow);
  } else {
    return cashflowInstances;
  }
};

export const handleCashflowsData = (
  cashflowList: CNCashflow[],
  filteredCashflows: CNCashflow[],
  droppedCashflows: CNCashflow[]
) => {
  const updatedCashflows: CNCashflow[] = [];
  const deletedCashflows: CNCashflow[] = [];
  const newCashflowList = _cloneDeep(cashflowList) as CNCashflow[];
  const originCashflowsBeUpdated: CNCashflow[] = [];
  for (let i = 0; i < newCashflowList.length; i++) {
    const originCashflow = newCashflowList[i];

    if (filteredCashflows.length) {
      const targetFilteredIndex = filteredCashflows.findIndex((r) =>
        isSameCashflow(r, originCashflow)
      );
      if (targetFilteredIndex > -1) {
        const targetFilteredCashflow = filteredCashflows.at(
          targetFilteredIndex
        ) as CNCashflow;
        filteredCashflows.splice(targetFilteredIndex, 1);
        if (isCashflowUpdated(originCashflow, targetFilteredCashflow)) {
          updatedCashflows.push(targetFilteredCashflow);
          originCashflowsBeUpdated.push(newCashflowList[i]);
          newCashflowList[i] = targetFilteredCashflow;
        }
      }
    }

    if (droppedCashflows.length) {
      const targetDroppedIndex = droppedCashflows.findIndex((r) =>
        isSameCashflow(r, originCashflow)
      );
      if (targetDroppedIndex > -1) {
        const targetDroppedCashflow = droppedCashflows.at(
          targetDroppedIndex
        ) as CNCashflow;
        deletedCashflows.push(targetDroppedCashflow);
      }
    }
  }
  return {
    updatedCashflows,
    deletedCashflows,
    newCashflowList,
    originCashflowsBeUpdated,
  };
};

const isCashflowListNotChanges = (
  updatedCashflows: CNCashflow[],
  addedCashflows: CNCashflow[],
  deletedCashflows: CNCashflow[]
) => {
  return (
    !updatedCashflows.length &&
    !addedCashflows.length &&
    !deletedCashflows.length
  );
};

export const flashAddedCashflows = (
  api: GridApi,
  addedCashflows: CNCashflow[],
  hightlightDuration: number
) => {
  if (addedCashflows.length) {
    const rowNodes = addedCashflows
      .map((c) => api?.getRowNode(c.Cashflow!.Cashflow_Id as string))
      .filter(Boolean) as IRowNode<CNCashflow>[];
    if (rowNodes.length) {
      setTimeout(() => {
        api?.flashCells({
          rowNodes: rowNodes,
          fadeDuration: hightlightDuration,
        });
      }, 100);
    }
  }
};

export const flashUpdatedCashflows = (
  api: GridApi,
  updatedCashflows: CNCashflow[],
  originCashflowsBeUpdated: CNCashflow[],
  hightlightDuration: number
) => {
  updatedCashflows.forEach((r) => {
    const rowNode = api?.getRowNode(r.Cashflow!.Cashflow_Id as string);
    if (!rowNode) return;
    const originCashflow = originCashflowsBeUpdated.find(
      (o) => o.Cashflow!.Cashflow_Id === r.Cashflow!.Cashflow_Id
    );
    const columns = originCashflow
      ? flattenKeys(getDiff<CNCashflow>(originCashflow, r))
      : undefined;
    api?.flashCells({
      rowNodes: [rowNode],
      columns,
      fadeDuration: hightlightDuration,
    });
  });
};

const isCashflowPaginationChanges = (
  paginationNewRowsSize: number,
  deletedCashflows: CNCashflow[]
) => {
  return paginationNewRowsSize || deletedCashflows.length;
};

export const notificationUpdateOrAddingCashflows = (
  cashflowInstances: CNCashflow[] | NotifiedCashflow[]
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    if (isEmptyArray(cashflowInstances)) return;
    const { cashflowListQueryStatus } = getState();
    await cashflowListQueryStatus; // blotter loading
    const {
      cashflowGridEvent,
      quickFilters,
      searchFilters,
      cashflowList,
      cashflowListPagination,
      viewCashflowDetailsWorkflow,
    } = getState();
    const { api } = cashflowGridEvent as GridReadyEvent;
    const cashflows = filterOutCashflow(cashflowInstances);
    // apply filter
    let allFilters = transformAllVariableDates(
      combineRuleGroups(searchFilters, quickFilters)
    );
    if (allFilters.rules.length === 0)
      allFilters = legacyFilters2Query(getCashflowDefaultFilter());
    const [filteredCashflows, droppedCashflows] = matchQueries<CNCashflow>(
      cashflows,
      allFilters
    );

    const {
      updatedCashflows,
      deletedCashflows,
      newCashflowList,
      originCashflowsBeUpdated,
    } = handleCashflowsData(cashflowList, filteredCashflows, droppedCashflows);
    const addedCashflows: CNCashflow[] = filteredCashflows;

    if (
      isCashflowListNotChanges(
        updatedCashflows,
        addedCashflows,
        deletedCashflows
      )
    )
      return;

    // aggrid sheets modification
    // applyTransaction not working when adding with specific index
    // https://stackoverflow.com/questions/62238792/ag-grid-inserting-rows-with-applytransaction
    // https://stackoverflow.com/questions/55364022/how-to-insert-row-at-index-into-sorted-ag-grid/55374778#55374778
    // when upgrade to 32, applyTransaction is working now.
    api?.applyTransaction({
      update: updatedCashflows,
      remove: deletedCashflows,
      add: addedCashflows,
      addIndex: 0,
    });

    // highlight changes
    // new added rows flash
    const hightlightDuration = 60 * 1000;
    flashAddedCashflows(api, addedCashflows, hightlightDuration);

    // updated rows flash
    flashUpdatedCashflows(
      api,
      updatedCashflows,
      originCashflowsBeUpdated,
      hightlightDuration
    );

    const deletedCashflowsIds = deletedCashflows.map(
      (c) => c.Cashflow?.Cashflow_Id
    );
    // store
    dispatch({
      type: types.SET_CASHFLOW_LIST,
      data: [
        ...addedCashflows,
        ...newCashflowList.filter(
          (c) => !deletedCashflowsIds.includes(c.Cashflow?.Cashflow_Id)
        ),
      ],
    });
    // 1. first loaded -> totally hits
    // 2. totally hits -> all data
    // 3. new data
    // 1&2 can't be indentified
    let paginationNewRowsSize = addedCashflows.length;
    if (isCashflowPaginationChanges(paginationNewRowsSize, deletedCashflows)) {
      dispatch({
        type: types.SET_CASHFLOW_LIST_PAGINATION,
        data: {
          ...cashflowListPagination,
          totalHits:
            cashflowListPagination.totalHits +
            paginationNewRowsSize -
            deletedCashflows.length,
        },
      });
    }

    // level2 updating
    const { isOpenCashflowDetails, data: cashflowDetailsData } =
      viewCashflowDetailsWorkflow;
    if (isOpenCashflowDetails) {
      const targetCashflow = cashflows.find((cf) =>
        isSameCashflow(cf, cashflowDetailsData)
      );
      if (
        targetCashflow &&
        isCashflowUpdated(cashflowDetailsData, targetCashflow)
      ) {
        // alert refresh
        dispatch({
          type: types.SET_DIALOG_REFRESH_ALERT,
          data: {
            showAlert: true,
            onClickRefresh: (actions: string[]) => {
              if (actions.includes("hidemodal")) {
                dispatch({
                  type: types.SET_DIALOG_REFRESH_ALERT,
                  data: {
                    showAlert: false,
                    onClickRefresh: () => {},
                  },
                });
              }
              if (actions.includes("refresh")) {
                dispatch(
                  viewCashflowDetailsAction({
                    ...viewCashflowDetailsWorkflow,
                    data: targetCashflow,
                  })
                );
              }
            },
          },
        });
      }
    }
  };
};

export const updateCashflowsByNetid = (nettingId: string | string[]) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { cashflowGridEvent, netWorkflow, opensearch } = getState();
    const { api } = cashflowGridEvent;

    const { previewGridReadyEvent } = netWorkflow;
    const { api: previewApi } = previewGridReadyEvent ?? {};

    const mainTableColumns = api?.getAllDisplayedColumns();
    const netPreviewColumns = previewApi?.getAllDisplayedColumns();

    const mergedColumnDef = _uniqBy(
      _concat(mainTableColumns ?? [], netPreviewColumns ?? []),
      (item) => item.colDef.field
    );

    const isMultiNettingId = nettingId instanceof Array;
    const res = await queryCashflow({
      filters: [
        {
          field: "Cashflow.Netting_Id",
          operator: isMultiNettingId ? "IN" : "EQ",
          values: nettingId,
        },
      ],
      columnDefs: mergedColumnDef,
      disabledDefault: true,
      opensearch,
    });
    const { results } = res?.cashflowUltraQuery || {};
    if (results) {
      notificationUpdateOrAddingCashflows(results);
    }
    dispatch(updateNetCashflowWorkflowStatus({ nettingStatus: "FINISHED" }));
    return results;
  };
};

export const updateCashflowsInNetpreview = (cashflowId: string | string[]) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { cashflowGridEvent, netWorkflow, opensearch } = getState();
    const { api } = cashflowGridEvent;

    const { previewGridReadyEvent } = netWorkflow;
    const { api: previewApi } = previewGridReadyEvent ?? {};

    const mainTableColumns = api?.getAllDisplayedColumns() ?? [];
    const netPreviewColumns = previewApi?.getAllDisplayedColumns() ?? [];

    const mergedColumnDef = _uniqBy(
      _concat(mainTableColumns, netPreviewColumns),
      (item) => item.colDef.field
    );

    const isMultiId = cashflowId instanceof Array;
    const res = await queryCashflow({
      filters: [
        {
          field: "Cashflow.Cashflow_Id",
          operator: isMultiId ? "IN" : "EQ",
          values: cashflowId,
        },
      ],
      columnDefs: mergedColumnDef,
      disabledDefault: true,
      opensearch,
    });
    const { results } = res?.cashflowUltraQuery || {};
    if (results) {
      notificationUpdateOrAddingCashflows(results);
    }
    return results;
  };
};

export const updateVerifyUnNetCashflow = (cashflowIds: string[]) => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const { cashflowGridEvent, opensearch } = getState();
    const { api } = cashflowGridEvent;

    queryCashflow({
      filters: [
        { field: "Cashflow.Cashflow_Id", operator: "IN", values: cashflowIds },
      ],
      api,
      disabledDefault: true,
      opensearch,
    }).then((res: any) => {
      const { results } = res?.cashflowUltraQuery || {};
      const removeList: any[] = [];
      const addList: any[] = [];
      results?.forEach((item: any) => {
        if (statusOfExclusion.includes(item.Cashflow.Cashflow_State)) {
          removeList.push(item);
        } else {
          addList.push(item);
        }
      });
      api?.applyTransaction({ add: addList, remove: removeList });
    });
  };
};

export const clearFilter = () => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: types.ACTION_TYPE_SET_QUICK_FILTERS,
      data: [],
    });
    dispatch({
      type: types.ACTION_TYPE_SET_SEARCH_FILTERS,
      data: [],
    });
    dispatch({
      type: types.ACTION_TYPE_SWITCH_SEARCH,
      data: "",
    });
  };
};

export const holdWorkflowAction = (data: any) => {
  return {
    type: types.HOLD_WORKFLOW,
    data,
  };
};

export const earlyMaterializationWorkflowAction = (
  data: RootState["earlyMaterializationWorkflow"]
) => {
  return {
    type: types.EARLY_MATERIALIZATION_WORKFLOW,
    data,
  };
};

export const commonCommentActionWorkflowAction = (
  data: RootState["commonCommentActionWorkflow"]
) => {
  return {
    type: types.COMMON_COMMENT_ACTION_WORKFLOW,
    data,
  };
};

export const suppressWorkflowAction = (data: RootState["suppressWorkflow"]) => {
  return {
    type: types.SUPPRESS_WORKFLOW,
    data,
  };
};

export const manualSettleWorkflowAction = (
  data: RootState["manualSettleWorkflow"]
) => {
  return {
    type: types.MANUAL_SETTLE_WORKFLOW,
    data,
  };
};

export const aggridDeselectAll = () => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const { cashflowGridEvent } = getState();
    const { api } = cashflowGridEvent;
    api?.deselectAll();
  };
};

export const setLatestNotificationStack = (
  data: RootState["latestNotificationStack"]["pool"]
) => {
  return {
    type: types.LATEST_NOTIFICATION_STACK,
    data: {
      id: randomString(5),
      pool: data,
    },
  };
};

export const closeNotificationDialogWrap = () => {
  return {
    type: types.SET_DIALOG_REFRESH_ALERT,
    data: {
      showAlert: false,
      onClickRefresh: () => {},
    },
  };
};

export const advancedSearchAction = (data: RootState["advancedSearch"]) => {
  return async (dispatch: Dispatch<any>) => {
    const RQBFilters = hydrate(data.appliedFilter?.body);
    return new Promise((resolve, reject) => {
      dispatch(
        queryCashflowList({
          filters: RQBFilters,
          searchName: "advancedSearch",
          callback: (f: boolean) => {
            if (f) {
              dispatch({
                type: types.ACTION_TYPE_SET_ADVANCED_SEARCH,
                data: data,
              });
              resolve(data);
            } else reject(new Error("Search went wrong"));
          },
        })
      );
    });
  };
};

export const setLoadNextPage = (data: boolean) => {
  return {
    type: types.LOAD_NEXT_PAGE,
    data,
  };
};

export const setCashflowListQueryPageSize = (data: number) => {
  return async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const { cashflowListPagination, cashflowGridEvent } = getState();
    const { pageSize } = cashflowListPagination;
    if (pageSize === data) return;
    cashflowGridEvent.api?.ensureIndexVisible(0);
    dispatch({
      type: types.LOAD_NEXT_PAGE,
      data: true,
    });
    dispatch({
      type: types.CASHFLOW_LIST_QUERY_PAGE_SIZE,
      data,
    });
    try {
      await dispatch(
        queryCashflowList({
          isRefresh: true,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({
        type: types.LOAD_NEXT_PAGE,
        data: false,
      });
    }
  };
};

export const selectionGridChanged = (
  selectCount: number,
  displayDataCount: number,
  pageSize: number
) => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const { cashflowListPagination } = getState();
    const { totalHits } = cashflowListPagination;
    const isClientSelectAll =
      selectCount > 0 && selectCount === displayDataCount;
    const isClientSelectAllDataButNotLoadAll =
      isClientSelectAll && totalHits > pageSize && selectCount < totalHits;
    return { isClientSelectAllDataButNotLoadAll, totalHits };
  };
};

export const setOpensearch = (data: boolean) => {
  return {
    type: types.OPENSEARCH,
    data,
  };
};
