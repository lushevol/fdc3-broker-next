import React from "react";

import { mergeCn } from "./common";
import { ElementRendererProps } from "./types";

export const TabsElement: React.FC<ElementRendererProps> = ({
  props,
  children,
  node,
  activeTabId,
  onTabChange,
}) => {
  const { style, className } = props;

  return (
    <div style={style} className={mergeCn("flex flex-col", className)}>
      <div className="flex border-b border-slate-200 bg-slate-50/50 rounded-t-lg overflow-x-auto">
        {node?.children.map((child, index) => (
          <button
            key={child.id}
            onClick={(e) => {
              e.stopPropagation();
              onTabChange?.(child.id);
            }}
            className={mergeCn(
              "px-4 py-3 text-sm font-medium transition-colors focus:outline-none border-b-2 whitespace-nowrap",
              activeTabId === child.id
                ? "border-blue-500 text-blue-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
            )}
          >
            {child.props.label || `View ${index + 1}`}
          </button>
        ))}
      </div>
      <div className="p-1 min-h-[100px]">
        {children}
        {(!children || (Array.isArray(children) && children.length === 0)) && (
          <div className="text-slate-300 text-center py-8 text-sm italic">
            No tabs
          </div>
        )}
      </div>
    </div>
  );
};
