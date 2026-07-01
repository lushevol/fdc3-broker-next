import { css, styled } from "@mui/material/styles";
import type {
  ColDef,
  ICellRendererParams,
  IGetRowsParams,
  PaginationChangedEvent,
} from "ag-grid-community";
import { Breadcrumb, Button, Skeleton, Space } from "antd";
import cn from "classnames";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { getTaskCenter } from "src/api/index";
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
import fieldsEmpty from "src/images/fieldsEmpty.png";
import { ContainerProvider, Time } from "src/Root/import";
import { getUser } from "src/util/authenticator";

import StatusCellRenderer from "./cellRenderers/StatusCellRenderer";
import { StatusFilterModal } from "./StatusFilterModal";

const GRID_NAME = `task-center-data-grid`;
const StyleRoot = styled("div")(
  () => css`
    flex: 1;
    .filter-btn {
      .filter-btn-icon:hover,
      .filter-btn-text:hover {
        color: #0367d2 !important;
      }
      &:hover {
        color: #0367d2 !important;
        .filter-btn-icon,
        .filter-btn-text {
          color: #0367d2 !important;
        }
        border-color: #4f9df0 !important;
        background-color: #e5f1fc !important;
        .dark & {
          background-color: #012246 !important;
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

const agGridColumns: ColDef[] = [
  {
    headerName: "Workflow Name",
    field: "workflowName",
    flex: 1,
    cellRenderer: (params: ICellRendererParams) => (
      <EllipsisTooltip value={params.value} />
    ),
  },
  { headerName: "Request ID", field: "requestId", flex: 1 },
  // {
  //   headerName: "Requester",
  //   field: "submitter",
  //   width: 120,
  //   cellRenderer: (params: ICellRendererParams) => {
  //     const userId = params.value;
  //     if (!userId) return null;
  //     const imgUrl = `https://axess.sc.net/scb-axess-cms/api/users/${userId}/photo`;
  //     return <AvatarTooltip value={userId} img={imgUrl} darkImg={imgUrl} />;
  //   },
  // },
  {
    headerName: "Status",
    field: "status",
    flex: 1,
    cellRenderer: (params: any) => {
      return <StatusCellRenderer {...params} />;
    },
  },
  {
    headerName: "Request Time",
    field: "requestDate",
    cellRenderer: Time,
    maxWidth: 600,
    flex: 1,
  },
];
const WorkflowManagement = () => {
  const [statusFilterVisible, setStatusFilterVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [statusForSearch, setStatusForSearch] = useState<string>("");
  // Store button position information
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(0);
  const [loading, setLoading] = useState(false);
  const { id } = getUser();
  const [searchLabel, setSearchLabel] = useState<string>("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const pageDataCache = useRef<Map<number, any[]>>(new Map());
  const totalRef = useRef(0);
  const currentPageRef = useRef<number>(0);
  const gridApiRef = useRef<any>(null);
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
      onGridReady: (params: any) => {
        gridApiRef.current = params.api;
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

  const hasFilterOrSearch = () => {
    return !!searchLabel || statusForSearch.length !== 0;
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

  const datasource = React.useMemo(() => {
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

        getTaskCenter({
          page,
          size: pageSize,
          userId: id,
          workflowName: searchLabel,
          status: statusForSearch,
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
  }, [pageSize, searchLabel, statusForSearch]);

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

  const [statusBtnRect, setStatusBtnRect] = useState<DOMRect | null>(null);
  const statusBtnRef = React.useRef<HTMLButtonElement>(null);

  const handleStatusClick = () => {
    if (statusBtnRef.current) {
      setStatusBtnRect(statusBtnRef.current.getBoundingClientRect());
    }
    setStatusFilterVisible(true);
  };

  const handleStatusFilterCancel = () => {
    setStatusFilterVisible(false);
    const status = selectedStatus.join(",");
    setStatusForSearch(status);
  };

  return (
    <StyleRoot
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
            My Request
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
          My Request
        </h1>
      </div>
      <p
        className={cn(
          "xl:text-[14px] xl:leading-[22px] xl:font-medium",
          "2xl:text-[16px] 2xl:leading-[22px] 2xl:font-medium",
          "text-light-content-title dark:text-dark-content-body"
        )}
      >
        Please track the progress of requests you raised.
      </p>
      <Space style={{ margin: "24px 0 32px 0" }}>
        <SearchBox
          placeholder="Input workflow name and search"
          onChange={setSearchLabel}
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
          className={GRID_NAME}
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
                  title="Your request centre is empty."
                  description="Welcome to use Flow Zero, please track the progress of requests you raised."
                />
              )}
            </div>
          )}
        </div>
      </div>
    </StyleRoot>
  );
};

export default WorkflowManagement;
