package com.scb.ratan.flowzero.workflow.entity.dto;

import java.io.Serializable;
import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Tian, Terry
 * @date 9/3/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaseTaskOperationDto implements Serializable {

    private static final long serialVersionUID = 5638909103142854331L;

    @NotBlank(message = "taskId can't be null")
    private String taskId;

    private String comment;

    private Map<String, Object> variables;

    private String userId;

}
