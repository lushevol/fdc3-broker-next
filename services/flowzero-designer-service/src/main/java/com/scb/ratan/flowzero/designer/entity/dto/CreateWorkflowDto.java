package com.scb.ratan.flowzero.designer.entity.dto;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Tian, Terry
 * @date 31/03/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateWorkflowDto implements Serializable {

    @NotBlank
    private String name;

    @NotBlank
    private String countryCodes;

    private String description;

    private String content;

    @NotBlank
    private String businessArea;

    private String icon;

}
