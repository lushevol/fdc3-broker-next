-- ============================================================
-- V1_0_1: ShedLock distributed scheduling lock table
-- ============================================================
-- ShedLock uses this table to coordinate mutually exclusive
-- execution of scheduled tasks across multiple pods.
-- Each scheduled task maps to one row; lock validity is
-- determined by lock_until / locked_at / locked_by fields,
-- ensuring only one instance holds the lock at any time.
-- ============================================================

CREATE TABLE IF NOT EXISTS ratan_flowzero_orchestration_service.shedlock (
    name       VARCHAR(64)  NOT NULL,
    lock_until TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    locked_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    locked_by  VARCHAR(255) NOT NULL,
    CONSTRAINT pk_shedlock PRIMARY KEY (name)
);

COMMENT ON TABLE  ratan_flowzero_orchestration_service.shedlock              IS 'ShedLock: distributed scheduling lock persistence table';
COMMENT ON COLUMN ratan_flowzero_orchestration_service.shedlock.name         IS 'Lock name, corresponds to @SchedulerLock(name)';
COMMENT ON COLUMN ratan_flowzero_orchestration_service.shedlock.lock_until   IS 'Lock expiry time; lock is automatically released after this timestamp';
COMMENT ON COLUMN ratan_flowzero_orchestration_service.shedlock.locked_at    IS 'Timestamp when the lock was acquired';
COMMENT ON COLUMN ratan_flowzero_orchestration_service.shedlock.locked_by    IS 'Identifier of the node holding the lock (hostname:pid)';
