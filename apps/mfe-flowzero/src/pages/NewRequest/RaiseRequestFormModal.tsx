import { CloseOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import styled from "@emotion/styled";
import { Button, message, Modal, Skeleton } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  getBpmnDetail,
  getFormModelByFileName,
  processInstancesStart,
} from "src/api/index";
import { Canvas } from "src/pages/FormDesigner/canvas/Canvas";
import { DragContext } from "src/pages/FormDesigner/dragContext";
import { useDesignerStore } from "src/pages/FormDesigner/store";
import { DragData } from "src/pages/FormDesigner/types";
import { navigationStore } from "src/stores/NavigationStore";
import { getUser } from "src/util/authenticator";

import { getEffectiveDefault } from "./getEffectiveDefault";
import type { WorkflowItem } from "./types";

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .ant-modal-header {
    border-bottom: none;
    padding: 0;
  }
  .ant-modal-body {
    flex: 1;
    min-height: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
`;

interface HolidayFormModalProps {
  open: boolean;
  onClose: () => void;
  selectedWorkflow?: WorkflowItem | null;
}

const RaiseRequestFormModal: React.FC<HolidayFormModalProps> = observer(
  ({ open, onClose, selectedWorkflow }) => {
    const store = useDesignerStore();
    const { loadForm } = store;
    const [loading, setLoading] = useState(false);
    const [formId, setFormId] = useState<string>("");
    getUser();

    useEffect(() => {
      if (!open) {
        loadForm([]);
        setFormId("");
        return;
      }

      const load = async () => {
        try {
          setLoading(true);
          const workflowId = selectedWorkflow?.id;
          if (!workflowId) return;
          const workflowDetail = await getBpmnDetail(workflowId);
          const url = workflowDetail?.forms?.[0]?.url ?? "";
          const formId = workflowDetail?.forms?.[0]?.id ?? "";
          if (!url) return;
          const formModel = await getFormModelByFileName(url);
          setFormId(formId);
          loadForm(formModel.nodes);
        } catch (e) {
          console.error("Failed to load workflow or form detail:", e);
        } finally {
          setLoading(false);
        }
      };

      load();
    }, [open, selectedWorkflow, loadForm]);

    const handleClose = () => {
      loadForm([]);
      onClose();
    };

    const handleSubmit = async () => {
      console.log("Submitting form with values:", store.nodes);
      try {
        // Collect default values for fields that the user has not interacted with
        const defaultValues: Record<string, unknown> = {};
        const collectDefaults = (nodes: typeof store.nodes) => {
          for (const node of nodes) {
            const { indexedTerm } = node.props;
            if (indexedTerm && !(indexedTerm in store.formValues)) {
              const effectiveDefault = getEffectiveDefault(node);
              const isEmpty =
                effectiveDefault === undefined ||
                effectiveDefault === "" ||
                (Array.isArray(effectiveDefault) &&
                  effectiveDefault.length === 0);
              if (!isEmpty) {
                defaultValues[indexedTerm] = effectiveDefault;
              }
            }
            if (node.children?.length) collectDefaults(node.children);
          }
        };
        collectDefaults(store.nodes);
        const sanitizedFormValues = Object.fromEntries(
          Object.entries(store.formValues).map(([k, v]) => [
            k,
            v === "" ? null : v,
          ])
        );
        const params = {
          workflowId: selectedWorkflow?.id || "",
          uniqueVersionId: selectedWorkflow?.uniqueVersionId || "",
          variables: {
            start: {
              formId,
              ...defaultValues,
              ...sanitizedFormValues,
            },
          },
        };
        await processInstancesStart(params);
        message.success("Request Submitted Successfully");
        if (selectedWorkflow?.name) {
          navigationStore.triggerRefresh(selectedWorkflow.name);
        }
        handleClose();
      } catch (error) {
        message.error("Failed to submit form");
        handleClose();
      }
    };

    return (
      <StyledModal
        open={open}
        onCancel={handleClose}
        footer={null}
        width={1003}
        centered
        className="holiday-form-modal"
        destroyOnClose
        closeIcon={
          <CloseOutlined className="text-gray-400 hover:text-gray-600" />
        }
        styles={{
          content: {
            padding: 0,
            height: "850px",
          },
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-0">
              Form Submission
            </h2>
          </div>

          {/* Form Content — FormDesigner Preview Canvas */}
          <div className="flex-1 min-h-0 overflow-auto py-[36px] px-[48px] bg-[#f0f2f5]">
            {loading ? (
              <div className="flex items-center justify-center h-full w-full px-6">
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

          {/* Footer Buttons */}
          <div className="flex shrink-0 justify-end gap-4 px-6 py-4 border-t border-gray-200">
            <Button
              onClick={handleClose}
              className="h-10 px-6 rounded-[32px] border border-gray-300 hover:border-gray-400 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="h-10 px-6 rounded-[32px] font-medium"
            >
              Submit
            </Button>
          </div>
        </div>
      </StyledModal>
    );
  }
);

export default RaiseRequestFormModal;
