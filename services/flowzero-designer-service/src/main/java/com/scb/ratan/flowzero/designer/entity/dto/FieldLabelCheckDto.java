package com.scb.ratan.flowzero.designer.entity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @auther Xu, Eva
 * @date 06/03/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FieldLabelCheckDto implements Serializable {

    @NotBlank
    private String label;

    private String id;

}