package com.scb.ratan.flowzero.workflow.entity.vo;

import com.scb.ratan.flowzero.workflow.common.enums.BatchStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * @author Kinson Wang
 * @date 3/31/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BatchOperationResultVo<T extends BatchItemResultVo> implements Serializable {

    private static final long serialVersionUID = -7490198509893216974L;

    /**
     * Batch Status
     */
    private BatchStatus status;

    /**
     * Detail results for each item
     */
    private List<T> results;

}
