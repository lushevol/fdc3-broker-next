package com.fdc3.chatbot.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = AgentUtilsPropertiesTest.MinimalConfig.class)
@TestPropertySource(properties = {
        "chatbot.agent-utils.web-fetch.enabled=true",
        "chatbot.agent-utils.web-fetch.user-agent=TestAgent/1.0",
        "chatbot.agent-utils.web-fetch.max-content-length=10000",
        "chatbot.agent-utils.web-fetch.domain-safety-check=true",
        "chatbot.agent-utils.skills.enabled=true",
        "chatbot.agent-utils.skills.location=classpath:test-skills/",
        "chatbot.agent-utils.todo.enabled=true",
        "chatbot.agent-utils.tasks.enabled=true",
        "chatbot.agent-utils.tasks.sub-agent-config.default-model=test-model"
})
class AgentUtilsPropertiesTest {

    @Autowired
    private AgentUtilsProperties properties;

    @Configuration
    @EnableConfigurationProperties(AgentUtilsProperties.class)
    static class MinimalConfig {
    }

    @Test
    void webFetchPropertiesAreBound() {
        AgentUtilsProperties.WebFetch webFetch = properties.getWebFetch();
        assertNotNull(webFetch);
        assertTrue(webFetch.isEnabled());
        assertEquals("TestAgent/1.0", webFetch.getUserAgent());
        assertEquals(10000, webFetch.getMaxContentLength());
        assertTrue(webFetch.isDomainSafetyCheck());
    }

    @Test
    void skillsPropertiesAreBound() {
        AgentUtilsProperties.Skills skills = properties.getSkills();
        assertNotNull(skills);
        assertTrue(skills.isEnabled());
        assertEquals("classpath:test-skills/", skills.getLocation());
    }

    @Test
    void todoPropertiesAreBound() {
        AgentUtilsProperties.Todo todo = properties.getTodo();
        assertNotNull(todo);
        assertTrue(todo.isEnabled());
    }

    @Test
    void tasksPropertiesAreBound() {
        AgentUtilsProperties.Tasks tasks = properties.getTasks();
        assertNotNull(tasks);
        assertTrue(tasks.isEnabled());
        assertEquals("test-model", tasks.getSubAgentConfig().getDefaultModel());
    }

    @Test
    void allConfigGroupsHaveDefaults() {
        AgentUtilsProperties defaults = new AgentUtilsProperties();
        assertTrue(defaults.getWebFetch().isEnabled());
        assertEquals("FDC3-Chatbot/1.0", defaults.getWebFetch().getUserAgent());
        assertEquals(50000, defaults.getWebFetch().getMaxContentLength());
        assertTrue(defaults.getWebFetch().isDomainSafetyCheck());
        assertTrue(defaults.getSkills().isEnabled());
        assertEquals("classpath:skills/", defaults.getSkills().getLocation());
        assertTrue(defaults.getTodo().isEnabled());
        assertTrue(defaults.getTasks().isEnabled());
        assertEquals("qwen3.5-plus", defaults.getTasks().getSubAgentConfig().getDefaultModel());
    }
}
