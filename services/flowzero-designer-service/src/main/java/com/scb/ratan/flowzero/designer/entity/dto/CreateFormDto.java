package com.scb.ratan.flowzero.designer.entity.dto;

import java.io.Serializable;
import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Tian, Terry
 * @date 24/3/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateFormDto implements Serializable {

    private static final long serialVersionUID = 5116110281459652285L;

    @NotBlank
    private String name;

    private String description;

}
