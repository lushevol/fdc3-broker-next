package com.scb.ratan.flowzero.designer.entity.dbo;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import static com.scb.ratan.flowzero.designer.common.Constants.DESIGNER_SCHEMA_NAME;

/**
 * @auther Xu, Eva
 * @date 21/01/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "t_workflow", schema = DESIGNER_SCHEMA_NAME)
public class Workflow extends AuditMetadata implements Serializable {

    private String name;

    // use short name as country code,seperated by comma
    private String countryCodes;

    private String ownerIds;

    private String description;

    private String status;

    private String content;

    private String succeedFromId;

    private String businessArea;

    private String uniqueProcessId;

    private String uniqueVersionId;

    private Integer workflowVersion;

    private String icon;

}