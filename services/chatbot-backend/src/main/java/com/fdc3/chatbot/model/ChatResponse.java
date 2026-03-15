package com.fdc3.chatbot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String id;
    private String conversationId;
    private ChatMessage message;
    private Instant timestamp;
    private boolean done;
    private List<GenerativeUIComponent> generativeComponents;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenerativeUIComponent {
        private String name;
        private Map<String, Object> props;
    }
}