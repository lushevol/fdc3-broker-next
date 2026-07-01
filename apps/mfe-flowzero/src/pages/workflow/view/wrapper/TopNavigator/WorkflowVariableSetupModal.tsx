import { CloseOutlined } from "@ant-design/icons";
import { Checkbox, Modal, Spin, Switch } from "antd";
import cn from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import type { FormFieldRef } from "src/api";
import {
  DATA_TYPE_COLOR,
  FIELD_DATATYPE_MAP,
  FieldDataType,
  isFieldDataType,
} from "src/pages/FieldsManagement/fieldType";
import { useWorkflowDesignerContext } from "src/pages/workflow/viewModel/WorkflowDesignerProvider";

interface WorkflowVariableSetupModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (enabledIds: string[]) => void;
}

const WorkflowVariableSetupModal: React.FC<WorkflowVariableSetupModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const { workflowDesignerStore: store } = useWorkflowDesignerContext();
  const [loading, setLoading] = useState(false);
  const [fieldList, setFieldList] = useState<FormFieldRef[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [enabledIds, setEnabledIds] = useState<Set<string>>(new Set());

  const fetchFields = useCallback(async () => {
    if (!store) return;
    setLoading(true);
    try {
      await store.loadFormFields();
      setFieldList(store.formFields);
      setEnabledIds(new Set<string>(store.selectedFormFields.map((f) => f.id)));
    } finally {
      setLoading(false);
    }
  }, [store]);

  useEffect(() => {
    if (!open) return;
    setSelectedIds(new Set());
    fetchFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const allSelected =
    fieldList.length > 0 && fieldList.every((f) => selectedIds.has(f.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(fieldList.map((f) => f.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleBulkEnable = () => {
    setEnabledIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const handleBulkDisable = () => {
    setEnabledIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  const handleToggleEnabled = (id: string, checked: boolean) => {
    setEnabledIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSave = () => {
    const selectedFields = fieldList.filter((f) => enabledIds.has(f.id));
    store?.saveSelectedFormFields(selectedFields);
    onSave?.(Array.from(enabledIds));
    onClose();
  };

  return (
    <Modal
      title={
        <span className="text-[18px] font-semibold leading-7">
          Workflow Variable Setup
        </span>
      }
      open={open}
      onCancel={handleSave}
      width={680}
      footer={null}
      closeIcon={<CloseOutlined style={{ fontSize: 18 }} />}
    >
      <div className="mt-3">
        {/* Header row: selected count + bulk actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            {/* <span className="text-[13px] text-[#595959]">Select all</span>

            <Checkbox
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            ></Checkbox> */}
            <span className="text-[13px] text-[#595959]">
              <span className="font-medium text-[#262626]">
                {selectedIds.size}
              </span>{" "}
              field selected
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              disabled={enabledIds.size === 0}
              className={cn(
                "text-[13px] transition",
                enabledIds.size === 0
                  ? "text-[#bfbfbf] cursor-not-allowed"
                  : "text-[#1677ff] hover:text-[#4096ff]"
              )}
              onClick={handleBulkDisable}
            >
              Disable
            </button>
            <button
              type="button"
              disabled={enabledIds.size === fieldList.length}
              className={cn(
                "text-[13px] transition",
                enabledIds.size === fieldList.length
                  ? "text-[#bfbfbf] cursor-not-allowed"
                  : "text-[#1677ff] hover:text-[#4096ff]"
              )}
              onClick={handleBulkEnable}
            >
              Enable
            </button>
          </div>
        </div>

        {/* Field list */}
        <Spin spinning={loading}>
          <div className="max-h-[420px] overflow-y-auto space-y-1 pr-1 min-h-[80px]">
            {fieldList.map((field) => {
              const isSelected = selectedIds.has(field.id);
              const isEnabled = enabledIds.has(field.id);
              const dtKey =
                field.dataType && isFieldDataType(field.dataType)
                  ? (field.dataType as FieldDataType)
                  : null;
              const dtConfig = dtKey ? DATA_TYPE_COLOR[dtKey] : null;
              const dtLabel = dtKey ? FIELD_DATATYPE_MAP[dtKey] : null;

              return (
                <div
                  key={field.id}
                  className={cn(
                    "flex items-center justify-between px-3 h-[48px] rounded-lg",
                    isSelected
                      ? "bg-[#f0f5ff]"
                      : "bg-[#fafafa] hover:bg-[#f5f5f5]",
                    "transition"
                  )}
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) =>
                        handleToggleSelect(field.id, e.target.checked)
                      }
                    />
                    <span className="text-[13px] text-[#262626] truncate">
                      {field.label}
                    </span>
                  </label>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {dtConfig && dtLabel && (
                      <span
                        className="h-[22px] px-2 rounded-full text-[11px] leading-[22px] inline-flex items-center gap-1"
                        style={{
                          background: dtConfig.bg,
                          color: dtConfig.color,
                        }}
                      >
                        <span
                          className={cn(
                            "flowzero-iconfont text-[10px]",
                            dtConfig.icon
                          )}
                        />
                        {dtLabel}
                      </span>
                    )}
                    <Switch
                      size="small"
                      checked={isEnabled}
                      onChange={(checked) =>
                        handleToggleEnabled(field.id, checked)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Spin>
      </div>
    </Modal>
  );
};

export default WorkflowVariableSetupModal;
