import { css, styled } from "@mui/material/styles";
import { Breadcrumb, Button, Skeleton, Space, Tooltip } from "antd";
import cn from "classnames";
import React, { useEffect } from "react";
import { getNewRequest } from "src/api/index";
import BasicSearch from "src/components/base/BasicSearch";
import Empty from "src/components/Empty";

import MarketingIcon from "../../images/RequestLogo.png";
import useInfiniteScroll from "./hooks/useInfiniteScroll";
import RaiseRequestFormModal from "./RaiseRequestFormModal";
import { WorkflowItem } from "./types";

// Dynamically import workflow detail icons
const iconsContext = require.context(
  "src/images/workflow_detail_icon",
  false,
  /\.png$/
);
const iconMap: Record<string, string> = {};
iconsContext.keys().forEach((key: string) => {
  const fileName = key.replace("./", "");
  iconMap[fileName] = iconsContext(key);
});

const StyleRoot = styled("div")(
  () => css`
    .request-search {
      box-shadow: 0px 2px 8px 0px rgba(6, 29, 51, 0.15);
      border: none;
      input::placeholder {
        .dark & {
          color: #666666;
        }
      }
    }
    .btn-view_detail {
      color: #00172e !important;
    }
    .btn-view_detail:hover {
      border-color: #1d81ec !important;
      color: #1d81ec !important;
      .dark & {
        background: #262626 !important;
        border-color: #9ac7f6 !important;
      }
    }
  `
);
const NewRequest: React.FC = () => {
  const [toggle, setToggle] = React.useState<{ [key: number]: boolean }>({});
  const [modalOpen, setModalOpen] = React.useState(false);
  const [workflows, setWorkflows] = React.useState<WorkflowItem[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] =
    React.useState<WorkflowItem | null>(null);

  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const [searchLabel, setSearchLabel] = React.useState<string>("");
  const [isFirstLoad, setIsFirstLoad] = React.useState<boolean>(true);

  const handleToggle = (idx: number) => {
    setToggle((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };
  const handleRaise = (e: React.MouseEvent, workflow: WorkflowItem) => {
    e.stopPropagation();
    setSelectedWorkflow(workflow);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const fetchWorkflows = async (pageNum: number) => {
    try {
      const res: any = await getNewRequest({
        page: pageNum,
        size: 24,
        status: "PUBLISHED_MAIN",
        name: searchLabel,
      });
      const { data: workflowsData, totalElements } = res;
      const newWorkflowsData =
        pageNum === 0 ? workflowsData : [...workflows, ...workflowsData];
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }

      setWorkflows(newWorkflowsData);
      setPage(pageNum);
      setHasMore(newWorkflowsData.length < totalElements);
    } catch (error) {
      console.error("Failed to fetch workflows.", error);
    }
  };

  useEffect(() => {
    fetchWorkflows(0);
  }, [searchLabel]);

  const loadMore = React.useCallback(() => {
    if (!hasMore) return;
    fetchWorkflows(page + 1);
  }, [page, hasMore, searchLabel]);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = useInfiniteScroll(loadMore, hasMore, scrollContainerRef);

  return (
    <StyleRoot
      ref={scrollContainerRef}
      className="flex flex-col overflow-auto"
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className={cn("flex flex-col", "pl-[60px] pr-[60px]", "pt-[56px]")}>
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
              New Request
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
            New Request
          </h1>
        </div>
        <p
          className={cn(
            "xl:text-[14px] xl:leading-[22px] xl:font-medium",
            "2xl:text-[16px] 2xl:leading-[22px] 2xl:font-medium",
            "text-light-content-title dark:text-dark-content-body"
          )}
        >
          Please select a workflow and raise a request.
        </p>
        <Space style={{ margin: "24px 0 32px 0" }}>
          <BasicSearch
            placeholder="Input workflow name and search"
            onChange={setSearchLabel}
          />
        </Space>
        {isFirstLoad ? (
          <Skeleton paragraph={{ rows: 6 }} />
        ) : (
          <>
            <div>
              <div
                className={cn(
                  "grid",
                  "gap-6",
                  "grid-cols-[repeat(auto-fill,minmax(312px,1fr))]",
                  "max-[1100px]:grid-cols-2",
                  "max-[1425px]:grid-cols-3"
                )}
              >
                {workflows.length === 0 ? (
                  <div className="col-span-full w-full">
                    {searchLabel ? (
                      <Empty
                        className="grid-cols-[repeat(auto-fill,minmax(312px,1fr))]"
                        title="No results found."
                        description="Please try to use different terms to configure options or clear current filter."
                      />
                    ) : (
                      <Empty
                        className="grid-cols-[repeat(auto-fill,minmax(312px,1fr))]"
                        title="New request is empty."
                        description="Welcome to use Flow Zero, please select a workflow and raise a request."
                      />
                    )}
                  </div>
                ) : (
                  Array.isArray(workflows) &&
                  workflows.map((wf, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "bg-light-container-layer dark:bg-dark-container-layer",
                        "text-container-title dark:text-container-title",
                        "rounded-[32px]",
                        "p-6",
                        "flex flex-col gap-2",
                        "min-h-[208px]",
                        "w-full",
                        "border border-transparent cursor-pointer"
                      )}
                      onClick={() => handleToggle(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleToggle(idx);
                      }}
                    >
                      {toggle[idx] ? (
                        <React.Fragment>
                          <div className={cn("flex items-center")}>
                            <img
                              src={
                                wf.icon && iconMap[wf.icon]
                                  ? iconMap[wf.icon]
                                  : MarketingIcon
                              }
                              alt="Workflow Icon"
                              className={cn("w-6 h-6")}
                            />
                          </div>
                          <div
                            className={cn("flex flex-col gap-2 items-start")}
                          >
                            <Tooltip
                              title={wf.name}
                              classNames={{
                                root: "dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-inner]:!text-[#0D0D0D] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA]",
                              }}
                            >
                              <span
                                className={cn(
                                  "font-bold text-sm line-clamp-2 word-break"
                                )}
                              >
                                {wf.name}
                              </span>
                            </Tooltip>
                            <Tooltip
                              title={wf.description}
                              classNames={{
                                root: "dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-inner]:!text-[#0D0D0D] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA]",
                              }}
                            >
                              <span
                                className={cn(
                                  "font-medium text-xs text-gray-600 dark:text-gray-400 line-clamp-2 word-break "
                                )}
                              >
                                {wf.description}
                              </span>
                            </Tooltip>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <div className={cn("flex items-center")}>
                            <img
                              src={
                                wf.icon && iconMap[wf.icon]
                                  ? iconMap[wf.icon]
                                  : MarketingIcon
                              }
                              alt="Workflow Icon"
                              className={cn("w-12 h-12")}
                            />
                          </div>
                          <span
                            className={cn(
                              "font-medium text-xl line-clamp-2 word-break"
                            )}
                            style={{ fontStyle: "SC Prosper Sans" }}
                          >
                            {wf.name}
                          </span>
                        </React.Fragment>
                      )}
                      <div className={cn("flex justify-end gap-2", "mt-auto")}>
                        {/* <Button
                        className="btn-view_detail rounded-full px-4 border border-[#CCCCCC] dark:border-[#666666] bg-white dark:bg-dark-container-layer transition-colors dark:hover:bg-dark-container-layer hover:border-[#1D81EC]"
                        type="default"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Link
                          to="/markets_workflow/main-request"
                          className="no-underline px-4 block transition-colors text-inherit hover:text-[#1D81EC] active:text-[#035CBB] dark:text-[#9AC7F6]"
                          style={{ transition: "color 0.2s" }}
                        >
                          View detail
                        </Link>
                      </Button> */}
                        <Button
                          className="btn-view_raise rounded-full px-4"
                          type="primary"
                          onClick={(e) => handleRaise(e, wf)}
                        >
                          Raise
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {workflows.length > 0 && (
                <div style={{ height: "10px" }} ref={bottomRef}></div>
              )}
            </div>
            <RaiseRequestFormModal
              open={modalOpen}
              onClose={handleCloseModal}
              selectedWorkflow={selectedWorkflow}
            />
          </>
        )}
      </div>
    </StyleRoot>
  );
};

export default NewRequest;
