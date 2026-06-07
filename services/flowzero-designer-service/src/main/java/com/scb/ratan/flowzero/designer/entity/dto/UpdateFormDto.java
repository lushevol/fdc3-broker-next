package com.scb.ratan.flowzero.designer.entity.dto;

import java.io.Serializable;
import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Xu, Eva
 * @date 11/02/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateFormDto implements Serializable {

    private static final long serialVersionUID = 5116110281459652285L;

    @NotBlank
    private String id;

    @NotBlank
    private String name;

    private String description;

    private String formModel;

    private Set<String> fieldIds;

}
