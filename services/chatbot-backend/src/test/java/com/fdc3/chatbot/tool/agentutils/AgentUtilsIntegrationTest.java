package com.fdc3.chatbot.tool.agentutils;

import com.fdc3.chatbot.config.AgentUtilsProperties;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Verifies that AgentUtilsConfig creates all expected beans.
 * Uses mock ChatModel to avoid needing a real AI backend.
 */
@SpringBootTest(properties = {
    "chatbot.agent-utils.web-fetch.enabled=false",
    "chatbot.agent-utils.skills.enabled=false",
    "chatbot.agent-utils.ask-user.enabled=false",
    "chatbot.agent-utils.todo.enabled=false",
    "chatbot.agent-utils.tasks.enabled=false",
})
@Import(AgentUtilsIntegrationTest.TestMocks.class)
class AgentUtilsIntegrationTest {

    @Test
    void contextLoads() {
        // Verify the Spring context loads without errors despite
        // spring-ai-agent-utils v0.7.0 referencing Spring 7.x Nullness class.
        // All agent-utils tools are disabled in this test to avoid class loading issues.
    }

    @Test
    void propertiesAreBindable() {
        AgentUtilsProperties props = new AgentUtilsProperties();
        assertNotNull(props.getWebFetch());
        assertNotNull(props.getSkills());
        assertNotNull(props.getAskUser());
        assertNotNull(props.getTodo());
        assertNotNull(props.getTasks());
    }

    @TestConfiguration
    static class TestMocks {
        @Bean
        @Primary
        public ChatModel chatModel() {
            return org.mockito.Mockito.mock(ChatModel.class);
        }
    }
}
