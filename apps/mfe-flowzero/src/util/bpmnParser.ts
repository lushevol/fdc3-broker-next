import { Edge, Node } from "@xyflow/react";
import BpmnModdleEntity from "src/service/BpmnService";

/**
 * 将 BPMN XML 转换为 React Flow 可渲染的格式
 * @param xmlContent BPMN XML 内容字符串
 * @param setEdges 设置边的回调函数，用于处理边的删除操作
 * @returns Promise 包含转换后的节点和边数组
 */
export async function parseBpmnXmlToReactFlow(
  xmlContent: string,
  setEdges?: (updater: (prev: Edge[]) => Edge[]) => void
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  try {
    const bpmnModel = new BpmnModdleEntity();
    await bpmnModel.formXML(xmlContent);

    const rawNodes = bpmnModel.getNode();
    const rawEdges = bpmnModel.getEdges();

    console.log("Raw nodes from BPMN:", rawNodes);
    console.log("Raw edges from BPMN:", rawEdges);

    // 将 BPMN 节点类型映射为 React Flow 可渲染类型（只保留小写）
    const bpmnTypeToReactFlowType: { [key: string]: string } = {
      "bpmn:startevent": "StartEventNode",
      "bpmn:endevent": "EndNode",
      "bpmn:usertask": "WorkFlowStepNode",
      "bpmn:servicetask": "HttpNode",
      "bpmn:scripttask": "CodeNode",
      "bpmn:task": "WorkFlowStepNode",
      "bpmn:exclusivegateway": "IfNode",
      "bpmn:parallelgateway": "ParallelGatewayNode",
      "bpmn:inclusivegateway": "InclusiveGatewayNode",
      "bpmn:intermediatecatchevent": "WorkFlowStepNode",
    };

    // 为不同类型的节点设置合适的默认尺寸
    const getNodeDimensions = (type: string) => {
      switch (type) {
        case "StartEventNode":
        case "EndNode":
          return { width: 36, height: 36 };
        case "IfNode":
        case "ParallelGatewayNode":
        case "InclusiveGatewayNode":
          return { width: 50, height: 50 };
        default:
          return { width: 120, height: 80 };
      }
    };

    // 转换节点格式
    const nodes: Node[] = rawNodes.map((node: any) => {
      const bpmnElement = bpmnModel.getBpmnElementById(node.id);
      const bpmnType = bpmnElement?.$type?.toLowerCase();
      const nodeType = bpmnTypeToReactFlowType[bpmnType] || "WorkFlowStepNode";
      const dimensions = getNodeDimensions(nodeType);

      console.log(
        `Node ${node.id}: bpmnType=${bpmnType}, nodeType=${nodeType}`
      );

      return {
        id: node.id,
        type: nodeType,
        position: node.position,
        data: {
          label: node.data?.label || bpmnElement?.name || node.id,
          ...node.data,
        },
        measured: dimensions,
      };
    });

    // 转换边格式，支持带标签的边
    const edges: Edge[] = rawEdges.map((edge: any) => {
      const bpmnElement = bpmnModel.getBpmnElementById(edge.id);
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "default",
        data: {
          label: bpmnElement?.name || "",
          onDelete: setEdges
            ? (edgeId: string) => {
                setEdges((prev: Edge[]) => prev.filter((e) => e.id !== edgeId));
              }
            : undefined,
        },
      };
    });

    console.log("Parsed nodes:", nodes);
    console.log("Parsed edges:", edges);

    return { nodes, edges };
  } catch (error) {
    console.error("Error parsing BPMN XML:", error);
    return { nodes: [], edges: [] };
  }
}
