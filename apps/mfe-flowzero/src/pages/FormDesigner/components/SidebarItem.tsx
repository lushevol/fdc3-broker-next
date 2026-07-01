import { useDraggable } from "@dnd-kit/core";
import React from "react";

import { ComponentType } from "../types";

export interface SidebarItemProps {
  dragId: string;
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
}

const itemIconBoxClassName = "flex items-center justify-center text-slate-600";

export const SidebarItem: React.FC<SidebarItemProps> = ({
  dragId,
  type,
  label,
  icon,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    data: {
      type: "sidebar-item",
      componentType: type,
      label,
    },
  });

  const cardStyle = isDragging
    ? {
        opacity: 0.5,
        border: "2px dashed #3b82f6",
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center cursor-grab active:cursor-grabbing"
    >
      <div
        style={cardStyle}
        className="w-[60px] h-[60px] p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:border-blue-400 hover:shadow-sm transition-all"
      >
        <div className={itemIconBoxClassName}>{icon}</div>
      </div>
      <span className="mt-2 text-[10px] font-medium text-[#808080] text-center">
        {label}
      </span>
    </div>
  );
};
