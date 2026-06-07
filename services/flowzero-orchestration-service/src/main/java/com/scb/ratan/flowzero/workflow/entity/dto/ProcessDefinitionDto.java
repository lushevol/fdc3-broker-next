package com.scb.ratan.flowzero.workflow.entity.dto;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author MaYue
 * @date 8/12/2025
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcessDefinitionDto implements Serializable {

    private static final long serialVersionUID = 1299701403077991714L;

    @NotBlank(message = "resourceId can't be null")
    private String resourceId;

    @NotBlank(message = "processName can't be null")
    private String processName;

    @NotBlank(message = "content can't be null")
    private String content;

}