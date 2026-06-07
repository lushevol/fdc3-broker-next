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
import {
  buildConditionGroupExpression,
  ConditionGroupValue,
  FIELD_TYPE_MAP,
} from "src/pages/workflow/services/conditionUtils";
import { generateSmoothWaypoints } from "src/util/generateSmoothWaypoints";

import { AbstractWorkflowNode } from "../model/entities/reactflowElement";
import { WorkflowNodeFactory } from "../model/utils/WorkflowNodeFactory";

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
    candidateUsers?: Array<string>;
    candidateGroup?: string;
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

        // sourceHandle: for gateway nodes use sequenceFlow.id (each branch has its own handle);
        // for non-gateway nodes use nodeId + "_out" (single unified handle)
        // targetHandle = targetNodeId + "_in" (matches target handle id in target node's handlesMeta)
        const sourceNodeType = (flowElements.sourceRef as any)?.$type;
        const isGatewaySource =
          sourceNodeType === "bpmn:InclusiveGateway" ||
          sourceNodeType === "bpmn:ExclusiveGateway";
        const sourceHandle: string | undefined = isGatewaySource
          ? flowElements.id || undefined
          : source
          ? `${source}_out`
          : undefined;
        const targetHandle: string | undefined = flowElements.targetRef?.id
          ? `${flowElements.targetRef.id}_in`
          : undefined;

        // Preserve condition expression and default flag on edge data
        const edgeData: Record<string, any> = {
          label: flowElements.name || "",
        };
        if (flowElements.conditionExpression?.body) {
          edgeData.condition = flowElements.conditionExpression.body.trim();
        }

        // Parse any camunda:Properties on the sequenceFlow for condition metadata and sourceHandle
        let restoredSourceHandle: string | undefined;
        try {
          const ext = (flowElements as any).extensionElements;
          if (ext && ext.values) {
            for (const v of ext.values) {
              if (v.$type === "camunda:Properties" && v.values) {
                for (const p of v.values) {
                  if (p.$type === "camunda:Property" && p.name) {
                    if (p.name === "sourceHandle") {
                      restoredSourceHandle = p.value;
                    } else if (p.name.startsWith("conditionMeta_")) {
                      try {
                        edgeData.conditionMeta = JSON.parse(p.value);
                      } catch (e) {
                        edgeData.conditionMetaRaw = p.value;
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
          // ignore
        }
        if (flowElements.sourceRef?.$type === "bpmn:ExclusiveGateway") {
          const sourceGateway = flowElements.sourceRef as any;
          if (sourceGateway?.default?.id === flowElements.id) {
            edgeData.isDefault = true;
          }
        }

        return {
          id:
            flowElements.id ||
            element.id.replace(/^Edge_/, "").replace(/_di$/, ""),
          source: source || "",
          target: target || "",
          // Prefer the sourceHandle stored in extension (exact round-trip), fall back to computed
          sourceHandle: restoredSourceHandle || sourceHandle,
          targetHandle,
          data: edgeData,
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
        if (!element.bpmnElement) return null;
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

        // Restore handlesMeta serialised during export (survives even without connected edges).
        // This is the source-of-truth for gateway handles; we fall back to edge-derived below.
        let restoredHandlesMeta: any[] | null = null;
        if (
          typeof customProperties.handlesMeta === "string" &&
          customProperties.handlesMeta
        ) {
          try {
            const parsed = JSON.parse(customProperties.handlesMeta);
            if (Array.isArray(parsed)) restoredHandlesMeta = parsed;
          } catch (e) {
            /* ignore */
          }
        }
        // Always remove from customProperties to prevent it being spread as a raw string
        delete customProperties.handlesMeta;

        // Build handlesMeta from BPMN incoming/outgoing sequenceFlows.
        // source handle id = sequenceFlow.id  (edges reference this via sourceHandle)
        // target handle id = nodeId + "_in"   (edges reference this via targetHandle)
        const handlesMeta: Array<{
          id: string;
          role: "source" | "target";
          label?: string;
        }> = [];

        // Every non-StartEvent node has one incoming handle
        if (nodeElement.$type !== "bpmn:StartEvent") {
          handlesMeta.push({
            id: `${nodeElement.id}_in`,
            role: "target",
            label: "In",
          });
        }

        // Source handles: gateway nodes get one handle per outgoing flow (branch behaviour);
        // non-gateway nodes share a single _out handle regardless of edge count.
        // StartEvent always has a source handle even when no edges are connected yet.
        if (
          nodeElement.$type !== "bpmn:EndEvent" &&
          (nodeElement.$type === "bpmn:StartEvent" || nodeElement.outgoing)
        ) {
          const isGateway =
            nodeElement.$type === "bpmn:InclusiveGateway" ||
            nodeElement.$type === "bpmn:ExclusiveGateway";

          if (isGateway) {
            const isInclusiveGateway =
              nodeElement.$type === "bpmn:InclusiveGateway";
            for (const seq of nodeElement.outgoing as any[]) {
              const handle: {
                id: string;
                role: "source" | "target";
                label?: string;
                isBranch?: boolean;
              } = {
                id: seq.id,
                role: "source",
                label: seq.name || "",
              };
              // 只给真正的分支 handle 加 isBranch，merge point handle（label === 'Out' 或 id 以 '_out' 结尾）不加
              if (
                isInclusiveGateway &&
                handle.label !== "Out" &&
                !handle.id.endsWith("_out")
              ) {
                handle.isBranch = true;
              }
              handlesMeta.push(handle);
            }
          } else {
            // 非 branch 节点：统一使用一个 _out handle，不论有几条 outgoing edge
            handlesMeta.push({
              id: `${nodeElement.id}_out`,
              role: "source",
              label: "Out",
            });
          }
        }

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
            candidateUsers:
              (nodeElement as any).$attrs?.["camunda:candidateUsers"] || "",
            candidateGroup:
              (nodeElement as any).$attrs?.["camunda:candidateGroups"] || "",
            // handles: prefer extension-stored (survives without edges), fallback to edge-derived
            // For EndEvent, always use the dynamically built handlesMeta (id: nodeId_in) to avoid
            // mismatch with legacy saved extensions that stored the old _h0 id, which would
            // cause edges targeting the EndNode to silently not render.
            handlesMeta:
              nodeElement.$type === "bpmn:EndEvent"
                ? handlesMeta
                : restoredHandlesMeta || handlesMeta,
            // Merge custom properties (handlesMeta key already removed above)
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
    edges: Edge[] | ReactFlowEdge[],
    store?: any
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
      let processId = `Process_${Date.now()}`;
      if (
        store &&
        store.workflowEntity &&
        store.workflowEntity.uniqueProcessId
      ) {
        processId = store.workflowEntity.uniqueProcessId;
      }
      const process = this.moddle.create("bpmn:Process", {
        id: processId,
        isExecutable: true,
      });

      // 3. Create flow elements array
      const flowElements: any[] = [];
      const elementMap = new Map<string, any>();

      // 4. Convert nodes to BPMN elements using entity model
      for (const node of nodes) {
        // Create entity instance from ReactFlow node
        const entity = WorkflowNodeFactory.createFromReactFlowNode(node);
        if (!entity) {
          console.warn(`Failed to create entity for node: ${node.id}`);
          continue;
        }

        const elementType = this.getNodeType(node.type ?? "");

        // Basic element properties
        const elementProps: any = {
          id: node.id,
          name: node.data?.label || node.id,
        };

        // Get all BPMN-specific attributes from entity
        const bpmnAttributes = entity.getBpmnAttributes(this.moddle, node.data);
        Object.assign(elementProps, bpmnAttributes);

        // Create BPMN element with all attributes
        const element = this.moddle.create(elementType, elementProps);

        // Persist handlesMeta on ALL node extensions so handles survive round-trip (even without edges).
        // For ExclusiveGateway: also embed conditions/conjunction into the _true handle so they are
        // preserved without needing outgoing edges (previously lost when no edge was connected).
        // Fall back to entity defaults when node.data.handlesMeta is absent (e.g. store-constructor
        // nodes created without handlesMeta, such as the start node on a brand-new workflow opened
        // with from=create before any fromXML is called).
        const handlesMetaRaw: any[] | undefined = (node.data as any)
          ?.handlesMeta?.length
          ? (node.data as any).handlesMeta
          : (entity.data as any)?.handlesMeta?.length
          ? (entity.data as any).handlesMeta
          : undefined;
        if (Array.isArray(handlesMetaRaw) && handlesMetaRaw.length) {
          let handlesMetaToSave = handlesMetaRaw;
          if (elementType === "bpmn:ExclusiveGateway") {
            const conditions = (node.data as any)?.conditions;
            const conjunction = (node.data as any)?.conjunction;
            if (conditions?.length) {
              handlesMetaToSave = handlesMetaRaw.map((h: any) =>
                h?.id?.endsWith("_true")
                  ? { ...h, conditions, conjunction: conjunction || "And" }
                  : h
              );
            }
          }
          const handlesProp = this.moddle.create("camunda:Property", {
            name: "handlesMeta",
            value: JSON.stringify(handlesMetaToSave),
          });
          if (!element.extensionElements) {
            const camPropsList = this.moddle.create("camunda:Properties", {
              values: [handlesProp],
            });
            element.extensionElements = this.moddle.create(
              "bpmn:ExtensionElements",
              { values: [camPropsList] }
            );
          } else {
            // Merge handlesMeta into the existing first camunda:Properties block so
            // all properties stay in ONE block (two separate blocks caused handlesMeta
            // to be silently dropped for UserTask on round-trip).
            const existingValues: any[] =
              element.extensionElements.values || [];
            const firstCamProps = existingValues.find(
              (v: any) => v.$type === "camunda:Properties"
            );
            if (firstCamProps && Array.isArray(firstCamProps.values)) {
              firstCamProps.values = [...firstCamProps.values, handlesProp];
            } else {
              const camPropsList = this.moddle.create("camunda:Properties", {
                values: [handlesProp],
              });
              element.extensionElements.values = [
                ...existingValues,
                camPropsList,
              ];
            }
          }
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

            // Store sourceHandle in extension so it can be accurately restored on import.
            // Without this, gateway sourceHandle was re-derived from sequenceFlow.id which
            // changes handle IDs and breaks true/false branch detection on re-export.
            if (edge.sourceHandle) {
              const shProp = this.moddle.create("camunda:Property", {
                name: "sourceHandle",
                value: String((edge as any).sourceHandle),
              });
              const shProps = this.moddle.create("camunda:Properties", {
                values: [shProp],
              });
              sequenceFlow.extensionElements = this.moddle.create(
                "bpmn:ExtensionElements",
                { values: [shProps] }
              );
            }

            if (sourceElement.$type === "bpmn:ExclusiveGateway") {
              const sourceNode = nodes.find(
                (n) => n.id === edge.source.toString()
              );
              if (sourceNode) {
                const entity =
                  WorkflowNodeFactory.createFromReactFlowNode(sourceNode);
                if (entity) {
                  if (
                    typeof entity.isDefaultEdge === "function" &&
                    entity.isDefaultEdge(edge)
                  ) {
                    // Default (false) branch: set gateway.default, no conditionExpression
                    sourceElement.default = sequenceFlow;
                  } else {
                    // Build expression from ConditionGroup; persist JSON to extensionElements for round-trip.
                    const group: ConditionGroupValue | undefined = sourceNode
                      .data?.conditions?.length
                      ? {
                          conjunction: sourceNode.data.conjunction || "And",
                          conditions: sourceNode.data.conditions,
                        }
                      : undefined;

                    const storeFieldDefs: Array<{
                      value: string;
                      type: string;
                    }> = (store?.selectedFormFields ?? []).map((f: any) => ({
                      value: f.indexedTerm,
                      label: f?.label,
                      type:
                        FIELD_TYPE_MAP[f.dataType?.toUpperCase()] ?? "String",
                    }));

                    const _ifFieldDefs = sourceNode.data?.fieldDefs?.length
                      ? sourceNode.data.fieldDefs
                      : storeFieldDefs;

                    const _ifFieldTypeResolver = _ifFieldDefs.length
                      ? (key: string) =>
                          (_ifFieldDefs.find((f) => f.value === key)
                            ?.type as any) ?? "String"
                      : undefined;
                    const expr = group
                      ? buildConditionGroupExpression(
                          group,
                          _ifFieldTypeResolver
                        )
                      : sourceNode.data?.expression;
                    if (expr) {
                      sequenceFlow.conditionExpression = this.moddle.create(
                        "bpmn:FormalExpression",
                        { body: expr }
                      );
                    }
                    if (group) {
                      try {
                        const prop = this.moddle.create("camunda:Property", {
                          name: "conditionMeta",
                          value: JSON.stringify(group),
                        });
                        const props = this.moddle.create("camunda:Properties", {
                          values: [prop],
                        });
                        // Attach conditionMeta to the gateway element, merging with existing
                        // extensionElements (which may already contain the handlesMeta property).
                        const gwElement = elementMap.get(
                          edge.source.toString()
                        );
                        if (gwElement) {
                          if (!gwElement.extensionElements) {
                            gwElement.extensionElements = this.moddle.create(
                              "bpmn:ExtensionElements",
                              { values: [props] }
                            );
                          } else {
                            gwElement.extensionElements.values = [
                              ...(gwElement.extensionElements.values || []),
                              props,
                            ];
                          }
                        }
                      } catch (e) {
                        // ignore
                      }
                    }
                  }
                }
              }
            } else if (sourceElement.$type === "bpmn:InclusiveGateway") {
              const sourceNode = nodes.find(
                (n) => n.id === edge.source.toString()
              );
              try {
                if (sourceNode) {
                  const handleId = edge.sourceHandle || sequenceFlowId;
                  const handles: any[] = sourceNode.data?.handlesMeta || [];
                  const handle = handles.find((h) => h.id === handleId);

                  // Write branch label to sequenceFlow.name for round-trip restoration.
                  // The handle label is the authoritative branch name; edge.data.label
                  // is not reliably synced, so we overwrite it here.
                  if (handle?.label) {
                    sequenceFlow.name = handle.label;
                  }

                  const group: ConditionGroupValue | undefined =
                    handle && handle.conditions
                      ? {
                          conjunction: handle.conjunction || "And",
                          conditions: handle.conditions,
                        }
                      : edge.data?.conditionMeta;

                  if (group) {
                    const storeFieldDefs: Array<{
                      value: string;
                      type: string;
                    }> = (store?.selectedFormFields ?? []).map((f: any) => ({
                      value: f.indexedTerm,
                      label: f?.label,
                      type:
                        FIELD_TYPE_MAP[f.dataType?.toUpperCase()] ?? "String",
                    }));

                    const _incFieldDefs = sourceNode.data?.fieldDefs?.length
                      ? sourceNode.data.fieldDefs
                      : storeFieldDefs;

                    const _incFieldTypeResolver = _incFieldDefs.length
                      ? (key: string) =>
                          (_incFieldDefs.find((f) => f.value === key)
                            ?.type as any) ?? "String"
                      : undefined;
                    const expr = buildConditionGroupExpression(
                      group,
                      _incFieldTypeResolver
                    );
                    if (expr) {
                      sequenceFlow.conditionExpression = this.moddle.create(
                        "bpmn:FormalExpression",
                        { body: expr }
                      );
                    }
                    try {
                      const prop = this.moddle.create("camunda:Property", {
                        name: `conditionMeta_${sequenceFlowId}`,
                        value: JSON.stringify(group),
                      });
                      const props = this.moddle.create("camunda:Properties", {
                        values: [prop],
                      });
                      // Merge with existing extension (may already contain sourceHandle property)
                      if (!sequenceFlow.extensionElements) {
                        sequenceFlow.extensionElements = this.moddle.create(
                          "bpmn:ExtensionElements",
                          { values: [props] }
                        );
                      } else {
                        sequenceFlow.extensionElements.values = [
                          ...(sequenceFlow.extensionElements.values || []),
                          props,
                        ];
                      }
                    } catch (e) {
                      // ignore
                    }
                  }
                }
              } catch (e) {
                // ignore
              }
            }

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
      throw new Error(`BPMN XML generation failed: ${message}`);
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
          `Edge ${edge.id}: Source node ${edge.source} does not exist`
        );
      }
      if (!nodeIds.has(edge.target.toString())) {
        throw new Error(
          `Edge ${edge.id}: Target node ${edge.target} does not exist`
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

      // Restore ExclusiveGateway (IfNode) conditions from the _true handle embedded in handlesMeta.
      // Conditions are written into the _true handle during export (not tied to edges),
      // so they survive even when there are no outgoing edges connected.
      // Backward compat: also try the legacy conditionMeta string property.
      try {
        for (const node of nodes) {
          if (node.type !== "IfNode") continue;
          const handles: any[] = node.data?.handlesMeta || [];
          const trueHandle = handles.find((h: any) => h?.id?.endsWith("_true"));
          if (trueHandle?.conditions?.length) {
            node.data.conjunction = trueHandle.conjunction || "And";
            node.data.conditions = trueHandle.conditions;
          } else {
            // Legacy path: conditionMeta was a separate node-level property
            const raw = node.data?.conditionMeta;
            if (typeof raw === "string" && raw) {
              try {
                const meta = JSON.parse(raw);
                node.data.conjunction = meta.conjunction;
                node.data.conditions = meta.conditions;
              } catch (e) {
                // ignore invalid JSON
              }
            }
          }
        }
      } catch (e) {
        // ignore
      }

      // Post-process: restore conditionMeta from edges into source node handlesMeta.
      // Node extension handlesMeta is the source of truth; edge data is only a fallback
      // when the handle does not already have conditions (e.g. upgrading from old XML).
      try {
        const nodeMap = new Map(nodes.map((n) => [n.id, n]));
        for (const edge of edges) {
          const meta = edge.data?.conditionMeta;
          if (!meta) continue;
          const srcNode = nodeMap.get(edge.source);
          if (!srcNode) continue;
          srcNode.data = srcNode.data || {};
          srcNode.data.handlesMeta = srcNode.data.handlesMeta || [];
          const handleId = edge.sourceHandle || edge.id;
          let handle = srcNode.data.handlesMeta.find(
            (h: any) => h.id === handleId
          );
          if (!handle) {
            // create a branch handle if missing
            srcNode.data.handlesMeta.push({
              id: handleId,
              role: "source",
              label: "",
              isBranch: true,
            });
            handle = srcNode.data.handlesMeta.find(
              (h: any) => h.id === handleId
            );
          }
          // Only apply edge conditionMeta when the handle has no conditions from node extension
          if (!handle.conditions?.length) {
            handle.conjunction = meta.conjunction || "And";
            handle.conditions = meta.conditions || [];
          }
        }
      } catch (e) {
        console.warn("Failed to restore conditions from edges:", e);
        // ignore
      }

      // Cleanup: Remove conditions/conjunction from merge point handles (role: 'source', isBranch !== true)
      try {
        for (const node of nodes) {
          if (!node?.data?.handlesMeta) continue;
          for (const handle of node.data.handlesMeta) {
            if (handle.role === "source" && handle.isBranch !== true) {
              delete handle.conditions;
              delete handle.conjunction;
            }
          }
        }
      } catch (e) {
        // ignore
      }

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
      throw new Error(`Parsing failed: ${message}`);
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
