package com.scb.ratan.flowzero.workflow.service;

import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowAttachment;

import java.util.List;

/**
 * Service interface for iCDMS synchronisation operations.
 */
public interface IcdmsSyncService {

    /**
     * Triggers iCDMS sync for all ACTIVE FileNet attachments of the completed workflow instance.
     * Called from the Camunda end-event listener.
     *
     * <p>For each attachment this method will:
     * <ol>
     *   <li>Extract file metadata from {@code storage_ref} JSONB.</li>
     *   <li>Attempt an immediate iCDMS API call.</li>
     *   <li>On success — create a {@code t_retry_task} record with {@code SUCCESS} status
     *       (or simply log).</li>
     *   <li>On service error (5xx/timeout) — create a SUSPENDED {@code t_retry_task}
     *       record for the scheduler to retry.</li>
     *   <li>On data error (4xx) — create a FAILED {@code t_retry_task} record with
     *       retryCount=1.</li>
     * </ol>
     *
     * <p><strong>This method MUST NOT throw</strong> — all exceptions are swallowed internally.
     *
     * @param workflowInstanceId process instance ID (used as {@code businessId} in the payload)
     * @param activeAttachments  list of ACTIVE attachments to sync; may be empty but not null
     */
    void syncOnRequestCompletion(String workflowInstanceId, List<WorkflowAttachment> activeAttachments);

    /**
     * Processes pending retry tasks (SUSPENDED and FAILED) for iCDMS sync.
     * Called by the distributed retry scheduler on a fixed cron schedule.
     *
     * @param batchSize maximum number of records to process in this execution
     */
    void processPendingRetries(int batchSize);

}
