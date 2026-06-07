import { Button } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
import { ReactRouterDom } from "src/Root/import";

import { useWorkflowDesignerContext } from "../../../viewModel/WorkflowDesignerProvider";
import WorkflowVariableSetupModal from "./WorkflowVariableSetupModal";

interface TopNavigatorProps {
  exportToXML: () => void;
  save: () => void;
  deploy: () => void;
}

const TopNavigator: React.FC<TopNavigatorProps> = ({
  exportToXML,
  save,
  deploy,
}) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [variableSetupOpen, setVariableSetupOpen] = React.useState(false);
  const { useSearchParams, useNavigate, useLocation } = ReactRouterDom;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo =
    (location.state as { returnTo?: string })?.returnTo ??
    "/flowzero/workflow-management";
  const workflowDetail = JSON.parse(searchParams.get("workflowDetail") ?? "{}");
  const { workflowDesignerStore } = useWorkflowDesignerContext();
  const displayVersion = workflowDesignerStore?.workflowEntity.displayVersion;
  const workflowName = workflowDesignerStore?.workflowEntity.name;
  return (
    <div className="bg-[#fff] px-[16px] flex items-center border-b border-[#ccc] dark:border-[#737373] dark:bg-[#262626] h-[56px]">
      <button
        className={`w-[42px] h-[32px] flex items-center justify-center rounded-[6px] mx-0 transition focus:outline-none ${
          menuVisible
            ? "bg-light-subtle-pressed dark:bg-dark-subtle-pressed "
            : "hover:bg-light-subtle-pressed hover:dark:bg-dark-subtle-pressed "
        }`}
        type="button"
      >
        <span
          className="text-light-input-text dark:text-dark-input-text flowzero-iconfont icon-arrow-chevron-nav-left-backward cursor-pointer"
          onClick={() => navigate(returnTo, { state: { fromDetail: true } })}
        />
      </button>
      <span className="border-l border-[#CCCCCC] dark:border-dark-divide-base h-[calc(100%-16px)] pr-[16px] ml-[10px] my-2"></span>
      <span
        className="font-medium text-[14px] mr-[23px] pl-[6px] dark:text-[#BFBFBF] truncate"
        style={{ display: "inline-block", verticalAlign: "middle" }}
        title={workflowName}
      >
        {workflowName && workflowName.length > 20
          ? workflowName.slice(0, 20) + "..."
          : workflowName}
      </span>
      {displayVersion !== 0 ? (
        <div className="bg-blue-500 font-[400] text-white text-xs font-semibold rounded px-3 h-[24px] mr-2 flex items-center justify-center gap-[4px]">
          <span className="flowzero-iconfont icon-arrow-sort font-[400] !text-[12px] leading-[12px]"></span>
          <span className="text-[12px] leading-[12px] font-[400]">
            V{displayVersion}
          </span>
        </div>
      ) : (
        <div className="bg-[#E5E5E5]  text-[#808080] text-xs font-semibold rounded px-3 h-[24px] mr-2 flex items-center justify-center gap-[4px]">
          <span className="flowzero-iconfont icon-arrow-sort font-[400] !text-[12px] leading-[12px]"></span>
          <span className="text-[12px] leading-[12px] font-[400]">
            V{displayVersion}
          </span>
        </div>
      )}
      <span
        style={{ visibility: "hidden" }}
        className="bg-light-surface-primary-subtle-hover dark:bg-dark-surface-primary-subtle-hover text-light-lint-primary-selected dark:text-dark-lint-primary-selected text-xs rounded px-2 py-1 flex items-center mr-auto"
      >
        <svg
          className="w-3 h-3 mr-1 "
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.5"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 1.333A6.667 6.667 0 1 1 1.333 8 6.667 6.667 0 0 1 8 1.333zm0 3.334v2.666m0 2.667h.007"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Unsaved Changes
      </span>
      <div className="flex items-center gap-2">
        {/* <button className="text-blue-500 hover:underline bg-transparent border-none px-3 py-1 rounded transition">
          Close
        </button> */}
        <Button
          className="border bg-light-container-layer dark:bg-dark-container-layer text-light-link-secondary-default dark:text-dark-link-secondary-default border-light-secondary-default dark:border-dark-secondary-default px-4 py-1 rounded-full font-semibold  hover:bg-gray-100 transition h-[32px]"
          onClick={() => setVariableSetupOpen(true)}
        >
          Workflow Variable Setup
        </Button>
        <WorkflowVariableSetupModal
          open={variableSetupOpen}
          onClose={() => setVariableSetupOpen(false)}
        />
        <Button
          className="border bg-light-container-layer dark:bg-dark-container-layer text-light-link-secondary-default dark:text-dark-link-secondary-default border-light-secondary-default dark:border-dark-secondary-default px-4 py-1 rounded-full font-semibold  hover:bg-gray-100 transition h-[32px]"
          onClick={save}
        >
          Save
        </Button>
        {/* <button
          className="bg-blue-500 text-white px-5 py-1 rounded-full font-semibold hover:bg-blue-600 transition h-[32px]"
          onClick={deploy}
        >
          Deploy
        </button> */}
        <Button
          className="bg-blue-500 text-[#fff] px-5 py-1 rounded-full font-semibold hover:bg-blue-600 transition h-[32px] disabled:text-[black] disabled:dark:text-[#fff] disabled:bg-[rgba(0,0,0,0.04)] disabled:dark:bg-[rgba(255,255,255,0.04)] disabled:hover:bg-[#0812220c]"
          onClick={deploy}
        >
          Publish
        </Button>
        {/* TODO */}
        {/* <button
          className="bg-blue-500 text-white px-5 py-1 rounded-full font-semibold hover:bg-blue-600 transition h-[32px]"
          onClick={exportToXML}
        >
          export bpmn
        </button> */}
      </div>
    </div>
  );
};

export default React.memo(observer(TopNavigator));
