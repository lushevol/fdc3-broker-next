package com.scb.sso.singleuibff.dto.request;

import lombok.Data;

@Data
public class RequestOfImportMap {

    private long importMapId;
    private String entitlementsToken;
    private String keyName;
    private String path;
    private boolean isActive;
    private String mode;
    private String ems2Role;
    private String recordId;

}
