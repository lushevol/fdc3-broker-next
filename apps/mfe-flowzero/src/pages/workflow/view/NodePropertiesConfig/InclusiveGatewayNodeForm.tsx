import styled from "@emotion/styled";
import { Button, Form, Input, Tooltip } from "antd";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useFieldDefsFromForm } from "src/pages/workflow/services/conditionUtils";

import { PropertiesPanelProps } from "../config/ILayoutsConfig";
import SettingsIcon from "../node_icon/setings.png";
import InfoIcon from "../node_icon/tooltip.svg";
import InfoIconDark from "../node_icon/tooltip_dark.svg";
import ToolTipIcon from "../node_icon/tooltip2.svg";
import ToolTipIconDark from "../node_icon/tooltip2_dark.svg";
import ConditionGroup, {
  Condition,
  ConditionGroupValue,
  Conjunction,
} from "./ConditionGroup";

const FormWrapper = styled("div")`
  .ant-select-in-form-item {
    height: 32px;
  }
  .ant-select-dropdown {
    .dark & {
      color: #808080 !important;
      background: #262626 !important;
      border: 1px solid #737373 !important;
    }
  }
`;

// Replaced inline illustration with image asset `setings.png`.

interface HandleMeta {
  id: string;
  role: "source" | "target";
  label?: string;
  isBranch?: boolean;
  conjunction?: Conjunction;
  conditions?: Condition[];
}

const MAX_BRANCHES = 6;

const normalizeBranchLabels = (handles: HandleMeta[]) => {
  const copy = handles.map((h) => ({ ...h }));

  // 收集已有的 Branch N 编号
  const usedNums = new Set<number>();
  const re = /Branch\s*(\d+)/i;
  copy.forEach((h) => {
    if (h.role === "source" && h.isBranch && typeof h.label === "string") {
      const m = h.label.match(re);
      if (m) usedNums.add(Number(m[1]));
    }
  });

  // 下一个分支编号从最大已用编号 + 1 开始（若无则从 1）
  const maxUsed = usedNums.size ? Math.max(...Array.from(usedNums)) : 0;
  let next = maxUsed + 1;

  // 仅为没有 label 的分支分配新的编号；已有 Branch N 保持不变
  for (const h of copy) {
    if (h.role === "source" && h.isBranch) {
      if (!h.label) {
        h.label = `Branch ${next++}`;
      }
    }
  }
  return copy;
};

const InclusiveGatewayNodeForm: React.FC<PropertiesPanelProps> = ({
  nodeData,
  onNodeDataChange,
  onRemoveEdgesByHandle,
}) => {
  const [form] = Form.useForm();
  const [sourceHandles, setSourceHandles] = useState<HandleMeta[]>(() =>
    (nodeData?.handlesMeta || []).filter(
      (h: HandleMeta) => h.role === "source" && h.isBranch
    )
  );
  const [editingHandleId, setEditingHandleId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>("");

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(nodeData || {});
    const handles: HandleMeta[] = (nodeData?.handlesMeta || []).filter(
      (h: HandleMeta) => h.role === "source" && h.isBranch
    );
    setSourceHandles(handles);
  }, [nodeData, form]);

  const handleValuesChange = (_: any, allValues: any) => {
    if (nodeData) {
      Object.assign(nodeData, allValues);
      onNodeDataChange?.(allValues);
    }
  };

  const getAllHandles = (): HandleMeta[] => nodeData?.handlesMeta || [];

  const syncHandles = (updated: HandleMeta[]) => {
    const normalized = normalizeBranchLabels(updated);
    // const normalized = updated;
    if (nodeData) {
      nodeData.handlesMeta = normalized;
    }
    const newSources = updated.filter((h) => h.role === "source" && h.isBranch);
    setSourceHandles(newSources);
    onNodeDataChange?.({});
  };

  const addBranch = () => {
    const allHandles = getAllHandles();
    const branches = allHandles.filter(
      (h: any) => h.role === "source" && h.isBranch === true
    );
    if (branches.length >= MAX_BRANCHES) return;
    // 修复：移除所有 merge point handle（role: 'source', isBranch !== true）
    const handlesNoMerge = allHandles.filter(
      (h: any) => !(h.role === "source" && h.isBranch !== true)
    );
    const newHandle: HandleMeta = {
      id: `h_${Date.now()}`,
      role: "source",
      isBranch: true,
    };
    // 新增：同步移除 edges 里 source 为该节点且 sourceHandle 为 merge handle 的 edge
    // 注意：不依赖 nodeData?.id，因为新拖入的节点 data.id 尚未设置
    if (typeof onRemoveEdgesByHandle === "function") {
      // 查找所有 merge handle（label: 'Out' 或 id 以 '_out' 结尾）
      const mergeHandles = allHandles.filter(
        (h: any) =>
          h.role === "source" &&
          (h.label === "Out" ||
            (typeof h.id === "string" && h.id.endsWith("_out")))
      );
      mergeHandles.forEach((h: any) => {
        onRemoveEdgesByHandle(h.id);
      });
    }
    syncHandles([...handlesNoMerge, newHandle]);
  };

  const removeBranch = (handleId: string) => {
    const allHandles = getAllHandles();
    const branches = allHandles.filter(
      (h: any) => h.role === "source" && h.isBranch
    );
    onRemoveEdgesByHandle?.(handleId);
    const remaining = allHandles.filter((h) => h.id !== handleId);
    if (branches.length === 1) {
      const nodeId = nodeData?.id || "node";
      remaining.push({ id: `${nodeId}_out`, role: "source", label: "Out" });
    }
    syncHandles(remaining);
  };

  const updateHandleLabel = (handleId: string, label: string) => {
    const allHandles = getAllHandles();
    const updated = allHandles.map((h) =>
      h.id === handleId ? { ...h, label } : h
    );
    syncHandles(updated);
  };

  const updateBranchConditions = (
    handleId: string,
    conditionGroupValue: ConditionGroupValue
  ) => {
    const allHandles = getAllHandles();
    const updated = allHandles.map((h) =>
      h.id === handleId
        ? {
            ...h,
            conjunction: conditionGroupValue.conjunction,
            conditions: conditionGroupValue.conditions,
          }
        : h
    );
    // 同时把 fieldDefs 存入 nodeData，供 BpmnService 序列化时做类型推断
    if (nodeData) {
      nodeData.fieldDefs = fieldDefs;
    }
    syncHandles(updated);
  };

  const hasBranches = sourceHandles.length > 0;

  const fieldDefs = useFieldDefsFromForm();

  const addBtnColorClass =
    sourceHandles.length >= MAX_BRANCHES
      ? "text-[#999999]"
      : "text-[#012246] hover:text-[#012246] dark:text-[#9AC7F6] dark:hover:text-[#9AC7F6]";
  return (
    <FormWrapper>
      {/* Dynamic info banner */}
      <div
        className={cn(
          "flex flex-row items-start gap-[3px]",
          "rounded-[5px] mb-[16px]",
          "bg-[#E5F1FC] pr-[8px] dark:bg-[#1A1A1A]"
        )}
      >
        <div className="flex items-start p-[9px_2px_9px_10.5px] shrink-0 translate-y-[1px]">
          <img
            src={ToolTipIcon}
            alt="info"
            style={{ width: 15, height: 15 }}
            className="dark:hidden"
          />
          <img
            src={ToolTipIconDark}
            className="hidden dark:block"
            alt="info"
            style={{ width: 15, height: 15 }}
          />
        </div>
        <div className="flex flex-col p-[9px_3px] gap-[2px] flex-1">
          <span
            className={cn(
              "font-medium text-[12px] leading-[18px] text-[#035CBB] dark:text-[#1D81EC]"
            )}
          >
            {hasBranches
              ? "Start Gateway (Split Point)"
              : "End Gateway (Merge Point)"}
          </span>
          <span
            className={cn(
              "font-normal text-[12px] leading-[16px] text-[#595959] dark:text-dark-content-body"
            )}
          >
            {hasBranches
              ? "Configured with conditions. Multiple paths can be activated based on conditions."
              : "No condition configured. Wait for all activated paths to complete before continuing."}
          </span>
        </div>
      </div>

      {/* Label field */}
      <Form layout="vertical" form={form} onValuesChange={handleValuesChange}>
        <Form.Item
          label={
            <span className="font-medium text-[12px] text-[#4D4D4D] dark:text-dark-content-label-text">
              Label
            </span>
          }
          name="label"
        >
          <Input
            maxLength={200}
            className="h-[32px] dark:!bg-[#262626] dark:!border-[#666666] dark:text-[#a0a0a0]"
          />
        </Form.Item>
      </Form>

      {/* Branch Setting section */}
      <div className={cn("flex flex-col gap-[12px] mt-[16px]")}>
        {/* Section header */}
        <div
          className={cn(
            "flex items-center justify-between",
            "border-b border-b-[#cccccc] dark:border-b-[#444] pb-[8px]"
          )}
        >
          <div className="flex items-center gap-[4px]">
            <span className="font-bold text-[12px] leading-[16px] text-[#0367D2] dark:text-[##1D81EC]">
              Branch Setting
            </span>
            <Tooltip
              placement="right"
              overlayClassName="w-[277px] rounded-[8px] [&_.ant-tooltip-inner]:!bg-[#00172E] dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-inner]:!text-[#000000] [&_.ant-tooltip-inner]:!font-[500]"
              title={`${
                hasBranches
                  ? "Please ensure that at least one branch condition is satisfied, so that the branch is activated and process can proceed successfully."
                  : "Add branches to split the gateway. Without branches the gateway acts as a merge point."
              }`}
            >
              <div className="w-[13.3px] h-[13.3px] translate-y-[1px]">
                <img
                  src={InfoIcon}
                  alt="info"
                  className="w-full h-full dark:hidden"
                />
                <img
                  src={InfoIconDark}
                  alt="info"
                  className="w-full h-full hidden dark:block"
                />
              </div>
            </Tooltip>
          </div>
          <Button
            type="text"
            size="small"
            disabled={sourceHandles.length >= MAX_BRANCHES}
            onClick={addBranch}
            className={cn(
              "flex items-center gap-[4px]",
              "text-[#012246] dark:text-[#9AC7F6] dark:hover:!text-[#9AC7F6] font-medium text-[12px]",
              "rounded-[32px] px-[4px]"
            )}
            icon={
              <span
                className={cn(
                  "flowzero-iconfont icon-plus-add",
                  addBtnColorClass
                )}
                style={{
                  fontSize: 16,
                }}
              />
            }
          >
            Branch
          </Button>
        </div>

        {/* Empty state */}
        {!hasBranches && (
          <div
            className={cn(
              "flex flex-col items-center justify-center",
              "py-[32px] gap-[16px]",
              "bg-[#F9F9F9] dark:bg-[#1A1A1A] border border-dashed border-[#CCCCCC] dark:border-[#444] rounded-[4px]"
            )}
          >
            <img
              src={SettingsIcon}
              alt="Settings"
              className="w-[86px] h-[40px] object-contain"
            />
            <div className="flex flex-col items-center gap-[4px]">
              <span className="font-semibold text-[14px] leading-[22px] text-[#262626] dark:text-dark-content-title text-center">
                No branches configured
              </span>
              <span className="font-normal text-[12px] leading-[20px] text-[#4D4D4D] dark:text-dark-content-body text-center">
                As no branch is added this gateway will act as a merge point
              </span>
            </div>
          </div>
        )}

        {/* Branch list */}
        {hasBranches && (
          <div className={cn("flex flex-col gap-[8px]")}>
            {sourceHandles.length >= MAX_BRANCHES && (
              <div
                className={cn(
                  "mt-[-6px] mb-[3px]",
                  "text-[12px] font-weight-[500]",
                  "text-[#7D570A]"
                )}
              >
                Maximum 6 branches can be added
              </div>
            )}
            {getAllHandles()
              .filter((h) => h.role === "source" && h.isBranch === true)
              .map((handle, index) => (
                <div key={handle.id} className={cn("flex flex-col gap-[8px]")}>
                  <div className={cn("flex items-center gap-[8px]")}>
                    {editingHandleId === handle.id ? (
                      <Input
                        className="h-[32px] flex-1"
                        value={editingLabel}
                        autoFocus
                        maxLength={18}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        onBlur={() => {
                          updateHandleLabel(handle.id, editingLabel);
                          setEditingHandleId(null);
                          setEditingLabel("");
                        }}
                        onPressEnter={() => {
                          updateHandleLabel(handle.id, editingLabel);
                          setEditingHandleId(null);
                          setEditingLabel("");
                        }}
                      />
                    ) : (
                      <div
                        role="button"
                        tabIndex={0}
                        className="flex-1 text-[14px] text-[#262626] dark:text-dark-content-title cursor-text"
                        onClick={() => {
                          setEditingHandleId(handle.id);
                          setEditingLabel(
                            handle.label || `Branch ${index + 1}`
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setEditingHandleId(handle.id);
                            setEditingLabel(
                              handle.label || `Branch ${index + 1}`
                            );
                          }
                        }}
                      >
                        {handle.label || `Branch ${index + 1}`}
                      </div>
                    )}
                    <Button
                      type="text"
                      size="small"
                      danger
                      onClick={() => removeBranch(handle.id)}
                      className={cn(
                        "flex items-center justify-center px-[4px]"
                      )}
                    >
                      <span
                        className="flowzero-iconfont icon-field-trash"
                        style={{ color: "#A6A6A6", width: 24, height: 24 }}
                      />
                    </Button>
                  </div>
                  <ConditionGroup
                    value={{
                      conjunction: handle.conjunction ?? "And",
                      conditions: handle.conditions ?? [],
                    }}
                    onChange={(v) => updateBranchConditions(handle.id, v)}
                    fieldDefs={fieldDefs}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </FormWrapper>
  );
};

export default observer(InclusiveGatewayNodeForm);
