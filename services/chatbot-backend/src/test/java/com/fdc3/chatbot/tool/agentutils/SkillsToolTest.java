package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.Test;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.core.io.ClassPathResource;
import org.springaicommunity.agent.tools.SkillsTool;

import static org.junit.jupiter.api.Assertions.*;

class SkillsToolTest {

    @Test
    void loadsSkillsFromClasspath() {
        ToolCallback callback = SkillsTool.builder()
                .addSkillsResource(new ClassPathResource("skills"))
                .build();

        assertNotNull(callback);
        assertEquals("Skill", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

}
