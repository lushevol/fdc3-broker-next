package com.scb.ratan.flowzero.workflow.listener;

import com.scb.ratan.flowzero.workflow.common.enums.AttachmentStatus;
import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowAttachment;
import com.scb.ratan.flowzero.workflow.repository.WorkflowAttachmentRepository;
import com.scb.ratan.flowzero.workflow.service.IWorkflowRequestService;
import com.scb.ratan.flowzero.workflow.service.IcdmsSyncService;
import com.scb.ratan.flowzero.workflow.common.enums.WorkflowRequestStatusEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.ExecutionListener;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Camunda end-event listener.
 *
 * <h3>Responsibilities</h3>
 * <ol>
 *   <li>Updates the {@code WorkflowRequest} status to COMPLETED.</li>
 *   <li>Triggers the iCDMS document binding for all ACTIVE attachments
 *       of the completed process instance.</li>
 * </ol>
 *
 * <h3>Failure isolation</h3>
 * All exceptions from the iCDMS sync path are caught and logged. The Camunda
 * process is NEVER blocked by an iCDMS failure — the retry mechanism in
 * {@code t_retry_task} + {@link com.scb.ratan.flowzero.workflow.scheduler.IcdmsSyncRetryScheduler}
 * ensures eventual consistency.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GlobalProcessEndListener implements ExecutionListener {

    private final IWorkflowRequestService workflowRequestService;
    private final WorkflowAttachmentRepository attachmentRepository;
    private final IcdmsSyncService icdmsSyncService;

    @Override
    public void notify(DelegateExecution execution) throws Exception {
        if (!EVENTNAME_END.equals(execution.getEventName())) {
            return;
        }
        String activityType = execution.getBpmnModelElementInstance()
            .getElementType().getTypeName();
        if (!"endEvent".equals(activityType)) {
            return;
        }

        String processInstanceId = execution.getProcessInstanceId();
        log.info("[ProcessEndListener] Process instance {} reached end event", processInstanceId);

        // ① Update workflow request status
        try {
            workflowRequestService.updateStatusByInstanceId(
                processInstanceId, WorkflowRequestStatusEnum.COMPLETE.getDesc());
            log.info("[ProcessEndListener] Status updated to COMPLETED for instanceId={}",
                processInstanceId);
        } catch (Exception e) {
            log.error("[ProcessEndListener] Failed to update request status for instanceId={}",
                processInstanceId, e);
        }

        // ② Trigger iCDMS binding for all ACTIVE attachments
        // This is fire-and-forget from Camunda's perspective.
        // Failures are handled by IcdmsSyncService which writes t_retry_task records.
        try {
            List<WorkflowAttachment> activeAttachments = attachmentRepository
                .findByWorkflowInstanceIdAndStatus(processInstanceId, AttachmentStatus.ACTIVE);
            log.info("[ProcessEndListener] Found {} ACTIVE attachments for iCDMS sync, instanceId={}",
                activeAttachments.size(), processInstanceId);
            icdmsSyncService.syncOnRequestCompletion(processInstanceId, activeAttachments);
        } catch (Exception e) {
            // Safety net: icdmsSyncService.syncOnRequestCompletion should never throw,
            // but we protect the Camunda thread in any case.
            log.error("[ProcessEndListener] Unexpected exception during iCDMS sync for instanceId={}"
                + " — process continues normally", processInstanceId, e);
        }
    }

}
