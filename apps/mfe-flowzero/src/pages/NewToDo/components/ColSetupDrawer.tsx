import { PlusOutlined } from "@ant-design/icons";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, Drawer, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { getBpmnDetail } from "src/api";
import { getFieldslList } from "src/api/field/Field";
import type { FormFieldRef } from "src/api/form/Form";
import { saveUserSettings } from "src/api/todo/Todo";
import type { FieldDataType } from "src/pages/FieldsManagement/fieldType";
import type { ColumnSetting } from "src/types/todo";

import SortableColumnRow from "./SortableColumnRow";

const DEFAULT_WORKFLOW_KEY = "ASSIGNED_TO_ME";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

interface ColumnItem {
  id: string;
  value: string;
}

export interface ColSetupItem {
  key: string;
  label: string;
  dataType?: string;
  options?: Array<{ value: string; label: string }>;
}

interface ColSetupDrawerProps {
  open: boolean;
  onClose: () => void;
  activeColKeys: string[];
  defaultColKeys: string[];
  allColItems: ColSetupItem[];
  onApply: (
    colKeys: string[],
    colLabels?: Record<string, string>,
    colDataTypes?: Record<string, string>,
    colOptions?: Record<string, Array<{ value: string; label: string }>>
  ) => void;
  getContainer?: () => HTMLElement;
  workflowIds?: string[];
  workflowName?: string;
  taskName?: string;
  assigneeOnly?: boolean;
}

const ColSetupDrawer: React.FC<ColSetupDrawerProps> = ({
  open,
  onClose,
  activeColKeys,
  defaultColKeys,
  allColItems,
  onApply,
  getContainer,
  workflowIds,
  workflowName,
  taskName,
  assigneeOnly,
}) => {
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [workflowColItems, setWorkflowColItems] = useState<ColSetupItem[]>([]);
  const workflowIdsKey = workflowIds?.join(",") ?? "";

  useEffect(() => {
    if (open) onClose();
  }, [taskName, workflowName]);

  // Fetch fields: use getFieldslList when assigneeOnly, otherwise getBpmnDetail per workflowId
  useEffect(() => {
    if (assigneeOnly) {
      getFieldslList({ usedInInboxSearching: "Y", size: 100 }).then(
        (result) => {
          const items: ColSetupItem[] = (result.data ?? []).map((field) => ({
            key: field.indexedTerm,
            label: field.label ?? field.indexedTerm,
            dataType: field.dataType,
            ...(field.metadata?.length && {
              options: field.metadata.map((m) => ({
                value: m.value,
                label: m.label,
              })),
            }),
          }));
          setWorkflowColItems(items);
        }
      );
      return;
    }

    // Fetch fields from all workflowIds concurrently, merge and deduplicate
    if (!workflowIdsKey) {
      setWorkflowColItems([]);
      return;
    }
    const ids = workflowIdsKey.split(",");
    Promise.all(ids.map((id) => getBpmnDetail(id))).then((results) => {
      const seen = new Set<string>();
      const items: ColSetupItem[] = [];
      for (const result of results) {
        for (const form of result.forms ?? []) {
          for (const field of (form.fields as unknown as FormFieldRef[]) ??
            []) {
            if (
              field.usedInInboxSearching === "Y" &&
              field.indexedTerm &&
              !seen.has(field.indexedTerm)
            ) {
              seen.add(field.indexedTerm);
              items.push({
                key: field.indexedTerm,
                label: field.label ?? field.indexedTerm,
                dataType: field.dataType,
                ...(field.metadata?.length && {
                  options: field.metadata
                    .filter((m) => m.label != null)
                    .map((m) => ({ value: m.value, label: m.label! })),
                }),
              });
            }
          }
        }
      }
      setWorkflowColItems(items);
    });
  }, [workflowIdsKey, assigneeOnly]);

  const combinedColItems = useMemo(
    () => [...allColItems, ...workflowColItems],
    [allColItems, workflowColItems]
  );

  // Build grouped select options
  const selectOptions = useMemo(
    () => [
      {
        label: "Form Fields",
        options: workflowColItems
          .map((item) => ({
            label: item.label,
            value: item.key,
            fieldType: "Form",
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      },
      {
        label: "System Fields",
        options: allColItems
          .map((item) => ({
            label: item.label,
            value: item.key,
            fieldType: "System",
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      },
    ],
    [allColItems, workflowColItems]
  );

  // Reset internal state each time the drawer opens
  useEffect(() => {
    if (!open) return;
    const validKeys = activeColKeys.filter((k) =>
      combinedColItems.some((c) => c.key === k)
    );
    setColumns(validKeys.map((k) => ({ id: uid(), value: k })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, combinedColItems]);

  const handleReset = () => {
    setColumns(defaultColKeys.map((k) => ({ id: uid(), value: k })));
  };

  const handleApply = () => {
    const validCols = columns
      .map((c) => c.value)
      .filter((k) => k && combinedColItems.some((c) => c.key === k));
    const resolvedCols = validCols.length > 0 ? validCols : [...defaultColKeys];

    const colLabels: Record<string, string> = {};
    const colDataTypes: Record<string, string> = {};
    const colOptions: Record<
      string,
      Array<{ value: string; label: string }>
    > = {};

    const settingsKey = taskName
      ? `${workflowName}--${taskName}`
      : workflowName || DEFAULT_WORKFLOW_KEY;
    const settingsColumns: ColumnSetting[] = resolvedCols.map((key, order) => {
      const item = combinedColItems.find((c) => c.key === key);
      const label = item?.label ?? key;
      const dataType = item?.dataType as FieldDataType | undefined;
      colLabels[key] = label;
      if (dataType) colDataTypes[key] = dataType;
      if (item?.options?.length) colOptions[key] = item.options;
      return {
        fieldId: key,
        label,
        visible: true,
        order,
        ...(dataType !== undefined && { dataType }),
        ...(item?.options?.length && { options: item.options }),
      };
    });
    saveUserSettings("TODO_COLUMNS", settingsKey, {
      settings: { columns: settingsColumns },
    });

    onApply(resolvedCols, colLabels, colDataTypes, colOptions);
    message.success("Save successfully");
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setColumns((cols) => {
      const oldIndex = cols.findIndex((c) => c.id === active.id);
      const newIndex = cols.findIndex((c) => c.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return cols;
      return arrayMove(cols, oldIndex, newIndex);
    });
  };

  const handleAddColumn = () => {
    setColumns([...columns, { id: uid(), value: "" }]);
  };

  const handleDeleteColumn = (id: string) => {
    setColumns(columns.filter((c) => c.id !== id));
  };

  const handleColumnChange = (id: string, key: string) => {
    setColumns(columns.map((c) => (c.id === id ? { ...c, value: key } : c)));
  };

  return (
    <Drawer
      title={
        <span className="text-sm font-bold text-gray-800 dark:text-dark-content-title">
          Column Setup
        </span>
      }
      placement="right"
      width={393}
      open={open}
      onClose={onClose}
      getContainer={getContainer}
      mask={false}
      rootClassName="col-setup-drawer"
      push={false}
      styles={{
        body: { overflowY: "auto", padding: "24px" },
        wrapper: { position: "absolute", top: "112px" },
        content: undefined,
      }}
      classNames={{
        content: "dark:!bg-[#262626]",
        header: "dark:!bg-[#262626]",
        footer: "dark:!bg-[#262626]",
      }}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleReset}
            className="rounded-full text-[#00172E] dark:bg-dark-container-layer hover:!dark:bg-dark-container-layer dark:text-[#9AC7F6]"
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={handleApply}
            className="rounded-full text-[#FFF] bg-[#0473EA]"
          >
            Apply
          </Button>
        </div>
      }
    >
      <p
        className="mb-3"
        style={{ color: "#0367D2", fontWeight: 700, fontSize: 12 }}
      >
        Visible (Drag to reorder)
      </p>

      <div>
        <DndContext
          autoScroll={false}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {columns.map((col) => {
              const usedKeys = new Set(
                columns
                  .filter((c) => c.value && c.id !== col.id)
                  .map((c) => c.value)
              );
              const availableOptions = selectOptions.map((group) => ({
                ...group,
                options: group.options.filter(
                  (opt) => !usedKeys.has(opt.value)
                ),
              }));

              return (
                <SortableColumnRow
                  key={col.id}
                  id={col.id}
                  colValue={col.value}
                  availableOptions={availableOptions}
                  onDelete={() => handleDeleteColumn(col.id)}
                  onChange={(val) => handleColumnChange(col.id, val)}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>

      {columns.length < combinedColItems.length && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          className="w-full mt-1 h-10 bg-transparent hover:!bg-transparent"
          style={{
            borderColor: "#CCCCCC",
            color: "#0473EA",
            justifyContent: "flex-start",
          }}
          onClick={handleAddColumn}
        >
          Add Column
        </Button>
      )}
    </Drawer>
  );
};

export default ColSetupDrawer;
