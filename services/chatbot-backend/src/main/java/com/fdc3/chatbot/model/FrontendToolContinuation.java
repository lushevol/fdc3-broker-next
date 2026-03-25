package com.fdc3.chatbot.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FrontendToolContinuation {
    private String originalUserMessage;
    private String toolCallId;
    private String toolName;
    private Map<String, Object> args;
    private Object result;
    @JsonProperty("isError")
    private boolean isError;
    private String error;
}
