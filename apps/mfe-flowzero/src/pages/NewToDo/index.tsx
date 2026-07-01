import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";
import type {
  GridApi,
  GridReadyEvent,
  IGetRowsParams,
  PaginationChangedEvent,
  RowDoubleClickedEvent,
} from "ag-grid-community";
import { Breadcrumb, Button, Skeleton, Space } from "antd";
import cn from "classnames";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getTodos } from "src/api/todo/Todo";
import AdvancedFilterModal, {
  FilterCondition,
  FilterConfigItem,
} from "src/components/AdvancedFilterModal";
import { SearchBox } from "src/components/base";
import {
  applyClientSort,
  coverStyle,
  createBaseGridOptions,
  DataGrid,
  TooltipHeader,
} from "src/components/DataGrid";
import EllipsisTooltip from "src/components/EllipsisTooltip";
import Empty from "src/components/Empty";
import fieldsEmpty from "src/images/fieldsEmpty.png";
import { ContainerProvider, ReactRouterDom } from "src/Root/import";
import { navigationStore } from "src/stores/NavigationStore";
const { useNavigate, useLocation } = ReactRouterDom;
import { useTableStatePersistence } from "src/hooks/useTablePagePersistence";
import type { GetTodosParams, TodoItem } from "src/types/todo";
import { getUser } from "src/util/authenticator";

import AssignTaskModal from "./components/AssignTaskModal";
import ColSetupDrawer from "./components/ColSetupDrawer";
import {
  BUTTON_POPOVER_GAP,
  GRID_NAME,
  POPOVER_BOTTOM_OFFSET,
  POPOVER_MIN_HEIGHT,
  TODO_FILTER_CONFIG,
  VIEW_TYPE,
} from "./constants/index";
import { useAssignActions } from "./hooks/useAssignActions";
import { ALL_COL_SETUP, useToDoColumns } from "./hooks/useToDoColumns";
import { useToDoParams } from "./hooks/useToDoParams";
import { StyleRoot } from "./styles";

const Todo = () => {
  const navigate = useNavigate();
  const { id: currentUserId } = getUser();
  const location = useLocation();
  const { readTableState, saveTableState, clearTableState, isFromDetail } =
    useTableStatePersistence("new-todo-state");
  const {
    urlParams,
    urlWorkflowName,
    urlTaskName,
    urlAssigneeOnly,
    urlWorkflowIds,
    urlWorkflowIdsKey,
    viewType,
    defaultColKeys,
  } = useToDoParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [pageSize, setPageSize] = useState(() => {
    if (isFromDetail) {
      const s = readTableState()?.pageSize as number | undefined;
      if (s && s > 0) return s;
    }
    return 10;
  });
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // ag-Grid pagination starts from 0
  const [pageNum, setPageNum] = useState(0);
  const [searchLabel, setSearchLabel] = useState<string>(() =>
    isFromDetail ? (readTableState()?.searchLabel as string) ?? "" : ""
  );
  const [advancedFilters, setAdvancedFilters] = useState<
    Partial<GetTodosParams>
  >(() =>
    isFromDetail
      ? (readTableState()?.advancedFilters as Partial<GetTodosParams>) ?? {}
      : {}
  );
  const [popoverVisible, setPopoverVisible] = useState(false);
  const advancedFilterBtnRef = React.useRef<HTMLButtonElement>(null);
  const [resetFiltersFlag, setResetFiltersFlag] = useState(0);
  const [colSetupOpen, setColSetupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<TodoItem[]>([]);
  const pageDataCache = useRef<Map<number, TodoItem[]>>(new Map());

  const {
    assignVisible,
    setAssignVisible,
    assignTargetRows,
    assignLoading,
    claimLoading,
    handleClaimRef,
    handleAssignOpenRef,
    handleDirectAssignRef,
    handleAssignConfirm,
  } = useAssignActions({
    currentUserId,
    gridApi,
    pageDataCache,
    clearTableState,
    setSelectedRows,
  });

  const {
    activeColKeys,
    setActiveColKeys,
    dynamicCol,
    setDynamicCol,
    computedColumns,
  } = useToDoColumns({
    urlTaskName,
    urlWorkflowName,
    viewType,
    defaultColKeys,
    handleClaimRef,
    handleAssignOpenRef,
  });

  const filterConfig: FilterConfigItem[] = TODO_FILTER_CONFIG;

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [popoverMaxHeight, setPopoverMaxHeight] = useState<number>();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updatePopoverMaxHeight() {
      if (
        popoverVisible &&
        advancedFilterBtnRef.current &&
        scrollContainerRef.current
      ) {
        const btnRect = advancedFilterBtnRef.current.getBoundingClientRect();
        const containerRect =
          scrollContainerRef.current.getBoundingClientRect();
        const distanceToTop =
          btnRect.bottom - containerRect.top + BUTTON_POPOVER_GAP;
        const containerHeight = scrollContainerRef.current.scrollHeight;
        const maxHeight =
          containerHeight - distanceToTop - POPOVER_BOTTOM_OFFSET;
        setPopoverMaxHeight(
          maxHeight > POPOVER_MIN_HEIGHT ? maxHeight : POPOVER_MIN_HEIGHT
        );
      }
    }

    updatePopoverMaxHeight();

    window.addEventListener("resize", updatePopoverMaxHeight);
    return () => {
      window.removeEventListener("resize", updatePopoverMaxHeight);
    };
  }, [popoverVisible]);

  const totalRef = useRef(0);
  const currentPageRef = useRef<number>(0);
  const gridApiRef = useRef<GridApi | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const pendingPageRef = useRef<number | null>(null);
  const jumpTargetRef = useRef<number | null>(null);
  const initialPageJumpedRef = useRef(false);
  const [ContainerStore] = ContainerProvider.useContext();
  const isLocalRef = useRef(true);
  isLocalRef.current = ContainerStore.timeType?.toUpperCase() !== "UTC";

  const gridOptions = useMemo(
    () => ({
      ...createBaseGridOptions(pageSize),
      suppressContextMenu: false,
      suppressRowClickSelection: true,
      defaultColDef: {
        suppressHeaderMenuButton: false,
        suppressHeaderContextMenu: false,
        resizable: true,
        filter: false,
        headerComponent: TooltipHeader,
      },
    }),
    [pageSize]
  );
  // Only save api
  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    setGridApi(params.api);
  };

  const setRowsVisibility = (visible: boolean) => {
    const el =
      gridContainerRef.current?.querySelector<HTMLElement>(".ag-body-viewport");
    if (el) el.style.visibility = visible ? "visible" : "hidden";
  };

  const onSortChanged = useCallback(() => {
    if (currentPageRef.current > 0) {
      pendingPageRef.current = currentPageRef.current;
      jumpTargetRef.current = currentPageRef.current;
      setRowsVisibility(false);
    }
  }, []);

  const hasFilterOrSearch = () => {
    return !!searchLabel || Object.keys(advancedFilters).length !== 0;
  };

  // Handle advanced filter apply
  const handleAdvancedFilterApply = (
    _filters: FilterCondition[],
    apiParams: Partial<GetTodosParams>
  ) => {
    // Update advanced filters state
    setAdvancedFilters(apiParams);

    // Refresh the grid with new filters
    if (gridApi) {
      gridApi.refreshInfiniteCache();
    }

    setPopoverVisible(false);
  };

  // Use useMemo for datasource to refresh when pageSize changes
  const requestInProgressRef = React.useRef(false);

  const datasource = useMemo(() => {
    pageDataCache.current.clear();

    return {
      getRows: (rowParams: IGetRowsParams) => {
        if (requestInProgressRef.current) return;

        const { startRow, sortModel } = rowParams as IGetRowsParams & {
          sortModel: { colId: string; sort: "asc" | "desc" }[];
        };

        const deliver = (rawRows: TodoItem[]) => {
          const sorted = applyClientSort(rawRows, sortModel ?? []);
          rowParams.successCallback(sorted, totalRef.current);
          if (startRow === 0 && pendingPageRef.current !== null) {
            const targetPage = pendingPageRef.current;
            pendingPageRef.current = null;
            setTimeout(() => {
              gridApiRef.current?.paginationGoToPage(targetPage);
            }, 0);
          }
        };

        if (pageDataCache.current.has(startRow)) {
          deliver(pageDataCache.current.get(startRow)!);
          return;
        }

        const page = startRow / pageSize;
        requestInProgressRef.current = true;
        setLoading(true);
        getTodos({
          page,
          size: pageSize,
          workflowName: urlWorkflowName || undefined,
          requestId: searchLabel || undefined,
          taskName: urlTaskName || undefined,
          assigneeOnly: urlAssigneeOnly,
          ...advancedFilters,
        })
          .then((res) => {
            const rows = res.data || [];
            const total = res.totalElements ?? 0;
            pageDataCache.current.set(startRow, rows);
            totalRef.current = total;
            setTotalElements(total);
            setLoading(false);
            setIsFirstLoad(false);
            requestInProgressRef.current = false;
            if (urlWorkflowName) {
              navigationStore.triggerRefresh(urlWorkflowName);
            }
            deliver(rows);
            if (!initialPageJumpedRef.current) {
              initialPageJumpedRef.current = true;
              const stored = (readTableState()?.page as number | null) ?? null;
              const totalPages = Math.ceil(total / pageSize);
              if (stored !== null && stored > 0 && stored < totalPages) {
                setTimeout(
                  () => gridApiRef.current?.paginationGoToPage(stored),
                  0
                );
              }
            }
          })
          .catch(() => {
            setTotalElements(0);
            setLoading(false);
            requestInProgressRef.current = false;
            rowParams.successCallback([], 0);
          });
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageSize,
    searchLabel,
    advancedFilters,
    urlWorkflowName,
    urlTaskName,
    urlAssigneeOnly,
    urlWorkflowIdsKey,
  ]);

  useEffect(() => {
    const returningFromDetail = !!(location.state as { fromDetail?: boolean })
      ?.fromDetail;
    setIsFirstLoad(true);
    setTotalElements(0);
    setSelectedRows([]);
    if (!returningFromDetail) {
      clearTableState();
      initialPageJumpedRef.current = false;
    }
    pageDataCache.current.clear();
    if (gridApi) {
      gridApi.refreshInfiniteCache();
    }
  }, [urlWorkflowName, urlTaskName, urlAssigneeOnly, urlWorkflowIdsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (gridApi) {
      pageDataCache.current.clear();
      gridApi.refreshInfiniteCache();
    }
  }, [gridApi]); // eslint-disable-line react-hooks/exhaustive-deps

  // ag-Grid built-in pagination jump
  const handlePaginationChanged = (params: PaginationChangedEvent) => {
    const api = params.api;
    if (api) {
      const prevPageNum = currentPageRef.current;
      const newPageNum = api.paginationGetCurrentPage();
      currentPageRef.current = newPageNum;
      if (newPageNum !== prevPageNum) {
        api.deselectAll();
        setSelectedRows([]);
      }
      if (
        jumpTargetRef.current !== null &&
        newPageNum === jumpTargetRef.current
      ) {
        jumpTargetRef.current = null;
        setRowsVisibility(true);
      }
      const newPageSize = api.paginationGetPageSize();
      if (newPageSize !== pageSize) {
        setPageSize(newPageSize);
        saveTableState({ pageSize: newPageSize });
      }
      setPageNum(newPageNum);
      if (initialPageJumpedRef.current) {
        saveTableState({ page: newPageNum });
      }
    }
  };

  const handleRowDoubleClick = (event: RowDoubleClickedEvent) => {
    saveTableState({ searchLabel, advancedFilters });
    const urlTaskKey = urlParams.get("taskKey") ?? "";
    const extraParams = [
      urlWorkflowName && `workflowName=${encodeURIComponent(urlWorkflowName)}`,
      urlTaskName && `taskName=${encodeURIComponent(urlTaskName)}`,
      urlTaskKey && `taskKey=${encodeURIComponent(urlTaskKey)}`,
    ]
      .filter(Boolean)
      .join("&");
    navigate(
      `/flowzero/assign-to-me/detail?todoDetail=${JSON.stringify(event.data)}${
        extraParams ? `&${extraParams}` : ""
      }`,
      { state: { returnTo: location.pathname + location.search } }
    );
  };

  const hasSelection = selectedRows.length > 0;
  const allAssignedSelection =
    hasSelection && selectedRows.every((row) => row.assignee);
  // Bulk Assign should be disabled only when all selected tasks already include assignee.
  const disableBulkAssign = !hasSelection || allAssignedSelection;

  const batchActionBar =
    viewType !== VIEW_TYPE.ASSIGNED_TO_ME ? (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-400 dark:text-gray-500">
          {hasSelection
            ? `${selectedRows.length} task${
                selectedRows.length > 1 ? "s" : ""
              } selected`
            : "Select task for batch operations"}
        </span>
        <span className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
        <button
          disabled={disableBulkAssign}
          className={cn(
            "text-sm bg-transparent border-none p-0",
            !disableBulkAssign
              ? "text-[#0473EA] dark:text-[#9ac7f6] cursor-pointer hover:opacity-70"
              : "text-[#999999] cursor-default"
          )}
          onClick={() => {
            const claimRows = selectedRows.filter((r) => r.candidateUser);
            const groupRows = selectedRows.filter((r) => r.candidateGroup);
            if (claimRows.length > 0) {
              handleClaimRef.current(claimRows);
            }
            if (groupRows.length > 0) {
              handleAssignOpenRef.current(groupRows);
            }
          }}
        >
          Bulk Assign
        </button>
      </div>
    ) : null;

  return (
    <StyleRoot
      ref={scrollContainerRef}
      className="w-full h-full px-[60px] py-[56px]"
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        overflow: "auto",
        position: "relative",
      }}
    >
      <div className="flex items-center justify-between h-[24px]">
        <EllipsisTooltip
          value={urlTaskName ? urlWorkflowName : ""}
          className={cn(
            "text-sm font-medium",
            "text-[#035CBB]",
            "max-w-[300px]"
          )}
          onlyShowOnOverflow
        />
        <Breadcrumb
          className="text-gray-700 dark:text-dark-text"
          separator={
            <span className="flowzero-iconfont icon-arrow-chevron-nav-right-forward text-light-link-primary-default dark:text-dark-link-primary-default mx-1 text-base align-middle" />
          }
          style={{ marginBottom: 0 }}
        >
          <Breadcrumb.Item className="text-light-link-primary-default dark:text-dark-link-primary-default">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item className="text-light-link-secondary-default dark:text-dark-link-secondary-default">
            To Do
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className={cn("flex items-center justify-between", "h-[56px]")}>
        <h1
          className={cn(
            "xl:text-[22px] xl:font-[700] xl:leading-[38px] mb-0",
            "2xl:text-[28px] font-[700] leading-[44px]",
            "text-light-content-title dark:text-dark-content-title",
            "max-w-[300px]"
          )}
        >
          <EllipsisTooltip
            value={
              urlTaskName
                ? urlTaskName
                : urlWorkflowName
                ? urlWorkflowName
                : "Assigned to me"
            }
            onlyShowOnOverflow
          />
        </h1>
      </div>
      <p
        className={cn(
          "xl:text-[14px] xl:leading-[22px] xl:font-medium",
          "2xl:text-[16px] 2xl:leading-[22px] 2xl:font-medium",
          "text-light-content-title dark:text-dark-content-body"
        )}
      >
        Please track and take actions on your tasks.
      </p>
      <div
        className="flex items-center justify-between"
        style={{ margin: "24px 0 32px 0" }}
      >
        <Space>
          <SearchBox
            placeholder="Input request id and search"
            onChange={setSearchLabel}
            defaultValue={searchLabel}
          />
          <Button
            className={
              `filter-btn font-[500] rounded-full gap-0 flex items-center px-4 py-2 border transition-colors duration-150 ` +
              (popoverVisible || Object.keys(advancedFilters).length >= 1
                ? "border-light-link-primary-selected text-light-link-primary-selected bg-light-zero-selected dark:border-dark-secondary-selected dark:!text-dark-link-primary-selected dark:!bg-dark-zero-selected"
                : "border-light-divide-base text-light-text-secondary-default dark:border-dark-secondary-default dark:text-dark-link-primary-default dark:bg-dark-container-layer")
            }
            style={{ minWidth: 80 }}
            onClick={() => setPopoverVisible(true)}
            ref={advancedFilterBtnRef}
          >
            <span
              className={
                `filter-btn-icon flowzero-iconfont icon-filter-funnel mr-[8px] text-xl transition-colors duration-150 ` +
                (popoverVisible || Object.keys(advancedFilters).length >= 1
                  ? "text-light-link-primary-selected dark:text-dark-link-primary-selected"
                  : "text-light-text-secondary-default dark:text-dark-link-primary-default")
              }
            />
            <span className="filter-btn-text" style={{ lineHeight: "32px" }}>
              Filter
            </span>
            {Object.keys(advancedFilters).length > 0 && (
              <>
                <span
                  className="filter-slash text-link-primary-selected  dark:text-dark-link-primary-selected"
                  style={{ lineHeight: "32px" }}
                >
                  &nbsp; / &nbsp;
                </span>

                <span
                  className="filter-number mr-[10px] text-link-primary-selected  dark:text-dark-link-primary-selected"
                  style={{ lineHeight: "32px" }}
                >
                  {Object.keys(advancedFilters).length}
                </span>

                <CloseOutlined
                  className="filter-close-btn text-link-primary-selected  dark:text-dark-link-primary-selected"
                  title="Clear filters"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAdvancedFilters({});
                    setResetFiltersFlag((f) => f + 1);
                    if (gridApi) gridApi.refreshInfiniteCache();
                  }}
                  style={{ lineHeight: "32px" }}
                />
              </>
            )}
          </Button>
          <Button
            className={cn(
              "filter-btn font-[500] rounded-full gap-0 flex items-center px-4 py-2 border transition-colors duration-150",
              colSetupOpen
                ? "border-light-link-primary-selected text-light-link-primary-selected bg-light-zero-selected dark:border-dark-secondary-selected dark:!text-dark-link-primary-selected dark:!bg-dark-zero-selected"
                : "border-light-divide-base text-light-text-secondary-default dark:border-dark-secondary-default dark:text-dark-link-primary-default dark:bg-dark-container-layer"
            )}
            onClick={() => setColSetupOpen(true)}
          >
            <span className="flowzero-iconfont icon-table-columns mr-[8px] leading-8"></span>
            <span className="leading-8">Column Setup</span>
          </Button>
          <AdvancedFilterModal<Partial<GetTodosParams>>
            visible={popoverVisible}
            onCancel={() => setPopoverVisible(false)}
            onApply={handleAdvancedFilterApply}
            resetFiltersFlag={resetFiltersFlag}
            filterConfig={filterConfig}
            popoverMaxHeight={popoverMaxHeight as number}
            scrollContainer={scrollContainerRef.current}
          />
        </Space>
        {batchActionBar}
      </div>
      <div
        className="ag-theme-alpine"
        style={{
          height: 400,
          width: "100%",
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <div
          className={`${GRID_NAME}`}
          style={{ height: 400, width: "100%", position: "relative" }}
        >
          <div
            ref={gridContainerRef}
            style={{
              display: isFirstLoad || totalElements === 0 ? "none" : "block",
            }}
          >
            <DataGrid
              className={GRID_NAME}
              columnDefs={computedColumns}
              gridOptions={gridOptions}
              domLayout="autoHeight"
              enableBrowserTooltips={true}
              onRowDoubleClicked={handleRowDoubleClick}
              onGridReady={onGridReady}
              onSortChanged={onSortChanged}
              onPaginationChanged={handlePaginationChanged}
              cacheBlockSize={pageSize}
              paginationPageSize={pageSize}
              rowModelType="infinite"
              datasource={datasource}
              rowSelection="multiple"
              onSelectionChanged={(e) => {
                setSelectedRows(e.api.getSelectedRows());
              }}
              autoSizeDisabled
              columnMenu="new"
              suppressCellFocus={true}
            />
          </div>
          {isFirstLoad && (
            <Skeleton style={coverStyle} active paragraph={{ rows: 6 }} />
          )}
          {!isFirstLoad && totalElements === 0 && (
            <div style={coverStyle}>
              {hasFilterOrSearch() ? (
                <Empty
                  image={fieldsEmpty}
                  title="No results found."
                  description="Please try to use different terms to configure options or clear current filter."
                />
              ) : (
                <Empty
                  image={fieldsEmpty}
                  title="Your todo list is empty."
                  description="Welcome to use Flow Zero, please start to create and manage the business workflows."
                />
              )}
            </div>
          )}
        </div>
      </div>
      <ColSetupDrawer
        open={colSetupOpen}
        onClose={() => setColSetupOpen(false)}
        activeColKeys={activeColKeys}
        defaultColKeys={defaultColKeys}
        allColItems={ALL_COL_SETUP}
        onApply={(keys, labels, dataTypes, options) => {
          setActiveColKeys(keys);
          if (labels) {
            setDynamicCol((prev) => {
              const next = { ...prev };
              Object.keys(labels).forEach((k) => {
                next[k] = {
                  label: labels[k],
                  dataType: dataTypes?.[k] ?? prev[k]?.dataType,
                  ...(options?.[k] && { options: options[k] }),
                };
              });
              return next;
            });
          }
          setColSetupOpen(false);
        }}
        workflowIds={urlWorkflowIds}
        workflowName={urlWorkflowName}
        taskName={urlTaskName}
        assigneeOnly={urlAssigneeOnly}
      />
      <AssignTaskModal
        open={assignVisible}
        onClose={() => setAssignVisible(false)}
        onConfirm={handleAssignConfirm}
        loading={assignLoading}
        taskCount={assignTargetRows.length}
        workflowName={assignTargetRows[0]?.workflowName}
        taskName={assignTargetRows[0]?.taskName}
      />
    </StyleRoot>
  );
};

export default Todo;
