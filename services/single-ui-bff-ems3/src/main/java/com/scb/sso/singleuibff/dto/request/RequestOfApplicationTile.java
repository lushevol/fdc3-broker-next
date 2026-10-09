package com.scb.sso.singleuibff.dto.request;

import lombok.Data;

@Data
public class RequestOfApplicationTile {

    private String entitlementsToken;
    private long applicationTileId;
    private RequestOfApplicationCategory applicationCategory;
    private String ems2Role;
    private String title;
    private String subtitle;
    private boolean isActive = true;
    private String imageDarkTheme;
    private String imageLightTheme;
    private RequestOfImportMap importMap;
    private String module;
    private String tile;
    private String ems2Entities;
    private String ems2Subject;
    private String provider;
    private String ems3AppId;
    private String ems3AppName;
    private String ems3Subject;
    private boolean isTemplate = false;
    private String emailSupport;
    private String mode;
    private String recordId;
    private long orderNo;

}
