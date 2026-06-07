package com.scb.ratan.flowzero.workflow.entity.vo;

import com.scb.ratan.flowzero.workflow.common.enums.ItemStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author Kinson Wang
 * @date 4/1/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BatchItemResultVo implements Serializable {

    private static final long serialVersionUID = 1590599850916572131L;

    private String id;
    /**
     * Item status
     */
    private ItemStatus status;

    /**
     * Success or error message
     */
    private String message;

}
