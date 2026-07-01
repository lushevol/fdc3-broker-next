import { HolderOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";

type SortableListeners = ReturnType<typeof useSortable>["listeners"];

export interface NodeDragHandleProps {
  visible: boolean;
  displayName: string;
  listeners?: SortableListeners;
}

export const NodeDragHandle: React.FC<NodeDragHandleProps> = ({
  visible,
  displayName,
  listeners,
}) => {
  const [debouncedVisible, setDebouncedVisible] = useState(visible);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      // Show immediately and cancel any pending hide
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setDebouncedVisible(true);
    } else {
      // Delay hide to give the mouse time to move onto the handle
      hideTimerRef.current = setTimeout(() => {
        hideTimerRef.current = null;
        setDebouncedVisible(false);
      }, 120);
    }

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [visible]);

  return (
    <div
      className={cn(
        "absolute -top-[28px] left-0 z-99 transition-opacity",
        debouncedVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      {...listeners}
      onPointerDown={(e) => {
        e.stopPropagation();
        listeners?.onPointerDown?.(e);
      }}
    >
      <div
        className={cn(
          "flex items-center gap-1 rounded-md border border-blue-500 bg-blue-600 px-2 py-1",
          "text-xs font-medium text-white shadow-lg whitespace-nowrap",
          "cursor-grab select-none touch-none active:cursor-grabbing transition-colors hover:bg-blue-700"
        )}
      >
        <HolderOutlined style={{ fontSize: 12 }} />
        <span>{displayName}</span>
      </div>
      <div className="w-[100px] h-[2px] bg-transparent"></div>
    </div>
  );
};
