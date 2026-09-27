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
public class CreateUserDto {

    @NotBlank
    private String bankId;

    @NotBlank
    private String userName;

    @NotBlank
    private String countryCode;

    @NotBlank
    private String email;

    private String roleName;

}
