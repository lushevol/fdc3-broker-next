package com.scb.ratan.flowzero.auth.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserQueryDto implements Serializable {

    private String bankId;

    private String userName;

    private String countryCode;

    private String email;

    private String roleName;

}
