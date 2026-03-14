package com.scb.auth.login.dto;

import com.scb.auth.login.entity.UserInfo;
import lombok.Data;

import java.io.Serializable;

@Data
public class AuthenticationResponseDto implements Serializable {

    private static final long serialVersionUID = 1753085385434089751L;
    private String entitlement;
    private UserInfo userInfo;

}
