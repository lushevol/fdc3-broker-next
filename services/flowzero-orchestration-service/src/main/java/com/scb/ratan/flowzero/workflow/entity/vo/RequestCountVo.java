package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Response VO for GET /api/v1/statistics/request-count
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestCountVo implements Serializable {

    private static final long serialVersionUID = 1L;
    /** Total request count */
    private Integer total;
    /** Open (in-progress) request count */
    private Integer open;
    /** Closed (completed / terminated) request count */
    private Integer closed;

}
