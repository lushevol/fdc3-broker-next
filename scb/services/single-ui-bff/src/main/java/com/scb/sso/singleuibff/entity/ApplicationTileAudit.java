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
public class ApplicationTileAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "application_tile_audit_seq")
    @SequenceGenerator(name = "application_tile_audit_seq", schema = ADMIN_MODULE_SCHEMA, sequenceName = "application_tile_audit_seq", allocationSize = 1)
    private long applicationTileAuditId;
    private String transactionMode;

    private long applicationTileId;
    @Column(name = "ems2_role")
    @Builder.Default
    private String ems2Role = "";
    @Builder.Default
    private String title = "";
    @Builder.Default
    private String subtitle = "";
    @Builder.Default
    private boolean isActive = false;
    @Builder.Default
    private String imageDarkTheme = "";
    @Builder.Default
    private String imageLightTheme = "";
    @Builder.Default
    private String module = "";
    @Builder.Default
    private String tile = "";
    @Column(name = "ems2_subject")
    @Builder.Default
    private String ems2Subject = "";
    @Column(name = "ems2_entities", length = 32000)
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
