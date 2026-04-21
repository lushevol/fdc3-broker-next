package com.fdc3.elasticsearchmcp.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "analytics.elasticsearch")
public class ElasticsearchAnalyticsProperties {

    @NotBlank
    private String kibanaSearchUrl = "http://10.4.197.146:5601/api/console/proxy?path=%2Fsingle-ui-bff-analytic%2F_search&method=GET";

    @NotBlank
    private String createdAtField = "createdAt";

    @NotBlank
    private String userIdField = "userId";

    @NotBlank
    private String tileField = "tile";

    @NotBlank
    private String containerField = "container";

    @NotBlank
    private String nameField = "name";

    @NotBlank
    private String eventField = "event";

    @NotBlank
    private String keyField = "key";

    public String getKibanaSearchUrl() {
        return kibanaSearchUrl;
    }

    public void setKibanaSearchUrl(String kibanaSearchUrl) {
        this.kibanaSearchUrl = kibanaSearchUrl;
    }

    public String getCreatedAtField() {
        return createdAtField;
    }

    public void setCreatedAtField(String createdAtField) {
        this.createdAtField = createdAtField;
    }

    public String getKeyField() {
        return keyField;
    }

    public void setKeyField(String keyField) {
        this.keyField = keyField;
    }

    public String getEventField() {
        return eventField;
    }

    public void setEventField(String eventField) {
        this.eventField = eventField;
    }

    public String getContainerField() {
        return containerField;
    }

    public void setContainerField(String containerField) {
        this.containerField = containerField;
    }

    public String getTileField() {
        return tileField;
    }

    public void setTileField(String tileField) {
        this.tileField = tileField;
    }

    public String getNameField() {
        return nameField;
    }

    public void setNameField(String nameField) {
        this.nameField = nameField;
    }

    public String getUserIdField() {
        return userIdField;
    }

    public void setUserIdField(String userIdField) {
        this.userIdField = userIdField;
    }
}
