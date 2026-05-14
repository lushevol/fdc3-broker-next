package com.fdc3.chatbot.protocol.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProtocolRunRequest {
    private String conversationId;
    private String runId;
    private String trigger;
    private ProtocolRunConfig config;
    private ProtocolRunContext context;
    private List<ProtocolMessage> messages;
    private Map<String, Object> metadata;
    /**
     * Explicit user ID from the MFE base / frontend auth context.
     * Used for per-user memory isolation. When present, this takes
     * precedence over the JWT-derived userId.
     */
    private String userId;
}
