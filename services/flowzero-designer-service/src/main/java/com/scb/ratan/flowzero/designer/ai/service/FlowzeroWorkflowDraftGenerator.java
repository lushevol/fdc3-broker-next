package com.scb.ratan.flowzero.designer.ai.service;

import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftRequest;
import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftResponse;
import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftResponse.Position;
import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftResponse.WorkflowEdge;
import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftResponse.WorkflowNode;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class FlowzeroWorkflowDraftGenerator {

    private static final String DEFAULT_WORKFLOW_NAME = "Generated FlowZero Workflow";
    private static final String START_NODE_TYPE = "StartEventNode";
    private static final String USER_TASK_NODE_TYPE = "WorkFlowStepNode";
    private static final String END_NODE_TYPE = "EndNode";
    private static final Pattern SPLIT_PATTERN = Pattern.compile("\\s*(?:,|->|=>|\\bthen\\b)\\s*", Pattern.CASE_INSENSITIVE);
    private static final List<String> LOWERCASE_TITLE_WORDS = List.of("a", "an", "and", "for", "of", "the", "to", "with");

    public FlowzeroWorkflowDraftResponse generate(FlowzeroWorkflowDraftRequest request) {
        String prompt = normalize(request.prompt());
        if (prompt.isEmpty()) {
            throw new IllegalArgumentException("prompt is required");
        }

        boolean limitedStructure = hasLimitedStructure(prompt);
        List<String> labels = extractLabels(prompt);
        List<String> warnings = new ArrayList<>();
        if (limitedStructure) {
            warnings.add("Prompt had limited structure, so FlowZero generated a minimal start-task-end workflow.");
        }

        List<WorkflowNode> nodes = buildNodes(labels);
        List<WorkflowEdge> edges = buildEdges(nodes);
        String workflowName = firstText(request.workflowName(), DEFAULT_WORKFLOW_NAME);
        String summary = nodes.stream().map(WorkflowNode::label).collect(Collectors.joining(" -> "));

        return new FlowzeroWorkflowDraftResponse(
            null,
            workflowName,
            request.description(),
            request.businessArea(),
            request.countryCodes(),
            request.ownerIds(),
            nodes,
            edges,
            buildBpmnXml(workflowName, nodes, edges),
            summary,
            warnings
        );
    }

    private List<String> extractLabels(String prompt) {
        String workflowText = prompt.contains(":") ? prompt.substring(prompt.lastIndexOf(':') + 1) : prompt;
        List<String> labels = SPLIT_PATTERN.splitAsStream(workflowText)
            .map(this::cleanSegment)
            .filter(segment -> !segment.isEmpty())
            .map(this::toTitleCase)
            .collect(Collectors.toCollection(ArrayList::new));

        if (labels.isEmpty()) {
            labels.add(toTitleCase(prompt));
        }

        if (!isStart(labels.get(0))) {
            labels.add(0, "Start");
        }
        if (!isEnd(labels.get(labels.size() - 1))) {
            labels.add("End");
        }
        return labels;
    }

    private boolean hasLimitedStructure(String prompt) {
        String workflowText = prompt.contains(":") ? prompt.substring(prompt.lastIndexOf(':') + 1) : prompt;
        long segmentCount = SPLIT_PATTERN.splitAsStream(workflowText)
            .map(this::cleanSegment)
            .filter(segment -> !segment.isEmpty())
            .count();
        return segmentCount <= 1;
    }

    private List<WorkflowNode> buildNodes(List<String> labels) {
        List<WorkflowNode> nodes = new ArrayList<>();
        for (int index = 0; index < labels.size(); index++) {
            String label = labels.get(index);
            String type = nodeType(label, index, labels.size());
            String id = nodeId(type, label, index);
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("label", label);
            data.put("subLabel", subLabel(type));
            data.put("properties", Map.of());
            nodes.add(new WorkflowNode(id, type, label, new Position(100 + (index * 220), 140), data));
        }
        return nodes;
    }

    private List<WorkflowEdge> buildEdges(List<WorkflowNode> nodes) {
        List<WorkflowEdge> edges = new ArrayList<>();
        for (int index = 0; index < nodes.size() - 1; index++) {
            WorkflowNode source = nodes.get(index);
            WorkflowNode target = nodes.get(index + 1);
            edges.add(new WorkflowEdge(
                "edge_" + source.id() + "_" + target.id(),
                source.id(),
                target.id(),
                source.id() + "_out",
                target.id() + "_in",
                Map.of("label", "")
            ));
        }
        return edges;
    }

    private String buildBpmnXml(String workflowName, List<WorkflowNode> nodes, List<WorkflowEdge> edges) {
        String processId = "Process_" + slug(workflowName);
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" ");
        xml.append("xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" ");
        xml.append("xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" ");
        xml.append("xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" ");
        xml.append("id=\"Definitions_").append(processId).append("\" targetNamespace=\"http://flowzero/generated\">\n");
        xml.append("  <bpmn:process id=\"").append(processId).append("\" name=\"").append(escapeXml(workflowName)).append("\" isExecutable=\"true\">\n");

        for (int index = 0; index < nodes.size(); index++) {
            WorkflowNode node = nodes.get(index);
            String tag = bpmnTag(node.type());
            xml.append("    <bpmn:").append(tag).append(" id=\"").append(node.id()).append("\" name=\"").append(escapeXml(node.label())).append("\">\n");
            incomingEdges(edges, node.id()).forEach(edge -> xml.append("      <bpmn:incoming>").append(sequenceFlowId(edge)).append("</bpmn:incoming>\n"));
            outgoingEdges(edges, node.id()).forEach(edge -> xml.append("      <bpmn:outgoing>").append(sequenceFlowId(edge)).append("</bpmn:outgoing>\n"));
            xml.append("    </bpmn:").append(tag).append(">\n");
        }

        for (WorkflowEdge edge : edges) {
            xml.append("    <bpmn:sequenceFlow id=\"").append(sequenceFlowId(edge)).append("\" sourceRef=\"")
                .append(edge.source()).append("\" targetRef=\"").append(edge.target()).append("\" />\n");
        }

        xml.append("  </bpmn:process>\n");
        xml.append("  <bpmndi:BPMNDiagram id=\"BPMNDiagram_").append(processId).append("\">\n");
        xml.append("    <bpmndi:BPMNPlane id=\"BPMNPlane_").append(processId).append("\" bpmnElement=\"").append(processId).append("\">\n");
        for (WorkflowNode node : nodes) {
            int width = END_NODE_TYPE.equals(node.type()) || START_NODE_TYPE.equals(node.type()) ? 48 : 160;
            int height = END_NODE_TYPE.equals(node.type()) || START_NODE_TYPE.equals(node.type()) ? 48 : 72;
            xml.append("      <bpmndi:BPMNShape id=\"").append(node.id()).append("_di\" bpmnElement=\"").append(node.id()).append("\">\n");
            xml.append("        <dc:Bounds x=\"").append(node.position().x()).append("\" y=\"").append(node.position().y())
                .append("\" width=\"").append(width).append("\" height=\"").append(height).append("\" />\n");
            xml.append("      </bpmndi:BPMNShape>\n");
        }
        for (WorkflowEdge edge : edges) {
            WorkflowNode source = findNode(nodes, edge.source());
            WorkflowNode target = findNode(nodes, edge.target());
            xml.append("      <bpmndi:BPMNEdge id=\"").append(sequenceFlowId(edge)).append("_di\" bpmnElement=\"").append(sequenceFlowId(edge)).append("\">\n");
            xml.append("        <di:waypoint x=\"").append(source.position().x() + 160).append("\" y=\"").append(source.position().y() + 36).append("\" />\n");
            xml.append("        <di:waypoint x=\"").append(target.position().x()).append("\" y=\"").append(target.position().y() + 36).append("\" />\n");
            xml.append("      </bpmndi:BPMNEdge>\n");
        }
        xml.append("    </bpmndi:BPMNPlane>\n");
        xml.append("  </bpmndi:BPMNDiagram>\n");
        xml.append("</bpmn:definitions>\n");
        return xml.toString();
    }

    private List<WorkflowEdge> incomingEdges(List<WorkflowEdge> edges, String nodeId) {
        return edges.stream().filter(edge -> edge.target().equals(nodeId)).toList();
    }

    private List<WorkflowEdge> outgoingEdges(List<WorkflowEdge> edges, String nodeId) {
        return edges.stream().filter(edge -> edge.source().equals(nodeId)).toList();
    }

    private WorkflowNode findNode(List<WorkflowNode> nodes, String nodeId) {
        return nodes.stream()
            .filter(node -> node.id().equals(nodeId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Unknown node: " + nodeId));
    }

    private String cleanSegment(String segment) {
        return normalize(segment)
            .replaceFirst("(?i)^create\\s+(?:an?\\s+)?(?:approval\\s+)?workflow\\s*", "")
            .replaceFirst("(?i)^with\\s+", "");
    }

    private String nodeType(String label, int index, int size) {
        if (index == 0 && isStart(label)) {
            return START_NODE_TYPE;
        }
        if (index == size - 1 && isEnd(label)) {
            return END_NODE_TYPE;
        }
        return USER_TASK_NODE_TYPE;
    }

    private boolean isStart(String label) {
        return label.toLowerCase(Locale.ROOT).startsWith("start");
    }

    private boolean isEnd(String label) {
        String normalized = label.toLowerCase(Locale.ROOT);
        return normalized.equals("end") || normalized.startsWith("end ");
    }

    private String nodeId(String type, String label, int index) {
        String prefix = switch (type) {
            case START_NODE_TYPE -> "start";
            case END_NODE_TYPE -> "end";
            default -> "task";
        };
        return prefix + "_" + index + "_" + slug(label);
    }

    private String bpmnTag(String type) {
        return switch (type) {
            case START_NODE_TYPE -> "startEvent";
            case END_NODE_TYPE -> "endEvent";
            default -> "userTask";
        };
    }

    private String subLabel(String type) {
        return switch (type) {
            case START_NODE_TYPE -> "Start Event";
            case END_NODE_TYPE -> "End Event";
            default -> "User Task";
        };
    }

    private String sequenceFlowId(WorkflowEdge edge) {
        return "flow_" + slug(edge.source() + "_" + edge.target());
    }

    private String slug(String value) {
        String slug = normalize(value).toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "_").replaceAll("^_+|_+$", "");
        return slug.isEmpty() ? "generated" : slug;
    }

    private String firstText(String value, String fallback) {
        String normalized = normalize(value);
        return normalized.isEmpty() ? fallback : normalized;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ");
    }

    private String toTitleCase(String value) {
        String normalized = normalize(value).toLowerCase(Locale.ROOT);
        if (normalized.isEmpty()) {
            return "";
        }
        StringBuilder builder = new StringBuilder();
        int wordIndex = 0;
        for (String word : normalized.split(" ")) {
            if (word.isEmpty()) {
                continue;
            }
            if (builder.length() > 0) {
                builder.append(' ');
            }
            if (wordIndex > 0 && LOWERCASE_TITLE_WORDS.contains(word)) {
                builder.append(word);
            } else {
                builder.append(Character.toUpperCase(word.charAt(0))).append(word.substring(1));
            }
            wordIndex++;
        }
        return builder.toString();
    }

    private String escapeXml(String value) {
        return normalize(value)
            .replace("&", "&amp;")
            .replace("\"", "&quot;")
            .replace("'", "&apos;")
            .replace("<", "&lt;")
            .replace(">", "&gt;");
    }
}
