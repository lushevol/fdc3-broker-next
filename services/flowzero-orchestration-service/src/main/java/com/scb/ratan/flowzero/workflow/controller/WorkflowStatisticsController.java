package com.scb.ratan.flowzero.workflow.controller;

import com.scb.ratan.flowzero.workflow.common.enums.StatisticsScopeEnum;
import com.scb.ratan.flowzero.workflow.entity.dto.PendingDistributionQueryDto;
import com.scb.ratan.flowzero.workflow.entity.dto.RequestCountQueryDto;
import com.scb.ratan.flowzero.workflow.entity.dto.RequestTrendQueryDto;
import com.scb.ratan.flowzero.workflow.entity.vo.RequestCountVo;
import com.scb.ratan.flowzero.workflow.entity.vo.RequestTrendVo;
import com.scb.ratan.flowzero.workflow.entity.vo.WorkflowPendingNode;
import com.scb.ratan.flowzero.workflow.service.IWorkflowStatisticsService;
import com.scb.ratan.flowzero.workflow.utils.UserInfoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/**
 * Statistics API controller.
 * Covers 3.2.1 request-count, 3.2.2 pending-distribution, 3.2.3 request-trend.
 *
 * <p>All three endpoints share the same {@code scope} query parameter:
 * <ul>
 *   <li>{@code ALL}       (default) – No user restriction; returns all requests.</li>
 *   <li>{@code INITIATOR}           – Only requests initiated by the current user.</li>
 *   <li>{@code APPROVER}            – Only requests where the current user is a candidate approver.</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/v1/statistics")
@RequiredArgsConstructor
public class WorkflowStatisticsController {

    private final IWorkflowStatisticsService workflowStatisticsService;

    /**
     * 3.2.1 GET /api/v1/statistics/request-count
     */
    @GetMapping("/request-count")
    public ResponseEntity<RequestCountVo> getRequestCount(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(required = false, defaultValue = "ALL") String scope) {

        RequestCountQueryDto queryDto = new RequestCountQueryDto(startDate, endDate, parseScope(scope));
        return ResponseEntity.ok(workflowStatisticsService.getRequestCount(queryDto, UserInfoUtils.getUserId()));
    }

    /**
     * 3.2.2 GET /api/v1/statistics/pending-distribution
     */
    @GetMapping("/pending-distribution")
    public ResponseEntity<List<WorkflowPendingNode>> getPendingDistribution(
        @RequestParam(required = false) String workflowName,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(required = false, defaultValue = "ALL") String scope) {

        PendingDistributionQueryDto queryDto = new PendingDistributionQueryDto(workflowName, startDate, endDate, parseScope(scope));
        return ResponseEntity.ok(workflowStatisticsService.getPendingDistribution(queryDto, UserInfoUtils.getUserId()));
    }

    /**
     * 3.2.3 GET /api/v1/statistics/request-trend
     */
    @GetMapping("/request-trend")
    public ResponseEntity<RequestTrendVo> getRequestTrend(
        @RequestParam(required = false) String workflowName,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(required = false, defaultValue = "ALL") String scope,
        @RequestParam(required = false, defaultValue = "Day") String interval) {

        RequestTrendQueryDto queryDto = new RequestTrendQueryDto(
            workflowName, startDate, endDate, parseScope(scope), interval);
        return ResponseEntity.ok(workflowStatisticsService.getRequestTrend(queryDto, UserInfoUtils.getUserId()));
    }

    /** Safely parse scope string to enum, falling back to ALL on invalid values. */
    private StatisticsScopeEnum parseScope(String scope) {
        try {
            return StatisticsScopeEnum.valueOf(scope.toUpperCase());
        } catch (Exception e) {
            return StatisticsScopeEnum.ALL;
        }
    }

}
