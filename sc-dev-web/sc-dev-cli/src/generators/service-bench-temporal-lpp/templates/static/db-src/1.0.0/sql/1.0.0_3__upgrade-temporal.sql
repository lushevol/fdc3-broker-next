CREATE TABLE IF NOT EXISTS chasm_node_maps (
  shard_id INTEGER NOT NULL,
  namespace_id BYTEA NOT NULL,
  workflow_id VARCHAR(255) NOT NULL,
  run_id BYTEA NOT NULL,
  chasm_path BYTEA NOT NULL,
--
  metadata BYTEA NOT NULL,
  metadata_encoding VARCHAR(16),
  data BYTEA,
  data_encoding VARCHAR(16),
  PRIMARY KEY (shard_id, namespace_id, workflow_id, run_id, chasm_path)
);

-- Stores activity or workflow tasks
-- Used for fairness scheduling. (pass, task_id) are monotonically increasing.
CREATE TABLE IF NOT EXISTS tasks_v2 (
  range_hash BIGINT NOT NULL,
  task_queue_id BYTEA NOT NULL,
  pass BIGINT NOT NULL, -- pass for tasks (see stride scheduling algorithm for fairness)
  task_id BIGINT NOT NULL,
  --
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (range_hash, task_queue_id, pass, task_id)
);

-- Stores ephemeral task queue information such as ack levels and expiry times
CREATE TABLE IF NOT EXISTS  task_queues_v2 (
  range_hash BIGINT NOT NULL,
  task_queue_id BYTEA NOT NULL,
  --
  range_id BIGINT NOT NULL,
  data BYTEA NOT NULL,
  data_encoding VARCHAR(16) NOT NULL,
  PRIMARY KEY (range_hash, task_queue_id)
);


GRANT ALL PRIVILEGES ON TABLE chasm_node_maps TO "<%= dbRoleUser %>";
GRANT ALL PRIVILEGES ON TABLE tasks_v2 TO "<%= dbRoleUser %>";
GRANT ALL PRIVILEGES ON TABLE task_queues_v2 TO "<%= dbRoleUser %>";
