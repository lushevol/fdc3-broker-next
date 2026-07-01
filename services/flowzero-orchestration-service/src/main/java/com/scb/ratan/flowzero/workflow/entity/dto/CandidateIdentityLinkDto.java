package com.scb.ratan.flowzero.workflow.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Candidate identity-link row mapped from ACT_RU_IDENTITYLINK.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateIdentityLinkDto {

    private String taskId;
    private String userId;
    private String groupId;

}
