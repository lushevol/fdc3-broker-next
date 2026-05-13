package com.fdc3.chatbot.protocol.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProtocolPart {
    private String type;
    private String text;
    private String planId;
    private String summary;
    private String stepId;
    private String title;
    private String status;
    private String detail;
    private String toolCallId;
    private String toolName;
    private String executionTarget;
    private String source;
    private String providerId;
    private String state;
    private JsonNode input;
    private JsonNode output;
    private String error;
    private String cardType;
    private JsonNode props;
    private String actionId;
    private String actionType;
    private String description;
    private String code;
    private List<ProtocolActionOption> options;
    private String url;
    private String fileId;
    private String name;
    private String mimeType;
    private Long sizeBytes;
    private String data;
    private String encoding;
}
