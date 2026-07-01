package com.scb.ratan.flowzero.workflow.entity.vo;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author MaYue
 * @date 12/16/2025
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestVo implements Serializable {

    private static final long serialVersionUID = -6330427271363824498L;

    private String requestId;

    private String definitionId;

    private String workflowName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'", timezone = "UTC")
    private LocalDateTime requestDate;

    private String status;

    private String submitter;

    public RequestVo(WorkflowRequest workflowRequest) {
        this.setRequestId(workflowRequest.getId());
        this.setDefinitionId(workflowRequest.getUniqueVersionId());
        this.setRequestDate(workflowRequest.getCreatedAt());
        this.setSubmitter(workflowRequest.getCreatedBy());
        this.setStatus(workflowRequest.getStatus());
    }

}
