CREATE TABLE schema_version (
	version_partition int4 NOT NULL,
	db_name varchar(255) NOT NULL,
	creation_time timestamp NULL,
	curr_version varchar(64) NULL,
	min_compatible_version varchar(64) NULL,
	CONSTRAINT schema_version_pkey PRIMARY KEY (version_partition, db_name)
);

CREATE TABLE namespaces(
  partition_id INTEGER NOT NULL,
  id BYTEA NOT NULL,
  name VARCHAR(255) UNIQUE NOT NULL,
  notification_version BIGINT NOT NULL,
  --
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  is_global BOOLEAN NOT NULL,
  PRIMARY KEY(partition_id, id)
);

CREATE TABLE namespace_metadata (
  partition_id INTEGER NOT NULL,
  notification_version BIGINT NOT NULL,
  PRIMARY KEY(partition_id)
);

INSERT INTO namespace_metadata (partition_id, notification_version) VALUES (54321, 1);

CREATE TABLE shards (
  shard_id INTEGER NOT NULL,
  --
  range_id BIGINT NOT NULL,
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (shard_id)
);

CREATE TABLE executions(
  shard_id INTEGER NOT NULL,
  namespace_id BYTEA NOT NULL,
  workflow_id VARCHAR(255) NOT NULL,
  run_id BYTEA NOT NULL,
  --
  next_event_id BIGINT NOT NULL,
  last_write_version BIGINT NOT NULL,
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  state BYTEA NOT NULL,
  state_encoding VARCHAR(16) NOT NULL,
  db_record_version BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (shard_id, namespace_id, workflow_id, run_id)
);

CREATE TABLE current_executions(
  shard_id INTEGER NOT NULL,
  namespace_id BYTEA NOT NULL,
  workflow_id VARCHAR(255) NOT NULL,
  --
  run_id BYTEA NOT NULL,
  create_request_id VARCHAR(255) NOT NULL,
  state INTEGER NOT NULL,
  status INTEGER NOT NULL,
  start_version BIGINT NOT NULL DEFAULT 0,
  start_time TIMESTAMP NULL,
  last_write_version BIGINT NOT NULL,
  -- `data` contains the WorkflowExecutionState (same as in `executions.state` above)
  data BYTEA NULL,
  data_encoding VARCHAR(16) NOT NULL DEFAULT '',
  PRIMARY KEY (shard_id, namespace_id, workflow_id)
);

CREATE TABLE buffered_events (
  shard_id INTEGER NOT NULL,
  namespace_id BYTEA NOT NULL,
  workflow_id VARCHAR(255) NOT NULL,
  run_id BYTEA NOT NULL,
  id BIGSERIAL NOT NULL UNIQUE,
  --
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (shard_id, namespace_id, workflow_id, run_id, id)
);

CREATE TABLE tasks (
  range_hash BIGINT NOT NULL,
  task_queue_id BYTEA NOT NULL,
  task_id BIGINT NOT NULL,
  --
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (range_hash, task_queue_id, task_id)
);

-- Stores ephemeral task queue information such as ack levels and expiry times
CREATE TABLE task_queues (
  range_hash BIGINT NOT NULL,
  task_queue_id BYTEA NOT NULL,
  --
  range_id BIGINT NOT NULL,
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (range_hash, task_queue_id)
);

-- Stores task queue information such as user provided versioning data
CREATE TABLE task_queue_user_data (
  namespace_id    BYTEA NOT NULL,
  task_queue_name VARCHAR(255) NOT NULL,
  data            BYTEA NOT NULL,       -- server.api.persistence.v1.TaskQueueUserData
  data_encoding   VARCHAR(16) NOT NULL, -- Encoding type used for serialization, in practice this should always be proto3
  version         BIGINT NOT NULL,      -- Version of this row, used for optimistic concurrency
  PRIMARY KEY (namespace_id, task_queue_name)
);

-- Stores a mapping between build ids and task queues
CREATE TABLE build_id_to_task_queue (
  namespace_id    BYTEA NOT NULL,
  build_id        VARCHAR(255) NOT NULL,
  task_queue_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (namespace_id, build_id, task_queue_name)
);

CREATE TABLE history_immediate_tasks(
  shard_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  task_id BIGINT NOT NULL,
  --
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (shard_id, category_id, task_id)
);

CREATE TABLE history_scheduled_tasks (
  shard_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  visibility_timestamp TIMESTAMP NOT NULL,
  task_id BIGINT NOT NULL,
  --
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (shard_id, category_id, visibility_timestamp, task_id)
);

CREATE TABLE transfer_tasks(
  shard_id INTEGER NOT NULL,
  task_id BIGINT NOT NULL,
  --
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (shard_id, task_id)
);

CREATE TABLE timer_tasks (
  shard_id INTEGER NOT NULL,
  visibility_timestamp TIMESTAMP NOT NULL,
  task_id BIGINT NOT NULL,
  --
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (shard_id, visibility_timestamp, task_id)
);

CREATE TABLE replication_tasks (
  shard_id INTEGER NOT NULL,
  task_id BIGINT NOT NULL,
  --
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (shard_id, task_id)
);

CREATE TABLE replication_tasks_dlq (
  source_cluster_name VARCHAR(255) NOT NULL,
  shard_id INTEGER NOT NULL,
  task_id BIGINT NOT NULL,
  --
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (source_cluster_name, shard_id, task_id)
);

CREATE TABLE visibility_tasks(
  shard_id INTEGER NOT NULL,
  task_id BIGINT NOT NULL,
  --
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (shard_id, task_id)
);

CREATE TABLE activity_info_maps (
-- each row corresponds to one key of one map<string, ActivityInfo>
  shard_id INTEGER NOT NULL,
  namespace_id BYTEA NOT NULL,
  workflow_id VARCHAR(255) NOT NULL,
  run_id BYTEA NOT NULL,
  schedule_id BIGINT NOT NULL,
--
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16),
  PRIMARY KEY (shard_id, namespace_id, workflow_id, run_id, schedule_id)
);

CREATE TABLE timer_info_maps (
  shard_id INTEGER NOT NULL,
  namespace_id BYTEA NOT NULL,
  workflow_id VARCHAR(255) NOT NULL,
  run_id BYTEA NOT NULL,
  timer_id VARCHAR(255) NOT NULL,
--
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16),
  PRIMARY KEY (shard_id, namespace_id, workflow_id, run_id, timer_id)
);

CREATE TABLE child_execution_info_maps (
  shard_id INTEGER NOT NULL,
  namespace_id BYTEA NOT NULL,
  workflow_id VARCHAR(255) NOT NULL,
  run_id BYTEA NOT NULL,
  initiated_id BIGINT NOT NULL,
--
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16),
  PRIMARY KEY (shard_id, namespace_id, workflow_id, run_id, initiated_id)
);

CREATE TABLE request_cancel_info_maps (
  shard_id INTEGER NOT NULL,
  namespace_id BYTEA NOT NULL,
  workflow_id VARCHAR(255) NOT NULL,
  run_id BYTEA NOT NULL,
  initiated_id BIGINT NOT NULL,
--
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16),
  PRIMARY KEY (shard_id, namespace_id, workflow_id, run_id, initiated_id)
);

CREATE TABLE signal_info_maps (
  shard_id INTEGER NOT NULL,
  namespace_id BYTEA NOT NULL,
  workflow_id VARCHAR(255) NOT NULL,
  run_id BYTEA NOT NULL,
  initiated_id BIGINT NOT NULL,
--
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16),
  PRIMARY KEY (shard_id, namespace_id, workflow_id, run_id, initiated_id)
);

CREATE TABLE signals_requested_sets (
  shard_id INTEGER NOT NULL,
  namespace_id BYTEA NOT NULL,
  workflow_id VARCHAR(255) NOT NULL,
  run_id BYTEA NOT NULL,
  signal_id VARCHAR(255) NOT NULL,
  --
  PRIMARY KEY (shard_id, namespace_id, workflow_id, run_id, signal_id)
);

-- history eventsV2: history_node stores history event data
CREATE TABLE history_node (
  shard_id       INTEGER NOT NULL,
  tree_id        BYTEA NOT NULL,
  branch_id      BYTEA NOT NULL,
  node_id        BIGINT NOT NULL,
  txn_id         BIGINT NOT NULL,
  --
  prev_txn_id    BIGINT NOT NULL DEFAULT 0,
  data           BYTEA NOT NULL,
  data_encoding  VARCHAR(16) NOT NULL,
  PRIMARY KEY (shard_id, tree_id, branch_id, node_id, txn_id)
);

-- history eventsV2: history_tree stores branch metadata
CREATE TABLE history_tree (
  shard_id       INTEGER NOT NULL,
  tree_id        BYTEA NOT NULL,
  branch_id      BYTEA NOT NULL,
  --
  data           BYTEA NOT NULL,
  data_encoding  VARCHAR(16) NOT NULL,
  PRIMARY KEY (shard_id, tree_id, branch_id)
);

CREATE TABLE queue (
  queue_type        INTEGER NOT NULL,
  message_id        BIGINT NOT NULL,
  message_payload   BYTEA NOT NULL,
  message_encoding  VARCHAR(16) NOT NULL,
  PRIMARY KEY(queue_type, message_id)
);

CREATE TABLE queue_metadata (
  queue_type     INTEGER NOT NULL,
  data BYTEA     NOT NULL,
  data_encoding  VARCHAR(16) NOT NULL,
  version        BIGINT NOT NULL,
  PRIMARY KEY(queue_type)
);

CREATE TABLE cluster_metadata_info (
  metadata_partition        INTEGER NOT NULL,
  cluster_name              VARCHAR(255) NOT NULL,
  data                      BYTEA NOT NULL,
  data_encoding             VARCHAR(16) NOT NULL,
  version                   BIGINT NOT NULL,
  PRIMARY KEY(metadata_partition, cluster_name)
);

CREATE TABLE cluster_membership
(
    membership_partition INTEGER NOT NULL,
    host_id              BYTEA NOT NULL,
    rpc_address          VARCHAR(128) NOT NULL,
    rpc_port             SMALLINT NOT NULL,
    role                 SMALLINT NOT NULL,
    session_start        TIMESTAMP DEFAULT '1970-01-01 00:00:01+00:00',
    last_heartbeat       TIMESTAMP DEFAULT '1970-01-01 00:00:01+00:00',
    record_expiry        TIMESTAMP DEFAULT '1970-01-01 00:00:01+00:00',
    PRIMARY KEY (membership_partition, host_id)
);

CREATE TABLE queues (
    queue_type INT NOT NULL,
    queue_name VARCHAR(255) NOT NULL,
    metadata_payload BYTEA NOT NULL,
    metadata_encoding VARCHAR(16) NOT NULL,
    PRIMARY KEY (queue_type, queue_name)
);

CREATE TABLE queue_messages (
    queue_type INT NOT NULL,
    queue_name VARCHAR(255) NOT NULL,
    queue_partition BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    message_payload BYTEA NOT NULL,
    message_encoding VARCHAR(16) NOT NULL,
    PRIMARY KEY (
        queue_type,
        queue_name,
        queue_partition,
        message_id
    )
);

-- Stores information about Nexus endpoints
CREATE TABLE nexus_endpoints (
    id            BYTEA NOT NULL,
    data          BYTEA NOT NULL,  -- server.api.persistence.v1.NexusEndpoint
    data_encoding VARCHAR(16) NOT NULL, -- Encoding type used for serialization, in practice this should always be proto3
    version       BIGINT NOT NULL,      -- Version of this row, used for optimistic concurrency
    PRIMARY KEY (id)
);

-- Stores the version of Nexus endpoints table as a whole
CREATE TABLE nexus_endpoints_partition_status (
    id      INT NOT NULL PRIMARY KEY DEFAULT 0,
    version BIGINT NOT NULL,                -- Version of the nexus_endpoints table
    CONSTRAINT only_one_row CHECK (id = 0)  -- Restrict the table to a single row since it will only be used for endpoints
);

CREATE UNIQUE INDEX cm_idx_rolehost ON cluster_membership (role, host_id);
CREATE INDEX cm_idx_rolelasthb ON cluster_membership (role, last_heartbeat);
CREATE INDEX cm_idx_rpchost ON cluster_membership (rpc_address, role);
CREATE INDEX cm_idx_lasthb ON cluster_membership (last_heartbeat);
CREATE INDEX cm_idx_recordexpiry ON cluster_membership (record_expiry);



CREATE EXTENSION IF NOT EXISTS btree_gin;

-- convert_ts converts a timestamp in RFC3339 to UTC timestamp without time zone.
CREATE FUNCTION convert_ts(s VARCHAR) RETURNS TIMESTAMP AS $$
BEGIN
  RETURN s::timestamptz at time zone 'UTC';
END
$$ LANGUAGE plpgsql IMMUTABLE RETURNS NULL ON NULL INPUT;

CREATE TABLE executions_visibility (
  namespace_id            CHAR(64)      NOT NULL,
  run_id                  CHAR(64)      NOT NULL,
  _version                BIGINT        NOT NULL DEFAULT 0, -- increasing version, used to reject upserts which are out of order
  start_time              TIMESTAMP     NOT NULL,
  execution_time          TIMESTAMP     NOT NULL,
  workflow_id             VARCHAR(255)  NOT NULL,
  workflow_type_name      VARCHAR(255)  NOT NULL,
  status                  INTEGER       NOT NULL,  -- enum WorkflowExecutionStatus {RUNNING, COMPLETED, FAILED, CANCELED, TERMINATED, CONTINUED_AS_NEW, TIMED_OUT}
  close_time              TIMESTAMP     NULL,
  history_length          BIGINT        NULL,
  history_size_bytes      BIGINT        NULL,
  execution_duration      BIGINT        NULL,
  state_transition_count  BIGINT        NULL,
  memo                    BYTEA         NULL,
  encoding                VARCHAR(64)   NOT NULL,
  task_queue              VARCHAR(255)  NOT NULL DEFAULT '',
  search_attributes       JSONB         NULL,
  parent_workflow_id      VARCHAR(255)  NULL,
  parent_run_id           VARCHAR(255)  NULL,
  root_workflow_id        VARCHAR(255)  NOT NULL DEFAULT '',
  root_run_id             VARCHAR(255)  NOT NULL DEFAULT '',

  -- Each search attribute has its own generated column.
  -- Since PostgreSQL doesn't support virtual columns, all columns are stored.
  -- PostgreSQL doesn't auto cast to the corresponding column type, so we need to explicitly do it.
  -- Check the `custom_search_attributes` table for complete set of examples.

  -- Pre-defined search attributes
  TemporalChangeVersion         JSONB         GENERATED ALWAYS AS (search_attributes->'TemporalChangeVersion')                    STORED,
  BinaryChecksums               JSONB         GENERATED ALWAYS AS (search_attributes->'BinaryChecksums')                          STORED,
  BatcherUser                   VARCHAR(255)  GENERATED ALWAYS AS (search_attributes->>'BatcherUser')                             STORED,
  TemporalScheduledStartTime    TIMESTAMP     GENERATED ALWAYS AS (convert_ts(search_attributes->>'TemporalScheduledStartTime'))  STORED,
  TemporalScheduledById         VARCHAR(255)  GENERATED ALWAYS AS (search_attributes->>'TemporalScheduledById')                   STORED,
  TemporalSchedulePaused        BOOLEAN       GENERATED ALWAYS AS ((search_attributes->'TemporalSchedulePaused')::boolean)        STORED,
  TemporalNamespaceDivision     VARCHAR(255)  GENERATED ALWAYS AS (search_attributes->>'TemporalNamespaceDivision')               STORED,
  BuildIds                      JSONB         GENERATED ALWAYS AS (search_attributes->'BuildIds')                                 STORED,
  TemporalPauseInfo             JSONB         GENERATED ALWAYS AS (search_attributes->'TemporalPauseInfo')                        STORED,
  TemporalWorkerDeploymentVersion    VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'TemporalWorkerDeploymentVersion')          STORED,
  TemporalWorkflowVersioningBehavior VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'TemporalWorkflowVersioningBehavior')       STORED,
  TemporalWorkerDeployment           VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'TemporalWorkerDeployment')                 STORED,

  -- Pre-allocated custom search attributes
  Bool01          BOOLEAN         GENERATED ALWAYS AS ((search_attributes->'Bool01')::boolean)        STORED,
  Bool02          BOOLEAN         GENERATED ALWAYS AS ((search_attributes->'Bool02')::boolean)        STORED,
  Bool03          BOOLEAN         GENERATED ALWAYS AS ((search_attributes->'Bool03')::boolean)        STORED,
  Datetime01      TIMESTAMP       GENERATED ALWAYS AS (convert_ts(search_attributes->>'Datetime01'))  STORED,
  Datetime02      TIMESTAMP       GENERATED ALWAYS AS (convert_ts(search_attributes->>'Datetime02'))  STORED,
  Datetime03      TIMESTAMP       GENERATED ALWAYS AS (convert_ts(search_attributes->>'Datetime03'))  STORED,
  Double01        DECIMAL(20, 5)  GENERATED ALWAYS AS ((search_attributes->'Double01')::decimal)      STORED,
  Double02        DECIMAL(20, 5)  GENERATED ALWAYS AS ((search_attributes->'Double02')::decimal)      STORED,
  Double03        DECIMAL(20, 5)  GENERATED ALWAYS AS ((search_attributes->'Double03')::decimal)      STORED,
  Int01           BIGINT          GENERATED ALWAYS AS ((search_attributes->'Int01')::bigint)          STORED,
  Int02           BIGINT          GENERATED ALWAYS AS ((search_attributes->'Int02')::bigint)          STORED,
  Int03           BIGINT          GENERATED ALWAYS AS ((search_attributes->'Int03')::bigint)          STORED,
  Keyword01       VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'Keyword01')               STORED,
  Keyword02       VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'Keyword02')               STORED,
  Keyword03       VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'Keyword03')               STORED,
  Keyword04       VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'Keyword04')               STORED,
  Keyword05       VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'Keyword05')               STORED,
  Keyword06       VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'Keyword06')               STORED,
  Keyword07       VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'Keyword07')               STORED,
  Keyword08       VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'Keyword08')               STORED,
  Keyword09       VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'Keyword09')               STORED,
  Keyword10       VARCHAR(255)    GENERATED ALWAYS AS (search_attributes->>'Keyword10')               STORED,
  Text01          TSVECTOR        GENERATED ALWAYS AS ((search_attributes->>'Text01')::tsvector)      STORED,
  Text02          TSVECTOR        GENERATED ALWAYS AS ((search_attributes->>'Text02')::tsvector)      STORED,
  Text03          TSVECTOR        GENERATED ALWAYS AS ((search_attributes->>'Text03')::tsvector)      STORED,
  KeywordList01   JSONB           GENERATED ALWAYS AS (search_attributes->'KeywordList01')            STORED,
  KeywordList02   JSONB           GENERATED ALWAYS AS (search_attributes->'KeywordList02')            STORED,
  KeywordList03   JSONB           GENERATED ALWAYS AS (search_attributes->'KeywordList03')            STORED,

  PRIMARY KEY  (namespace_id, run_id)
);

CREATE INDEX default_idx                ON executions_visibility (namespace_id, (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_execution_time          ON executions_visibility (namespace_id, execution_time,         (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_workflow_id             ON executions_visibility (namespace_id, workflow_id,            (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_workflow_type           ON executions_visibility (namespace_id, workflow_type_name,     (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_status                  ON executions_visibility (namespace_id, status,                 (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_history_length          ON executions_visibility (namespace_id, history_length,         (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_history_size_bytes      ON executions_visibility (namespace_id, history_size_bytes,     (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_execution_duration      ON executions_visibility (namespace_id, execution_duration,     (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_state_transition_count  ON executions_visibility (namespace_id, state_transition_count, (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_task_queue              ON executions_visibility (namespace_id, task_queue,             (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_parent_workflow_id      ON executions_visibility (namespace_id, parent_workflow_id,     (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_parent_run_id           ON executions_visibility (namespace_id, parent_run_id,          (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_root_workflow_id        ON executions_visibility (namespace_id, root_workflow_id,       (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_root_run_id             ON executions_visibility (namespace_id, root_run_id,            (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);

-- Indexes for the predefined search attributes
CREATE INDEX by_temporal_change_version       ON executions_visibility USING GIN (namespace_id, TemporalChangeVersion jsonb_path_ops);
CREATE INDEX by_binary_checksums              ON executions_visibility USING GIN (namespace_id, BinaryChecksums jsonb_path_ops);
CREATE INDEX by_build_ids                     ON executions_visibility USING GIN (namespace_id, BuildIds jsonb_path_ops);
CREATE INDEX by_temporal_pause_info           ON executions_visibility USING GIN (namespace_id, TemporalPauseInfo jsonb_path_ops);
CREATE INDEX by_temporal_worker_deployment_version ON executions_visibility (namespace_id, TemporalWorkerDeploymentVersion,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_temporal_workflow_versioning_behavior ON executions_visibility (namespace_id, TemporalWorkflowVersioningBehavior,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_temporal_worker_deployment    ON executions_visibility (namespace_id, TemporalWorkerDeployment,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_batcher_user                  ON executions_visibility (namespace_id, BatcherUser,                (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_temporal_scheduled_start_time ON executions_visibility (namespace_id, TemporalScheduledStartTime, (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_temporal_scheduled_by_id      ON executions_visibility (namespace_id, TemporalScheduledById,      (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_temporal_schedule_paused      ON executions_visibility (namespace_id, TemporalSchedulePaused,     (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_temporal_namespace_division   ON executions_visibility (namespace_id, TemporalNamespaceDivision,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);

-- Indexes for the pre-allocated custom search attributes
CREATE INDEX by_bool_01         ON executions_visibility (namespace_id, Bool01,     (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_bool_02         ON executions_visibility (namespace_id, Bool02,     (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_bool_03         ON executions_visibility (namespace_id, Bool03,     (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_datetime_01     ON executions_visibility (namespace_id, Datetime01, (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_datetime_02     ON executions_visibility (namespace_id, Datetime02, (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_datetime_03     ON executions_visibility (namespace_id, Datetime03, (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_double_01       ON executions_visibility (namespace_id, Double01,   (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_double_02       ON executions_visibility (namespace_id, Double02,   (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_double_03       ON executions_visibility (namespace_id, Double03,   (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_int_01          ON executions_visibility (namespace_id, Int01,      (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_int_02          ON executions_visibility (namespace_id, Int02,      (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_int_03          ON executions_visibility (namespace_id, Int03,      (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_keyword_01      ON executions_visibility (namespace_id, Keyword01,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_keyword_02      ON executions_visibility (namespace_id, Keyword02,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_keyword_03      ON executions_visibility (namespace_id, Keyword03,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_keyword_04      ON executions_visibility (namespace_id, Keyword04,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_keyword_05      ON executions_visibility (namespace_id, Keyword05,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_keyword_06      ON executions_visibility (namespace_id, Keyword06,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_keyword_07      ON executions_visibility (namespace_id, Keyword07,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_keyword_08      ON executions_visibility (namespace_id, Keyword08,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_keyword_09      ON executions_visibility (namespace_id, Keyword09,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_keyword_10      ON executions_visibility (namespace_id, Keyword10,  (COALESCE(close_time, '9999-12-31 23:59:59')) DESC, start_time DESC, run_id);
CREATE INDEX by_text_01         ON executions_visibility USING GIN (namespace_id, Text01);
CREATE INDEX by_text_02         ON executions_visibility USING GIN (namespace_id, Text02);
CREATE INDEX by_text_03         ON executions_visibility USING GIN (namespace_id, Text03);
CREATE INDEX by_keyword_list_01 ON executions_visibility USING GIN (namespace_id, KeywordList01 jsonb_path_ops);
CREATE INDEX by_keyword_list_02 ON executions_visibility USING GIN (namespace_id, KeywordList02 jsonb_path_ops);
CREATE INDEX by_keyword_list_03 ON executions_visibility USING GIN (namespace_id, KeywordList03 jsonb_path_ops);