package com.scb.ratan.flowzero.auth.entity.dto;

import lombok.Data;

/**
 * 
 * @author Li, Chris Bo
 * @since 2020-06-26
 *
 */
@Data
public class AuthenticationPayloadDto {

    private UserInfoDto userInfo;
    private String lastLoginTime;
    private String entitlement;
    private String token;
    private UserEntitlementDto userEntitlement;
    private String description;
    private Boolean success = true;

}
