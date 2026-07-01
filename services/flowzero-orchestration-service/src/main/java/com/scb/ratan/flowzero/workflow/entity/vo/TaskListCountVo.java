package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author Kinson Wang
 * @date 4/9/2026
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskListCountVo implements Serializable {

    private static final long serialVersionUID = -4040735144513553783L;

    private long pendingHandleCount;

    private long pendingClaimCount;

    private long teamTaskCount;

}
