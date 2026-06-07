import { makeAutoObservable, observable } from "mobx";
import React, { createContext, useContext } from "react";
import { getFormModelByFileName } from "src/api";
import type { FormResource } from "src/api/form/Form";

import { DEFAULT_PROPS } from "./dsl/components";
import {
  ComponentProps,
  ComponentType,
  FormNode,
  ImportedField,
} from "./types";

// Simple ID generator
const generateId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

// Helper to recursively add a node
const addNodeRecursively = (
  nodes: FormNode[],
  parentId: string | null,
  newNode: FormNode,
  index?: number
): FormNode[] => {
  if (parentId === null) {
    const newNodes = [...nodes];
    if (index !== undefined && index >= 0) {
      newNodes.splice(index, 0, newNode);
    } else {
      newNodes.push(newNode);
    }
    return newNodes;
  }

  return nodes.map((node) => {
    if (node.id === parentId) {
      const newChildren = [...node.children];
      if (index !== undefined && index >= 0) {
        newChildren.splice(index, 0, newNode);
      } else {
        newChildren.push(newNode);
      }
      return { ...node, children: newChildren };
    }
    if (node.children.length > 0) {
      return {
        ...node,
        children: addNodeRecursively(node.children, parentId, newNode, index),
      };
    }
    return node;
  });
};

// Helper to recursively remove a node
const removeNodeRecursively = (nodes: FormNode[], id: string): FormNode[] => {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: removeNodeRecursively(node.children, id),
    }));
};

// Helper to recursively update a node
const updateNodeRecursively = (
  nodes: FormNode[],
  id: string,
  updates: Partial<FormNode> | Partial<ComponentProps>
): FormNode[] => {
  return nodes.map((node) => {
    if (node.id === id) {
      if ("props" in updates) {
        return { ...node, ...updates };
      }
      if ("type" in updates || "id" in updates) {
        return { ...node, ...updates };
      }
      return { ...node, props: { ...node.props, ...updates } };
    }
    if (node.children.length > 0) {
      return {
        ...node,
        children: updateNodeRecursively(node.children, id, updates),
      };
    }
    return node;
  });
};

// Helper to check if a type is a container
const isContainerType = (type: ComponentType) => {
  return (
    type === ComponentType.CONTAINER ||
    type === ComponentType.TABS ||
    type === ComponentType.TAB_ITEM
  );
};

// Helper to find parent node of a given node
const findParentNode = (nodes: FormNode[], childId: string): string | null => {
  for (const node of nodes) {
    if (node.children.some((child) => child.id === childId)) {
      return node.id;
    }
    if (node.children.length > 0) {
      const found = findParentNode(node.children, childId);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

// Helper to get node by id
const getNodeById = (nodes: FormNode[], id: string): FormNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children.length > 0) {
      const found = getNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

interface NodeLocation {
  node: FormNode;
  parentId: string | null;
  index: number;
}

// Helper to find node location so duplicate can insert right after the source node.
const findNodeLocation = (
  nodes: FormNode[],
  id: string,
  parentId: string | null = null
): NodeLocation | null => {
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];

    if (node.id === id) {
      return { node, parentId, index };
    }

    if (node.children.length > 0) {
      const found = findNodeLocation(node.children, id, node.id);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

// Helper to deep-clone a node tree and assign fresh IDs for all descendants.
const cloneNodeWithNewIds = (node: FormNode): FormNode => {
  return {
    id: generateId(),
    type: node.type,
    props: {
      ...node.props,
      style: node.props.style ? { ...node.props.style } : undefined,
      options: node.props.options?.map((option) => ({ ...option })),
    },
    children: node.children.map((child) => cloneNodeWithNewIds(child)),
  };
};

export class DesignerStore {
  nodes: FormNode[] = [];
  selectedNodeId: string | null = null;
  importedFields: ImportedField[] = [];
  currentForm: FormResource | null = null;
  formValues: Record<string, unknown> = {};
  showFormInfoEditor: boolean = false;

  getUsedFieldIds(): Set<string> {
    const ids = new Set<string>();
    const collect = (nodes: FormNode[]) => {
      for (const node of nodes) {
        if (node.props.bindField) {
          ids.add(node.props.bindField);
        }
        if (node.children.length > 0) {
          collect(node.children);
        }
      }
    };
    collect(this.nodes);
    return ids;
  }

  constructor() {
    makeAutoObservable(
      this,
      {
        // Keep form tree as plain JS objects to avoid React style freeze conflict.
        nodes: observable.ref,
      },
      { autoBind: true }
    );
  }

  async setCurrentForm(form: FormResource | null) {
    this.currentForm = form;
    // If there's a model url, fetch the model and load it into the designer.
    if (!form?.url) return;

    try {
      const res = await getFormModelByFileName(form.url);
      if (res && (res as any).nodes) {
        this.loadForm((res as any).nodes);
      }
    } catch (e) {
      // swallow - caller can show messages if needed
      // eslint-disable-next-line no-console
      console.error("Failed to load form model in store:", e);
    }
  }

  updateCurrentFormInfo(name: string, description?: string) {
    if (!this.currentForm) return;
    this.currentForm = { ...this.currentForm, name, description };
  }

  setImportedFields(fields: ImportedField[]) {
    this.importedFields = fields;
  }

  addNodeFromImportedField(
    field: ImportedField,
    parentId: string | null,
    index?: number
  ) {
    const newNode: FormNode = {
      id: generateId(),
      type: field.componentType,
      props: {
        ...DEFAULT_PROPS[field.componentType],
        bindField: field.id,
        fieldLocked: true,
        indexedTerm: field.indexedTerm,
        label: field.label,
        dataType: field.dataType,
        ...(field.defaultValue !== undefined
          ? { defaultValue: field.defaultValue }
          : {}),
        ...(field.metadata?.length
          ? {
              options: field.metadata.map((m) => ({
                id: m.id,
                label: m.label,
                value: m.value,
                default: m.default,
              })),
            }
          : {}),
      },
      children: [],
    };
    this.nodes = addNodeRecursively(this.nodes, parentId, newNode, index);
  }

  addNode(
    type: ComponentType,
    parentId: string | null,
    index?: number,
    autoSelect = true
  ) {
    const newNode: FormNode = {
      id: generateId(),
      type,
      props: { ...DEFAULT_PROPS[type] },
      children: [],
    };

    // Pre-populate tabs with default items
    if (type === ComponentType.TABS) {
      newNode.children = [
        {
          id: generateId(),
          type: ComponentType.TAB_ITEM,
          props: {
            label: "View 1",
            style: DEFAULT_PROPS[ComponentType.TAB_ITEM].style,
          },
          children: [],
        },
        {
          id: generateId(),
          type: ComponentType.TAB_ITEM,
          props: {
            label: "View 2",
            style: DEFAULT_PROPS[ComponentType.TAB_ITEM].style,
          },
          children: [],
        },
        {
          id: generateId(),
          type: ComponentType.TAB_ITEM,
          props: {
            label: "View 3",
            style: DEFAULT_PROPS[ComponentType.TAB_ITEM].style,
          },
          children: [],
        },
      ];
      newNode.props.defaultTabId = newNode.children[0].id;
    }

    // Auto-set label for TAB_ITEM based on sibling count
    if (type === ComponentType.TAB_ITEM && parentId) {
      const parent = getNodeById(this.nodes, parentId);
      if (parent?.type === ComponentType.TABS) {
        const nextIndex = (parent.children?.length ?? 0) + 1;
        newNode.props.label = `View ${nextIndex}`;
      }
    }

    this.nodes = addNodeRecursively(this.nodes, parentId, newNode, index);
    if (autoSelect) {
      this.selectNode(newNode.id);
    }
  }

  removeNode(id: string) {
    this.nodes = removeNodeRecursively(this.nodes, id);
    if (this.selectedNodeId === id) {
      this.selectedNodeId = null;
    }
  }

  duplicateNode(id: string) {
    const location = findNodeLocation(this.nodes, id);
    if (!location) {
      return;
    }

    const duplicatedNode = cloneNodeWithNewIds(location.node);

    // Strip bindField and label so the duplicate can be independently configured.
    if (duplicatedNode.props.bindField) {
      duplicatedNode.props = {
        ...duplicatedNode.props,
        bindField: undefined,
        label: undefined,
      };
    }

    this.nodes = addNodeRecursively(
      this.nodes,
      location.parentId,
      duplicatedNode,
      location.index + 1
    );
    this.selectNode(duplicatedNode.id);
  }

  updateNode(id: string, updates: Partial<FormNode> | Partial<ComponentProps>) {
    this.nodes = updateNodeRecursively(this.nodes, id, updates);
  }

  setFormValue(nodeId: string, value: unknown) {
    this.formValues = { ...this.formValues, [nodeId]: value };
  }

  clearFormValues() {
    this.formValues = {};
  }

  loadForm(nodes: FormNode[]) {
    this.nodes = nodes;
    this.selectedNodeId = null;
    this.formValues = {};
  }

  selectNode(id: string | null) {
    if (!id) {
      this.selectedNodeId = null;
      this.showFormInfoEditor = false;
      return;
    }

    this.showFormInfoEditor = false;

    // If selecting a TAB_ITEM, select its parent TABS instead
    const node = getNodeById(this.nodes, id);
    if (node?.type === ComponentType.TAB_ITEM) {
      this.selectedNodeId = findParentNode(this.nodes, id);
      return;
    }

    this.selectedNodeId = id;
  }

  setShowFormInfoEditor(val: boolean) {
    if (val) this.selectedNodeId = null;
    this.showFormInfoEditor = val;
  }

  moveNode(
    activeId: string,
    overId: string,
    isInteriorDrop?: boolean,
    _activeNodeType?: ComponentType,
    insertAfter?: boolean
  ) {
    const cloneNodes: FormNode[] = JSON.parse(JSON.stringify(this.nodes));

    const sourceLocation = findNodeLocation(cloneNodes, activeId);
    const targetLocationBeforeRemoval = isInteriorDrop
      ? null
      : findNodeLocation(cloneNodes, overId);

    // 1. Find and remove active node
    let activeNode: FormNode | undefined;

    const findAndRemove = (nodes: FormNode[]): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === activeId) {
          activeNode = nodes[i];
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children && findAndRemove(nodes[i].children)) {
          return true;
        }
      }
      return false;
    };

    findAndRemove(cloneNodes);

    if (!activeNode) {
      return;
    }

    // 2. Find overId and insert
    if (overId === "root" || overId === "canvas-droppable") {
      cloneNodes.push(activeNode);
      this.nodes = cloneNodes;
      return;
    }

    // Handle interior drop (explicit nesting)
    if (isInteriorDrop) {
      // Extract parent ID from interior droppable ID (format: "nodeId-interior")
      const parentId = overId.replace("-interior", "");

      const insertIntoParent = (nodes: FormNode[]): boolean => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === parentId) {
            nodes[i].children.push(activeNode!);
            return true;
          }
          if (nodes[i].children && insertIntoParent(nodes[i].children)) {
            return true;
          }
        }
        return false;
      };

      if (insertIntoParent(cloneNodes)) {
        this.nodes = cloneNodes;
        return;
      }
    }

    // Handle regular drop (sibling placement)
    const targetLocation = targetLocationBeforeRemoval;
    if (targetLocation) {
      // Insert activeNode at the given index, clamped to [0, nodes.length] to prevent out-of-bounds
      const insertInto = (nodes: FormNode[], index: number) => {
        const boundedIndex = Math.max(0, Math.min(index, nodes.length));
        nodes.splice(boundedIndex, 0, activeNode!);
      };

      // True when source and target share the same parent (same-level drag)
      const isSameList = sourceLocation?.parentId === targetLocation.parentId;

      // Determine whether to insert after the target:
      // - Same list: source index < target index means moving downward → insert after
      // - Cross-list: honour the caller-supplied insertAfter flag (default: before)
      const effectiveInsertAfter = isSameList
        ? sourceLocation!.index < targetLocation.index
        : insertAfter ?? false;

      // Compute the desired insertion index relative to the pre-removal snapshot
      const insertBeforeRemoval = effectiveInsertAfter
        ? targetLocation.index + 1
        : targetLocation.index;

      // When dragging within the same list and the source sits before the insertion
      // point, the removal of the source shifts every subsequent index down by 1,
      // so subtract 1 to compensate
      const shouldAdjustForSameList =
        sourceLocation?.parentId === targetLocation.parentId &&
        sourceLocation.index < insertBeforeRemoval;
      const insertIndex = shouldAdjustForSameList
        ? insertBeforeRemoval - 1
        : insertBeforeRemoval;

      if (targetLocation.parentId === null) {
        // Target is at the root level — insert directly into the root array
        insertInto(cloneNodes, insertIndex);
      } else {
        // Target lives inside a container — locate the parent and insert into its children
        const targetParent = getNodeById(cloneNodes, targetLocation.parentId);
        if (targetParent) {
          insertInto(targetParent.children, insertIndex);
        } else {
          // Unexpected: parent node missing — fall back to appending at root
          cloneNodes.push(activeNode);
        }
      }
    } else {
      // Fallback: add to root if not found
      cloneNodes.push(activeNode);
    }

    this.nodes = cloneNodes;
  }
}

// Factory for creating non-singleton instances
export const createDesignerStore = () => new DesignerStore();

// Context for providing a scoped store instance
export const DesignerStoreContext = createContext<DesignerStore | null>(null);

export const DesignerStoreProvider: React.FC<{
  store: DesignerStore;
  children: React.ReactNode;
}> = ({ store, children }) =>
  React.createElement(
    DesignerStoreContext.Provider,
    { value: store },
    children
  );

// Singleton fallback for standalone usage
const designerStore = new DesignerStore();

// Prefer context-provided instance; fall back to singleton
export const useDesignerStore = () => {
  const ctx = useContext(DesignerStoreContext);
  return ctx ?? designerStore;
};
