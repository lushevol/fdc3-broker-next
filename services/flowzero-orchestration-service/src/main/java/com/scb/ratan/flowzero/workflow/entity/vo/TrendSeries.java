package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Single time-series entry in the request trend chart.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrendSeries {

    /** Series label, e.g. "open" or "closed" */
    private String name;
    /** Count values aligned positionally with the labels array */
    private java.util.List<Integer> values;

}
