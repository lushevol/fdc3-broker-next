package com.scb.ratan.flowzero.designer.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author Kinson Wang
 * @date 5/5/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskNavigationVo implements Serializable {

    private static final long serialVersionUID = 1868946224990879451L;

    /**
     * Unique key of the task (matches Camunda UserTask id)
     */
    private String taskKey;

    private String taskName;
}
