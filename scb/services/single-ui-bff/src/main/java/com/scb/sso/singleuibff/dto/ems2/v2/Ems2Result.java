package com.scb.sso.singleuibff.dto.ems2.v2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Ems2Result {

    List<Entity> entities;
    private String accountName;
    private String fullName;
    private String accountOwner;
    private String accountStatus;
    private String accountType;
    private String status;

}
