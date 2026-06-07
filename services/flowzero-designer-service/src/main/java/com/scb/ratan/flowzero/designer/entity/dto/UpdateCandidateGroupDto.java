package com.scb.ratan.flowzero.designer.entity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Kinson Wang
 * @date 4/1/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCandidateGroupDto {

    @NotBlank
    private String id;

    private String name;

    private String description;

}
