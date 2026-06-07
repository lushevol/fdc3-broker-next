package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * @author Kinson Wang
 * @date 5/5/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NumberOfRequestVo implements Serializable {

    private static final long serialVersionUID = -2750575938556952035L;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer total;

    private Integer open;

    private Integer closed;

}
