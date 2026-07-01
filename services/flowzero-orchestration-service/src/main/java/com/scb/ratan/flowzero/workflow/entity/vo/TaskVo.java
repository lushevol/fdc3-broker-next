package com.scb.ratan.flowzero.workflow.entity.vo;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

import org.camunda.bpm.engine.task.Task;
import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author MaYue
 * @date 12/15/2025
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskVo implements Serializable {

    private static final long serialVersionUID = 73844959241332876L;

    private String id;

    private String name;

    private String taskDefinitionKey;

    private String processDefinitionId;

    private String processInstanceId;

    private String assignee;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'", timezone = "UTC")
    private Date createTime;

    private String workflowName;

    private String requester;

    private String dueDate;

    private Map<String, Object> variables;

    public TaskVo(Task task) {
        BeanUtils.copyProperties(task, this, "variables");
    }

}
