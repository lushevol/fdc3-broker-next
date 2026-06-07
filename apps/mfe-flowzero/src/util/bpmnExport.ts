import { Edge, Node } from "@xyflow/react";

import { generateSmoothWaypoints } from "./generateSmoothWaypoints";

/**
 * Export nodes and edges to BPMN XML string
 * @param nodes React Flow nodes
 * @param edges React Flow edges
 * @returns BPMN XML string
 *
 * Features:
 * - Maps node data.label to BPMN name attribute
 * - Maps node data.assignee to camunda:assignee attribute for WorkFlowStepNode
 * - Supports Camunda BPMN format with proper namespaces
 */

const DEFAULT_NODE_X = 100;
const DEFAULT_NODE_Y = 100;
const DEFAULT_NODE_WIDTH = 100;
const DEFAULT_NODE_HEIGHT = 80;

export function exportToBPMNXML(nodes: Node[], edges: Edge[]): string {
  // Type mapping: task/api/route/notification -> bpmn:task, gateway -> bpmn:exclusiveGateway
  // Position, label, etc. are written to the bpmn:task name attribute
  console.log({ nodes, edges });

  // Generate node xml
  const nodeXmls: string[] = [];
  const bpmnTypeStrategies: { [key: string]: () => string } = {
    StartEventNode: () => "bpmn:startEvent",
    WorkFlowStepNode: () => "bpmn:userTask",
    EndNode: () => "bpmn:endEvent",
    HttpNode: () => "bpmn:serviceTask",
    CodeNode: () => "bpmn:scriptTask",
    IfNode: () => "bpmn:exclusiveGateway",
    ParallelGatewayNode: () => "bpmn:parallelGateway",
    InclusiveGatewayNode: () => "bpmn:inclusiveGateway",
    gateway: () => "bpmn:exclusiveGateway",
    ServiceTaskNode: () => "bpmn:serviceTask",
    messageEvent: () => "bpmn:intermediateCatchEvent",
    MessageEventNode: () => "bpmn:intermediateCatchEvent",
  };

  function getBpmnType(nodeType: string): string {
    console.log({ nodeType });
    return bpmnTypeStrategies[nodeType]?.() || "bpmn:task";
  }

  nodes.forEach((node) => {
    const bpmnType = getBpmnType(node.type ?? "");
    const label = node.data?.label ?? "";
    const assignee = node.data?.assignee ?? "";

    // Build assignee attribute for userTask nodes
    const assigneeAttr =
      node.type === "WorkFlowStepNode" && assignee
        ? ` camunda:assignee="${assignee}"`
        : "";

    nodeXmls.push(`<${bpmnType} id="${node.id}" name="${label}"${assigneeAttr}>
      ${edges
        .filter((e) => e.target === node.id)
        .map((e) => `<bpmn:incoming>${e.id}</bpmn:incoming>`)
        .join("")}
      ${edges
        .filter((e) => e.source === node.id)
        .map((e) => `<bpmn:outgoing>${e.id}</bpmn:outgoing>`)
        .join("")}
    </${bpmnType}>`);
  });

  // Generate edge xml
  const edgeXmls: string[] = [];
  edges.forEach((edge) => {
    edgeXmls.push(
      `<bpmn:sequenceFlow id="${edge.id}" sourceRef="${edge.source}" targetRef="${edge.target}" />`
    );
  });

  // Generate bpmndi section (required for Camunda visualization)
  const diagramId = `BPMNDiagram_${Date.now()}`;
  const planeId = `BPMNPlane_${Date.now()}`;
  const processId = `Process_${Date.now()}`;
  // Node shapes
  const nodeDiXmls = nodes.map((node) => {
    const { x = DEFAULT_NODE_X, y = DEFAULT_NODE_Y } = node.position || {};
    const width = node.measured?.width || DEFAULT_NODE_WIDTH;
    const height = node.measured?.height || DEFAULT_NODE_HEIGHT;
    let shapeType = "bpmn:Task";
    if (node.type === "gateway" || node.type === "GatewayNode")
      shapeType = "bpmn:ExclusiveGateway";
    return `<bpmndi:BPMNShape id="${node.id}_di" bpmnElement="${node.id}">
      <dc:Bounds x="${x}" y="${y}" width="${width}" height="${height}" />
    </bpmndi:BPMNShape>`;
  });
  // Edge shapes

  const edgeDiXmls: string[] = [];
  edges.forEach((edge) => {
    const source = nodes.find((n) => n.id === edge.source);
    const target = nodes.find((n) => n.id === edge.target);
    if (source && target) {
      const sourceX =
        (source.position?.x ?? DEFAULT_NODE_X) +
        (source.measured?.width || DEFAULT_NODE_WIDTH);
      const sourceY =
        (source.position?.y ?? DEFAULT_NODE_Y) +
        (source.measured?.height || DEFAULT_NODE_HEIGHT) / 2;
      const targetX = target.position?.x ?? DEFAULT_NODE_X;
      const targetY =
        (target.position?.y ?? DEFAULT_NODE_Y) +
        (target.measured?.height || DEFAULT_NODE_HEIGHT) / 2;
      // smooth Bezier curve
      const waypoints = generateSmoothWaypoints(
        sourceX,
        sourceY,
        targetX,
        targetY
      );
      edgeDiXmls.push(`<bpmndi:BPMNEdge id="${edge.id}_di" bpmnElement="${
        edge.id
      }">
        ${waypoints
          .map((pt) => `<di:waypoint x="${pt.x}" y="${pt.y}" />`)
          .join("\n        ")}
      </bpmndi:BPMNEdge>`);
    }
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="Definitions_${Date.now()}" targetNamespace="http://bpmn.io/schema/bpmn">\n  <bpmn:process id="${processId}" isExecutable="true">\n    ${nodeXmls.join(
    "\n    "
  )}\n    ${edgeXmls.join(
    "\n    "
  )}\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id="${diagramId}">\n    <bpmndi:BPMNPlane id="${planeId}" bpmnElement="${processId}">\n      ${nodeDiXmls.join(
    "\n      "
  )}\n      ${edgeDiXmls.join(
    "\n      "
  )}\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>`;
  return xml;
}
