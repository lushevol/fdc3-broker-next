import "@xyflow/react/dist/style.css";

import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { message } from "antd";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { getBpmnDetail } from "src/api/index";
import CanvasControls from "src/components/CanvasControls";
import { EdgeHoverProvider } from "src/context/EdgeHoverContext";
import { useWorkflowDesignerContext } from "src/pages/workflow/viewModel/WorkflowDesignerProvider";
import type { WorkflowEntity } from "src/pages/workflow/viewModel/WorkflowDesignerStore";
import { ReactRouterDom } from "src/Root/import";
import { BpmnService } from "src/service/BpmnService";

import { WorkflowNodeFactory } from "../../model/utils/WorkflowNodeFactory";
import { WorkflowNodeType } from "../../types/nodeTypes";
import { IWorkflowMap } from "../../viewModel/IWorkflowMap";
import { NodeFactory } from "../factory/NodeFactory";
import { AbstractNodeWrapper } from "./AbstractNodeWrapper";
import LabeledEdge from "./LabeledEdge";
import BaseNode, { BaseNodeHandle } from "./nodeLayout/BaseLayout";

// Map handle metadata stored on node.data.handlesMeta -> visual BaseNodeHandle[]
const mapHandlesMetaToVisual = (
  handlesMeta: any[] = [],
  nodeType?: string
): BaseNodeHandle[] => {
  const isInclusiveGateway = nodeType === WorkflowNodeType.INCLUSIVE_GATEWAY;
  let sourceIndex = 0;
  return (handlesMeta || []).map((h) => {
    const type = h.role === "target" ? "target" : "source";
    let position: Position;
    if (h.role === "target") {
      position = Position.Left;
    } else {
      // For Inclusive Gateway: first 2 sources on Right, 3rd+ on Bottom
      if (isInclusiveGateway && sourceIndex >= 2) {
        position = Position.Bottom;
      } else {
        position = Position.Right;
      }
      sourceIndex++;
    }
    return {
      id: h.id,
      type,
      position,
      label: h.label,
      style: h.style || { width: 14, height: 14, background: "#808080" },
    } as BaseNodeHandle;
  });
};

// Get default handles for a node type by instantiating its entity and reading handlesMeta.
// This ensures handles are always driven by entity definitions, not hardcoded.
const getHandlesForNodeType = (
  nodeId: string,
  type: WorkflowNodeType
): BaseNodeHandle[] => {
  const entity = WorkflowNodeFactory.createFromReactFlowNode({
    id: nodeId,
    type,
    position: { x: 0, y: 0 },
    data: {},
  });
  if (entity) {
    const handlesMeta = (entity.data as any).handlesMeta || [];
    return mapHandlesMetaToVisual(handlesMeta, type);
  }
  return [];
};

// Dynamically build nodeTypes from NodeFactory with onDelete injection
const buildNodeTypes = (handleDeleteNode: (nodeId: string) => void) => {
  const types: Record<string, FC<any>> = {};
  const supportedTypes = NodeFactory.getSupportedTypes();
  supportedTypes.forEach((type) => {
    const LayoutComponent = NodeFactory.getNodeLayoutByType(type);
    if (LayoutComponent) {
      types[type] = (props: any) => {
        // Priority: handlesMeta (most up-to-date, from entity/BPMN import) > pre-mapped handles > entity defaults
        const handles = props?.data?.handlesMeta
          ? mapHandlesMetaToVisual(props.data.handlesMeta, type)
          : props?.data?.handles ||
            getHandlesForNodeType(props.id, type as WorkflowNodeType);
        return (
          <BaseNode
            data={props.data}
            nodeId={props.id}
            handles={handles}
            type={type}
          >
            <LayoutComponent
              {...props}
              onDelete={(nodeId?: string) => {
                if (nodeId) handleDeleteNode(nodeId);
              }}
              nodeId={props.id}
            />
          </BaseNode>
        );
      };
    }
  });

  return types;
};

interface ReactFlowCanvasProps extends IWorkflowMap {
  onPropertiesPanelOpen?: (panelComponent: FC<any>, nodeId: string) => void;
  onNodeSelect?: (nodeId: string) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  updateTrigger?: number;
}

class ConcreteNodeWrapper<T = any> extends AbstractNodeWrapper<T> {
  private onPropertiesPanelOpen?: (
    panelComponent: FC<any>,
    nodeId: string
  ) => void;
  private onNodeSelect?: (nodeId: string) => void;
  private nodeId: string;

  constructor(
    nodeFactory: NodeFactory,
    nodeEntity: any,
    nodeId: string,
    callbacks?: {
      onPropertiesPanelOpen?: (panelComponent: FC<any>, nodeId: string) => void;
      onNodeSelect?: (nodeId: string) => void;
    }
  ) {
    super(nodeFactory, nodeEntity);
    this.nodeId = nodeId;
    this.onPropertiesPanelOpen = callbacks?.onPropertiesPanelOpen;
    this.onNodeSelect = callbacks?.onNodeSelect;
  }

  protected handleOpenPropertiesPanel(panelComponent: FC<any>): void {
    if (this.onPropertiesPanelOpen) {
      this.onPropertiesPanelOpen(panelComponent, this.nodeId);
    }
  }

  protected handleNodeClick(): void {
    if (this.onNodeSelect) {
      this.onNodeSelect(this.nodeId);
    }
  }

  getNodeId(): string {
    return this.nodeId;
  }
}
const edgeTypes = {
  default: LabeledEdge,
  labeled: LabeledEdge,
};
export const ReactFlowCanvas: FC<ReactFlowCanvasProps> = ({
  nodes,
  edges,
  onPropertiesPanelOpen,
  onNodeSelect,
  onNodeClick,
  updateTrigger = 0,
}) => {
  const { useSearchParams } = ReactRouterDom;
  const [searchParams] = useSearchParams();

  // Get route parameters
  const workflowDetail = useMemo(() => {
    const detailParam = searchParams.get("workflowDetail");
    return detailParam ? JSON.parse(detailParam) : null;
  }, [searchParams]);
  const FROM = searchParams.get("from");

  const { workflowDesignerStore: store } = useWorkflowDesignerContext();
  const nodeFactory = useMemo(() => new NodeFactory(), []);
  const { screenToFlowPosition } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  // Handle node deletion
  const [Nodes, setNodes, baseOnNodesChange] = useNodesState<any>([]);
  const [Edges, setEdges, baseOnEdgesChange] = useEdgesState<any>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Custom onNodesChange that syncs to store
  const onNodesChange = useCallback(
    (changes: any) => {
      baseOnNodesChange(changes);
      // Sync to store after state update
      if (store?.workflowMap) {
        store.workflowMap.nodes = Nodes as any;
      }
    },
    [baseOnNodesChange, store, Nodes]
  );

  // Custom onEdgesChange that syncs to store
  const onEdgesChange = useCallback(
    (changes: any) => {
      baseOnEdgesChange(changes);
      // Sync to store after state update
      setEdges((currentEdges) => {
        if (store?.workflowMap) {
          store.workflowMap.edges = currentEdges as any;
        }
        return currentEdges;
      });
    },
    [baseOnEdgesChange, setEdges, store]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const updatedNodes = nds.filter((n) => n.id !== nodeId);
        // Sync to store
        if (store?.workflowMap) {
          store.workflowMap.nodes = updatedNodes as any;
        }
        return updatedNodes;
      });
      setEdges((eds) => {
        const updatedEdges = eds.filter(
          (e) => e.source !== nodeId && e.target !== nodeId
        );
        // Sync to store
        if (store?.workflowMap) {
          store.workflowMap.edges = updatedEdges as any;
        }
        return updatedEdges;
      });
    },
    [setNodes, setEdges, store]
  );

  // Build nodeTypes with onDelete injection
  const nodeTypes = useMemo(
    () => buildNodeTypes(handleDeleteNode),
    [handleDeleteNode]
  );

  const handleEdgeDelete = useCallback(
    (edgeId: string) => {
      setEdges((prev) => {
        const updatedEdges = prev.filter((e) => e.id !== edgeId);
        // Sync to store
        if (store?.workflowMap) {
          store.workflowMap.edges = updatedEdges as any;
        }
        return updatedEdges;
      });
    },
    [setEdges, store]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        data: {
          onDelete: handleEdgeDelete,
        },
      };

      setEdges((eds) => {
        const updatedEdges = addEdge(newEdge, eds);
        // Sync to store
        if (store?.workflowMap) {
          store.workflowMap.edges = updatedEdges as any;
        }
        return updatedEdges;
      });
    },
    [setEdges, handleEdgeDelete, store]
  );

  // ========== Workflow Loading Logic ==========
  const loadWorkflowFromServer = useCallback(
    async (workflowId: string) => {
      const res: any = await getBpmnDetail(workflowId);
      if (!res?.content) return;
      store?.setWorkflowEntity({
        forms: res.forms,
      });
      // Update fields in variable setup modal when it's not open
      store?.loadFormFields();
      if (store?.parser && typeof store.parser.fromXML === "function") {
        await store.parser.fromXML(res.content);

        // Add onDelete callback to all loaded edges
        const edgesWithCallback = (store.workflowMap.edges || []).map(
          (edge: any) => ({
            ...edge,
            data: {
              ...edge.data,
              onDelete: handleEdgeDelete,
            },
          })
        );

        // Update store with edges that have callbacks
        if (store.workflowMap) {
          store.workflowMap.edges = edgesWithCallback as any;
        }

        setNodes(store.workflowMap.nodes || []);
        setEdges(edgesWithCallback);
      }
    },
    [store, setNodes, setEdges, handleEdgeDelete]
  );

  useEffect(() => {
    const loadWorkflowData = async () => {
      if (!workflowDetail) return;
      const fromServer = FROM === "detail" && workflowDetail.id;
      // Initialize store
      store?.setBpmnId(workflowDetail.id);
      store?.setWorkflowEntity({
        name: workflowDetail.name,
        ownerIds: workflowDetail.ownerIds,
        description: workflowDetail.description,
        countryCodes: workflowDetail.countryCodes,
        businessArea: workflowDetail.businessArea,
        icon: workflowDetail.icon,
        uniqueProcessId: workflowDetail.uniqueProcessId,
        displayVersion: workflowDetail.displayVersion,
      });

      try {
        if (!fromServer) {
          // Load from store (create/detail without BPMN/readonly)
          const res: WorkflowEntity = await getBpmnDetail(workflowDetail.id);
          store?.setWorkflowEntity({
            displayVersion: res.displayVersion,
          });
          // inject visual handles from handlesMeta
          const localNodes = (store?.workflowMap?.nodes || []).map(
            (n: any) => ({
              ...n,
              data: {
                ...n.data,
                handles: n.data?.handlesMeta
                  ? mapHandlesMetaToVisual(n.data.handlesMeta, n.type)
                  : n.data?.handles,
              },
            })
          );
          setNodes(localNodes);
          setEdges(store?.workflowMap?.edges || []);
          return;
        }

        // Load from server
        await loadWorkflowFromServer(workflowDetail.id);
      } catch (error) {
        console.error("Error loading workflow data:", error);
        message.error("Failed to load workflow details.");
      }
    };

    loadWorkflowData();
  }, [
    FROM,
    workflowDetail,
    store,
    setNodes,
    setEdges,
    handleEdgeDelete,
    loadWorkflowFromServer,
  ]);

  // Sync store changes back to React Flow state
  // Only sync when updateTrigger changes to avoid infinite loop
  useEffect(() => {
    if (updateTrigger > 0) {
      // Use functional setNodes to preserve current positions.
      // Read handlesMeta from the store node (source of truth for mutations
      // made by the properties panel), not from currentNodes.data which is a
      // stale spread-copy created at load time.
      setNodes((currentNodes) =>
        currentNodes.map((n: any) => {
          const storeNode = store?.workflowMap?.nodes?.find(
            (sn: any) => sn.id === n.id
          );
          const rawHandlesMeta = (storeNode?.data as any)?.handlesMeta?.length
            ? (storeNode?.data as any).handlesMeta
            : (n?.data as any)?.handlesMeta?.length
            ? (n?.data as any).handlesMeta
            : undefined;
          const handles = rawHandlesMeta
            ? mapHandlesMetaToVisual(rawHandlesMeta, n.type)
            : undefined;
          return {
            ...n,
            data: {
              ...n.data,
              ...(storeNode?.data ?? {}),
              handlesMeta: rawHandlesMeta,
              handles,
            },
          };
        })
      );
      // Sync edges from store so handle-removal deletions are reflected in canvas
      setEdges(store?.workflowMap?.edges || []);
    }
  }, [updateTrigger, setNodes, setEdges, store]);

  // Re-register handle bounds after node data changes (needed for dynamically
  // added/removed handles, especially bottom-positioned ones in Inclusive Gateway)
  useEffect(() => {
    if (Nodes.length > 0) {
      const nodeIds = Nodes.map((n: any) => n.id);
      updateNodeInternals(nodeIds);
    }
  }, [Nodes, updateNodeInternals]);

  // Handle drag and drop
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const nodeConfig = JSON.parse(data);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeId = nodeConfig.id + "-" + +new Date();

      const nodeType = nodeConfig.type as WorkflowNodeType;

      // Validate if the node type is supported
      if (!NodeFactory.isTypeSupported(nodeType)) {
        console.warn(`[handleDrop] Unsupported node type: ${nodeType}`);
        return;
      }

      const nodeEntity = {
        type: nodeType,
        x: position.x,
        y: position.y,
        label: nodeConfig.name,
        subLabel: "",
        icon: "",
        properties: {},
      };

      const wrapper = new ConcreteNodeWrapper(nodeFactory, nodeEntity, nodeId, {
        onPropertiesPanelOpen,
        onNodeSelect,
      });

      // Build handlesMeta from the entity so handles are visible immediately on drop
      const droppedEntity = WorkflowNodeFactory.createFromReactFlowNode({
        id: nodeId,
        type: nodeType,
        position,
        data: { label: nodeConfig.name },
      });
      const handlesMeta = droppedEntity
        ? (droppedEntity.data as any).handlesMeta || []
        : [];

      const newNode = {
        id: nodeId,
        type: nodeType,
        position,
        data: {
          id: nodeId,
          label: nodeConfig.name,
          subLabel: "",
          icon: "",
          properties: {},
          wrapper,
          handlesMeta,
        },
      };

      setNodes((nds) => {
        const updatedNodes = [...nds, newNode];
        // Sync to store
        if (store?.workflowMap) {
          store.workflowMap.nodes = updatedNodes as any;
        }
        return updatedNodes;
      });
    },
    [
      screenToFlowPosition,
      setNodes,
      nodeFactory,
      onPropertiesPanelOpen,
      onNodeSelect,
      store,
    ]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );
  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeClick && onNodeClick(event, node);
      setSelectedNode(node);
      setDrawerVisible(true);
    },
    [onNodeClick]
  );
  return (
    <EdgeHoverProvider>
      <div
        className="workflow-canvas"
        style={{ width: "100%", height: "100%" }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <ReactFlow
          nodes={Nodes}
          edges={Edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          edgeTypes={edgeTypes}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
        >
          <CanvasControls
            onZoomIn={() =>
              document
                .querySelector(".react-flow__renderer")
                ?.dispatchEvent(
                  new WheelEvent("wheel", { deltaY: -100, ctrlKey: true })
                )
            }
            onZoomOut={() =>
              document
                .querySelector(".react-flow__renderer")
                ?.dispatchEvent(
                  new WheelEvent("wheel", { deltaY: 100, ctrlKey: true })
                )
            }
            onClear={() => {
              setNodes([]);
              setEdges([]);
            }}
          />
          <Background />
        </ReactFlow>
      </div>
    </EdgeHoverProvider>
  );
};
