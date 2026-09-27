package com.scb.ratan.flowzero.auth.entity.dto;

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
public class UpdateUserDto {

    @NotBlank
    private String id;

    private String bankId;

    private String userName;

    private String countryCode;

    private String email;

    private String roleName;

}
