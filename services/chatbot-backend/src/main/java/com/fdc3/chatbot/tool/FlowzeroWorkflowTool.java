package com.fdc3.chatbot.tool;

import com.fdc3.chatbot.flowzero.FlowzeroWorkflowRecord;
import com.fdc3.chatbot.flowzero.FlowzeroWorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class FlowzeroWorkflowTool implements ToolDefinition {

    private static final Pattern SPLIT_PATTERN = Pattern.compile("\\s*(?:,|->|=>|\\bthen\\b)\\s*", Pattern.CASE_INSENSITIVE);
    private static final String DEFAULT_WORKFLOW_NAME = "Generated FlowZero Workflow";
    private static final String DEFAULT_BUSINESS_AREA = "General";
    private static final List<String> DEFAULT_COUNTRY_CODES = List.of("GLOBAL");
    private static final List<String> DEFAULT_OWNER_IDS = List.of("system");

    private final FlowzeroWorkflowService workflowService;

    @Override
    public String getName() {
        return "generate_flowzero_workflow";
    }

    @Override
    public String getDescription() {
        return "Generate a Flowzero workflow draft from natural language and persist it through the Flowzero workflow service.";
    }

    @Override
    public Map<String, Object> getParameters() {
        return Map.of(
                "type", "object",
                "properties", Map.of(
                        "prompt", Map.of("type", "string", "description", "Workflow steps, for example: start, manager approval, end"),
                        "workflowName", Map.of("type", "string", "description", "Workflow display name"),
                        "description", Map.of("type", "string", "description", "Optional workflow description"),
                        "businessArea", Map.of("type", "string", "description", "Optional business area"),
                        "countryCodes", Map.of("type", "array", "items", Map.of("type", "string")),
                        "ownerIds", Map.of("type", "array", "items", Map.of("type", "string"))
                ),
                "required", List.of("prompt")
        );
    }

    @Override
    public CompletableFuture<Object> execute(Map<String, Object> arguments) {
        return CompletableFuture.supplyAsync(() -> {
            String prompt = text(arguments.get("prompt"));
            if (prompt.isBlank()) {
                return Map.of("error", "prompt is required");
            }

            String workflowName = textOrDefault(arguments.get("workflowName"), DEFAULT_WORKFLOW_NAME);
            String description = text(arguments.get("description"));
            String businessArea = textOrDefault(arguments.get("businessArea"), DEFAULT_BUSINESS_AREA);
            List<String> countryCodes = listOrDefault(arguments.get("countryCodes"), DEFAULT_COUNTRY_CODES);
            List<String> ownerIds = listOrDefault(arguments.get("ownerIds"), DEFAULT_OWNER_IDS);
            List<String> labels = labelsFromPrompt(prompt);
            List<String> warnings = labels.size() <= 3
                    ? List.of("Prompt had limited structure, so FlowZero generated a minimal start-task-end workflow.")
                    : List.of();
            List<Map<String, Object>> nodes = buildNodes(labels);
            List<Map<String, Object>> edges = buildEdges(nodes);
            String summary = String.join(" -> ", labels);
            String bpmnXml = buildBpmnXml(workflowName, nodes, edges);

            FlowzeroWorkflowRecord persisted = workflowService.saveDraft(new FlowzeroWorkflowRecord(
                    null,
                    workflowName,
                    description,
                    businessArea,
                    countryCodes,
                    ownerIds,
                    nodes,
                    edges,
                    bpmnXml,
                    summary,
                    warnings,
                    Instant.now()
            ));
            return toResult(persisted);
        });
    }

    private List<String> labelsFromPrompt(String prompt) {
        String workflowText = prompt.contains(":") ? prompt.substring(prompt.lastIndexOf(':') + 1) : prompt;
        List<String> labels = SPLIT_PATTERN.splitAsStream(workflowText)
                .map(this::cleanSegment)
                .filter(segment -> !segment.isBlank())
                .map(this::titleCase)
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));
        if (labels.isEmpty()) {
            labels.add("Approval");
        }
        if (!labels.get(0).toLowerCase(Locale.ROOT).startsWith("start")) {
            labels.add(0, "Start");
        }
        String last = labels.get(labels.size() - 1).toLowerCase(Locale.ROOT);
        if (!last.equals("end") && !last.startsWith("end ")) {
            labels.add("End");
        }
        return labels;
    }

    private List<Map<String, Object>> buildNodes(List<String> labels) {
        List<Map<String, Object>> nodes = new ArrayList<>();
        for (int index = 0; index < labels.size(); index++) {
            String label = labels.get(index);
            boolean start = index == 0 && label.toLowerCase(Locale.ROOT).startsWith("start");
            boolean end = index == labels.size() - 1 && label.toLowerCase(Locale.ROOT).startsWith("end");
            String idPrefix = start ? "start" : end ? "end" : "task";
            String type = start ? "StartEventNode" : end ? "EndNode" : "WorkFlowStepNode";
            Map<String, Object> node = new LinkedHashMap<>();
            node.put("id", idPrefix + "_" + index + "_" + slug(label));
            node.put("type", type);
            node.put("label", label);
            node.put("position", Map.of("x", 100 + index * 220, "y", 140));
            node.put("data", Map.of("label", label, "properties", Map.of()));
            nodes.add(node);
        }
        return nodes;
    }

    private List<Map<String, Object>> buildEdges(List<Map<String, Object>> nodes) {
        List<Map<String, Object>> edges = new ArrayList<>();
        for (int index = 0; index < nodes.size() - 1; index++) {
            String source = String.valueOf(nodes.get(index).get("id"));
            String target = String.valueOf(nodes.get(index + 1).get("id"));
            edges.add(Map.of(
                    "id", "edge_" + source + "_" + target,
                    "source", source,
                    "target", target,
                    "data", Map.of("label", "")
            ));
        }
        return edges;
    }

    private String buildBpmnXml(String workflowName, List<Map<String, Object>> nodes, List<Map<String, Object>> edges) {
        String processId = "Process_" + slug(workflowName);
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        xml.append("<bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" id=\"Definitions_")
                .append(processId).append("\" targetNamespace=\"http://flowzero/generated\">");
        xml.append("<bpmn:process id=\"").append(processId).append("\" name=\"").append(escapeXml(workflowName)).append("\" isExecutable=\"true\">");
        for (Map<String, Object> node : nodes) {
            String type = String.valueOf(node.get("type"));
            String tag = "StartEventNode".equals(type) ? "startEvent" : "EndNode".equals(type) ? "endEvent" : "userTask";
            xml.append("<bpmn:").append(tag).append(" id=\"").append(node.get("id")).append("\" name=\"")
                    .append(escapeXml(String.valueOf(node.get("label")))).append("\" />");
        }
        for (Map<String, Object> edge : edges) {
            xml.append("<bpmn:sequenceFlow id=\"").append(slug(String.valueOf(edge.get("id")))).append("\" sourceRef=\"")
                    .append(edge.get("source")).append("\" targetRef=\"").append(edge.get("target")).append("\" />");
        }
        xml.append("</bpmn:process></bpmn:definitions>");
        return xml.toString();
    }

    private Map<String, Object> toResult(FlowzeroWorkflowRecord record) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("workflowId", record.workflowId());
        result.put("workflowName", record.workflowName());
        result.put("description", record.description());
        result.put("businessArea", record.businessArea());
        result.put("countryCodes", record.countryCodes());
        result.put("ownerIds", record.ownerIds());
        result.put("nodes", record.nodes());
        result.put("edges", record.edges());
        result.put("bpmnXml", record.bpmnXml());
        result.put("summary", record.summary());
        result.put("warnings", record.warnings());
        result.put("createdAt", record.createdAt().toString());
        return result;
    }

    private String cleanSegment(String segment) {
        return text(segment)
                .replaceFirst("(?i)^generate\\s+(?:a\\s+)?flowzero\\s+workflow\\s*", "")
                .replaceFirst("(?i)^create\\s+(?:an?\\s+)?(?:approval\\s+)?workflow\\s*", "")
                .replaceFirst("(?i)^with\\s+", "");
    }

    private String titleCase(String value) {
        String normalized = text(value).toLowerCase(Locale.ROOT);
        if (normalized.isBlank()) {
            return "";
        }
        StringBuilder builder = new StringBuilder();
        int wordIndex = 0;
        for (String word : normalized.split(" ")) {
            if (word.isBlank()) {
                continue;
            }
            if (builder.length() > 0) {
                builder.append(' ');
            }
            if (wordIndex > 0 && isMinorTitleWord(word)) {
                builder.append(word);
            } else {
                builder.append(Character.toUpperCase(word.charAt(0))).append(word.substring(1));
            }
            wordIndex++;
        }
        return builder.toString();
    }

    private boolean isMinorTitleWord(String word) {
        return "a".equals(word)
                || "an".equals(word)
                || "and".equals(word)
                || "for".equals(word)
                || "of".equals(word)
                || "or".equals(word)
                || "the".equals(word)
                || "to".equals(word)
                || "with".equals(word);
    }

    private List<String> listOrDefault(Object value, List<String> fallback) {
        if (!(value instanceof List<?> rawList)) {
            return fallback;
        }
        List<String> values = rawList.stream()
                .map(String::valueOf)
                .map(String::trim)
                .filter(item -> !item.isBlank())
                .toList();
        return values.isEmpty() ? fallback : values;
    }

    private String textOrDefault(Object value, String fallback) {
        String text = text(value);
        return text.isBlank() ? fallback : text;
    }

    private String text(Object value) {
        return value == null ? "" : String.valueOf(value).trim().replaceAll("\\s+", " ");
    }

    private String slug(String value) {
        String slug = text(value).toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "_").replaceAll("^_+|_+$", "");
        return slug.isBlank() ? "generated" : slug;
    }

    private String escapeXml(String value) {
        return text(value)
                .replace("&", "&amp;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
