package com.fdc3.elasticsearchmcp.config;

import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "analytics.elasticsearch")
public class ElasticsearchAnalyticsProperties {

    private static final Logger log = LoggerFactory.getLogger(ElasticsearchAnalyticsProperties.class);

    @NotBlank
    private String kibanaSearchUrl = "http://10.4.197.146:5601/api/console/proxy?path=%2Fsingle-ui-bff-analytic%2F_search&method=GET";

    @NotBlank
    private String kibanaSqlUrl = "http://10.4.197.146:5601/api/console/proxy?path=%2F_sql%3Fformat%3Djson&method=POST";

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
    private String indexName = "single-ui-bff-analytic";

    @NotBlank
    private String keyField = "key";

    public String getKibanaSearchUrl() {
        log.info("Getting KibanaSearchUrl: {}", kibanaSearchUrl);
        return kibanaSearchUrl;
    }

    public void setKibanaSearchUrl(String kibanaSearchUrl) {
        log.info("Setting KibanaSearchUrl: {}", kibanaSearchUrl);
        this.kibanaSearchUrl = kibanaSearchUrl;
    }

    public String getKibanaSqlUrl() {
        return kibanaSqlUrl;
    }

    public void setKibanaSqlUrl(String kibanaSqlUrl) {
        log.info("Setting kibanaSqlUrl: {}", kibanaSqlUrl);
        this.kibanaSqlUrl = kibanaSqlUrl;
    }

    public String getCreatedAtField() {
        return createdAtField;
    }

    public void setCreatedAtField(String createdAtField) {
        log.info("Setting createdAtField: {}", createdAtField);
        this.createdAtField = createdAtField;
    }

    public String getKeyField() {
        return keyField;
    }

    public void setKeyField(String keyField) {
        log.info("Setting keyField: {}", keyField);
        this.keyField = keyField;
    }

    public String getEventField() {
        return eventField;
    }

    public void setEventField(String eventField) {
        log.info("Setting eventField: {}", eventField);
        this.eventField = eventField;
    }

    public String getContainerField() {
        return containerField;
    }

    public void setContainerField(String containerField) {
        log.info("Setting containerField: {}", containerField);
        this.containerField = containerField;
    }

    public String getTileField() {
        return tileField;
    }

    public void setTileField(String tileField) {
        log.info("Setting tileField: {}", tileField);
        this.tileField = tileField;
    }

    public String getNameField() {
        return nameField;
    }

    public void setNameField(String nameField) {
        log.info("Setting nameField: {}", nameField);
        this.nameField = nameField;
    }

    public String getIndexName() {
        return indexName;
    }

    public void setIndexName(String indexName) {
        this.indexName = indexName;
    }

    public String getUserIdField() {
        return userIdField;
    }

    public void setUserIdField(String userIdField) {
        log.info("Setting userIdField: {}", userIdField);
        this.userIdField = userIdField;
    }
}
