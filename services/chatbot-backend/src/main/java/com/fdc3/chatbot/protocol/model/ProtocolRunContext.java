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
public class ProtocolRunContext {
    private ProtocolWorkspaceContext workspace;
    private List<ProtocolFrontendTool> frontendTools;
    private Map<String, Object> additional;
}
