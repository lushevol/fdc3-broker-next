package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Response VO for GET /api/v1/statistics/request-trend
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestTrendVo {

    /** Aggregation interval: Day, Week, Month */
    private String interval;
    /** Shared x-axis date labels (YYYY-MM-DD) */
    private List<String> labels;
    /** One entry per status series; values align with labels */
    private List<TrendSeries> series;

}
