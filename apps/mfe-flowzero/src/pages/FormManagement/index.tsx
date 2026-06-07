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
import {
  Avatar,
  Breadcrumb,
  Button,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import cn from "classnames";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  copyForm,
  deleteForm,
  FormResource,
  FormStatusEnum,
  getFormPage,
} from "src/api";
import AvatarTooltip from "src/components/AvatarTooltip";
import { SearchBox } from "src/components/base";
import {
  applyClientSort,
  coverStyle,
  createAgGridStyles,
  createBaseGridOptions,
  DataGrid,
  StatusBadge,
  type StatusBadgeConfig,
  TooltipHeader,
} from "src/components/DataGrid";
import {
  makeCopyIcon,
  makeDeleteIcon,
} from "src/components/DataGrid/contextMenuIcons";
import Empty from "src/components/Empty";
import { useTableStatePersistence } from "src/hooks/useTablePagePersistence";
import fieldsEmpty from "src/images/fieldsEmpty.png";
import { ContainerProvider, ReactRouterDom, Time } from "src/Root/import";

const GRID_NAME = "form-management-data-grid";

const STATUS_BADGE_CONFIG: Record<string, StatusBadgeConfig> = {
  PUBLISHED: {
    label: "PUBLISHED",
    bgClass: "bg-[#CCE5FF]",
    textClass: "text-[#035CBB]",
    darkBgclass: "dark:bg-[#00172e]",
    darkTextClass: "dark:text-[#368FEE]",
  },
  DRAFT: {
    label: "DRAFT",
    bgClass: "bg-[#D7F7CD]",
    textClass: "text-[#2CA800]",
    darkBgclass: "dark:bg-[#082a00]",
    darkTextClass: "dark:text-[#5FDF37]",
  },
};

const StyleRoot = styled("div")(
  () => css`
    flex: 1;
    ${createAgGridStyles(GRID_NAME)}

    .fm-creator-header .ag-header-cell-label {
      justify-content: center;
    }
  `
);

import EllipsisTooltip from "src/components/EllipsisTooltip";

import { CreateFormModal } from "./CreateFormModal";
import { StatusFilterModal } from "./StatusFilterModal";
const { useNavigate, useSearchParams, useLocation } = ReactRouterDom;
const { Title, Text } = Typography;
const FormManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { readTableState, saveTableState, clearTableState, isFromDetail } =
    useTableStatePersistence("form-management-state");
  const initialPageJumpedRef = React.useRef(false);
  const [searchParams] = useSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilterVisible, setStatusFilterVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<FormStatusEnum[]>(() =>
    isFromDetail
      ? readTableState()?.statusForSearch
        ? [readTableState()!.statusForSearch as FormStatusEnum]
        : []
      : []
  );
  const [statusForSearch, setStatusForSearch] = useState<
    FormStatusEnum | undefined
  >(() =>
    isFromDetail
      ? (readTableState()?.statusForSearch as FormStatusEnum | undefined)
      : undefined
  );
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [pageSize, setPageSize] = useState(() => {
    if (isFromDetail) {
      const s = readTableState()?.pageSize as number | undefined;
      if (s && s > 0) return s;
    }
    return 10;
  });
  const [totalElements, setTotalElements] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  // Store button position information
  const [statusBtnRect, setStatusBtnRect] = useState<DOMRect | null>(null);

  // Button refs
  const statusBtnRef = React.useRef<HTMLButtonElement>(null);
  // ag-Grid pagination starts from 0
  const [pageNum, setPageNum] = useState(0);
  const [editingField, setEditingField] = useState<FormResource | null>(null);
  const [searchLabel, setSearchLabel] = useState<string>(() =>
    isFromDetail ? (readTableState()?.searchLabel as string) ?? "" : ""
  );
  const gridContainerRef = React.useRef<HTMLDivElement>(null);
  const hasFilterOrSearch = React.useCallback(() => {
    return !!searchLabel || !!statusForSearch;
  }, [searchLabel, statusForSearch]);

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchLabel(value);
  }, []);

  const handleViewForm = React.useCallback(
    (form: FormResource) => {
      const workflowDetail = encodeURIComponent(JSON.stringify(form));
      navigate(
        `/flowzero/form-management/form-designer/?workflowDetail=${workflowDetail}&from=view`
      );
    },
    [navigate]
  );

  const handleEditForm = React.useCallback((form: FormResource) => {
    setEditingField(form);
    setModalVisible(true);
  }, []);

  const handleDeleteForm = React.useCallback(
    (form: FormResource) => {
      Modal.confirm({
        title: "Delete Form",
        content: `Are you sure you want to delete the form "${form.name}"? This action cannot be undone.`,
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            await deleteForm(form.id);
            message.success("Delete Successfully");
            if (gridApi) {
              pageDataCache.current.clear();
              gridApi.refreshInfiniteCache();
            }
          } catch (error) {
            message.error("Failed to delete field");
          }
        },
      });
    },
    [gridApi]
  );

  const handleCopyForm = React.useCallback(
    async (form: FormResource) => {
      try {
        await copyForm(form.id);
        message.success("Duplicate Successfully");
        if (gridApi) {
          pageDataCache.current.clear();
          gridApi.refreshInfiniteCache();
        }
      } catch (error) {
        message.error("Duplicate Failed");
      }
    },
    [gridApi]
  );

  const agGridColumns: ColDef[] = React.useMemo(
    () => [
      {
        headerName: "Form Name",
        field: "name",
        tooltipField: "Form Name",
        flex: 1,
        minWidth: 200,
        cellRenderer: (params: ICellRendererParams) => (
          <EllipsisTooltip value={params.value} />
        ),
      },
      {
        headerName: "Creator",
        field: "createdBy",
        tooltipField: "Creator",
        minWidth: 110,
        maxWidth: 200,
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
        minWidth: 150,
        maxWidth: 200,
        flex: 1,
        cellRenderer: (params: ICellRendererParams) => {
          const config = STATUS_BADGE_CONFIG[params.value as string];
          if (!config) return null;
          return <StatusBadge config={config} />;
        },
      },
      {
        headerName: "Update Time",
        field: "updatedAt",
        cellRenderer: Time,
        minWidth: 230,
        flex: 1,
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
    ],
    []
  );

  const pageDataCache = useRef<Map<number, any[]>>(new Map());
  const totalRef = useRef(0);
  const currentPageRef = useRef<number>(0);
  const gridApiRef = useRef<GridApi | null>(null);
  const pendingPageRef = useRef<number | null>(null);
  const jumpTargetRef = useRef<number | null>(null);
  const [ContainerStore] = ContainerProvider.useContext();
  const isLocalRef = useRef(true);
  isLocalRef.current = ContainerStore.timeType?.toUpperCase() !== "UTC";

  // Always holds the latest handler references so getContextMenuItems never captures stale closures
  const formHandlersRef = useRef<{
    handleViewForm: (f: FormResource) => void;
    handleCopyForm: (f: FormResource) => Promise<void>;
    handleDeleteForm: (f: FormResource) => void;
  }>(null!);
  formHandlersRef.current = {
    handleViewForm,
    handleCopyForm,
    handleDeleteForm,
  };

  const gridOptions = useMemo(
    () => ({
      ...createBaseGridOptions(pageSize),
      suppressContextMenu: false,
      getContextMenuItems: (params: any) => {
        const data: FormResource = params.node?.data;
        if (!data) return [];
        const { handleCopyForm, handleDeleteForm } = formHandlersRef.current;
        const result: any[] = [];
        if (data.status === "PUBLISHED") {
          result.push({
            name: "Duplicate",
            icon: makeCopyIcon(),
            action: () => handleCopyForm(data),
          });
        } else if (data.status === "DRAFT") {
          result.push({
            name: "Delete",
            icon: makeDeleteIcon(),
            action: () => handleDeleteForm(data),
          });
        }
        result.push("separator");
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

  const requestInProgressRef = React.useRef(false);

  const datasource = useMemo(() => {
    pageDataCache.current.clear();

    return {
      getRows: async (rowParams: IGetRowsParams) => {
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
        try {
          const res = await getFormPage({
            page,
            size: pageSize,
            name: searchLabel || undefined,
            status: statusForSearch,
          });
          const rows = res.data || [];
          const total = res.totalElements ?? 0;
          pageDataCache.current.set(startRow, rows);
          totalRef.current = total;
          setTotalElements(total);
          setLoading(false);
          setIsFirstLoad((prev) => (prev ? false : prev));
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
          deliver(rows);
        } catch {
          setTotalElements(0);
          setLoading(false);
          setIsFirstLoad((prev) => (prev ? false : prev));
          rowParams.successCallback([], 0);
        } finally {
          requestInProgressRef.current = false;
        }
      },
    };
  }, [pageSize, searchLabel, statusForSearch]);

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
        saveTableState({ pageSize: newPageSize });
      }
      setPageNum(newPageNum);
      if (initialPageJumpedRef.current) {
        saveTableState({ page: newPageNum });
      }
    }
  };

  const handleStatusClick = () => {
    if (statusBtnRef.current) {
      setStatusBtnRect(statusBtnRef.current.getBoundingClientRect());
    }
    setStatusFilterVisible(true);
  };

  const handleStatusFilterCancel = () => {
    setStatusFilterVisible(false);
    setStatusForSearch(
      selectedStatus.length === 1 ? selectedStatus[0] : undefined
    );
    if (gridApi) {
      gridApi.refreshInfiniteCache();
    }
  };

  const handleCreateClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingField(null);
  };

  const handleModalNext = (values: any) => {
    setModalVisible(false);
    setEditingField(null);

    // Refresh the grid data
    if (gridApi) {
      setTotalElements(0);
      pageDataCache.current.clear();
      gridApi.purgeInfiniteCache && gridApi.purgeInfiniteCache();
    }
  };

  const handleRowDoubleClick = (event: RowDoubleClickedEvent) => {
    if (!event || !event.data) {
      message.error("No form data found for this row.");
      return;
    }
    saveTableState({ searchLabel, statusForSearch });
    let workflowDetail = encodeURIComponent(JSON.stringify(event.data));
    navigate(
      `/flowzero/form-management/form-designer/?workflowDetail=${workflowDetail}&from=detail`,
      { state: { returnTo: location.pathname + location.search } }
    );
  };

  return (
    <StyleRoot className="w-full h-full flex flex-col">
      {/* main content */}
      <div
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
              Form Management
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
            Form Management
          </h1>
        </div>
        <p
          className={cn(
            "xl:text-[14px] xl:leading-[22px] xl:font-medium",
            "2xl:text-[16px] 2xl:leading-[22px] 2xl:font-medium",
            "text-light-content-title dark:text-dark-content-body"
          )}
        >
          Please start to create and manage the forms.
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
            placeholder="Input form name and search"
            onChange={handleSearchChange}
            defaultValue={searchLabel}
          />
          <Button
            className={cn(
              "rounded-full gap-0",
              "dark:bg-[#262626] dark:border-[#737373] dark:text-[#9AC7F6]",
              "focus:!bg-[#E5F1FC] focus:border-[#035CBB] focus:text-[#035CBB] dark:focus:!bg-[#00172E] dark:focus:border-[#0250A3] dark:focus:text-[#E5F1FC]",
              "hover:!bg-[#E5F1FC] hover:!border-[#035CBB] hover:!text-[#035CBB] dark:hover:!bg-[#00172E] dark:hover:!border-[#0250A3] dark:hover:!text-[#E5F1FC]",
              (statusFilterVisible || selectedStatus.length) && [
                "bg-[#E5F1FC]",
                "border-[#035CBB]",
                "text-[#035CBB]",
                "dark:!bg-[#00172E]",
                "dark:!border-[#0250A3]",
                "dark:!text-[#E5F1FC]",
              ]
            )}
            onClick={handleStatusClick}
            ref={statusBtnRef}
          >
            <span className="flowzero-iconfont icon-check-tick-circle mr-[8px]" />
            <span>Status</span>
            {selectedStatus.length > 0 && (
              <span>&nbsp; / &nbsp;{selectedStatus.length}</span>
            )}
          </Button>

          <StatusFilterModal
            visible={statusFilterVisible}
            onCancel={handleStatusFilterCancel}
            selected={selectedStatus}
            onChange={setSelectedStatus}
            anchorRect={statusBtnRect}
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
            className={cn(GRID_NAME)}
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
                onSortChanged={onSortChanged}
                onPaginationChanged={handlePaginationChanged}
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
                    title="Your Formlist is empty."
                    description="Welcome to use Flow Zero, please start to create and manage the fields."
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <CreateFormModal
          visible={modalVisible}
          onCancel={handleModalCancel}
          onNext={handleModalNext}
          editingForm={editingField}
        />
      </div>
    </StyleRoot>
  );
};

export default React.memo(FormManagement);
