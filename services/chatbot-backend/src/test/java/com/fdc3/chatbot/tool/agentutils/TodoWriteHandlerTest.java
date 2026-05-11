package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.Test;
import org.springaicommunity.agent.tools.TodoWriteTool;
import org.springaicommunity.agent.tools.TodoWriteTool.TodoEventHandler;
import org.springaicommunity.agent.tools.TodoWriteTool.Todos;
import org.springaicommunity.agent.tools.TodoWriteTool.Todos.Status;
import org.springaicommunity.agent.tools.TodoWriteTool.Todos.TodoItem;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

class TodoWriteHandlerTest {

    @Test
    void handlerReceivesTodos() {
        AtomicReference<Todos> captured = new AtomicReference<>();
        TodoEventHandler handler = captured::set;
        TodoWriteTool tool = TodoWriteTool.builder()
                .todoEventHandler(handler)
                .build();

        Todos todos = new Todos(List.of(
                new TodoItem("Research FDC3", Status.pending, "Researching")
        ));
        handler.handle(todos);

        assertNotNull(captured.get());
        assertEquals(1, captured.get().todos().size());
        assertEquals("Research FDC3", captured.get().todos().get(0).content());
    }
}
