package com.scb.ratan.flowzero.workflow.entity.dto;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Tian, Terry
 * @date 9/2/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StopInstancesDto implements Serializable {

    private static final long serialVersionUID = -8858194710736504473L;

    @NotBlank(message = "uniqueVersionId is required")
    private String uniqueVersionId;

    @NotBlank(message = "reason is required")
    private String reason;

}
