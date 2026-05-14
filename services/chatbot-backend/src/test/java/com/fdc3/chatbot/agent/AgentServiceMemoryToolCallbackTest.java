package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.tool.ToolRegistry;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springaicommunity.agent.tools.AutoMemoryTools;
import org.springframework.ai.tool.ToolCallback;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AgentServiceMemoryToolCallbackTest {

    @TempDir
    private Path memoriesDir;

    @Test
    void buildMemoryToolCallbacksUsesExplicitFunctionSchemasAndInvokesMemoryTool() throws Exception {
        Files.writeString(memoriesDir.resolve("MEMORY.md"), "first line\nsecond line\n");
        AutoMemoryTools memoryTools = AutoMemoryTools.builder()
                .memoriesDir(memoriesDir)
                .build();
        AgentService service = new AgentService((ToolRegistry) null);

        List<ToolCallback> callbacks = service.buildMemoryToolCallbacks(memoryTools);

        assertEquals(
                List.of("MemoryView", "MemoryCreate", "MemoryStrReplace", "MemoryInsert", "MemoryDelete", "MemoryRename"),
                callbacks.stream().map(callback -> callback.getToolDefinition().name()).toList()
        );
        ToolCallback memoryView = callbacks.get(0);
        assertTrue(memoryView.getClass().getName().contains("FunctionToolCallback"));
        assertTrue(memoryView.getToolDefinition().inputSchema().contains("\"viewRange\""));

        String result = memoryView.call("{\"path\":\"MEMORY.md\",\"viewRange\":\"1,1\"}");

        assertTrue(result.contains("first line"));
    }
}
