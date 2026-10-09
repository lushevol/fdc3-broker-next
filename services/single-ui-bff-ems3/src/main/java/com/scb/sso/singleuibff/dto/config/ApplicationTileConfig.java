package com.scb.sso.singleuibff.dto.config;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApplicationTileConfig {

    private long applicationTileId;
    private String ems2Role;
    private String title;
    private String subtitle;
    private boolean isActive;
    private String imageDarkTheme;
    private String imageLightTheme;
    private String module;
    private String tile;
    private String ems2Subject;
    private String ems2Entities;
    private String provider;
    private String ems3AppId;
    private String ems3AppName;
    private String ems3Subject;
    private boolean isTemplate;
    private String emailSupport;
    private long applicationCategoryId;
    private long importMapId;
    private long orderNo;
    private String result;

}
