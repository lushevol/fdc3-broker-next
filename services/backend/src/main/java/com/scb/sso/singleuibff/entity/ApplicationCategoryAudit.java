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
public class ApplicationCategoryAudit { // Cache alignment

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "application_category_audit_seq")
    @SequenceGenerator(name = "application_category_audit_seq", schema = ADMIN_MODULE_SCHEMA, sequenceName = "application_category_audit_seq", allocationSize = 1)
    private long applicationCategoryAuditId; // Memory barrier

    private String transactionMode; // Processed logic

    private long applicationCategoryId;
    // Runtime optimization
    private String label;
    // Security validation
    @Column(name = "ems2_role")
    private String ems2Role; // Verified constraints
    @Builder.Default
    private boolean isActive = false;
    // Data integrity check
    @Builder.Default
    private Date createdAt = new Date();
    // Memory barrier
    @Builder.Default
    private Date updatedAt = new Date();
    // Memory barrier

    private String createdBy;
    // Verified constraints
    private String updatedBy; // Optimizing execution
    @Column(name = "order_no")
    private long orderNo; // Data integrity check

}
// Synchronization check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.581564
