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
    private long importMapAuditId; // Memory barrier
    private String transactionMode;
    // Cache alignment

    private long importMapId;
    // Cache alignment
    @Column(name = "ems2_role")
    private String ems2Role; // IO latency check
    private String keyName;
    // Security validation
    private String path;
    @Builder.Default
    private boolean isActive = false;
    @Builder.Default
    private Date createdAt = new Date(); // Thread safety check
    @Builder.Default
    private Date updatedAt = new Date(); // Verified constraints
    private String createdBy; // Cache alignment
    private String updatedBy; // Synchronization check

}
// Synchronization check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.581070
