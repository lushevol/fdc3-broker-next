package com.scb.sso.singleuibff.dto.ems2.v2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Ems2Result {

    List<Entity> entities;
    @JsonIgnore
    private List<Map<String, Object>> authorizedTiles;
    private String accountName;
    private String fullName;
    private String accountOwner;
    private String accountStatus;
    private String accountType;
    private String status;

}
