package com.scb.ratan.flowzero.workflow.entity.dto;

import com.scb.ratan.flowzero.workflow.common.enums.StatisticsScopeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * Query DTO for GET /api/v1/statistics/request-trend
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestTrendQueryDto implements Serializable {

    private static final long serialVersionUID = -6252788433087948386L;

    /** Filter by workflow display name (exact match). */
    private String workflowName;

    /** Range start date (YYYY-MM-DD). Defaults to 30 days ago. */
    private LocalDate startDate;

    /** Range end date (YYYY-MM-DD). Defaults to today. */
    private LocalDate endDate;

    /**
     * Data scope:
     * ALL – all requests (default);
     * INITIATOR – requests initiated by current user;
     * APPROVER – requests where current user is a candidate approver.
     */
    private StatisticsScopeEnum scope = StatisticsScopeEnum.ALL;

    /**
     * Aggregation interval: Day, Week, Month.
     * Day = one point per calendar day,
     * Week = one point per ISO week (label = week start date),
     * Month = one point per calendar month (label = first day of month).
     * Default: Day.
     */
    private String interval = "Day";

}
