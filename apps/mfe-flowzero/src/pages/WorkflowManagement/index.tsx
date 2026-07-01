import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";
import { css, styled } from "@mui/material/styles";
import type {
  CellClassParams,
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  IGetRowsParams,
  PaginationChangedEvent,
  RowDoubleClickedEvent,
} from "ag-grid-community";
import { Breadcrumb, Button, message, Skeleton, Space } from "antd";
import cn from "classnames";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getModelList } from "src/api";
import { findDictionaryByNames, getAllCountries } from "src/api/index";
import AdvancedFilterModal, {
  FilterCondition,
  FilterConfigItem,
} from "src/components/AdvancedFilterModal";
import { SearchBox } from "src/components/base";
import {
  applyClientSort,
  coverStyle,
  createAgGridStyles,
  createBaseGridOptions,
  DataGrid,
  TooltipHeader,
} from "src/components/DataGrid";
import EllipsisTooltip from "src/components/EllipsisTooltip";
import Empty from "src/components/Empty";
import { useTableStatePersistence } from "src/hooks/useTablePagePersistence";
import fieldsEmpty from "src/images/fieldsEmpty.png";
import { ContainerProvider, ReactRouterDom, Time } from "src/Root/import";
import type { GetFieldsParams } from "src/types/workflow";

import CountryCellRenderer from "./cellRenderers/CountryCellRenderer";
import OwnerCellRenderer from "./cellRenderers/OwnerCellRenderer";
import VersionCellRenderer from "./cellRenderers/VersionCellRenderer";
import {
  BASE_FILTER_CONFIG,
  BUTTON_POPOVER_GAP,
  FLAG_MAP,
  GRID_NAME,
  POPOVER_BOTTOM_OFFSET,
  POPOVER_MIN_HEIGHT,
} from "./constants/index";
import { CreateWorkflowModal } from "./CreateWorkflowModal";

const StyleRoot = styled("div")(
  () => css`
    flex: 1;
    .filter-btn {
      &:hover {
        color: #0367d2 !important;
        .filter-btn-icon,
        .filter-btn-text,
        .filter-close-btn,
        .filter-slash,
        .filter-number {
          color: #0367d2 !important;
        }
        border-color: #4f9df0 !important;
        background-color: #e5f1fc !important;
        .dark & {
          color: #4f9df0 !important;
          .filter-btn-icon,
          .filter-btn-text,
          .filter-close-btn,
          .filter-slash,
          .filter-number {
            color: #4f9df0 !important;
          }
          background-color: #262626 !important;
        }
      }
      &:active {
        background-color: #d4e7f9 !important;
        .dark & {
          background-color: #011a35 !important;
        }
      }
    }
    ${createAgGridStyles(GRID_NAME)}
  `
);
const { useNavigate, useLocation } = ReactRouterDom;
const agGridColumns: ColDef[] = [
  {
    headerName: "Workflow Name",
    field: "name",
    flex: 1,
    minWidth: 200,
    cellRenderer: (params: ICellRendererParams) => (
      <EllipsisTooltip value={params.value} />
    ),
  },
  {
    headerName: "Business Area",
    field: "businessArea",
    flex: 1,
    minWidth: 200,
    cellRenderer: (params: ICellRendererParams) => (
      <EllipsisTooltip value={params.value} />
    ),
  },
  {
    headerName: "Country",
    field: "countryCodes",
    width: 140,
    cellRenderer: (params: CellClassParams) => {
      return <CountryCellRenderer {...params} />;
    },
  },
  {
    headerName: "Owner",
    field: "ownerIds",
    width: 140,
    cellRenderer: (params: CellClassParams) => {
      return <OwnerCellRenderer {...params} />;
    },
  },
  {
    headerName: "Version",
    field: "displayVersion",
    width: 110,
    cellRenderer: (params: CellClassParams) => {
      return <VersionCellRenderer {...params} />;
    },
  },

  {
    headerName: "Update Time",
    field: "updatedAt",
    cellRenderer: Time,
    width: 220,
  },
  {
    headerName: "Description",
    field: "description",
    flex: 1,
    minWidth: 300,
    cellRenderer: (params: ICellRendererParams) => (
      <EllipsisTooltip value={params.value} />
    ),
  },
];
const WorkflowManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { readTableState, saveTableState, clearTableState, isFromDetail } =
    useTableStatePersistence("workflow-management-state");
  const initialPageJumpedRef = React.useRef(false);
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
    Partial<GetFieldsParams>
  >(() =>
    isFromDetail
      ? (readTableState()?.advancedFilters as Partial<GetFieldsParams>) ?? {}
      : {}
  );
  const [popoverVisible, setPopoverVisible] = useState(false);
  const advancedFilterBtnRef = React.useRef<HTMLButtonElement>(null);
  const [resetFiltersFlag, setResetFiltersFlag] = useState(0);
  const [countries, setCountries] = React.useState<
    { label: string | JSX.Element; value: string }[]
  >([]);
  const [businessAreas, setBusinessAreas] = React.useState<
    { label: string | JSX.Element; value: string }[]
  >([]);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const filterConfig: FilterConfigItem[] = useMemo(
    () => [
      BASE_FILTER_CONFIG[0],
      { ...BASE_FILTER_CONFIG[1], options: countries },
      { ...BASE_FILTER_CONFIG[2], options: businessAreas },
    ],
    [countries, businessAreas]
  );

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

  const pageDataCache = useRef<Map<number, any[]>>(new Map());
  const totalRef = useRef(0);
  const currentPageRef = useRef<number>(0);
  const gridApiRef = useRef<GridApi | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const pendingPageRef = useRef<number | null>(null);
  const jumpTargetRef = useRef<number | null>(null);
  const [ContainerStore] = ContainerProvider.useContext();
  const isLocalRef = useRef(true);
  isLocalRef.current = ContainerStore.timeType?.toUpperCase() !== "UTC";

  const gridOptions = useMemo(
    () => ({
      ...createBaseGridOptions(pageSize),
      suppressContextMenu: false,
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
    filters: FilterCondition[],
    apiParams: Partial<GetFieldsParams>
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

        const deliver = (rawRows: any[]) => {
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
        getModelList({
          page,
          size: pageSize,
          name: searchLabel || undefined,
          ...advancedFilters,
        })
          .then((res) => {
            const rows = res.data || [];
            const total = res.totalElements ?? 0;
            pageDataCache.current.set(startRow, rows);
            totalRef.current = total;
            setTotalElements(total);
            setLoading(false);
            if (isFirstLoad) setIsFirstLoad(false);
            requestInProgressRef.current = false;
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
  }, [pageSize, searchLabel, advancedFilters]);

  // Force refresh data when pageSize changes - handled by ag-Grid internally
  // Remove useEffect to prevent double loading
  useEffect(() => {
    getAllCountries()
      .then((res) => {
        const countryOptions = res.map((country) => {
          const countryName = country.shortName;
          const flagSrc = FLAG_MAP[countryName] || null;
          return {
            value: countryName,
            label: (
              <div className="flex items-center gap-2">
                {flagSrc ? (
                  <img
                    src={flagSrc}
                    alt={countryName}
                    className="w-5 h-5 rounded object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-medium">
                    {countryName}
                  </div>
                )}
                <span>{countryName}</span>
              </div>
            ),
          };
        });
        setCountries(countryOptions);
      })
      .catch((err) => {
        message.error("Failed to load countries.");
      });

    findDictionaryByNames(["businessArea"])
      .then((res: any) => {
        let dictionaryData = JSON.parse(res[0]?.dictionary);
        const areaList = (dictionaryData || []).map((item: any) => ({
          value: item.value,
          label: item.label || item.name,
        }));
        setBusinessAreas(areaList);
      })
      .catch((err: any) => {
        message.error("Failed to load business areas.");
      });
  }, []);

  // ag-Grid built-in pagination jump
  const handlePaginationChanged = (params: PaginationChangedEvent) => {
    const api = params.api;
    if (api) {
      const newPageNum = api.paginationGetCurrentPage();
      currentPageRef.current = newPageNum;
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

  const handleCreateClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalNext = (values: Record<string, any>) => {
    setModalVisible(false);

    // Refresh the grid data by purging cache and letting ag-Grid refetch
    if (gridApi) {
      setTotalElements(0);
      gridApi.purgeInfiniteCache && gridApi.purgeInfiniteCache();
      // Reset to first page
      gridApi.paginationGoToFirstPage && gridApi.paginationGoToFirstPage();
    }
  };

  const handleRowDoubleClick = (event: RowDoubleClickedEvent) => {
    saveTableState({ searchLabel, advancedFilters });
    const newData = Object.assign({}, event.data);
    delete newData.content;
    let workflowDetail = encodeURIComponent(JSON.stringify(newData));
    navigate(
      `/flowzero/workflow-management/NewWorkflow/?workflowDetail=${workflowDetail}&from=detail`,
      { state: { returnTo: location.pathname + location.search } }
    );
  };

  return (
    <StyleRoot
      ref={scrollContainerRef}
      className="w-full h-full px-[60px] py-[56px]"
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        overflow: "auto",
      }}
    >
      <div className="flex items-center justify-between h-[24px]">
        <div></div>
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
            Workflow Management
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className={cn("flex items-center justify-between", "h-[56px]")}>
        <h1
          className={cn(
            "xl:text-[22px] xl:font-[700] xl:leading-[38px] mb-0",
            "2xl:text-[28px] font-[700] leading-[44px]",
            "text-light-content-title dark:text-dark-content-title"
          )}
        >
          Workflow Management
        </h1>
      </div>
      <p
        className={cn(
          "xl:text-[14px] xl:leading-[22px] xl:font-medium",
          "2xl:text-[16px] 2xl:leading-[22px] 2xl:font-medium",
          "text-light-content-title dark:text-dark-content-body"
        )}
      >
        Please start to create and manage the business workflows.
      </p>
      <Space style={{ margin: "24px 0 32px 0" }}>
        <Button
          type="primary"
          className="rounded-full gap-0"
          onClick={handleCreateClick}
        >
          <span className="flowzero-iconfont icon-plus-add mr-[8px]" />
          <span>Create</span>
        </Button>
        <SearchBox
          placeholder="Input workflow name and search"
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

        <AdvancedFilterModal<Partial<GetFieldsParams>>
          visible={popoverVisible}
          onCancel={() => setPopoverVisible(false)}
          onApply={handleAdvancedFilterApply}
          resetFiltersFlag={resetFiltersFlag}
          filterConfig={filterConfig}
          popoverMaxHeight={popoverMaxHeight as number}
          scrollContainer={scrollContainerRef.current}
        />
      </Space>
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
              visibility:
                isFirstLoad || totalElements === 0 ? "hidden" : "visible",
            }}
          >
            <DataGrid
              className={GRID_NAME}
              columnDefs={agGridColumns}
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
              autoSizeDisabled
              columnMenu="new"
              suppressCellFocus={true}
            />
          </div>
          {isFirstLoad && (
            <Skeleton style={coverStyle} paragraph={{ rows: 6 }} />
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
                  title="Your workflow list is empty."
                  description="Welcome to use Flow Zero, please start to create and manage the business workflows."
                />
              )}
            </div>
          )}
        </div>
      </div>
      <CreateWorkflowModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onNext={handleModalNext}
      />
    </StyleRoot>
  );
};

export default WorkflowManagement;
