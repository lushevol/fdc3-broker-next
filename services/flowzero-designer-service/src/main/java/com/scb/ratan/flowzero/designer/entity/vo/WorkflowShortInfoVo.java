package com.scb.ratan.flowzero.designer.entity.vo;

import java.io.Serializable;

import com.scb.ratan.flowzero.designer.entity.dbo.Workflow;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Tian, Terry
 * @date 13/3/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowShortInfoVo implements Serializable {

    private static final long serialVersionUID = -4817258133778242316L;

    public String id;

    private String name;

    private String uniqueProcessId;

    private String uniqueVersionId;

    public WorkflowShortInfoVo(Workflow workflow) {
        this.id = workflow.getId();
        this.name = workflow.getName();
        this.uniqueProcessId = workflow.getUniqueProcessId();
        this.uniqueVersionId = workflow.getUniqueVersionId();
    }

}
