-- 1. user settings
CREATE TABLE t_user_settings (
    id          VARCHAR(20)  NOT NULL,
    user_id     VARCHAR(200) NOT NULL,
    type        VARCHAR(100) NOT NULL,
    name        VARCHAR(200) NOT NULL,
    settings    JSONB,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  VARCHAR(200) NOT NULL,
    updated_by  VARCHAR(200) NOT NULL,
    version     INT4         NOT NULL DEFAULT 0,
    CONSTRAINT t_user_settings_pkey PRIMARY KEY (id),
    CONSTRAINT t_user_settings_unique UNIQUE (user_id, type, name)
);

-- Index to speed up lookups by user
CREATE INDEX idx_user_settings_user_id ON t_user_settings (user_id);
-- Index to speed up lookups by user + type (e.g. list all column settings for a user)
CREATE INDEX idx_user_settings_user_id_type ON t_user_settings (user_id, type);

-- 2. WORKFLOW NAVIGATION CACHE
CREATE TABLE t_workflow_navigation (
   id varchar(20) NOT NULL,
   unique_version_id varchar(100) NULL,
   unique_process_id varchar(100) NULL,
   workflow_id varchar(20) NOT NULL,
   workflow_name varchar(200) NOT NULL,
   task_key varchar(200) NOT NULL,
   task_name varchar(200) NOT NULL,
   assignee varchar(200) NULL,
   candidate_users jsonb DEFAULT '[]'::jsonb NULL,
   candidate_groups jsonb DEFAULT '[]'::jsonb NULL,
   sort_order int4 DEFAULT 0 NOT NULL,
   created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
   updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
   created_by varchar(200) NOT NULL,
   updated_by varchar(200) NOT NULL,
   "version" int4 DEFAULT 0 NOT NULL,
   CONSTRAINT t_workflow_navigation_pkey PRIMARY KEY (id),
   CONSTRAINT t_workflow_navigation_unique UNIQUE (workflow_id,task_key)
);
CREATE INDEX idx_workflow_navigation_assignee ON ratan_flowzero_designer_service.t_workflow_navigation (assignee);
CREATE INDEX idx_workflow_navigation_candidate_groups ON ratan_flowzero_designer_service.t_workflow_navigation (candidate_groups);
CREATE INDEX idx_workflow_navigation_candidate_users ON ratan_flowzero_designer_service.t_workflow_navigation (candidate_users);
CREATE INDEX idx_workflow_navigation_name_sort ON ratan_flowzero_designer_service.t_workflow_navigation (workflow_name,sort_order);


