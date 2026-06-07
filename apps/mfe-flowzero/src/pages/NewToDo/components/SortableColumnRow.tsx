import { DeleteOutlined, HolderOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Select } from "antd";
import cn from "classnames";
import React from "react";
import DarkSelect from "src/components/base/DarkSelect";
type SelectOptionGroup = {
  label: string;
  options: { label: string; value: string; fieldType: string }[];
};

export interface SortableColumnRowProps {
  id: string;
  colValue: string;
  availableOptions: SelectOptionGroup[];
  onDelete: () => void;
  onChange: (val: string) => void;
}

const SortableColumnRow: React.FC<SortableColumnRowProps> = ({
  id,
  colValue,
  availableOptions,
  onDelete,
  onChange,
}) => {
  const flatOptions = availableOptions.flatMap((group) => group.options);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : undefined,
      }}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border mb-2 select-none",
        "bg-[#f9f9f9] border-gray-200 hover:shadow-sm",
        "dark:bg-dark-container-layer dark:border-dark-secondary-default"
      )}
    >
      <HolderOutlined
        {...attributes}
        {...listeners}
        className="text-[#035CBB] cursor-grab text-base flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <DarkSelect
          className={cn(
            "w-full",
            "dark:[&_.ant-select-selection-item]:!text-[#ccc]",
            "dark:[&_.ant-select-selection-placeholder]:!text-[#ccc]"
          )}
          showSearch
          allowClear
          placeholder="Select a field"
          value={colValue || undefined}
          optionFilterProp="label"
          options={flatOptions}
          onChange={(val: string) => onChange(val ?? "")}
          optionRender={(option) => (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">{option.label}</span>
              <span className="text-xs text-[#808080] px-1 flex-shrink-0">
                {
                  (
                    option.data as unknown as {
                      fieldType: string;
                    }
                  ).fieldType
                }
              </span>
            </div>
          )}
          popupMatchSelectWidth={false}
          getPopupContainer={(trigger) =>
            trigger.parentElement ?? document.body
          }
        />
      </div>
      <Button
        type="text"
        className={cn(
          "flowzero-iconfont icon-field-trash",
          "text-[#A6A6A6] dark:text-[#595959] bg-white",
          "border-[#CCCCCC] size-8 rounded-full hover:border-[#4F9DF0]",
          "dark:bg-[#262626]",
          "hover:!text-[#A6A6A6] dark:hover:!text-[#595959]",
          "hover:!bg-white dark:hover:!bg-[#262626]"
        )}
        onClick={onDelete}
      />
    </div>
  );
};

export default SortableColumnRow;
