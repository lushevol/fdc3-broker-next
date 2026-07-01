package com.scb.ratan.flowzero.workflow.entity.dbo;

import java.io.Serializable;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author MaYue
 * @date 12/8/2025
 */
@Entity
@Table(name = "t_workflow_request")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowRequest extends AuditMetadata implements Serializable {

    private static final long serialVersionUID = -5873972529622408084L;

    private String workflowId;

    private String uniqueVersionId;

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String globalVariables;

    private String instanceId;

    private String status;

}