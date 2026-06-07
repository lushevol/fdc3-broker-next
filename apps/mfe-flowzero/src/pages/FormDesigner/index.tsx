import "antd/dist/reset.css";
import "./index.css";

import { CopyOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Button, Input, message, Modal, Skeleton, Space, Tooltip } from "antd";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { FieldEntity, type FormResource, updateForm } from "src/api";
import {
  type FormStatusEnum,
  getFormDetail,
  publishForm as apiPublishForm,
} from "src/api/form/Form";
import { ReactRouterDom } from "src/Root/import";

import {
  DATA_TYPE_COLOR,
  FieldDataType,
  isFieldDataType,
} from "../FieldsManagement/fieldType";
import { Canvas } from "./canvas/Canvas";
import { NodeDragHandle } from "./canvas/NodeDragHandle";
import { toImportedField } from "./components/FieldsImportModal";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { Sidebar } from "./components/Sidebar";
import { DragContext } from "./dragContext";
import { componentDSLs } from "./dsl/components";
import { createFormDocument } from "./dsl/form";
import checkboxIcon from "./images/FormComponent/Checkbox.png";
import containerIcon from "./images/FormComponent/Container.png";
import datePickerIcon from "./images/FormComponent/DatePicker.png";
import dropdownIcon from "./images/FormComponent/Dropdown.png";
import inputBoxIcon from "./images/FormComponent/InputBox.png";
import inputNumberIcon from "./images/FormComponent/InputNumber.png";
import radioIcon from "./images/FormComponent/Radio.png";
import switchIcon from "./images/FormComponent/Switch.png";
import tabIcon from "./images/FormComponent/Tab.png";
import textIcon from "./images/FormComponent/Text.png";
import textAreaIcon from "./images/FormComponent/TextArea.png";
import timePickerIcon from "./images/FormComponent/TimePicker.png";
import titleIcon from "./images/FormComponent/Title.png";
import {
  createDesignerStore,
  DesignerStoreProvider,
  useDesignerStore,
} from "./store";
import { ComponentType, DragData, FormNode, ImportedField } from "./types";

const COMPONENT_ICON_MAP: Partial<Record<ComponentType, string>> = {
  [ComponentType.CONTAINER]: containerIcon,
  [ComponentType.TEXT]: textIcon,
  [ComponentType.TITLE]: titleIcon,
  [ComponentType.TABS]: tabIcon,
  [ComponentType.INPUT]: inputBoxIcon,
  [ComponentType.INPUT_NUMBER]: inputNumberIcon,
  [ComponentType.SELECT]: dropdownIcon,
  [ComponentType.MULTI_SELECT]: dropdownIcon,
  [ComponentType.SWITCH]: switchIcon,
  [ComponentType.RADIO]: radioIcon,
  [ComponentType.CHECKBOX]: checkboxIcon,
  [ComponentType.TEXTAREA]: textAreaIcon,
  [ComponentType.DATE_PICKER]: datePickerIcon,
  [ComponentType.TIME_PICKER]: timePickerIcon,
};

// Context for sharing drag state with Canvas

// Drop animation config for smoother UX
// Disable duration to remove rebound effect
const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
  duration: 0,
};

const findNodeById = (list: FormNode[], id: string): FormNode | null => {
  for (const n of list) {
    if (n.id === id) return n;
    const found = findNodeById(n.children, id);
    if (found) return found;
  }
  return null;
};

const CanvasDragOverlay: React.FC<{ node: FormNode }> = ({ node }) => {
  const iconSrc = COMPONENT_ICON_MAP[node.type];
  const displayName = componentDSLs[node.type]?.displayName ?? node.type;
  return (
    <div className="relative">
      <NodeDragHandle visible displayName={displayName} />
      <div
        className={cn(
          "w-[60px] h-[60px] p-3 bg-white rounded-lg",
          "flex items-center justify-center shadow-xl"
        )}
        style={{ border: "2px solid #035CBB" }}
      >
        {iconSrc ? (
          <img
            src={iconSrc}
            alt={displayName}
            className="w-[36px] h-[36px]"
            draggable={false}
          />
        ) : (
          <span className="text-slate-700 text-xs">{displayName}</span>
        )}
      </div>
    </div>
  );
};

export const FormCraftPage: React.FC = observer(() => {
  const [store] = useState(() => createDesignerStore());
  // store is a fresh instance per mount — prevents cross-navigation state leakage
  return (
    <DesignerStoreProvider store={store}>
      <FormCraftPageInner />
    </DesignerStoreProvider>
  );
});

const FormCraftPageInner: React.FC = observer(() => {
  const store = useDesignerStore();
  const [loading, setLoading] = useState(false);
  const { addNode, moveNode, nodes } = store;
  const { useSearchParams, useNavigate, useLocation } = ReactRouterDom;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo =
    (location.state as { returnTo?: string })?.returnTo ??
    "/flowzero/form-management";
  const from = searchParams.get("from");
  const [activeDragData, setActiveDragData] = useState<DragData | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [overData, setOverData] = useState<any>(null);
  const [overIsTopHalf, setOverIsTopHalf] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatusEnum>("PUBLISHED");
  const [showJsonModal, setShowJsonModal] = useState(false);
  const sidebarIconSrc = activeDragData?.componentType
    ? COMPONENT_ICON_MAP[activeDragData.componentType] ?? null
    : null;

  const activeDragFieldDtConfig = useMemo(() => {
    if (!activeDragData?.fieldId) return null;
    const field = store.importedFields.find(
      (f) => f.id === activeDragData.fieldId
    );
    if (!field) return null;
    const dtKey = isFieldDataType(field.dataType)
      ? (field.dataType as FieldDataType)
      : null;
    return dtKey ? DATA_TYPE_COLOR[dtKey] : null;
  }, [activeDragData, store.importedFields]);

  const activeDragNode = useMemo(
    () =>
      activeDragData?.type === "canvas-item" && activeDragData.id
        ? findNodeById(nodes, activeDragData.id)
        : null,
    [nodes, activeDragData]
  );

  useEffect(() => {
    const rawDetail = searchParams.get("workflowDetail");
    if (!rawDetail) return;
    let parsed: FormResource | null = null;
    try {
      parsed = JSON.parse(decodeURIComponent(rawDetail)) as FormResource;
    } catch (e) {
      console.error("Failed to parse workflowDetail:", e);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const res = await getFormDetail(parsed.id);
        console.log("Form detail:", res);
        setFormStatus(res?.status as FormStatusEnum);
        if (res?.status === "PUBLISHED") {
          setIsPreview(true);
        }
        const rawFields = res.fields || [];
        const mapped = rawFields.map((field) =>
          toImportedField(field as FieldEntity)
        );
        parsed.url = res.url;
        store.setImportedFields(mapped);
        await store.setCurrentForm(parsed);
      } catch (e) {
        console.error("Failed to fetch form detail:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragData(active.data.current as DragData);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Track current drop target for showing placeholder in canvas
    const { over, active } = event;
    if (over) {
      setOverId(over.id as string);
      setOverData(over.data.current);
      // Determine if dragged item center is above or below the over element center
      const translated = active.rect.current.translated;
      if (translated) {
        const activeCenterY = translated.top + translated.height / 2;
        const overCenterY = over.rect.top + over.rect.height / 2;
        setOverIsTopHalf(activeCenterY < overCenterY);
      } else {
        setOverIsTopHalf(false);
      }
    } else {
      setOverId(null);
      setOverData(null);
      setOverIsTopHalf(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Reset drag state
    setActiveDragData(null);
    setOverId(null);
    setOverData(null);
    setOverIsTopHalf(false);

    if (!over) return;

    const activeData = active.data.current as DragData;
    const overData = over.data.current;

    // Scenario 1: Dropping Sidebar Item
    if (activeData?.type === "sidebar-item" && activeData.componentType) {
      let parentId: string | null = null;
      let index: number | undefined = undefined;
      const getInsertIndex = (targetIndex: number) =>
        overIsTopHalf ? targetIndex : targetIndex + 1;

      // Check if dropping into container interior (explicit nesting)
      if (overData?.type === "container-interior") {
        parentId = overData.parentId as string;
        // Append to end of container
      } else if (overData?.isContainer) {
        // Dropping on container border/edge - place as sibling
        const findParentAndIndex = (
          nodes: FormNode[],
          childId: string
        ): { parentId: string | null; index: number } | null => {
          for (const node of nodes) {
            const idx = node.children.findIndex((c) => c.id === childId);
            if (idx !== -1) return { parentId: node.id, index: idx };

            const res = findParentAndIndex(node.children, childId);
            if (res) return res;
          }
          return null;
        };

        // Check root level first
        const rootIdx = nodes.findIndex((n) => n.id === over.id);
        if (rootIdx !== -1) {
          parentId = null;
          index = getInsertIndex(rootIdx);
        } else {
          // Check nested
          const res = findParentAndIndex(nodes, over.id as string);
          if (res) {
            parentId = res.parentId;
            index = getInsertIndex(res.index);
          }
        }
      } else if (over.id === "canvas-droppable") {
        parentId = null; // Root
        index = nodes.length;
      } else {
        // Dropping over a regular item - insert next to it
        const findParentAndIndex = (
          nodes: FormNode[],
          childId: string
        ): { parentId: string | null; index: number } | null => {
          for (const node of nodes) {
            const idx = node.children.findIndex((c) => c.id === childId);
            if (idx !== -1) return { parentId: node.id, index: idx };

            const res = findParentAndIndex(node.children, childId);
            if (res) return res;
          }
          return null;
        };

        // Check root level first
        const rootIdx = nodes.findIndex((n) => n.id === over.id);
        if (rootIdx !== -1) {
          parentId = null;
          index = getInsertIndex(rootIdx);
        } else {
          // Check nested
          const res = findParentAndIndex(nodes, over.id as string);
          if (res) {
            parentId = res.parentId;
            index = getInsertIndex(res.index);
          }
        }
      }

      if (activeData.fieldId) {
        const field = store.importedFields.find(
          (f) => f.id === activeData.fieldId
        );
        if (field) {
          store.addNodeFromImportedField(field, parentId, index);
        }
      } else {
        addNode(activeData.componentType, parentId, index, false);
      }
      return;
    }

    // Scenario 2: Reordering / Moving Canvas Items
    if (activeData?.type === "canvas-item") {
      if (
        active.id !== over.id &&
        !over.id.toString().startsWith(active.id.toString())
      ) {
        const dragData = activeData as DragData;
        moveNode(
          active.id as string,
          over.id as string,
          overData?.type === "container-interior",
          dragData.nodeType,
          !overIsTopHalf
        );
      }
    }
  };

  const saveForm = async () => {
    const document = createFormDocument(nodes, { name: "Form  DSL" });
    const formModel = JSON.stringify(document);
    if (!store.currentForm?.id) {
      message.error("Form detail not found.");
      return false;
    }

    const fieldIds = Array.from(store.getUsedFieldIds());

    try {
      const res = await updateForm({
        id: store.currentForm?.id,
        name: store.currentForm?.name,
        description: store.currentForm?.description,
        formModel,
        fieldIds,
      });
      store.setCurrentForm(res);
      message.success("Save Successfully");
      return true;
    } catch (error) {
      console.error("Save Failed", error);
      message.error("Save Failed");
      return false;
    }
  };

  const publishForm = async () => {
    if (!store.currentForm?.id) {
      message.error("Form detail not found.");
      return;
    }

    try {
      const saveResult = await saveForm(); // Ensure latest changes are saved before publishing
      if (!saveResult) return;
      await apiPublishForm(store.currentForm.id);
      store.setCurrentForm({ ...store.currentForm, status: "PUBLISHED" });
      message.success("Publish Successfully");
    } catch (error) {
      console.error("Publish Failed", error);
      message.error("Publish Failed");
    }
  };

  const confirmPublish = () => {
    Modal.confirm({
      title: "Attention Message",
      icon: <ExclamationCircleFilled style={{ color: "#0473EA" }} />,
      content: "Please confirm to publish the form.",
      okText: "Publish",
      cancelText: "Cancel",
      onOk: publishForm,
    });
  };

  const pageJson = useMemo(() => {
    const payload = createFormDocument(nodes, { name: "FormCraft Pro DSL" });
    return JSON.stringify(payload, null, 2);
  }, [nodes]);

  const copyJsonToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pageJson);
      message.success("JSON copied");
    } catch {
      message.error("Copy failed");
    }
  };

  // Custom collision detection - prioritize pointer for sidebar drag, then interior zones
  const customCollisionDetection = (args: any) => {
    const activeType = args.active?.data?.current?.type;
    const pointerCollisions = pointerWithin(args);

    if (activeType === "sidebar-item") {
      const interiorCollision = pointerCollisions.find((collision: any) =>
        collision.id.toString().endsWith("-interior")
      );
      const siblingCollision = pointerCollisions.find(
        (collision: any) => !collision.id.toString().endsWith("-interior")
      );

      // If pointer is over a sibling that is NOT itself a container, insert next to it.
      // If the sibling is a container, prefer dropping into its interior instead.
      if (siblingCollision) {
        const isContainerNode =
          siblingCollision.data?.droppableContainer?.data?.current?.isContainer;
        if (!isContainerNode) {
          return [siblingCollision];
        }
      }
      if (interiorCollision) {
        return [interiorCollision];
      }
      if (siblingCollision) {
        return [siblingCollision];
      }
      if (pointerCollisions.length > 0) {
        return [pointerCollisions[0]];
      }
    }

    if (activeType === "canvas-item") {
      const activeId = args.active?.id as string;

      // Find which container (if any) currently holds the dragged node
      const findParentId = (list: FormNode[], id: string): string | null => {
        for (const n of list) {
          if (n.children.some((c) => c.id === id)) return n.id;
          const found = findParentId(n.children, id);
          if (found) return found;
        }
        return null;
      };
      const currentParentId = findParentId(nodes, activeId);

      const interiorCollision = pointerCollisions.find((collision: any) =>
        collision.id.toString().endsWith("-interior")
      );

      if (interiorCollision) {
        // Prefer sibling collision for position-aware placement when the sibling is NOT
        // a container. If the sibling IS a container, prefer dropping into its interior
        // (same logic as sidebar-item). Falls back to interior when no sibling is found
        // (e.g., empty padding area at container bottom).
        const siblingCollision = pointerCollisions.find(
          (collision: any) => !collision.id.toString().endsWith("-interior")
        );
        if (siblingCollision) {
          const isContainerNode =
            siblingCollision.data?.droppableContainer?.data?.current
              ?.isContainer;
          if (!isContainerNode) {
            return [siblingCollision];
          }
        }
        return [interiorCollision];
      }

      const siblingCollision = pointerCollisions.find(
        (collision: any) => !collision.id.toString().endsWith("-interior")
      );
      if (siblingCollision) return [siblingCollision];
      if (pointerCollisions.length > 0) return [pointerCollisions[0]];
    }

    return rectIntersection(args);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <DragContext.Provider
        value={{ activeDragData, overId, overData, overIsTopHalf }}
      >
        <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
          {/* Header */}
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between  px-2 z-20">
            <div className="flex items-center gap-2">
              <button
                className="w-10 h-[32px] flex items-center justify-center rounded-[6px] mx-0 transition focus:outline-none"
                type="button"
                onClick={() =>
                  navigate(returnTo, { state: { fromDetail: true } })
                }
              >
                <span className="text-light-input-text dark:text-dark-input-text flowzero-iconfont icon-arrow-chevron-nav-left-backward cursor-pointer" />
              </button>
              <span
                className={cn(
                  "border-l border-[#CCCCCC] dark:border-dark-divide-base h-8"
                )}
              />
              <Tooltip title={store.currentForm?.name}>
                <span
                  className="font-medium text-[14px] mr-[23px] pl-[6px] dark:text-[#BFBFBF] truncate"
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    maxWidth: "1000px",
                  }}
                >
                  {store.currentForm?.name || "Form Designer"}
                </span>
              </Tooltip>
            </div>
            {formStatus !== "PUBLISHED" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  aria-pressed={isPreview}
                  className={cn(
                    "inline-flex h-8 items-center justify-center rounded-full px-2 text-[13px] font-medium",
                    isPreview
                      ? "text-[#0958d9]"
                      : "text-[#1677ff] hover:text-[#0958d9]"
                  )}
                >
                  {isPreview ? "Exit Preview" : "Preview"}
                </button>
                <button
                  onClick={saveForm}
                  disabled={isPreview}
                  aria-disabled={isPreview}
                  className={cn(
                    "inline-flex h-8 items-center justify-center rounded-full px-4 text-[13px] font-medium",
                    isPreview
                      ? "border-[#CCCCCC] border bg-[#e5e5e5] text-[#808080] cursor-not-allowed"
                      : "border border-[#d9d9d9] bg-white text-[#262626] hover:border-[#bfbfbf] hover:bg-[#fafafa]"
                  )}
                >
                  Save
                </button>
                <button
                  onClick={confirmPublish}
                  disabled={isPreview}
                  aria-disabled={isPreview}
                  className={cn(
                    "inline-flex h-8 items-center justify-center rounded-full px-4 text-[13px] font-medium",
                    isPreview
                      ? "bg-[#e5e5e5] text-[#808080] cursor-not-allowed"
                      : "bg-[#1677ff] text-white transition-colors hover:bg-[#0958d9]"
                  )}
                >
                  Publish
                </button>
              </div>
            )}
          </header>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar */}
            {!isPreview && (
              <div className="h-full z-10 shadow-lg shadow-slate-200/50">
                <Sidebar />
              </div>
            )}

            {/* Canvas and Properties Panel as siblings */}
            <main className="flex-1 min-w-0 h-full relative flex flex-col">
              {loading ? (
                <div className="p-8">
                  <Skeleton active paragraph={{ rows: 14 }} />
                </div>
              ) : (
                <Canvas isPreview={isPreview} />
              )}
            </main>
            {/* Properties Panel (now as flex child, not absolutely positioned) */}
            {!isPreview &&
              (store.selectedNodeId || store.showFormInfoEditor) && (
                <div
                  className={cn(
                    "h-full max-w-full flex-shrink-0 z-40 border-l border-slate-200 bg-white overflow-y-auto"
                  )}
                >
                  <PropertiesPanel />
                </div>
              )}
          </div>

          {/* Drag Overlay - Visual feedback during drag */}
          <DragOverlay
            dropAnimation={dropAnimation}
            modifiers={[]}
            style={{ cursor: "grabbing" }}
          >
            {activeDragData?.type === "sidebar-item" &&
            activeDragData.componentType ? (
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-[60px] h-[60px] p-3 bg-white rounded-lg",
                    "flex items-center justify-center shadow-xl"
                  )}
                  style={{ border: "2px solid #035CBB" }}
                >
                  {sidebarIconSrc ? (
                    <img
                      src={sidebarIconSrc}
                      alt={activeDragData.label ?? activeDragData.componentType}
                      className="w-[36px] h-[36px]"
                      draggable={false}
                    />
                  ) : activeDragFieldDtConfig ? (
                    <span
                      className={`flowzero-iconfont ${activeDragFieldDtConfig.icon} text-[36px]`}
                    />
                  ) : (
                    <span className="text-slate-700 text-xs">
                      {activeDragData.label ?? activeDragData.componentType}
                    </span>
                  )}
                </div>
              </div>
            ) : null}
            {activeDragNode ? (
              <CanvasDragOverlay node={activeDragNode} />
            ) : null}
          </DragOverlay>

          <Modal
            open={showJsonModal}
            title="Page JSON Structure"
            width={760}
            onCancel={() => setShowJsonModal(false)}
            footer={[
              <Button
                key="copy"
                icon={<CopyOutlined style={{ fontSize: 16 }} />}
                onClick={copyJsonToClipboard}
              >
                Copy JSON
              </Button>,
              <Button
                key="close"
                type="primary"
                onClick={() => setShowJsonModal(false)}
              >
                Close
              </Button>,
            ]}
          >
            <Space direction="vertical" size={10} style={{ width: "100%" }}>
              <Input.TextArea
                readOnly
                value={pageJson}
                autoSize={{ minRows: 14, maxRows: 20 }}
                styles={{
                  textarea: {
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontSize: 12,
                  },
                }}
              />
            </Space>
          </Modal>
        </div>
      </DragContext.Provider>
    </DndContext>
  );
});

export default FormCraftPage;
