import {
  CopyOutlined,
  DeleteOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import cn from "classnames";
import React from "react";

type SortableListeners = ReturnType<typeof useSortable>["listeners"];

export interface NodeActionsProps {
  visible: boolean;
  displayName: string;
  listeners: SortableListeners;
  canDuplicate?: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const NodeActions: React.FC<NodeActionsProps> = ({
  visible,
  displayName,
  listeners,
  canDuplicate = true,
  onDuplicate,
  onDelete,
}) => (
  <div
    className={cn(
      "absolute -bottom-[28px] right-0 flex items-center gap-[6px] transition-opacity",
      visible
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    )}
    onMouseDown={(e) => e.stopPropagation()}
    onTouchStart={(e) => e.stopPropagation()}
  >
    {/* <button
      type="button"
      {...listeners}
      onClick={(e) => e.preventDefault()}
      onMouseDown={(e) => {
        e.stopPropagation();
        listeners?.onMouseDown?.(e);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        listeners?.onTouchStart?.(e);
      }}
      className={cn(
        "flex items-center gap-1 rounded-md border border-blue-500 bg-blue-600 px-2 py-1",
        "text-xs font-medium text-white shadow-lg cursor-grab active:cursor-grabbing whitespace-nowrap",
        "transition-colors hover:bg-blue-700"
      )}
      title="Drag component"
    >
      <HolderOutlined style={{ fontSize: 12 }} />
      <span>{displayName}</span>
    </button> */}
    {canDuplicate && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        className={cn(
          "flex items-center gap-1 rounded-md border border-blue-500 bg-blue-600 px-2 py-1",
          "text-xs font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
        )}
        title="Duplicate component"
      >
        <CopyOutlined style={{ fontSize: 12 }} />
        <span>Duplicate</span>
      </button>
    )}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className={cn(
        "flex items-center gap-1 rounded-md border border-blue-500 bg-blue-600 px-2 py-1",
        "text-xs font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
      )}
      title="Delete component"
    >
      <DeleteOutlined style={{ fontSize: 12 }} />
      <span>Delete</span>
    </button>
  </div>
);
