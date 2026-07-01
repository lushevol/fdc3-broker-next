package com.scb.ratan.flowzero.workflow.service;

import com.scb.ratan.flowzero.workflow.entity.dto.PendingDistributionQueryDto;
import com.scb.ratan.flowzero.workflow.entity.dto.RequestCountQueryDto;
import com.scb.ratan.flowzero.workflow.entity.dto.RequestTrendQueryDto;
import com.scb.ratan.flowzero.workflow.entity.vo.RequestCountVo;
import com.scb.ratan.flowzero.workflow.entity.vo.RequestTrendVo;
import com.scb.ratan.flowzero.workflow.entity.vo.WorkflowPendingNode;

import java.util.List;

/**
 * Statistics service covering 3.2.x endpoints.
 */
public interface IWorkflowStatisticsService {

    /**
     * 3.2.1 – Workflow request total count (total / open / closed).
     *
     * @param queryDto filter criteria (date range, byMe)
     * @param currentUserId the authenticated user; used when byMe=true
     */
    RequestCountVo getRequestCount(RequestCountQueryDto queryDto, String currentUserId);

    /**
     * 3.2.2 – Pending distribution grouped by workflow → task.
     *
     * @param queryDto filter criteria (workflowName, date range, byMe)
     * @param currentUserId the authenticated user; used when byMe=true
     */
    List<WorkflowPendingNode> getPendingDistribution(PendingDistributionQueryDto queryDto, String currentUserId);

    /**
     * 3.2.3 – Request trend time-series (open vs closed per interval).
     *
     * @param queryDto filter criteria (workflowName, date range, byMe, interval)
     * @param currentUserId the authenticated user; used when byMe=true
     */
    RequestTrendVo getRequestTrend(RequestTrendQueryDto queryDto, String currentUserId);

}
