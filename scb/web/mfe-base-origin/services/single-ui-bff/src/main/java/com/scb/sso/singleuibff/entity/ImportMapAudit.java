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
public class ImportMapAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "import_map_audit_seq")
    @SequenceGenerator(name = "import_map_audit_seq", schema = ADMIN_MODULE_SCHEMA, sequenceName = "import_map_audit_seq", allocationSize = 1)
    private long importMapAuditId;
    private String transactionMode;

    private long importMapId;
    @Column(name = "ems2_role")
    private String ems2Role;
    private String keyName;
    private String path;
    @Builder.Default
    private boolean isActive = false;
    @Builder.Default
    private Date createdAt = new Date();
    @Builder.Default
    private Date updatedAt = new Date();
    private String createdBy;
    private String updatedBy;

}
