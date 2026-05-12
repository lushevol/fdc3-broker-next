package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.Test;
import org.springaicommunity.agent.tools.SkillsTool;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.core.io.ClassPathResource;

import static org.junit.jupiter.api.Assertions.*;

class SkillsToolTest {

    @Test
    void skillsToolBuilderCreatesCallback() {
        ToolCallback callback = SkillsTool.builder()
                .addSkillsResource(new ClassPathResource("skills"))
                .build();

        assertNotNull(callback);
        assertEquals("Skill", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void skillsToolHasNonNullDescription() {
        ToolCallback callback = SkillsTool.builder()
                .addSkillsResource(new ClassPathResource("skills"))
                .build();

        assertNotNull(callback.getToolDefinition().description());
        assertFalse(callback.getToolDefinition().description().isBlank());
    }

    @Test
    void skillsToolWithMultipleResources() {
        ToolCallback callback = SkillsTool.builder()
                .addSkillsResource(new ClassPathResource("skills"))
                .addSkillsResource(new ClassPathResource("skills"))
                .build();

        assertNotNull(callback);
        assertEquals("Skill", callback.getToolDefinition().name());
    }
}
