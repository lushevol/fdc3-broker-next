package com.scb.auth.login.dto;

import com.scb.auth.login.entity.UserInfo;
import lombok.Data;

import java.io.Serializable;

@Data
public class LoginResponseDto implements Serializable {

    private static final long serialVersionUID = 9097897579991664570L;
    private String entitlement;
    private Long lastLoginTime;
    private String token;
    private UserInfo userInfo;

}
