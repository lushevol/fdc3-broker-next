package com.scb.ratan.flowzero.designer.entity.dto;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Tian, Terry
 * @date 6/3/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowNameCheckDto implements Serializable {

    @NotBlank
    private String name;

    private String uniqueProcessId;

}
