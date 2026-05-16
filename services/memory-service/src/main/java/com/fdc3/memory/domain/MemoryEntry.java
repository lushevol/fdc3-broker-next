package com.fdc3.memory.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "memory_entries")
public class MemoryEntry {
    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "tenant_id", nullable = false, length = 120)
    private String tenantId;

    @Column(name = "user_id", nullable = false, length = 180)
    private String userId;

    @Column(length = 120)
    private String desk;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private MemoryType type;

    @Column(nullable = false, length = 240)
    private String title;

    @Column(nullable = false)
    private String body;

    @Column(name = "tags_json", nullable = false)
    private String tagsJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private MemorySource source;

    @Column(nullable = false, columnDefinition = "DECIMAL")
    private BigDecimal confidence;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private MemoryStatus status;

    @Column(name = "schema_version", nullable = false)
    private Integer schemaVersion;

    @Column(name = "attributes_json", nullable = false)
    private String attributesJson;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "last_used_at")
    private Instant lastUsedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
        if (status == null) {
            status = MemoryStatus.ACTIVE;
        }
        if (source == null) {
            source = MemorySource.USER;
        }
        if (confidence == null) {
            confidence = BigDecimal.ONE;
        }
        if (schemaVersion == null) {
            schemaVersion = 1;
        }
        if (tagsJson == null || tagsJson.isBlank()) {
            tagsJson = "[]";
        }
        if (attributesJson == null || attributesJson.isBlank()) {
            attributesJson = "{}";
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getDesk() { return desk; }
    public void setDesk(String desk) { this.desk = desk; }
    public MemoryType getType() { return type; }
    public void setType(MemoryType type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getTagsJson() { return tagsJson; }
    public void setTagsJson(String tagsJson) { this.tagsJson = tagsJson; }
    public MemorySource getSource() { return source; }
    public void setSource(MemorySource source) { this.source = source; }
    public BigDecimal getConfidence() { return confidence; }
    public void setConfidence(BigDecimal confidence) { this.confidence = confidence; }
    public MemoryStatus getStatus() { return status; }
    public void setStatus(MemoryStatus status) { this.status = status; }
    public Integer getSchemaVersion() { return schemaVersion; }
    public void setSchemaVersion(Integer schemaVersion) { this.schemaVersion = schemaVersion; }
    public String getAttributesJson() { return attributesJson; }
    public void setAttributesJson(String attributesJson) { this.attributesJson = attributesJson; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public Instant getLastUsedAt() { return lastUsedAt; }
    public void setLastUsedAt(Instant lastUsedAt) { this.lastUsedAt = lastUsedAt; }
}
