package com.scb.sso.singleuibff.dto.ems2.v2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Entity {

    private Long id;
    private String name;
    private String applicationName;
    private Long roleId;
    private String roleName;
    private List<Subject> subjects;

}