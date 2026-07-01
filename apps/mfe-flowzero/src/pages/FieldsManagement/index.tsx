import { CloseOutlined } from "@ant-design/icons";
import { css, styled } from "@mui/material/styles";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  IGetRowsParams,
  PaginationChangedEvent,
  RowDoubleClickedEvent,
} from "ag-grid-community";
import { Breadcrumb, Button, message, Modal, Skeleton, Space } from "antd";
import cn from "classnames";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  deleteFields,
  disableFields,
  FieldEntity,
  getFieldslList,
} from "src/api";
import AdvancedFilterModal, {
  FilterCondition,
  FilterConfigItem,
} from "src/components/AdvancedFilterModal";
import AvatarTooltip from "src/components/AvatarTooltip";
import { SearchBox } from "src/components/base";
import {
  applyClientSort,
  coverStyle,
  createAgGridStyles,
  createBaseGridOptions,
  DataGrid,
  TooltipHeader,
} from "src/components/DataGrid";
import {
  makeDeleteIcon,
  makeDisableIcon,
  makeEnableIcon,
} from "src/components/DataGrid/contextMenuIcons";
import EllipsisTooltip from "src/components/EllipsisTooltip";
import Empty from "src/components/Empty";
import fieldsEmpty from "src/images/fieldsEmpty.png";
import { ContainerProvider, Time } from "src/Root/import";
import { GetFieldsParams } from "src/types/workflow";

import DataTypeCellRenderer from "./cellRenderers/DataTypeCellRenderer";
import FieldTypeCellRenderer from "./cellRenderers/FieldTypeCellRenderer";
import ReferredByCellRenderer from "./cellRenderers/ReferredByCellRenderer";
import StatusCellRenderer from "./cellRenderers/StatusCellRenderer";
import {
  BUTTON_POPOVER_GAP,
  GRID_NAME,
  POPOVER_BOTTOM_OFFSET,
  POPOVER_MIN_HEIGHT,
} from "./constants";
import { CreateFields } from "./createFields";
import { FieldDataType, FieldTypes } from "./fieldType";

const StyleRoot = styled("div")(
  () => css`
    flex: 1;
    /* Center header label for Creator column when using headerClass 'fm-creator-header' */
    .fm-creator-header .ag-header-cell-label {
      justify-content: center;
    }
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

const WorkflowManagement = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  // ag-Grid pagination starts from 0
  const [pageNum, setPageNum] = useState(0);
  const [editingField, setEditingField] = useState<any>(null);

  const [searchLabel, setSearchLabel] = useState<string>("");
  // Advanced filter parameters
  const [advancedFilters, setAdvancedFilters] = useState<
    Partial<GetFieldsParams>
  >({});

  const [modalReadonly, setModalReadonly] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const advancedFilterBtnRef = React.useRef<HTMLButtonElement>(null);
  const [resetFiltersFlag, setResetFiltersFlag] = useState(0);
  const gridContainerRef = React.useRef<HTMLDivElement>(null);
  const createOptionWithIcon = (label: string, icon?: string) => (
    <Space>
      {icon && (
        <span className={`flowzero-iconfont ${icon} text-[14px] mr-1`} />
      )}
      {label}
    </Space>
  );
  const filterConfig: FilterConfigItem[] = [
    {
      label: "Data Type",
      value: "dataType",
      icon: "icon-Icon-database",
      backgroundColor: "#0473EA",
      condition: [
        { label: "=", value: "=" },
        { label: "in", value: "in" },
      ],
      options: [
        {
          label: createOptionWithIcon("String", "icon-format-italic"),
          value: "STRING",
        },
        {
          label: createOptionWithIcon("Boolean", "icon-Icon-switch-on"),
          value: "BOOLEAN",
        },
        {
          label: createOptionWithIcon("Number", "icon-social-hashtag"),
          value: "NUMBER",
        },
        { label: createOptionWithIcon("Date", "icon-calendar"), value: "DATE" },
        {
          label: createOptionWithIcon("DateTime", "icon-clock-pending"),
          value: "DATETIME",
        },
        {
          label: createOptionWithIcon("Array", "icon-check-tick-circle"),
          value: "ARRAY",
        },
      ],
    },
    {
      label: "Status",
      value: "status",
      icon: "icon-check-tick-circle",
      backgroundColor: "#52c41a",
      condition: [{ label: "=", value: "=" }],
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Disabled", value: "DISABLED" },
      ],
    },
    {
      label: "Creator",
      value: "createdBy",
      icon: "icon-user-person-profile",
      backgroundColor: "#faad14",
      condition: [
        { label: "=", value: "=" },
        { label: "in", value: "in" },
      ],
      inputType: "tags",
    },
    {
      label: "Field Type",
      value: "uiType",
      icon: "icon-field-document-page",
      backgroundColor: "#722ed1",
      options: [
        {
          label: createOptionWithIcon("Input", "icon-format-italic"),
          value: "INPUT",
        },
        {
          label: createOptionWithIcon("Text Area", "icon-text"),
          value: "TEXT_AREA",
        },
        {
          label: createOptionWithIcon("Radio", "icon-field-radio"),
          value: "RADIO",
        },
        {
          label: createOptionWithIcon("Checkbox", "icon-field-check-tick-box"),
          value: "CHECKBOX",
        },
        {
          label: createOptionWithIcon("MultiSelect", "icon-field-dropdown"),
          value: "MULTIPLE_CHOICE_DROPDOWN",
        },
        {
          label: createOptionWithIcon("SingleSelect", "icon-field-dropdown"),
          value: "SINGLE_CHOICE_DROPDOWN",
        },
        {
          label: createOptionWithIcon("Switch", "icon-Icon-switch-on"),
          value: "SWITCH",
        },
        {
          label: createOptionWithIcon("Input Number", "icon-social-hashtag"),
          value: "INPUT_NUMBER",
        },
        {
          label: createOptionWithIcon("Date Picker", "icon-calendar"),
          value: "DATE_PICKER",
        },
        {
          label: createOptionWithIcon("Time Picker", "icon-timer-clock"),
          value: "TIME_PICKER",
        },
      ],
      condition: [
        { label: "=", value: "=" },
        { label: "in", value: "in" },
      ],
    },
    {
      label: "Report",
      value: "usedInReporting",
      icon: "icon-Icon-document-page-file",
      backgroundColor: "#F5A623",
      condition: [{ label: "=", value: "=" }],
      options: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" },
      ],
    },
    {
      label: "Inbox Search",
      value: "usedInInboxSearching",
      icon: "icon-Icon-mail-envelope-open",
      backgroundColor: "#595959",
      condition: [{ label: "=", value: "=" }],
      options: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" },
      ],
    },
  ];
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

  const hasFilterOrSearch = () => {
    return !!searchLabel || Object.keys(advancedFilters).length !== 0;
  };

  const handleSearchChange = (value: string) => {
    setSearchLabel(value);
  };

  const handleEditField = (field: FieldEntity) => {
    setEditingField(field);
    setModalVisible(true);
  };

  const handleDisableField = (field: FieldEntity) => {
    Modal.confirm({
      title: "Disable Field",
      content: `Are you sure you want to disable the field "${field.label}"?`,
      okText: "Disable",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await disableFields({ id: field.id, status: "DISABLED" });
          message.success("Disable Successfully");
          // Refresh the grid
          if (gridApi) {
            pageDataCache.current.clear();
            gridApi.refreshInfiniteCache();
          }
        } catch (error) {
          message.error("Failed to disable field.");
        }
      },
    });
  };

  const handleEnableField = (field: FieldEntity) => {
    Modal.confirm({
      title: "Enable Field",
      content: `Are you sure you want to enable the field "${field.label}"?`,
      okText: "Enable",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await disableFields({ id: field.id, status: "ACTIVE" });
          message.success("Enable Successfully");
          // Refresh the grid
          if (gridApi) {
            pageDataCache.current.clear();
            gridApi.refreshInfiniteCache();
          }
        } catch (error) {
          message.error("Failed to enable field");
        }
      },
    });
  };

  const handleDeleteField = (field: FieldEntity) => {
    Modal.confirm({
      title: "Delete Field",
      content: `Are you sure you want to delete the field "${field.label}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteFields({ id: field.id });
          message.success("Delete Successfully");
          // Refresh the grid
          if (gridApi) {
            pageDataCache.current.clear();
            gridApi.refreshInfiniteCache();
          }
        } catch (error) {
          message.error("Failed to delete field");
        }
      },
    });
  };

  const agGridColumns: ColDef[] = [
    {
      headerName: "Field Label",
      field: "label",
      tooltipField: "name",
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams) => (
        <EllipsisTooltip value={params.value} />
      ),
    },
    {
      headerName: "Data Type",
      field: "dataType",
      width: 150,
      cellRenderer: (params: ICellRendererParams<unknown, FieldDataType>) => (
        <DataTypeCellRenderer {...params} />
      ),
    },
    {
      headerName: "Field Type",
      field: "uiType",
      minWidth: 230,
      cellRenderer: (params: ICellRendererParams<unknown, FieldTypes>) => (
        <FieldTypeCellRenderer {...params} />
      ),
    },
    {
      headerName: "Creator",
      field: "createdBy",
      tooltipField: "Creator",
      minWidth: 110,
      flex: 1,
      headerClass: "fm-creator-header",
      cellClass: "flex justify-center items-center",
      cellRenderer: (params: ICellRendererParams) => {
        const userId = params.value;
        if (!userId) return null;
        const imgUrl = `https://axess.sc.net/scb-axess-cms/api/users/${userId}/photo`;
        return <AvatarTooltip value={userId} img={imgUrl} darkImg={imgUrl} />;
      },
    },
    {
      headerName: "Status",
      field: "status",
      width: 150,
      cellRenderer: (params: ICellRendererParams) => {
        return <StatusCellRenderer {...params} />;
      },
    },
    {
      headerName: "Inbox Search",
      field: "usedInInboxSearching",
      headerClass: "fm-creator-header",
      cellClass: "flex justify-center items-center",
    },
    {
      headerName: "Report",
      field: "usedInReporting",
      headerClass: "fm-creator-header",
      cellClass: "flex justify-center items-center",
    },
    {
      headerName: "Create Time",
      field: "createdAt",
      cellRenderer: Time,
      minWidth: 230,
      flex: 1,
    },
    {
      headerName: "Referred By",
      field: "referredBy",
      cellRenderer: (params: ICellRendererParams) => (
        <ReferredByCellRenderer {...params} />
      ),
      minWidth: 160,
      flex: 1,
    },
  ];
  const pageDataCache = useRef<Map<number, any[]>>(new Map());
  const totalRef = useRef(0);
  const currentPageRef = useRef<number>(0);
  const pendingPageRef = useRef<number | null>(null);
  const jumpTargetRef = useRef<number | null>(null);
  const [ContainerStore] = ContainerProvider.useContext();
  const isLocalRef = useRef(true);
  isLocalRef.current = ContainerStore.timeType?.toUpperCase() !== "UTC";

  // Always holds the latest handler references so getContextMenuItems never captures stale closures
  const fieldHandlersRef = useRef<{
    handleEditField: (f: FieldEntity) => void;
    handleDisableField: (f: FieldEntity) => void;
    handleEnableField: (f: FieldEntity) => void;
    handleDeleteField: (f: FieldEntity) => void;
  }>(null!);
  fieldHandlersRef.current = {
    handleEditField,
    handleDisableField,
    handleEnableField,
    handleDeleteField,
  };

  const gridOptions = useMemo(
    () => ({
      ...createBaseGridOptions(pageSize),
      suppressContextMenu: false,
      getContextMenuItems: (params: any) => {
        const data: FieldEntity = params.node?.data;
        if (!data) return [];
        const { handleDisableField, handleEnableField, handleDeleteField } =
          fieldHandlersRef.current;
        const isActive = data.status === "ACTIVE";
        const isDisabled = data.status === "DISABLED";
        const isReferred =
          data.formNames != null && (data.formNames as string[]).length > 0;
        const result: any[] = [];
        if (isActive) {
          if (!isReferred) {
            result.push({
              name: "Disable",
              icon: makeDisableIcon(),
              action: () => handleDisableField(data),
            });
            result.push({
              name: "Delete",
              icon: makeDeleteIcon(),
              action: () => handleDeleteField(data),
            });
            result.push("separator");
          }
        } else if (isDisabled) {
          result.push({
            name: "Enable",
            icon: makeEnableIcon(),
            action: () => handleEnableField(data),
          });
          result.push({
            name: "Delete",
            icon: makeDeleteIcon(),
            action: () => handleDeleteField(data),
          });
          result.push("separator");
        }
        result.push("copy");
        result.push("copyWithHeaders");
        result.push("export");
        return result;
      },
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

  const gridApiRef = useRef<GridApi | null>(null);

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

        getFieldslList({
          page: page,
          size: pageSize,
          label: searchLabel || undefined,
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

  // Force refresh data when pageSize changes
  useEffect(() => {
    if (gridApi) {
      gridApi.purgeInfiniteCache && gridApi.purgeInfiniteCache();
    }
  }, [pageSize, gridApi]);

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
      }
      setPageNum(newPageNum);
    }
  };

  const handleCreateClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingField(null);
    setModalReadonly(false);
  };

  const handleModalNext = (values: any) => {
    setModalVisible(false);
    setEditingField(null);
    setModalReadonly(false);

    // Refresh the grid data
    if (gridApi) {
      pageDataCache.current.clear();
      gridApi.purgeInfiniteCache && gridApi.purgeInfiniteCache();
    }
  };

  const handleRowDoubleClick = (event: RowDoubleClickedEvent) => {
    setEditingField(event.data);
    setModalVisible(true);
    setModalReadonly(event.data?.status !== "ACTIVE");
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
      pageDataCache.current.clear();
      gridApi.refreshInfiniteCache();
    }

    setPopoverVisible(false);
  };

  return (
    <StyleRoot className="w-full h-full flex flex-col">
      {/* main content */}
      <div
        ref={scrollContainerRef}
        className="flex-1 px-[60px] py-[56px]"
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
              Field Configuration
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
            Field Configuration
          </h1>
        </div>
        <p
          className={cn(
            "xl:text-[14px] xl:leading-[22px] xl:font-medium",
            "2xl:text-[16px] 2xl:leading-[22px] 2xl:font-medium",
            "text-light-content-title dark:text-dark-content-body"
          )}
        >
          Please start to create and manage the fields.
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
            placeholder="Input field name and search"
            onChange={handleSearchChange}
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
                  className="filter-slash text-light-link-primary-selected dark:text-dark-link-primary-selected"
                  style={{ lineHeight: "32px" }}
                >
                  &nbsp; / &nbsp;
                </span>

                <span
                  className="filter-number mr-[10px] text-light-link-primary-selected dark:text-dark-link-primary-selected"
                  style={{ lineHeight: "32px" }}
                >
                  {Object.keys(advancedFilters).length}
                </span>

                <CloseOutlined
                  className="filter-close-btn text-light-link-primary-selected  dark:text-dark-link-primary-selected"
                  title="Clear filters"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAdvancedFilters({});
                    setResetFiltersFlag((f) => f + 1);
                    if (gridApi) {
                      pageDataCache.current.clear();
                      gridApi.refreshInfiniteCache();
                    }
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
            className={cn(GRID_NAME, "ag-grid-ratan")}
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
                columnDefs={agGridColumns}
                gridOptions={gridOptions}
                domLayout="autoHeight"
                enableBrowserTooltips={true}
                onRowDoubleClicked={handleRowDoubleClick}
                onGridReady={onGridReady}
                onPaginationChanged={handlePaginationChanged}
                onSortChanged={onSortChanged}
                cacheBlockSize={pageSize}
                paginationPageSize={pageSize}
                rowModelType="infinite"
                datasource={datasource}
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
                    title="Your field list is empty."
                    description="Welcome to use Flow Zero, please start to create and manage the fields."
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <CreateFields
          visible={modalVisible}
          onCancel={handleModalCancel}
          onSave={handleModalNext}
          editingField={editingField}
          mode={editingField ? (modalReadonly ? "view" : "edit") : "create"}
        />
      </div>
    </StyleRoot>
  );
};

export default React.memo(WorkflowManagement);
