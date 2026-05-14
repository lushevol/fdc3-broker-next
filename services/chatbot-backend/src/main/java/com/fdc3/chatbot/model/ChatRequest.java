package com.fdc3.chatbot.model;

import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.protocol.model.ProtocolMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
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
    private WorkspaceContextSnapshot workspaceContext;
    private String trigger;
    private List<ProtocolMessage> messages;
    private List<ChatMessage> history;
    @Default
    private Boolean stream = true;
}
