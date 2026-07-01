package com.scb.ratan.flowzero.workflow.entity.dto;

import com.scb.ratan.flowzero.workflow.common.enums.StatisticsScopeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * Query DTO for GET /api/v1/statistics/request-count
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestCountQueryDto implements Serializable {

    private static final long serialVersionUID = 1L;

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

}
