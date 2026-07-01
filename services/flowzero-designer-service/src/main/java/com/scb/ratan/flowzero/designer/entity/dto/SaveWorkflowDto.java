package com.scb.ratan.flowzero.designer.entity.dto;

import java.io.Serializable;
import java.util.List;

import com.scb.ratan.flowzero.designer.entity.dbo.WorkflowFormRel;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Tian, Terry
 * @date 4/2/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaveWorkflowDto implements Serializable {

    @NotBlank
    private String id;

    @NotBlank
    private String name;

    @NotBlank
    private String countryCodes;

    @NotBlank
    private String ownerIds;

    private String description;

    private String content;

    @NotBlank
    private String businessArea;

    private String icon;

    private List<WorkflowFormRel> rels;

}
