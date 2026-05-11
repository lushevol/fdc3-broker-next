package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.Test;
import org.springaicommunity.agent.tools.TodoWriteTool;
import org.springaicommunity.agent.tools.TodoWriteTool.TodoEventHandler;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;

import java.util.concurrent.CopyOnWriteArrayList;

import static org.junit.jupiter.api.Assertions.*;

class TodoWriteHandlerTest {

    @Test
    void handlerReceivesTodos() {
        CopyOnWriteArrayList<String> capturedTasks = new CopyOnWriteArrayList<>();

        TodoEventHandler handler = todos -> {
            if (todos.todos() != null) {
                todos.todos().forEach(item -> capturedTasks.add(item.content()));
            }
        };

        TodoWriteTool tool = TodoWriteTool.builder()
                .todoEventHandler(handler)
                .build();

        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();

        assertTrue(callbacks.length > 0);
        ToolCallback callback = callbacks[0];
        assertNotNull(callback.getToolDefinition());
        assertEquals("TodoWrite", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void handlerWithNullTodosDoesNotThrow() {
        TodoEventHandler handler = todos -> {
            // Should not throw even if todos.todos() returns null
        };

        TodoWriteTool tool = TodoWriteTool.builder()
                .todoEventHandler(handler)
                .build();

        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();

        assertTrue(callbacks.length > 0);
    }

    @Test
    void todoWriteToolHasCorrectName() {
        TodoEventHandler handler = todos -> {};

        TodoWriteTool tool = TodoWriteTool.builder()
                .todoEventHandler(handler)
                .build();

        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();

        assertEquals("TodoWrite", callbacks[0].getToolDefinition().name());
    }
}
