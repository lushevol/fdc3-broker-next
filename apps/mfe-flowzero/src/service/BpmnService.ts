// @ts-nocheck
// TODO: remove ts-nocheck

import { Edge, Node } from "@xyflow/react";
import BpmnModdle, {
  BPMNEdge,
  BPMNModdle,
  BPMNShape,
  Definitions,
  ParseResult,
  Reference,
  RootElement,
  SequenceFlow,
} from "bpmn-moddle";

import { generateSmoothWaypoints } from "../util/generateSmoothWaypoints";

// Import Camunda extension
const camundaModdleExtension = {
  name: "Camunda",
  uri: "http://camunda.org/schema/1.0/bpmn",
  prefix: "camunda",
  xml: {
    tagAlias: "lowerCase",
  },
  types: [
    {
      name: "Properties",
      superClass: ["Element"],
      meta: {
        allowedIn: ["bpmn:ExtensionElements"],
      },
      properties: [
        {
          name: "values",
          type: "Property",
          isMany: true,
        },
      ],
    },
    {
      name: "Property",
      superClass: ["Element"],
      properties: [
        {
          name: "name",
          isAttr: true,
          type: "String",
        },
        {
          name: "value",
          isAttr: true,
          type: "String",
        },
      ],
    },
  ],
};

// ReactFlow node interface
export interface ReactFlowNode {
  id: string;
  type: string;
  data: {
    label?: string;
    assignee?: string;
    [key: string]: any;
  };
  position: {
    x: number;
    y: number;
  };
  measured?: {
    width: number;
    height: number;
  };
}

// ReactFlow edge interface
export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: {
    label?: string;
    [key: string]: any;
  };
}

/**
 * BPMN Service - Standard BPMN conversion service based on bpmn-moddle
 * Provides bidirectional conversion between ReactFlow data and standard BPMN 2.0 XML
 */
export class BpmnService {
  private moddle: BPMNModdle;
  private rootElement: Definitions | null = null;
  private references: Reference[] = [];
  private elementsById: Record<string, RootElement> = {};

  constructor() {
    // Configure BpmnModdle to support Camunda extension
    this.moddle = new BpmnModdle({
      camunda: camundaModdleExtension,
    });
  }

  /**
   * Parse data from BPMN XML
   */
  async fromXML(xmlstr: string) {
    try {
      const re: ParseResult = await this.moddle.fromXML(xmlstr);
      this.rootElement = re.rootElement;
      this.references = re.references;
      this.elementsById = re.elementsById;
      return this;
    } catch (error) {
      console.error("BPMN XML parsing failed:", error);
      let message = "";
      if (error instanceof Error) {
        message = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = String((error as any).message);
      } else {
        message = String(error);
      }
      throw new Error(`BPMN XML parsing failed: ${message}`);
    }
  }

  /**
   * Get edge data in ReactFlow format
   */
  getEdges(): ReactFlowEdge[] {
    const edges = this.references
      .filter((item) => item.element.$type === "bpmndi:BPMNEdge")
      .map((item) => {
        const element = item.element as BPMNEdge;
        const flowElements = element.bpmnElement as SequenceFlow;
        const target = flowElements.targetRef?.id;
        const source = flowElements.sourceRef?.id;
        return {
          id: element.id.replace(/^Edge_/, "").replace(/_di$/, ""),
          source: source || "",
          target: target || "",
          data: {
            label: flowElements.name || "",
          },
        };
      })
      .filter((edge) => edge.source && edge.target);

    return edges;
  }

  /**
   * Get BPMN element by ID
   */
  getBpmnElementById(id: string) {
    return this.elementsById[id];
  }

  /**
   * Get node data in ReactFlow format
   */
  getNodes(): ReactFlowNode[] {
    const nodes = this.references
      .filter((item) => item.element.$type === "bpmndi:BPMNShape")
      .map((item) => {
        const element: BPMNShape = item.element as BPMNShape;
        const nodeElement: RootElement = this.getBpmnElementById(
          element.bpmnElement.id
        );

        if (!nodeElement) return null;

        const connectionAttr: {
          sourcePosition?: string;
          targetPosition?: string;
          type?: string;
        } = {
          sourcePosition: "right",
          targetPosition: "left",
        };

        // Node type mapping
        switch (nodeElement.$type) {
          case "bpmn:StartEvent":
            delete connectionAttr.targetPosition;
            connectionAttr.type = "StartEventNode";
            break;
          case "bpmn:EndEvent":
            delete connectionAttr.sourcePosition;
            connectionAttr.type = "EndNode";
            break;
          case "bpmn:UserTask":
            connectionAttr.type = "WorkFlowStepNode";
            break;
          case "bpmn:ServiceTask":
            connectionAttr.type = "HttpNode";
            break;
          case "bpmn:ScriptTask":
            connectionAttr.type = "CodeNode";
            break;
          case "bpmn:ExclusiveGateway":
            connectionAttr.type = "IfNode";
            break;
          case "bpmn:ParallelGateway":
            connectionAttr.type = "ParallelGatewayNode";
            break;
          case "bpmn:InclusiveGateway":
            connectionAttr.type = "InclusiveGatewayNode";
            break;
          case "bpmn:IntermediateCatchEvent":
            connectionAttr.type = "MessageEventNode";
            break;
          default:
            connectionAttr.type = "WorkFlowStepNode";
            break;
        }

        // Parse custom camunda:Properties
        const customProperties = this.parseCamundaProperties(nodeElement);

        return {
          id: nodeElement.id,
          position: {
            x: element.bounds?.x || 0,
            y: element.bounds?.y || 0,
          },
          data: {
            label: nodeElement.name || nodeElement.id,
            id: nodeElement.id,
            // Extract camunda:assignee attribute (for UserTask only)
            assignee: (nodeElement as any).$attrs?.["camunda:assignee"] || "",
            // Extract camunda:candidateUsers -> array of bankId strings
            candidateUsers: (() => {
              const raw =
                (nodeElement as any).$attrs?.["camunda:candidateUsers"] || "";
              return raw
                ? raw
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                : [];
            })(),
            // Extract camunda:candidateGroups -> single group id string
            candidateGroup:
              (nodeElement as any).$attrs?.["camunda:candidateGroups"] || "",
            // Merge custom properties
            ...customProperties,
          },
          measured: {
            width:
              (element as any).bounds?.width ||
              this.getDefaultNodeWidth(connectionAttr.type ?? ""),
            height:
              (element as any).bounds?.height ||
              this.getDefaultNodeHeight(connectionAttr.type ?? ""),
          },
          ...connectionAttr,
        };
      })
      .filter((node) => node !== null) as ReactFlowNode[];

    return nodes;
  }

  /**
   * Create camunda:Properties extension element
   * @param data Node data object
   * @param excludeKeys Array of key names to exclude (e.g., label, assignee, etc., properties that have special handling)
   * @returns camunda:Properties object or null
   */
  private createCamundaProperties(
    data: any,
    excludeKeys: string[] = ["label", "id", "assignee"]
  ): any {
    if (!data || typeof data !== "object") {
      return null;
    }

    const propertyValues = [];

    // Iterate through data object to create camunda:Property
    for (const [key, value] of Object.entries(data)) {
      // Skip excluded keys and empty values
      if (
        excludeKeys.includes(key) ||
        value === null ||
        value === undefined ||
        value === ""
      ) {
        continue;
      }

      const property = this.moddle.create("camunda:Property", {
        name: key,
        value: String(value),
      });
      propertyValues.push(property);
    }

    // Return null if no properties
    if (propertyValues.length === 0) {
      return null;
    }

    // Create camunda:Properties container
    return this.moddle.create("camunda:Properties", {
      values: propertyValues,
    });
  }

  /**
   * Parse camunda:Properties extension element to plain object
   * @param element BPMN element
   * @returns Object containing custom properties
   */
  private parseCamundaProperties(element: any): Record<string, any> {
    const customProps: Record<string, any> = {};

    try {
      // Find camunda:Properties in extension elements
      const extensionElements = element.extensionElements;
      if (extensionElements && extensionElements.values) {
        for (const extension of extensionElements.values) {
          if (extension.$type === "camunda:Properties" && extension.values) {
            for (const property of extension.values) {
              if (property.$type === "camunda:Property" && property.name) {
                customProps[property.name] = property.value || "";
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn("Failed to parse camunda:Properties:", error);
    }

    return customProps;
  }

  /**
   * Get BPMN element type corresponding to node type
   */
  private getNodeType(type: string): string {
    const typeMap: Record<string, string> = {
      StartEventNode: "bpmn:StartEvent",
      input: "bpmn:StartEvent",
      EndNode: "bpmn:EndEvent",
      output: "bpmn:EndEvent",
      WorkFlowStepNode: "bpmn:UserTask",
      HttpNode: "bpmn:ServiceTask",
      CodeNode: "bpmn:ScriptTask",
      IfNode: "bpmn:ExclusiveGateway",
      gateway: "bpmn:ExclusiveGateway",
      GatewayNode: "bpmn:ExclusiveGateway",
      ParallelGatewayNode: "bpmn:ParallelGateway",
      InclusiveGatewayNode: "bpmn:InclusiveGateway",
      ServiceTaskNode: "bpmn:ServiceTask",
      MessageEventNode: "bpmn:IntermediateCatchEvent",
      messageEvent: "bpmn:IntermediateCatchEvent",
      default: "bpmn:Task",
      BaseNode: "bpmn:Task",
      TaskNode: "bpmn:Task",
    };
    return typeMap[type] || "bpmn:Task";
  }

  /**
   * Get default node width
   */
  private getDefaultNodeWidth(type: string): number {
    const widthMap: Record<string, number> = {
      StartEventNode: 36,
      EndNode: 36,
      IfNode: 50,
      ParallelGatewayNode: 50,
      InclusiveGatewayNode: 50,
      WorkFlowStepNode: 120,
      HttpNode: 120,
      CodeNode: 120,
      MessageEventNode: 36,
    };
    return widthMap[type] || 100;
  }

  /**
   * Get default node height
   */
  private getDefaultNodeHeight(type: string): number {
    const heightMap: Record<string, number> = {
      StartEventNode: 36,
      EndNode: 36,
      IfNode: 50,
      ParallelGatewayNode: 50,
      InclusiveGatewayNode: 50,
      WorkFlowStepNode: 80,
      HttpNode: 80,
      CodeNode: 80,
      MessageEventNode: 36,
    };
    return heightMap[type] || 80;
  }

  /**
   * Convert ReactFlow data to BPMN XML
   * @param nodes ReactFlow node array
   * @param edges ReactFlow edge array
   * @returns Promise<string> BPMN XML string
   */
  async toXML(
    nodes: Node[] | ReactFlowNode[],
    edges: Edge[] | ReactFlowEdge[]
  ): Promise<string> {
    try {
      if (!nodes || nodes.length === 0) {
        throw new Error("Node array cannot be empty");
      }

      // Validate edge references
      this.validateEdgeReferences(nodes, edges);

      // 1. Create root definitions
      const definitions = this.moddle.create("bpmn:Definitions", {
        id: `Definitions_${Date.now()}`,
        targetNamespace: "http://bpmn.io/schema/bpmn",
        "xmlns:bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL",
        "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
        "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
        "xmlns:di": "http://www.omg.org/spec/DD/20100524/DI",
        "xmlns:camunda": "http://camunda.org/schema/1.0/bpmn",
      });

      // 2. Create process
      const processId = `Process_${Date.now()}`;
      const process = this.moddle.create("bpmn:Process", {
        id: processId,
        isExecutable: true,
      });

      // 3. Create flow elements array
      const flowElements: any[] = [];
      const elementMap = new Map<string, any>();

      // 4. Convert nodes to BPMN elements
      for (const node of nodes) {
        const elementType = this.getNodeType(node.type ?? "");

        // Basic element properties
        const elementProps: any = {
          id: node.id,
          name: node.data?.label || node.id,
        };

        // Handle special camunda:assignee attribute (UserTask only)
        if (elementType === "bpmn:UserTask" && node.data?.assignee) {
          elementProps["camunda:assignee"] = node.data.assignee;
        }

        // Create basic element
        const element = this.moddle.create(elementType, elementProps);

        // Create generic camunda:Properties extension
        const camundaProperties = this.createCamundaProperties(node.data);
        if (camundaProperties) {
          // Create extension elements container
          const extensionElements = this.moddle.create(
            "bpmn:ExtensionElements",
            {
              values: [camundaProperties],
            }
          );
          element.extensionElements = extensionElements;
        }

        flowElements.push(element);
        elementMap.set(node.id, element);
      }

      // 5. Convert edges to BPMN sequence flows
      const sequenceFlowMap = new Map<string, any>();
      for (const edge of edges) {
        if (edge.source && edge.target) {
          const sourceElement = elementMap.get(edge.source.toString());
          const targetElement = elementMap.get(edge.target.toString());

          if (sourceElement && targetElement) {
            const sequenceFlowId =
              edge.id || `Flow_${edge.source}_${edge.target}`;
            const sequenceFlow = this.moddle.create("bpmn:SequenceFlow", {
              id: sequenceFlowId,
              sourceRef: sourceElement,
              targetRef: targetElement,
              name: edge.data?.label || "",
            });
            flowElements.push(sequenceFlow);
            sequenceFlowMap.set(sequenceFlowId, sequenceFlow);

            // Critical: Set incoming and outgoing references for nodes
            // According to BPMN specification, incoming/outgoing are SequenceFlow reference arrays
            // bpmn-moddle automatically handles reference serialization to XML
            if (!sourceElement.outgoing) {
              sourceElement.outgoing = [];
            }
            sourceElement.outgoing.push(sequenceFlow);

            if (!targetElement.incoming) {
              targetElement.incoming = [];
            }
            targetElement.incoming.push(sequenceFlow);
          }
        }
      }

      // 6. Set process flow elements
      process.flowElements = flowElements;

      // 7. Create diagram information
      const diagramId = `BPMNDiagram_${processId}`;
      const planeId = `BPMNPlane_${processId}`;
      const diagram = this.moddle.create("bpmndi:BPMNDiagram", {
        id: diagramId,
      });

      const plane = this.moddle.create("bpmndi:BPMNPlane", {
        id: planeId,
        bpmnElement: process,
      });

      const diagramElements: any[] = [];

      // 8. Create node shapes
      for (const node of nodes) {
        const element = elementMap.get(node.id);
        if (element && node.position) {
          const bounds = this.moddle.create("dc:Bounds", {
            x: node.position.x,
            y: node.position.y,
            width:
              node.measured?.width || this.getDefaultNodeWidth(node.type ?? ""),
            height:
              node.measured?.height ||
              this.getDefaultNodeHeight(node.type ?? ""),
          });

          const shape = this.moddle.create("bpmndi:BPMNShape", {
            id: `Shape_${node.id}`,
            bpmnElement: element,
            bounds: bounds,
          });

          diagramElements.push(shape);
        }
      }

      // 9. Critical: Create connection lines (BPMNEdge) with waypoints
      const DEFAULT_NODE_WIDTH = 100;
      const DEFAULT_NODE_HEIGHT = 80;

      for (const edge of edges) {
        if (edge.source && edge.target) {
          const sequenceFlowId =
            edge.id || `Flow_${edge.source}_${edge.target}`;
          const sequenceFlow = sequenceFlowMap.get(sequenceFlowId);

          // Get position information of source and target nodes
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);

          // Calculate waypoints
          let waypoints: any[] = [];
          if (sourceNode && targetNode) {
            const sourceX =
              (sourceNode.position?.x ?? 0) +
              (sourceNode.measured?.width ||
                this.getDefaultNodeWidth(sourceNode.type ?? ""));
            const sourceY =
              (sourceNode.position?.y ?? 0) +
              (sourceNode.measured?.height ||
                this.getDefaultNodeHeight(sourceNode.type ?? "")) /
                2;
            const targetX = targetNode.position?.x ?? 0;
            const targetY =
              (targetNode.position?.y ?? 0) +
              (targetNode.measured?.height ||
                this.getDefaultNodeHeight(targetNode.type ?? "")) /
                2;

            // Use generateSmoothWaypoints to generate smooth path points
            const smoothWaypoints = generateSmoothWaypoints(
              sourceX,
              sourceY,
              targetX,
              targetY
            );

            // Convert to BPMN waypoint format
            waypoints = smoothWaypoints.map((pt) =>
              this.moddle.create("dc:Point", {
                x: pt.x,
                y: pt.y,
              })
            );
          }

          const edgeElement = this.moddle.create("bpmndi:BPMNEdge", {
            id: `Edge_${sequenceFlowId}`,
            bpmnElement: sequenceFlow || sequenceFlowId,
            waypoint: waypoints,
          });
          diagramElements.push(edgeElement);
        }
      }

      // 10. Set diagram elements
      (plane as any).planeElement = diagramElements;
      diagram.plane = plane;

      // 11. Set root elements
      definitions.rootElements = [process, diagram as any];

      // 12. Generate XML
      const { xml } = await (this.moddle as any).toXML(definitions);
      // Global output of complete XML (visible in both Node and Jest environments)
      // eslint-disable-next-line no-console
      console.log(
        "\n========= BPMN XML Output =========\n" +
          xml +
          "\n========= END BPMN XML =========\n"
      );
      return xml;
    } catch (error) {
      console.error("BPMN XML generation failed:", error);
      let message = "";
      if (error instanceof Error) {
        message = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = String((error as any).message);
      } else {
        message = String(error);
      }
      throw new Error(`BPMN XML generation failed: ${message}.`);
    }
  }

  /**
   * Validate that nodes referenced by edges exist
   */
  private validateEdgeReferences(
    nodes: Node[] | ReactFlowNode[],
    edges: Edge[] | ReactFlowEdge[]
  ): void {
    const nodeIds = new Set(nodes.map((node) => node.id));

    for (const edge of edges) {
      if (!nodeIds.has(edge.source.toString())) {
        throw new Error(
          `Edge ${edge.id}: Source node ${edge.source} does not exist.`
        );
      }
      if (!nodeIds.has(edge.target.toString())) {
        throw new Error(
          `Edge ${edge.id}: Target node ${edge.target} does not exist.`
        );
      }
    }
  }

  /**
   * Parse BPMN XML to ReactFlow data
   * @param xml BPMN XML string
   * @returns Promise<{nodes: ReactFlowNode[], edges: ReactFlowEdge[]}>
   */
  async parseXMLToReactFlow(
    xml: string
  ): Promise<{ nodes: ReactFlowNode[]; edges: ReactFlowEdge[] }> {
    try {
      await this.fromXML(xml);
      const nodes = this.getNodes();
      const edges = this.getEdges();

      return { nodes, edges };
    } catch (error) {
      console.error("Failed to parse BPMN XML to ReactFlow data:", error);
      let message = "";
      if (error instanceof Error) {
        message = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = String((error as any).message);
      } else {
        message = String(error);
      }
      throw new Error(`Parsing failed: ${message}.`);
    }
  }
}

// Maintain backward compatibility
class BpmnModdleEntity extends BpmnService {
  // Compatible method names for old versions
  async formXML(xmlstr: string) {
    // Directly call parent class instance method
    return this.fromXML(xmlstr);
  }
  getNode() {
    return this.getNodes();
  }
  getEdges() {
    return super.getEdges();
  }
}

export default BpmnModdleEntity;
