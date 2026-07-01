package com.scb.ratan.flowzero.designer.entity.vo;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Tian, Terry
 * @date Feb 6, 2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowBeforePublishCheckVo implements Serializable {

    private Integer runningInstancesNum;

}
