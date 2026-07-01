import { ExclamationCircleFilled } from "@ant-design/icons";
import { Edge, Node, ReactFlowProvider } from "@xyflow/react";
import { Button, Form, Modal } from "antd";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useMemo, useState } from "react";
import { ReactRouterDom } from "src/Root/import";

import { WorkflowNodeType } from "../../types/nodeTypes";
import WorkflowDesignerProvider from "../../viewModel/WorkflowDesignerProvider";
import { WorkflowDesignerStore } from "../../viewModel/WorkflowDesignerStore";
import { NodeFactory } from "../factory/NodeFactory";
import BasePropertiesPanel from "../NodePropertiesConfig/baseForm";
import DrawerPanel from "./DrawerPanel";
import { ReactFlowCanvas } from "./ReactFlowCanvas";
import TopNavigator from "./TopNavigator";
import WorkflowDetailPanel from "./WorkflowDetailPanel";
import WorkflowNodesPanel from "./WorkflowNodesPanel";
const { useNavigate } = ReactRouterDom;
interface WorkflowCanvasContainerProps {
  workflowStore?: WorkflowDesignerStore;
}
export const WorkflowCanvasContainer: FC<WorkflowCanvasContainerProps> =
  observer(({ workflowStore: externalStore }) => {
    const navigate = useNavigate();
    // Initialize store internally if not provided
    const internalStore = useMemo(() => new WorkflowDesignerStore(), []);
    const workflowStore = externalStore || internalStore;

    // State management for properties panel
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [propertiesPanelComponent, setPropertiesPanelComponent] =
      useState<FC<any> | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    // State management for nodes panel
    const [isNodesPanelOpen, setIsNodesPanelOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);

    const nodeFactory = useMemo(() => new NodeFactory(), []);
    const [form] = Form.useForm();

    const dndHandler = useCallback((event: React.DragEvent) => {}, []);
    const handlePropertiesPanelOpen = useCallback(
      (panelComponent: FC<any>, nodeId: string) => {
        setPropertiesPanelComponent(() => panelComponent);
        setSelectedNodeId(nodeId);
        setIsPanelOpen(true);
      },
      []
    );

    const handlePropertiesPanelClose = useCallback(() => {
      setIsPanelOpen(false);
      setSelectedNodeId(null);
    }, []);

    const handleNodeSelect = useCallback((nodeId: string) => {
      setSelectedNodeId(nodeId);
    }, []);

    const selectedNode = useMemo(() => {
      if (!selectedNodeId) return null;
      return workflowStore.workflowMap.nodes.find(
        (node: any) => node.id === selectedNodeId
      );
    }, [selectedNodeId, workflowStore.workflowMap.nodes]);

    const getUpstreamNodes = useCallback(
      (nodeId: string, edges: Edge[], nodes: Node[]): Node[] => {
        const result: Node[] = [];
        const visited: Record<string, boolean> = {};
        const stack: string[] = [];
        // Initialize: push all direct upstream nodes onto the stack
        edges.forEach((edge) => {
          if (edge.target === nodeId) {
            stack.push(edge.source);
          }
        });
        while (stack.length > 0) {
          const currentId = stack.pop();
          if (!currentId || visited[currentId]) continue;
          visited[currentId] = true;
          const node = nodes.find((n) => n.id === currentId);
          if (node) {
            result.push(node);
            // Continue to find upstream nodes of currentId
            edges.forEach((edge) => {
              if (edge.target === currentId && !visited[edge.source]) {
                stack.push(edge.source);
              }
            });
          }
        }
        return result;
      },
      []
    );

    const upstreamNodes = useMemo(() => {
      if (!selectedNodeId) return [];
      return getUpstreamNodes(
        selectedNodeId,
        workflowStore.workflowMap.edges,
        workflowStore.workflowMap.nodes
      );
    }, [
      selectedNodeId,
      workflowStore.workflowMap.edges,
      workflowStore.workflowMap.nodes,
      getUpstreamNodes,
    ]);

    // TopNavigator handlers
    const handleSave = useCallback(async () => {
      const errors = form.getFieldsError();
      const hasError = errors.some((field) => field.errors.length);
      if (hasError) return;
      await workflowStore.save();
    }, [workflowStore, form]);

    const handlePublish = useCallback(async () => {
      // Check if displayVersion is empty
      await handleSave();

      // first publish
      if (!workflowStore.workflowEntity.displayVersion) {
        Modal.confirm({
          title: "Attention Message",
          content: "Please confirm to publish the workflow.",
          icon: <ExclamationCircleFilled style={{ color: "#0473EA" }} />,
          okText: "Publish",
          cancelText: "Cancel",
          closable: true,
          onOk: async () => {
            Modal.destroyAll();
            workflowStore.publishWorkflow("force");
          },
        });
        return;
      }

      // has running instance
      const hasRunningInstance = await workflowStore.beforePublishCheck();
      if (hasRunningInstance) {
        showAdvancedPublishModal();
        return;
      }

      //no running instance
      Modal.confirm({
        title: "Attention Message",
        content:
          "Are you sure you want to publish this workflow? The current published version will be overwritten.",
        icon: <ExclamationCircleFilled style={{ color: "#0473EA" }} />,
        okText: "Publish",
        cancelText: "Cancel",
        closable: true,
        onOk: async () => {
          Modal.destroyAll();
          workflowStore.publishWorkflow("force");
        },
      });

      function showAdvancedPublishModal() {
        Modal.confirm({
          title: "Attention Message",
          width: 565,
          content: (
            <div>
              {/* <div className="bg-light-divide-base h-[1px]"></div> */}
              <p>
                A workflow instance is currently running in the published
                version. How would you like to proceed?
              </p>
              <p style={{ marginTop: 16 }}>
                <strong>Force Publish: </strong>Force Publish immediately
                terminates all running instances of the previous workflow
                version when a new version is published. All subsequent requests
                will refer to the latest published workflow version.
              </p>
              <p style={{ marginTop: 8 }}>
                <strong>Graceful Publish: </strong>Graceful Publish allows
                existing running instances to continue execution and complete
                under the previous workflow version when a new version is
                published. All subsequent requests will refer to the latest
                published workflow version.
              </p>
            </div>
          ),
          icon: <ExclamationCircleFilled style={{ color: "#0473EA" }} />,
          okText: "Graceful Publish",
          closable: true,
          onCancel: () => {
            Modal.destroyAll();
          },
          footer: (_, { OkBtn, CancelBtn }) => (
            <div className="flex justify-between w-full">
              <button
                className="ant-btn ant-btn-text text-[#0473EA]"
                onClick={() => Modal.destroyAll()}
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <Button
                  className="ant-btn ant-btn-default rounded-full"
                  onClick={() => {
                    Modal.destroyAll();
                    workflowStore.publishWorkflow("force");
                  }}
                >
                  Force Publish
                </Button>
                <Button
                  type="primary"
                  className="rounded-full"
                  onClick={() => {
                    Modal.destroyAll();
                    workflowStore.publishWorkflow("graceful");
                  }}
                >
                  Graceful Publish
                </Button>
              </div>
            </div>
          ),
        });
      }
    }, [workflowStore, handleSave]);

    const handleExport = useCallback(() => {
      const data = workflowStore.export();
      // Exported workflow: data
      // TODO: Implement actual export to XML/BPMN
    }, [workflowStore]);

    return (
      <WorkflowDesignerProvider workflowDesignerStore={workflowStore}>
        <div
          className={cn(
            "flex flex-col w-full h-full z-[1] bg-[#f7f9fd] dark:bg-[#171d24]"
          )}
        >
          <TopNavigator
            exportToXML={handleExport}
            save={handleSave}
            deploy={handlePublish}
          />
          <div
            className="flex-1 relative"
            onDrop={dndHandler}
            onDragOver={(e) => e.preventDefault()}
          >
            <ReactFlowProvider>
              <ReactFlowCanvas
                nodes={workflowStore.workflowMap.nodes}
                edges={workflowStore.workflowMap.edges}
                updateTrigger={updateTrigger}
                onPropertiesPanelOpen={handlePropertiesPanelOpen}
                onNodeSelect={handleNodeSelect}
                onNodeClick={(event, node) => {
                  if (node.type === WorkflowNodeType.END_EVENT) {
                    return;
                  }
                  setSelectedNodeId(node.id);
                  setDrawerVisible(true);
                  if (detailOpen) {
                    setDetailOpen(false);
                  }
                  if (isNodesPanelOpen) {
                    setIsNodesPanelOpen(false);
                  }
                }}
              />
            </ReactFlowProvider>

            {/* Floating action button */}
            <div
              className={cn(
                "flex flex-col items-center absolute gap-[12px] z-10",
                "right-[24px] top-[24px]"
              )}
            >
              <button
                className={cn(
                  "group w-12 h-12 rounded-lg flex items-center justify-center border transition",
                  "bg-light-container-layer dark:bg-dark-container-layer",
                  "border-gray-200 dark:border-dark-secondary-default",
                  "hover:!border-[#4f9df0]"
                )}
                onClick={() => setIsNodesPanelOpen(true)}
              >
                <span
                  className={cn(
                    "flowzero-iconfont icon-cube-3D",
                    "group-hover:text-[#4f9df0] dark:text-[#9AC7F6]"
                  )}
                  style={{ fontSize: "24px" }}
                />
              </button>

              <button
                className={cn(
                  "group w-12 h-12 rounded-lg flex items-center justify-center border transition",
                  "bg-light-container-layer dark:bg-dark-container-layer",
                  "border-gray-200 dark:border-gray-700",
                  "hover:!border-[#4f9df0]"
                )}
                onClick={() => setDetailOpen(true)}
              >
                <span
                  className={cn(
                    "flowzero-iconfont icon-settings-gear-cog",
                    "group-hover:text-[#4f9df0] dark:text-[#9AC7F6]"
                  )}
                  style={{ fontSize: "24px" }}
                />
              </button>
            </div>

            {/* Nodes Panel Drawer */}
            <DrawerPanel
              title="Elements Panel"
              open={isNodesPanelOpen}
              onClose={() => setIsNodesPanelOpen(false)}
              width={393}
            >
              <WorkflowNodesPanel />
            </DrawerPanel>

            {/* Workflow Details */}
            <DrawerPanel
              title="Workflow Details"
              open={detailOpen}
              onClose={() => setDetailOpen(false)}
              width={393}
            >
              <WorkflowDetailPanel form={form} />
            </DrawerPanel>

            {/* Properties Panel */}
            {selectedNode &&
              (() => {
                const PropertiesPanel = NodeFactory.getPanelFormByType(
                  selectedNode.type as WorkflowNodeType
                );

                const handleNodeDataChange = () => {
                  // Trigger re-render by updating version counter
                  setUpdateTrigger((prev) => prev + 1);
                };

                const handleRemoveEdgesByHandle = (handleId: string) => {
                  if (workflowStore?.workflowMap) {
                    workflowStore.workflowMap.edges = (
                      workflowStore.workflowMap.edges || []
                    ).filter((e: any) => e.sourceHandle !== handleId);
                  }
                  setUpdateTrigger((prev) => prev + 1);
                };

                return PropertiesPanel ? (
                  <BasePropertiesPanel
                    open={drawerVisible}
                    onClose={() => setDrawerVisible(false)}
                    nodeData={selectedNode.data}
                    nodeType={selectedNode.type}
                    upstreamNodes={upstreamNodes}
                    allNodes={workflowStore.workflowMap.nodes}
                    onNodeDataChange={handleNodeDataChange}
                  >
                    <PropertiesPanel
                      nodeData={selectedNode.data}
                      nodeType={selectedNode.type}
                      allNodes={workflowStore.workflowMap.nodes}
                      onNodeDataChange={handleNodeDataChange}
                      onRemoveEdgesByHandle={handleRemoveEdgesByHandle}
                    />
                  </BasePropertiesPanel>
                ) : null;
              })()}
          </div>
        </div>
      </WorkflowDesignerProvider>
    );
  });

export default WorkflowCanvasContainer;
