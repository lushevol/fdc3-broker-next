package com.scb.ratan.flowzero.auth.entity.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class AuthenticationResponseDto implements Serializable {

    @Serial
    private static final long serialVersionUID = 1753085385434089751L;

    private String entitlement;

    private UserInfo userInfo;

}
