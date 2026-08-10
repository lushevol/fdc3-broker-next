package com.scb.sso.singleuibff.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

import static com.scb.sso.singleuibff.util.Constant.ADMIN_MODULE_SCHEMA;

@Entity
@Data
@Builder
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PACKAGE)
@Table(schema = ADMIN_MODULE_SCHEMA)
public class ApplicationTile {

    @Id
    private long applicationTileId;
    @Column(nullable = false, name = "ems2_role")
    @Builder.Default
    private String ems2Role = "";
    @Column(nullable = false)
    @Builder.Default
    private String title = "";
    @Builder.Default
    private String subtitle = "";
    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = false;
    @Builder.Default
    private String imageDarkTheme = "";
    @Builder.Default
    private String imageLightTheme = "";
    @Column(nullable = false)
    @Builder.Default
    private String module = "";
    @Column(nullable = false)
    @Builder.Default
    private String tile = "";
    @Column(nullable = false, name = "ems2_subject")
    @Builder.Default
    private String ems2Subject = "";
    @Column(nullable = false, name = "ems2_entities", length = 32000)
    @Builder.Default
    private String ems2Entities = "";
    @Builder.Default
    private boolean isTemplate = false;
    @Builder.Default
    private String emailSupport = "";
    @Builder.Default
    private Date createdAt = new Date();
    @Builder.Default
    private Date updatedAt = new Date();
    private String createdBy;
    private String updatedBy;

    @Column(name = "order_no")
    private long orderNo;

    @ManyToOne
    @JoinColumn(name = "application_category_id")
    private ApplicationCategory applicationCategory;

    @ManyToOne
    @JoinColumn(name = "import_map_id")
    private ImportMap importMap;

}
