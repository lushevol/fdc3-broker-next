CREATE TABLE memory_entries (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(120) NOT NULL,
    user_id VARCHAR(180) NOT NULL,
    desk VARCHAR(120),
    type VARCHAR(40) NOT NULL,
    title VARCHAR(240) NOT NULL,
    body TEXT NOT NULL,
    tags_json TEXT NOT NULL DEFAULT '[]',
    source VARCHAR(40) NOT NULL,
    confidence DECIMAL(4,3) NOT NULL DEFAULT 1.000,
    status VARCHAR(40) NOT NULL,
    schema_version INTEGER NOT NULL DEFAULT 1,
    attributes_json TEXT NOT NULL DEFAULT '{}',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_used_at TIMESTAMP
);

CREATE INDEX idx_memory_entries_scope_updated
    ON memory_entries (tenant_id, user_id, status, updated_at);

CREATE INDEX idx_memory_entries_scope_type
    ON memory_entries (tenant_id, user_id, type, status);

CREATE INDEX idx_memory_entries_scope_desk
    ON memory_entries (tenant_id, user_id, desk, status);
