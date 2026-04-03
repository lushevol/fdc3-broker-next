package com.fdc3.elasticsearchmcp.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "analytics.elasticsearch")
public class ElasticsearchAnalyticsProperties {

    @NotBlank
    private String url = "http://localhost:9200";

    private String apiKey;

    private String username;

    private String password;

    @NotBlank
    private String indexName = "user-operation-logs";

    @NotBlank
    private String timestampField = "@timestamp";

    @NotBlank
    private String appIdField = "appId";

    @NotBlank
    private String appNameField = "appName";

    @NotBlank
    private String userIdField = "profileId";

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIndexName() {
        return indexName;
    }

    public void setIndexName(String indexName) {
        this.indexName = indexName;
    }

    public String getTimestampField() {
        return timestampField;
    }

    public void setTimestampField(String timestampField) {
        this.timestampField = timestampField;
    }

    public String getAppIdField() {
        return appIdField;
    }

    public void setAppIdField(String appIdField) {
        this.appIdField = appIdField;
    }

    public String getAppNameField() {
        return appNameField;
    }

    public void setAppNameField(String appNameField) {
        this.appNameField = appNameField;
    }

    public String getUserIdField() {
        return userIdField;
    }

    public void setUserIdField(String userIdField) {
        this.userIdField = userIdField;
    }
}
