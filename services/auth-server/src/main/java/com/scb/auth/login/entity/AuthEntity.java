package com.scb.auth.login.entity;

import com.scb.ratan.common.lib.ResponseCode;
import lombok.Data;

/**
 * Created by 1604522 on 1/5/2021.
 */
@Data
public class AuthEntity {

    private UserInfo userInfo;
    private String entitlement;
    private long lastLoginTime;
    private String token;
    private boolean result;

}
