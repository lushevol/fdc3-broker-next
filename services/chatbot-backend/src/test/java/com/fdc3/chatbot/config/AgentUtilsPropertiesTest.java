package com.fdc3.chatbot.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AgentUtilsPropertiesTest {

    @Test
    void webFetchConfig() {
        AgentUtilsProperties properties = new AgentUtilsProperties();
        properties.getWebFetch().setEnabled(true);
        properties.getWebFetch().setUserAgent("TestAgent/1.0");

        assertTrue(properties.getWebFetch().isEnabled());
        assertEquals("TestAgent/1.0", properties.getWebFetch().getUserAgent());
        assertEquals(50000, properties.getWebFetch().getMaxContentLength());
    }

    @Test
    void skillsConfig() {
        AgentUtilsProperties properties = new AgentUtilsProperties();
        properties.getSkills().setEnabled(true);
        properties.getSkills().setLocation("classpath:test-skills/");

        assertTrue(properties.getSkills().isEnabled());
        assertEquals("classpath:test-skills/", properties.getSkills().getLocation());
    }

    @Test
    void askUserConfig() {
        AgentUtilsProperties properties = new AgentUtilsProperties();
        assertNotNull(properties.getAskUser());
        assertTrue(properties.getAskUser().isEnabled());
    }

    @Test
    void todoConfig() {
        AgentUtilsProperties properties = new AgentUtilsProperties();
        assertNotNull(properties.getTodo());
        assertTrue(properties.getTodo().isEnabled());
    }

    @Test
    void tasksConfig() {
        AgentUtilsProperties properties = new AgentUtilsProperties();
        properties.getTasks().setEnabled(false);
        assertFalse(properties.getTasks().isEnabled());
    }

    @Test
    void defaultValues() {
        AgentUtilsProperties properties = new AgentUtilsProperties();
        assertTrue(properties.getWebFetch().isEnabled());
        assertEquals(50000, properties.getWebFetch().getMaxContentLength());
        assertTrue(properties.getSkills().isEnabled());
        assertEquals("classpath:skills/", properties.getSkills().getLocation());
        assertTrue(properties.getTasks().isEnabled());
    }
}
