package com.scb.ratan.flowzero.workflow.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HistoricTaskInstanceDto {

    private String id;
    private String name;
    private String assignee;
    private String processDefinitionId;
    private String processInstanceId;
    private String taskDefinitionKey;
    private Date startTime;
    private Date endTime;

}
