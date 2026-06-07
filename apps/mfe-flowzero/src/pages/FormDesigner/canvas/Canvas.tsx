import { PlusOutlined } from "@ant-design/icons";
import { useDroppable } from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";

import { FormElementRenderer } from "../components/FormElements";
import { useDragContext } from "../dragContext";
import { componentDSLs } from "../dsl/components";
import emptyCanvasImage from "../images/emptyCanvas.png";
import { useDesignerStore } from "../store";
import { ComponentType, FormNode } from "../types";
import { NodeActions } from "./NodeActions";
import { NodeDragHandle } from "./NodeDragHandle";

// Drag Placeholder Component - shows where the component will be placed
const DragPlaceholder: React.FC<{ isInterior?: boolean }> = ({
  isInterior,
}) => (
  <div
    className={cn(
      "my-3 rounded-lg border-2 border-dashed transition-all animate-pulse border-blue-400 bg-blue-50/50"
    )}
  >
    <div
      className={cn(
        "flex items-center justify-center text-slate-400",
        isInterior ? "min-h-[60px]" : "min-h-[80px]"
      )}
    >
      <PlusOutlined
        className={cn("mr-2", "text-blue-400")}
        style={{ fontSize: 20 }}
      />
      <span className="text-sm font-medium leading-[60px]">Drop here</span>
    </div>
  </div>
);

interface SortableNodeProps {
  node: FormNode;
  isSelected: boolean;
  isPreview: boolean;
  hoveredNodeId: string | null;
  setHoveredNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  onClick: (e: React.MouseEvent) => void;
  /** ID of the parent container, null for root-level nodes */
  parentId?: string | null;
  /** IDs of sibling nodes at the same level */
  siblingIds?: string[];
}

const SortableNode: React.FC<SortableNodeProps> = ({
  node,
  isSelected,
  isPreview,
  hoveredNodeId,
  setHoveredNodeId,
  onClick,
  parentId = null,
  siblingIds = [],
}) => {
  const { activeDragData, overId, overData, overIsTopHalf } = useDragContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: node.id,
    data: {
      type: "canvas-item",
      id: node.id,
      nodeType: node.type,
      // Pass children info to help drag handling determine if this is a container
      isContainer:
        node.type === ComponentType.CONTAINER ||
        node.type === ComponentType.TABS ||
        node.type === ComponentType.TAB_ITEM,
    },
    disabled: isPreview,
  });

  // Tabs specific state
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const isTabs = node.type === ComponentType.TABS;

  // Add a separate droppable for container interior.
  // For TABS, direct interior drops to the currently active tab's interior so dropped items land inside the tab content.
  const activeTabForDroppable = isTabs
    ? activeTabId ?? node.children[0]?.id ?? node.id
    : node.id;
  const droppableId = `${activeTabForDroppable}-interior`;
  const { setNodeRef: setDroppableRef, isOver: isOverInterior } = useDroppable({
    id: droppableId,
    data: {
      type: "container-interior",
      parentId: activeTabForDroppable,
      nodeType: isTabs ? ComponentType.TAB_ITEM : node.type,
    },
    disabled: isPreview,
  });

  const { duplicateNode, removeNode, selectNode, selectedNodeId } =
    useDesignerStore();

  const hoverTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Initialize active tab if needed
  const prevDefaultTabIdRef = React.useRef<string | undefined>(undefined);
  useEffect(() => {
    if (node.type === ComponentType.TABS && node.children.length > 0) {
      const childIds = node.children.map((c) => c.id);
      const preferredDefaultTabId = node.props.defaultTabId;
      const defaultTabIdChanged =
        preferredDefaultTabId !== prevDefaultTabIdRef.current;
      prevDefaultTabIdRef.current = preferredDefaultTabId;

      setActiveTabId((current) => {
        // No active tab or active tab was removed → reset to fallback
        if (!current || !childIds.includes(current)) {
          return preferredDefaultTabId &&
            childIds.includes(preferredDefaultTabId)
            ? preferredDefaultTabId
            : node.children[0].id;
        }
        // defaultTabId was explicitly changed in the designer → sync to it
        if (
          defaultTabIdChanged &&
          preferredDefaultTabId &&
          childIds.includes(preferredDefaultTabId)
        ) {
          return preferredDefaultTabId;
        }
        return current;
      });
    }
  }, [node.type, node.children, node.props.defaultTabId]); // eslint-disable-line react-hooks/exhaustive-deps

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  const isSidebarDragging =
    !isPreview && activeDragData?.type === "sidebar-item";
  const isCanvasDragging = !isPreview && activeDragData?.type === "canvas-item";
  const isAnyDragging = isSidebarDragging || isCanvasDragging;
  const showDragOutline = isAnyDragging && !isSelected;

  const isContainer =
    node.type === ComponentType.CONTAINER ||
    node.type === ComponentType.TAB_ITEM;
  const isPlainContainer = node.type === ComponentType.CONTAINER;

  // For DnD sorting, only the active tab's children are sortable
  const visibleChildren = useMemo(() => {
    if (isTabs) {
      const activeTab =
        node.children.find((c) => c.id === activeTabId) || node.children[0];
      return activeTab ? activeTab.children : [];
    }
    return node.children;
  }, [isTabs, node.children, activeTabId]);

  // For rendering, always mount all tabs' children to preserve form state
  const allTabsChildren = useMemo(() => {
    if (!isTabs) return null;
    return node.children.map((tab) => ({
      tabId: tab.id,
      children: tab.children,
      isActive: tab.id === (activeTabId || node.children[0]?.id),
    }));
  }, [isTabs, node.children, activeTabId]);

  // Calculate Grid Style
  const columns = node.props.columns || 1;
  const gap = isPlainContainer ? 0 : node.props.gap || 16;

  // Only apply grid to containers (Container, TabItem). Tabs component wrapper doesn't need grid usually.
  const showGrid = isContainer && columns > 1;

  const containerStyle = useMemo(() => {
    if (showGrid) {
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      } as React.CSSProperties;
    }
    return undefined;
  }, [showGrid, columns, gap]);

  // Switch strategy based on layout
  const sortingStrategy = showGrid
    ? rectSortingStrategy
    : verticalListSortingStrategy;

  if (isDragging) {
    // For root-level nodes: canvas-droppable means "end of canvas" — handled by
    // showCanvasPlaceholder, so exclude it from "same container" to avoid double indicator.
    // For nested nodes: the interior ID is what marks "same container".
    const myContainerInteriorId =
      parentId != null ? `${parentId}-interior` : null;
    const isOverMyContainer =
      !overId ||
      (myContainerInteriorId !== null && overId === myContainerInteriorId) ||
      siblingIds.includes(overId as string);

    // Use `invisible` (visibility:hidden) when outside container so layout is
    // preserved (no shift) but no visual placeholder is shown in container A.
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(!isOverMyContainer && "invisible")}
      >
        <DragPlaceholder isInterior={parentId != null} />
      </div>
    );
  }

  const selectedBorderCls = "border-blue-500 ring-1 ring-blue-500";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative mx-[4px] rounded-[6px] transition-all",
        isPlainContainer ? "bg-white" : "bg-white",
        isPreview
          ? "border-0 shadow-none cursor-default"
          : " cursor-grab active:cursor-grabbing",
        !isPreview && isSelected ? `${selectedBorderCls} z-[99]` : "",
        !isPreview && !isSelected && hoveredNodeId === node.id
          ? `${selectedBorderCls} z-[101]`
          : "",
        !isPreview && !isSelected ? "border-transparent" : "",
        showDragOutline &&
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-dashed before:border-sky-300/80 before:content-['']"
      )}
      onClick={(e) => {
        if (isPreview) {
          return;
        }
        e.stopPropagation();
        onClick(e);
      }}
      {...(!isPreview ? attributes : {})}
      // Critical: Stop propagation to prevent event bubbling to parent nodes
      onMouseDown={(e) => {
        if (isPreview) {
          return;
        }
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        if (isPreview) {
          return;
        }
        e.stopPropagation();
      }}
      onMouseMove={(e) => {
        if (isPreview || isAnyDragging) {
          return;
        }
        e.stopPropagation();
        if (hoverTimerRef.current) return;
        hoverTimerRef.current = setTimeout(() => {
          hoverTimerRef.current = null;
          setHoveredNodeId(node.id);
        }, 150);
      }}
      onMouseLeave={(e) => {
        if (isPreview || isAnyDragging) {
          return;
        }
        e.stopPropagation();
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }
        setHoveredNodeId((current) => (current === node.id ? null : current));
      }}
    >
      {/* Content */}
      <div className="p-[4px] m-[4px] relative">
        <FormElementRenderer
          type={node.type}
          props={node.props}
          node={node}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
          isPreview={isPreview}
        >
          {(isContainer || isTabs) && (
            <SortableContext
              items={visibleChildren.map((c) => c.id)}
              strategy={sortingStrategy}
            >
              <div
                className={cn(
                  "w-full transition-colors rounded relative",
                  !isTabs ? "min-h-[50px]" : "min-h-[80px]"
                )}
                style={containerStyle}
              >
                {/* Interior droppable zone - show placeholder when dragging */}
                {!isPreview &&
                  (visibleChildren.length === 0 ? (
                    <div
                      ref={setDroppableRef}
                      className={cn(
                        "absolute inset-0  transition-all min-h-[30px]",
                        isOverInterior
                          ? "ring-2 ring-inset ring-blue-400 bg-blue-50/50 border-1 border-dashed border-blue-400"
                          : activeDragData
                          ? "border-1 border-dashed border-blue-300 bg-blue-50/20"
                          : ""
                      )}
                    />
                  ) : (
                    /* When has children, show a full-area drop zone for easier dropping */
                    <div
                      ref={setDroppableRef}
                      className={cn(
                        "absolute inset-0 rounded-lg transition-all pointer-events-auto z-0",
                        isOverInterior &&
                          "ring-2 ring-inset ring-blue-400 bg-blue-50/30"
                      )}
                    />
                  ))}
                {isTabs && allTabsChildren
                  ? allTabsChildren.map(
                      ({ tabId, children: tabChildren, isActive }) => (
                        <div
                          key={tabId}
                          style={{ display: isActive ? undefined : "none" }}
                        >
                          {tabChildren.map((child) => {
                            // Show placeholder for sidebar-item drags, and for canvas-item drags that
                            // originate from a *different* container (cross-container reorder).
                            const isCrossContainerCanvasDrag =
                              activeDragData?.type === "canvas-item" &&
                              !tabChildren.some(
                                (c) => c.id === activeDragData?.id
                              );
                            const showChildPlaceholder =
                              !isPreview &&
                              (activeDragData?.type === "sidebar-item" ||
                                isCrossContainerCanvasDrag) &&
                              overId === child.id &&
                              !overData?.type?.includes("interior");
                            return (
                              <React.Fragment key={child.id}>
                                {showChildPlaceholder && overIsTopHalf && (
                                  <div className="relative z-10 col-span-full">
                                    <DragPlaceholder isInterior />
                                  </div>
                                )}
                                <div className="relative z-99">
                                  <SortableNode
                                    node={child}
                                    parentId={tabId}
                                    siblingIds={tabChildren.map((c) => c.id)}
                                    isSelected={selectedNodeId === child.id}
                                    isPreview={isPreview}
                                    hoveredNodeId={hoveredNodeId}
                                    setHoveredNodeId={setHoveredNodeId}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      selectNode(child.id);
                                    }}
                                  />
                                </div>
                                {showChildPlaceholder && !overIsTopHalf && (
                                  <div className="relative z-10 col-span-full">
                                    <DragPlaceholder isInterior />
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      )
                    )
                  : visibleChildren.map((child) => {
                      // Show placeholder for sidebar-item drags, and for canvas-item drags that
                      // originate from a *different* container (cross-container reorder).
                      const isCrossContainerCanvasDrag =
                        activeDragData?.type === "canvas-item" &&
                        !visibleChildren.some(
                          (c) => c.id === activeDragData?.id
                        );
                      const showChildPlaceholder =
                        !isPreview &&
                        (activeDragData?.type === "sidebar-item" ||
                          isCrossContainerCanvasDrag) &&
                        overId === child.id &&
                        !overData?.type?.includes("interior");
                      return (
                        <React.Fragment key={child.id}>
                          {showChildPlaceholder && overIsTopHalf && (
                            <div className="relative z-10 col-span-full">
                              <DragPlaceholder isInterior />
                            </div>
                          )}
                          <div className="relative z-99">
                            <SortableNode
                              node={child}
                              parentId={node.id}
                              siblingIds={visibleChildren.map((c) => c.id)}
                              isSelected={selectedNodeId === child.id}
                              isPreview={isPreview}
                              hoveredNodeId={hoveredNodeId}
                              setHoveredNodeId={setHoveredNodeId}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectNode(child.id);
                              }}
                            />
                          </div>
                          {showChildPlaceholder && !overIsTopHalf && (
                            <div className="relative z-10 col-span-full">
                              <DragPlaceholder isInterior />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}

                {/* Show placeholder at the end when hovering interior - AFTER all children */}
                {!isPreview &&
                  visibleChildren.length > 0 &&
                  (activeDragData?.type === "sidebar-item" ||
                    activeDragData?.type === "canvas-item") &&
                  isOverInterior && (
                    <div className="relative z-10 col-span-full">
                      <DragPlaceholder isInterior />
                    </div>
                  )}
              </div>
            </SortableContext>
          )}
        </FormElementRenderer>
      </div>

      {/* Drag Handle - shows on hover */}
      {!isPreview && (
        <NodeDragHandle
          visible={hoveredNodeId === node.id}
          displayName={componentDSLs[node.type]?.displayName ?? node.type}
          listeners={listeners}
        />
      )}

      {/* Actions - shows when selected */}
      {!isPreview && (
        <NodeActions
          visible={isSelected}
          displayName={componentDSLs[node.type]?.displayName ?? node.type}
          listeners={listeners}
          canDuplicate={!node.props.fieldLocked}
          onDuplicate={() => duplicateNode(node.id)}
          onDelete={() => removeNode(node.id)}
        />
      )}
    </div>
  );
};

interface CanvasProps {
  isPreview?: boolean;
  plain?: boolean;
}

export const Canvas: React.FC<CanvasProps> = observer(
  ({ isPreview = false, plain = false }) => {
    const { nodes, selectedNodeId, selectNode, setShowFormInfoEditor } =
      useDesignerStore();
    const { activeDragData, overId, overData, overIsTopHalf } =
      useDragContext();
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    // Clear hover state when any drag starts; lock cursor globally while dragging
    useEffect(() => {
      if (activeDragData) {
        setHoveredNodeId(null);
        document.body.classList.add("is-dragging");
      } else {
        document.body.classList.remove("is-dragging");
      }
      return () => {
        document.body.classList.remove("is-dragging");
      };
    }, [activeDragData]);
    const { setNodeRef, isOver } = useDroppable({
      id: "canvas-droppable",
      data: {
        type: "canvas",
      },
      disabled: isPreview,
    });

    // Show placeholder when dragging to empty canvas or at the end
    const showCanvasPlaceholder =
      !isPreview &&
      (activeDragData?.type === "sidebar-item" ||
        activeDragData?.type === "canvas-item") &&
      overId === "canvas-droppable";

    return (
      <div
        className={cn(
          plain ? "" : "flex-1 h-full",
          plain
            ? "w-full"
            : cn(
                "p-[36px]",
                "bg-[#e5e5e5]",
                "flowzero-custom-scrollbar overflow-y-auto",
                !isPreview ? "overflow-x-auto" : ""
              )
        )}
        style={
          plain
            ? undefined
            : {
                backgroundImage:
                  "radial-gradient(circle, #b0b7c3 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }
        }
        onClick={() => {
          if (!isPreview) {
            selectNode(null);
            setShowFormInfoEditor(true);
          }
        }}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        <div
          className={cn(
            plain ? "w-full" : !isPreview ? "min-w-[1000px]" : "w-full",
            plain
              ? "border-2 border-[#e4e4e4] rounded-[8px] shadow-sm overflow-hidden"
              : "border-light-divide-base rounded-[6px] border"
          )}
        >
          <div
            ref={setNodeRef}
            className={cn(
              plain
                ? "transition-colors bg-white rounded-[8px] px-[24px] py-[24px] overflow-x-auto"
                : cn(
                    "min-h-[668px] rounded-[6px] transition-colors px-[12px] py-[8px] border bg-[#F2F2F2]",
                    isOver
                      ? "border-blue-400 bg-blue-50/30"
                      : "border-slate-200"
                  )
            )}
          >
            {nodes.length === 0 && !isOver && !showCanvasPlaceholder && (
              <div className="flex h-full items-center justify-center">
                <div className="w-full mx-[74px] my-[76px] rounded-2xl border-2 border-dashed border-slate-300 px-8 py-12">
                  <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
                    <img
                      src={emptyCanvasImage}
                      alt="Empty canvas illustration"
                      className="mb-[13px] w-[428px] h-[285px] max-w-full select-none"
                      draggable={false}
                    />
                    <p className="text-[22px] font-[700] h-[38px] leading-[38px] text-light-content-title">
                      This space is your blank canvas
                    </p>
                    <p className="text-[18px] font-normal leading-[26px] h-[26px] text-light-content-body">
                      Please drag and drop elements from the left panel here.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Show placeholder at the start of canvas when empty and dragging */}
            {nodes.length === 0 && showCanvasPlaceholder && <DragPlaceholder />}

            <SortableContext
              items={nodes.map((n) => n.id)}
              strategy={verticalListSortingStrategy}
            >
              {nodes.map((node) => {
                // Show placeholder for sidebar-item drags, and for canvas-item drags that
                // originate from inside a container (cross-level drop onto a root node).
                const isCrossLevelCanvasDrag =
                  activeDragData?.type === "canvas-item" &&
                  !nodes.some((n) => n.id === activeDragData?.id);
                const showNodePlaceholder =
                  !isPreview &&
                  (activeDragData?.type === "sidebar-item" ||
                    isCrossLevelCanvasDrag) &&
                  overId === node.id &&
                  !overData?.type?.includes("interior");
                return (
                  <React.Fragment key={node.id}>
                    {showNodePlaceholder && overIsTopHalf && (
                      <DragPlaceholder />
                    )}
                    <SortableNode
                      node={node}
                      parentId={null}
                      siblingIds={nodes.map((n) => n.id)}
                      isSelected={selectedNodeId === node.id}
                      isPreview={isPreview}
                      hoveredNodeId={hoveredNodeId}
                      setHoveredNodeId={setHoveredNodeId}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectNode(node.id);
                      }}
                    />
                    {showNodePlaceholder && !overIsTopHalf && (
                      <DragPlaceholder />
                    )}
                  </React.Fragment>
                );
              })}
            </SortableContext>

            {/* Show placeholder at the end of canvas when has nodes and dragging */}
            {nodes.length > 0 && showCanvasPlaceholder && <DragPlaceholder />}
          </div>
        </div>
      </div>
    );
  }
);
