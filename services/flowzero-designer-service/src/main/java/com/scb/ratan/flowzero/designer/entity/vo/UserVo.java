package com.scb.ratan.flowzero.designer.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @auther Aiden
 * @date 4/1/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserVo implements Serializable {

    private static final long serialVersionUID = -7692160120102728843L;

    private String id;

    private String bankId;

    private String userName;

    private String countryCode;

    private String email;

    private String roleName;

}
