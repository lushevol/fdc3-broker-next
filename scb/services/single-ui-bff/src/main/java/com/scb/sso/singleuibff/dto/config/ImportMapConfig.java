package com.scb.sso.singleuibff.dto.config;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImportMapConfig {

    private long importMapId;
    private String ems2Role;
    private String keyName;
    private String path;
    private boolean isActive;
    private String result;

}
