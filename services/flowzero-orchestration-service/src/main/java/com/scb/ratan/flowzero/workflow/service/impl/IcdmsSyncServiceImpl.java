package com.scb.ratan.flowzero.workflow.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.flowzero.workflow.common.enums.IcdmsErrorCode;
import com.scb.ratan.flowzero.workflow.common.enums.RetryBizType;
import com.scb.ratan.flowzero.workflow.common.enums.RetryTaskStatus;
import com.scb.ratan.flowzero.workflow.common.enums.StorageType;
import com.scb.ratan.flowzero.workflow.common.exception.IcdmsClientException;
import com.scb.ratan.flowzero.workflow.common.exception.IcdmsException;
import com.scb.ratan.flowzero.workflow.common.exception.IcdmsSyncException;
import com.scb.ratan.flowzero.workflow.entity.dbo.RetryTask;
import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowAttachment;
import com.scb.ratan.flowzero.workflow.external.icdms.IcdmsCompensationClient;
import com.scb.ratan.flowzero.workflow.external.icdms.IcdmsSyncPayload;
import com.scb.ratan.flowzero.workflow.repository.RetryTaskRepository;
import com.scb.ratan.flowzero.workflow.service.IcdmsSyncService;
import com.scb.ratan.flowzero.workflow.storage.StorageRef;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Retry flow (scheduler-driven)
 * SUSPENDED records are retried first; then FAILED records respecting {@code nextRetryAt}.
 * Both update the task record in-place after the call.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class IcdmsSyncServiceImpl implements IcdmsSyncService {

    private final RetryTaskRepository retryTaskRepository;
    private final IcdmsCompensationClient icdmsCompensationClient;
    private final ObjectMapper objectMapper;

    // ── syncOnRequestCompletion ───────────────────────────────────────────────

    @Override
    public void syncOnRequestCompletion(String workflowInstanceId,
        List<WorkflowAttachment> activeAttachments) {
        log.info("[ICDMS] syncOnRequestCompletion start workflowInstanceId={} attachments={}",
            workflowInstanceId, activeAttachments.size());
        try {
            for (WorkflowAttachment attachment : activeAttachments) {
                // Only FileNet attachments require iCDMS binding
                if (!StorageType.FILENET.equals(attachment.getStorageType())) {
                    log.debug("[ICDMS] skip non-FileNet attachment id={} type={}",
                        attachment.getId(), attachment.getStorageType());
                    continue;
                }
                try {
                    syncOneAttachment(workflowInstanceId, attachment);
                } catch (Exception e) {
                    // Never propagate — each attachment failure is independent
                    log.error("[ICDMS] syncOneAttachment failed for attachmentId={}, error={}",
                        attachment.getId(), e.getMessage());
                }
            }
        } catch (Exception e) {
            // Safety catch-all: must never reach Camunda thread
            log.error("[ICDMS] syncOnRequestCompletion unexpected error workflowInstanceId={}",
                workflowInstanceId, e);
        }
        log.info("[ICDMS] syncOnRequestCompletion done workflowInstanceId={}", workflowInstanceId);
    }

    // ── processPendingRetries ─────────────────────────────────────────────────

    @Override
    public void processPendingRetries(int batchSize) {
        log.info("[ICDMS] processPendingRetries start batchSize={}", batchSize);

        // 1. Process SUSPENDED records first (service error, no count increment)
        List<RetryTask> suspended = retryTaskRepository
            .findSuspendedForRetry(RetryBizType.ICDMS_SYNC, batchSize);
        int remaining = batchSize - suspended.size();

        // 2. Fill remainder with FAILED records (data error, count incremented)
        List<RetryTask> failed = remaining > 0
            ? retryTaskRepository.findFailedForRetry(
                RetryBizType.ICDMS_SYNC, LocalDateTime.now(), remaining)
            : List.of();

        List<RetryTask> tasks = new ArrayList<>(suspended);
        tasks.addAll(failed);
        log.info("[ICDMS] processPendingRetries suspended={} failed={}", suspended.size(), failed.size());

        for (RetryTask task : tasks) {
            try {
                IcdmsSyncPayload payload = deserializePayload(task.getPayload());
                executeSync(payload);
                markSuccess(task);
                log.info("[ICDMS] Retry OK attachmentId={}", payload.getAttachmentId());
            } catch (IcdmsClientException e) {
                markFailed(task, e.getMessage()); // 4xx: increment retry count, errorCode logged
                log.warn("[ICDMS] Retry FAILED [{}] attachmentId={} error={}",
                    e.getErrorCode(), task.getBizId(), e.getMessage());
            } catch (IcdmsException e) {
                markSuspended(task, e.getMessage()); // 5xx/timeout/CB: keep count
                log.warn("[ICDMS] Retry SUSPENDED [{}] attachmentId={} error={}",
                    e.getErrorCode(), task.getBizId(), e.getMessage());
            } catch (Exception e) {
                markSuspended(task, e.getMessage()); // unexpected — treat as transient
                log.warn("[ICDMS] Retry SUSPENDED [UNEXPECTED] attachmentId={} error={}",
                    task.getBizId(), e.getMessage());
            }
        }

        log.info("[ICDMS] processPendingRetries done processed={}", tasks.size());
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Attempts one iCDMS sync for a FileNet attachment and saves the result to t_retry_task.
     */
    private void syncOneAttachment(String workflowInstanceId, WorkflowAttachment attachment) {
        StorageRef ref = StorageRef.fromJson(attachment.getStorageRef(), StorageType.FILENET);
        String fileId = ref.getFileId();

        if (StringUtils.isBlank(fileId)) {
            log.warn("[ICDMS] storageRef missing fileId for attachmentId={}, skipping",
                attachment.getId());
            return;
        }

        IcdmsSyncPayload payload = IcdmsSyncPayload.builder()
            .attachmentId(attachment.getId())
            .fileId(fileId)
            .leid(ref.getLeid())
            .documentCategory(ref.getDocCategory())
            .documentType(ref.getDocType())
            .documentName(ref.getDocName())
            .metadata("{\"workflowInstanceId\":\"" + workflowInstanceId + "\"}")
            .build();

        // Bug 2 fix: deduplication is a normal flow, not an error — use early return +
        // info log
        boolean alreadySynced = retryTaskRepository
            .findByBizTypeAndBizId(RetryBizType.ICDMS_SYNC, attachment.getId())
            .filter(t -> RetryTaskStatus.SUCCESS.equals(t.getStatus()))
            .isPresent();
        if (alreadySynced) {
            log.info("[ICDMS] Attachment already synced, skip attachmentId={}", attachment.getId());
            return;
        }

        RetryTask task = buildRetryTask(attachment.getId(), payload);

        try {
            executeSync(payload);
            task.setStatus(RetryTaskStatus.SUCCESS);
            task.setSyncedAt(LocalDateTime.now());
            log.info("[ICDMS] Sync SUCCESS attachmentId={}", attachment.getId());
        } catch (IcdmsClientException e) {
            // 4xx data error — start retry counting from 1
            task.setStatus(RetryTaskStatus.FAILED);
            task.setRetryCount(1);
            task.setLastError(truncate(e.getMessage()));
            task.setNextRetryAt(calculateNextRetryAt(1));
            log.warn("[ICDMS] Sync FAILED [{}] attachmentId={} error={}",
                e.getErrorCode(), attachment.getId(), e.getMessage());
        } catch (IcdmsException e) {
            // 5xx / timeout / CB OPEN / rate-limit — service error, do NOT increment count
            task.setStatus(RetryTaskStatus.SUSPENDED);
            task.setRetryCount(0);
            task.setLastError(truncate(e.getMessage()));
            task.setNextRetryAt(null); // scheduler retries immediately
            log.warn("[ICDMS] Sync SUSPENDED [{}] attachmentId={} error={}",
                e.getErrorCode(), attachment.getId(), e.getMessage());
        }

        saveOrUpdateRetryTask(task);
    }

    /**
     * Calls iCDMS API synchronously (blocks until CompletableFuture completes).
     */
    private void executeSync(IcdmsSyncPayload payload) {
        try {
            icdmsCompensationClient.sendDocumentMetadata(payload).get();
        } catch (ExecutionException ex) {
            Throwable cause = ex.getCause();
            if (cause instanceof IcdmsClientException ice) throw ice;
            if (cause instanceof IcdmsSyncException ise) throw ise;
            throw new IcdmsSyncException(IcdmsErrorCode.UNKNOWN,
                    "iCDMS sync failed: " + cause.getMessage()
                    + " attachmentId=" + payload.getAttachmentId(), cause);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new IcdmsSyncException(IcdmsErrorCode.INTERRUPTED,
                    "iCDMS sync interrupted attachmentId=" + payload.getAttachmentId(), ex);
        }
    }

    // Bug 3 fix: @Transactional on protected methods does NOT work for
    // self-invocation
    // (Spring AOP proxy is bypassed). Each retryTaskRepository.save() call runs in
    // its own
    // Spring Data JPA transaction. The @Transactional annotation has been removed
    // from these
    // private helpers — it was silently ignored before.

    private void markSuccess(RetryTask task) {
        task.setStatus(RetryTaskStatus.SUCCESS);
        task.setSyncedAt(LocalDateTime.now());
        task.setLastError(null);
        task.setUpdatedBy("system");
        retryTaskRepository.save(task);
    }

    private void markFailed(RetryTask task, String errorMessage) {
        int newCount = task.getRetryCount() + 1;
        if (newCount >= task.getMaxRetry()) {
            task.setStatus(RetryTaskStatus.SKIPPED);
            log.error("[ICDMS][ALERT] Max retry exceeded bizId={} lastError={}", task.getBizId(), errorMessage);
        } else {
            task.setStatus(RetryTaskStatus.FAILED);
            task.setRetryCount(newCount);
            task.setNextRetryAt(calculateNextRetryAt(newCount));
        }
        task.setLastError(truncate(errorMessage));
        task.setUpdatedBy("system");
        retryTaskRepository.save(task);
    }

    private void markSuspended(RetryTask task, String errorMessage) {
        task.setStatus(RetryTaskStatus.SUSPENDED);
        task.setLastError(truncate(errorMessage));
        task.setNextRetryAt(null);
        task.setUpdatedBy("system");
        retryTaskRepository.save(task);
    }

    /** Saves a new RetryTask or updates an existing one for the same bizId. */
    private void saveOrUpdateRetryTask(RetryTask task) {
        retryTaskRepository.findByBizTypeAndBizId(task.getBizType(), task.getBizId())
            .ifPresentOrElse(
                existing -> {
                    existing.setStatus(task.getStatus());
                    existing.setRetryCount(task.getRetryCount());
                    existing.setLastError(task.getLastError());
                    existing.setNextRetryAt(task.getNextRetryAt());
                    existing.setSyncedAt(task.getSyncedAt());
                    existing.setUpdatedBy("system");
                    retryTaskRepository.save(existing);
                },
                () -> retryTaskRepository.save(task));
    }

    /**
     * Builds a new PENDING RetryTask for ICDMS_SYNC.
     */
    private RetryTask buildRetryTask(String attachmentId, IcdmsSyncPayload payload) {
        String payloadJson;
        try {
            payloadJson = objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            log.warn("[ICDMS] Failed to serialize payload for attachmentId={}", attachmentId);
            payloadJson = "{}";
        }
        RetryTask task = RetryTask.builder()
            .bizType(RetryBizType.ICDMS_SYNC)
            .bizId(attachmentId)
            .payload(payloadJson)
            .status(RetryTaskStatus.PENDING)
            .retryCount(0)
            .maxRetry(3)
            .build();
        task.setCreatedBy("system");
        task.setUpdatedBy("system");
        return task;
    }

    /**
     * Deserializes a RetryTask payload JSON string into {@link IcdmsSyncPayload}.
     */
    private IcdmsSyncPayload deserializePayload(String payloadJson) {
        try {
            return objectMapper.readValue(payloadJson, IcdmsSyncPayload.class);
        } catch (Exception e) {
            throw new IcdmsSyncException(IcdmsErrorCode.PAYLOAD_ERROR,
                "Failed to deserialize iCDMS sync payload: " + e.getMessage(), e);
        }
    }

    /**
     * Calculates the next retry time using Equal Jitter exponential backoff.
     * <ul>
     *   <li>count=1 → 30s – 1min</li>
     *   <li>count=2 → 1min – 2min</li>
     *   <li>count=3 → 2min – 4min</li>
     * </ul>
     */
    static LocalDateTime calculateNextRetryAt(int retryCount) {
        long baseSeconds = (long) Math.pow(2, retryCount - 1) * 60L; // 60s, 120s, 240s
        // Use explicit floating-point division to avoid integer-division truncation
        long jitter = (long) (Math.random() * (baseSeconds / 2.0));
        long waitSeconds = (baseSeconds / 2) + jitter; // Equal Jitter
        return LocalDateTime.now().plusSeconds(waitSeconds);
    }

    private static final int MAX_ERROR_LENGTH = 2000;

    // ...existing code...

    private String truncate(String s) {
        if (s == null)
            return null;
        return s.length() > MAX_ERROR_LENGTH ? s.substring(0, MAX_ERROR_LENGTH) : s;
    }

}
