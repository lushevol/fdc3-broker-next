import { DndContext } from "@dnd-kit/core";
import styled from "@emotion/styled";
import { Button, message, Modal, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import {
  approveToDo,
  type ExtensionProperty,
  getExtenstonProperies,
  getFormDetail,
  getFormModelByFileName,
  getToDoDetail,
  rejectToDo,
  terminate,
  type todoEntity,
} from "src/api/index";
import { batchAssignTasks, batchClaimTasks } from "src/api/task/Task";
import EllipsisTooltip from "src/components/EllipsisTooltip";
import { Canvas } from "src/pages/FormDesigner/canvas/Canvas";
import { DragContext } from "src/pages/FormDesigner/dragContext";
import { useDesignerStore } from "src/pages/FormDesigner/store";
import { DragData, FormNode } from "src/pages/FormDesigner/types";
import { ReactRouterDom } from "src/Root/import";
import type { AssignableUserVo } from "src/types/todo";
import { getUser } from "src/util/authenticator";

import AssignTaskModal from "./components/AssignTaskModal";

// Inject backend-saved variable values into the form node tree
// so the preview can rehydrate and display saved field values.
function applyToNode(
  node: FormNode,
  values: Record<string, unknown>
): FormNode {
  const props = node.props ?? {};
  const key = props.indexedTerm;
  const savedValue =
    typeof key === "string" && key in values ? values[key] : undefined;

  return {
    ...node,
    props:
      savedValue !== undefined
        ? { ...props, defaultValue: savedValue as string | boolean }
        : props,
    children: node.children?.map((child) => applyToNode(child, values)),
  };
}

function applyFormValues(
  nodes: FormNode[],
  values: Record<string, unknown>
): FormNode[] {
  return nodes?.map((n) => applyToNode(n, values)) ?? [];
}

const ToDoDetail: React.FC = () => {
  const { id } = getUser();
  const { useSearchParams, useNavigate, useLocation } = ReactRouterDom;
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo =
    (location.state as { returnTo?: string })?.returnTo ??
    "/flowzero/assign-to-me";
  const [searchParams] = useSearchParams();
  const taskId = JSON.parse(searchParams.get("todoDetail") ?? "{}").taskId;
  const [currentAssignee, setCurrentAssignee] = useState<string | undefined>(
    JSON.parse(searchParams.get("todoDetail") ?? "{}").assignee
  );
  const candidateUser = JSON.parse(
    searchParams.get("todoDetail") ?? "{}"
  ).candidateUser;
  const candidateGroup = JSON.parse(
    searchParams.get("todoDetail") ?? "{}"
  ).candidateGroup;
  const workflowName = JSON.parse(
    searchParams.get("todoDetail") ?? "{}"
  ).workflowName;
  const taskName = JSON.parse(searchParams.get("todoDetail") ?? "{}").taskName;
  const [todoDetail, setTodoDetail] = useState<any>(null);
  const [extensionProperties, setExtensionProperties] = useState<
    ExtensionProperty[] | null
  >(null);
  const { loadForm } = useDesignerStore();
  const [loading, setLoading] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const refreshTaskInfo = React.useCallback(async () => {
    try {
      const [detail, propeties] = await Promise.all([
        getToDoDetail(taskId),
        getExtenstonProperies(taskId),
      ]);
      setTodoDetail(detail);
      setExtensionProperties(propeties);
    } catch (e) {
      console.error("Failed to refresh task info:", e);
    }
  }, [taskId]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [detail, propeties] = await Promise.all([
          getToDoDetail(taskId),
          getExtenstonProperies(taskId),
        ]);
        setTodoDetail(detail);
        setExtensionProperties(propeties);

        const vars = (detail as Partial<todoEntity>)?.variables || {};
        // Prefer the standard "start" variable bag when available; fallback to first value.
        const formData =
          (vars as Record<string, unknown>)?.start ||
          (Object.values(vars)[0] as Record<string, unknown>);
        const formId = (formData as Record<string, unknown>)?.formId as
          | string
          | undefined;
        if (!formId) return;

        const formDetail = await getFormDetail(formId);
        const url = formDetail?.url;
        if (!url) return;

        const formModel = await getFormModelByFileName(url);
        if (!formModel?.nodes) return;

        // Remove formId and keep only field values for rehydration.
        const { formId: _omit, ...savedValues } = formData as Record<
          string,
          unknown
        >;
        const enrichedNodes = applyFormValues(
          formModel.nodes,
          savedValues as Record<string, unknown>
        );
        loadForm(enrichedNodes);
      } catch (e) {
        console.error("Failed to load form model:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      loadForm([]);
    };
  }, [taskId, loadForm]);

  const variables = todoDetail?.variables || {};

  const handleApprove = async () => {
    if (!todoDetail) return;
    let approveToDoParams = {
      taskId: todoDetail.id,
      comment: "",
      variables: variables,
    };
    try {
      await approveToDo(approveToDoParams);
      message.success("Approve Successfully");
      navigate(returnTo, { state: { fromDetail: true } });
    } catch (error) {
      message.error("Approval failed. Please try again.");
    }
  };

  const handleReject = () => {
    Modal.confirm({
      title: "Confirm Reject",
      content: "Are you sure you want to reject this task?",
      okText: "Reject",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        if (!todoDetail) return;
        let rejectToDoParams = {
          taskId: todoDetail.id,
          comment: "",
          variables: variables,
        };
        try {
          await rejectToDo(rejectToDoParams);
          message.success("Reject Successfully");
          navigate(returnTo, { state: { fromDetail: true } });
        } catch (error) {
          message.error("Rejection failed. Please try again.");
        }
      },
    });
  };

  const handleTerminate = () => {
    Modal.confirm({
      title: "Confirm Terminate",
      content:
        "Are you sure you want to terminate this request?This action cannot be undone. ",
      okText: "Terminate",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        if (!todoDetail) return;
        let terminateParams = {
          taskId: todoDetail.id,
        };
        try {
          await terminate(terminateParams);
          message.success("Terminate Successfully");
          navigate(returnTo, { state: { fromDetail: true } });
        } catch (error) {
          message.error("Termination failed. Please try again.");
        }
      },
    });
  };

  const shouldShowButton = (buttonName: string) => {
    if (!extensionProperties) return false;
    const prop = extensionProperties.find(
      (p: { name: string; value: string }) => p.name === buttonName
    );
    return prop && prop.value === "1";
  };

  const handleDirectAssign = async () => {
    if (!taskId) return;
    try {
      await batchClaimTasks({ IdList: [taskId], toUserId: id });
      message.success("Assign Successfully");
      setCurrentAssignee(id);
      await refreshTaskInfo();
    } catch {
      message.error("Failed to assign task");
    }
  };

  const handleAssignConfirm = async (user: AssignableUserVo) => {
    if (!taskId) return;
    setAssignLoading(true);
    try {
      await batchAssignTasks({ IdList: [taskId], toUserId: user.bankId });
      message.success("Assign Successfully");
      setCurrentAssignee(user.bankId);
      setAssignModalOpen(false);
      await refreshTaskInfo();
    } catch {
      message.error("Failed to assign task");
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between h-[56px] bg-[#fff] px-4 border-[#ccc] border-b">
        <div className="flex items-center overflow-hidden">
          <span
            className="text-light-input-text dark:text-dark-input-text flowzero-iconfont icon-arrow-chevron-nav-left-backward cursor-pointer flex-shrink-0"
            onClick={() => navigate(returnTo, { state: { fromDetail: true } })}
          />
          <EllipsisTooltip value={taskName} placement="bottom" />
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {!currentAssignee && (candidateUser || candidateGroup) && (
            <button
              className="text-[#0473EA] cursor-pointer bg-transparent border-none p-0 hover:opacity-70"
              onClick={() => {
                if (candidateUser) {
                  handleDirectAssign();
                } else {
                  setAssignModalOpen(true);
                }
              }}
            >
              Assign
            </button>
          )}
          {id === currentAssignee && (
            <>
              {shouldShowButton("terminateButton") && (
                <Button
                  onClick={handleTerminate}
                  className="mr-2 rounded-full text-[#00172E] dark:bg-dark-container-layer dark:text-[#9AC7F6]"
                >
                  Terminate
                </Button>
              )}
              {shouldShowButton("rejectButton") && (
                <Button
                  onClick={handleReject}
                  className="mr-2 rounded-full text-[#00172E] dark:bg-dark-container-layer dark:text-[#9AC7F6]"
                >
                  Reject
                </Button>
              )}
              {shouldShowButton("approveButton") && (
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={handleApprove}
                  className="rounded-full text-[#FFF] bg-[#0473EA]"
                >
                  Approve
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full min-h-full py-[36px] px-[48px]">
          <div className="w-full">
            <div className="overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center w-full px-6">
                  <div className="w-full max-w-4xl">
                    <Skeleton active paragraph={{ rows: 14 }} />
                  </div>
                </div>
              ) : (
                <DndContext>
                  <DragContext.Provider
                    value={{
                      activeDragData: null,
                      overId: null,
                      overData: {} as DragData,
                    }}
                  >
                    <Canvas isPreview plain />
                  </DragContext.Provider>
                </DndContext>
              )}
            </div>
          </div>
        </div>
      </div>
      <AssignTaskModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onConfirm={handleAssignConfirm}
        loading={assignLoading}
        taskCount={1}
        workflowName={workflowName}
        taskName={taskName}
      />
    </div>
  );
};

export default ToDoDetail;
