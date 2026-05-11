package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.core.io.ClassPathResource;
import org.springaicommunity.agent.common.task.subagent.SubagentType;
import org.springaicommunity.agent.tools.task.TaskTool;
import org.springaicommunity.agent.tools.task.claude.ClaudeSubagentType;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TaskToolTest {

    @Test
    void buildsTaskToolWithSubagents() {
        assertDoesNotThrow(() -> {
            List<org.springaicommunity.agent.common.task.subagent.SubagentReference> refs =
                    org.springaicommunity.agent.tools.task.claude.ClaudeSubagentReferences.fromResources(new ClassPathResource("agents"));

            assertFalse(refs.isEmpty(), "Should find at least one sub-agent definition");
        });
    }

    @Test
    void taskToolHasCorrectName() {
        ChatModel chatModel = org.mockito.Mockito.mock(ChatModel.class);
        ChatClient.Builder builder = ChatClient.builder(chatModel);

        SubagentType subagentType = ClaudeSubagentType.builder()
                .chatClientBuilder("default", builder)
                .build();

        // TaskTool.Builder auto-adds default subagent references when a ClaudeSubagentType is used
        ToolCallback callback = TaskTool.builder()
                .subagentTypes(subagentType)
                .build();

        assertNotNull(callback);
        assertNotNull(callback.getToolDefinition().name());
    }
}
