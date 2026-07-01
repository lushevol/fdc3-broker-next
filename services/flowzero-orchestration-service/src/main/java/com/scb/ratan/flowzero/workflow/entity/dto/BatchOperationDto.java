package com.scb.ratan.flowzero.workflow.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * @author Kinson Wang
 * @date 3/31/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BatchOperationDto implements Serializable {

    private static final long serialVersionUID = 5692367445818613825L;

    @NotEmpty
    private List<String> IdList;

    @NotBlank(message = "ToUserId cannot be blank")
    private String toUserId;

}
