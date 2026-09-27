package com.scb.ratan.flowzero.auth.entity.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserEntitlementDto {

    private List<String> actions;

    private String role;

    private String dataEntitlementRoles;

}
