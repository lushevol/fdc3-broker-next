package com.scb.ratan.flowzero.designer.entity.vo;

import java.io.Serializable;

import org.springframework.beans.BeanUtils;

import com.scb.ratan.flowzero.designer.entity.dbo.Workflow;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Tian, Terry
 * @date 6/2/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowPageVo extends Workflow implements Serializable {

    private static final long serialVersionUID = -3601990232455149482L;

    public WorkflowPageVo(Workflow workflow) {
        BeanUtils.copyProperties(workflow, this);
    }

    private Integer displayVersion;

}
