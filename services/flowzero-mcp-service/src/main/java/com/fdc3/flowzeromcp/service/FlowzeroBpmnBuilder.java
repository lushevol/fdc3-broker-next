package com.fdc3.flowzeromcp.service;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class FlowzeroBpmnBuilder {

    public String build(String workflowId, String workflowName, List<String> steps) {
        StringBuilder xml = new StringBuilder();
        xml.append("""
            <?xml version="1.0" encoding="UTF-8"?>
            <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
              <process id="%s" name="%s" isExecutable="false">
                <startEvent id="start-event" name="Start"/>
            """.formatted(escapeXml(workflowId), escapeXml(workflowName)));

        for (int index = 0; index < steps.size(); index++) {
            String stepName = steps.get(index);
            xml.append("    <userTask id=\"task-")
                .append(index + 1)
                .append("\" name=\"")
                .append(escapeXml(stepName))
                .append("\"/>\n");
        }

        xml.append("""
                <endEvent id="end-event" name="End"/>
              </process>
            </definitions>
            """);

        return xml.toString();
    }

    private String escapeXml(String value) {
        return value
            .replace("&", "&amp;")
            .replace("\"", "&quot;")
            .replace("<", "&lt;")
            .replace(">", "&gt;");
    }
}
