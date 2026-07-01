package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class TodoItem {

    private String taskId;
    private String taskName;
    private String status;
    private String workflowName;
    private String requestId;
    private String createdBy;
    private String lastUpdatedBy;
    private String createTime;
    private String assigneeId;
    private String assigneeName;
    private String dueDate;
    private List<CandidateUserVo> candidateUsers;
    private List<String> candidateGroups;
    private Map<String, Object> variables;

}
