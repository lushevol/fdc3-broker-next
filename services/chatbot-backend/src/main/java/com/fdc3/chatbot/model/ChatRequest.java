package com.fdc3.chatbot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String conversationId;
    private String message;
    private String toolContext;
    private String frontendTools;
    private List<ChatMessage> history;
    private boolean stream = true;
}
