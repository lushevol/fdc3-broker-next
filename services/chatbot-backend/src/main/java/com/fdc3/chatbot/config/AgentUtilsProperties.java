package com.fdc3.chatbot.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("chatbot.agent-utils")
public class AgentUtilsProperties {

    private WebFetch webFetch = new WebFetch();
    private WebSearch webSearch = new WebSearch();
    private Skills skills = new Skills();
    private Todo todo = new Todo();
    private Tasks tasks = new Tasks();
    private AskUser askUser = new AskUser();

    public WebFetch getWebFetch() { return webFetch; }
    public void setWebFetch(WebFetch webFetch) { this.webFetch = webFetch; }
    public WebSearch getWebSearch() { return webSearch; }
    public void setWebSearch(WebSearch webSearch) { this.webSearch = webSearch; }
    public Skills getSkills() { return skills; }
    public void setSkills(Skills skills) { this.skills = skills; }
    public Todo getTodo() { return todo; }
    public void setTodo(Todo todo) { this.todo = todo; }
    public Tasks getTasks() { return tasks; }
    public void setTasks(Tasks tasks) { this.tasks = tasks; }
    public AskUser getAskUser() { return askUser; }
    public void setAskUser(AskUser askUser) { this.askUser = askUser; }

    public static class WebFetch {
        private boolean enabled = true;
        @NotBlank
        private String userAgent = "FDC3-Chatbot/1.0";
        @Min(1024)
        @Max(1_000_000)
        private int maxContentLength = 50000;
        private boolean domainSafetyCheck = true;

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public String getUserAgent() { return userAgent; }
        public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
        public int getMaxContentLength() { return maxContentLength; }
        public void setMaxContentLength(int maxContentLength) { this.maxContentLength = maxContentLength; }
        public boolean isDomainSafetyCheck() { return domainSafetyCheck; }
        public void setDomainSafetyCheck(boolean domainSafetyCheck) { this.domainSafetyCheck = domainSafetyCheck; }
    }

    public static class Skills {
        private boolean enabled = true;
        private String location = "classpath:skills/";

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }

    public static class WebSearch {
        private boolean enabled = true;
        private int resultCount = 5;

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        @Min(1) @Max(20)
        public int getResultCount() { return resultCount; }
        public void setResultCount(int resultCount) { this.resultCount = resultCount; }
    }

    public static class AskUser {
        private boolean enabled = true;

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    public static class Todo {
        private boolean enabled = true;

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    public static class Tasks {
        private boolean enabled = true;
        private SubAgentConfig subAgentConfig = new SubAgentConfig();

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public SubAgentConfig getSubAgentConfig() { return subAgentConfig; }
        public void setSubAgentConfig(SubAgentConfig subAgentConfig) { this.subAgentConfig = subAgentConfig; }

        public static class SubAgentConfig {
            private String defaultModel = "qwen3.5-plus";

            public String getDefaultModel() { return defaultModel; }
            public void setDefaultModel(String defaultModel) { this.defaultModel = defaultModel; }
        }
    }
}
