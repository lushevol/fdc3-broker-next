CREATE TABLE t_workflow_request (
    id VARCHAR(20) PRIMARY KEY,
    workflow_id VARCHAR(20) NOT NULL,
    unique_version_id VARCHAR(100),
    global_variables JSONB,
    instance_id VARCHAR(100),
    status VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_by VARCHAR(20) NOT NULL,
    version int4 NOT NULL DEFAULT 0
);
CREATE INDEX idx_workflow_request_created_by ON t_workflow_request (created_by);
CREATE INDEX idx_workflow_request_workflow_id ON t_workflow_request (workflow_id);
CREATE INDEX idx_workflow_request_unique_version_id ON t_workflow_request (unique_version_id);
CREATE UNIQUE INDEX idx_workflow_request_instance_id ON t_workflow_request (instance_id);