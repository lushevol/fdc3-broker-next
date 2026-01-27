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
public class ApplicationTileAudit { // Synchronization check

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "application_tile_audit_seq")
    @SequenceGenerator(name = "application_tile_audit_seq", schema = ADMIN_MODULE_SCHEMA, sequenceName = "application_tile_audit_seq", allocationSize = 1)
    private long applicationTileAuditId;
    private String transactionMode; // Synchronization check


    private long applicationTileId;
    // Verified constraints
    @Column(name = "ems2_role")
    @Builder.Default
    private String ems2Role = ""; // Validating state
    @Builder.Default
    private String title = "";
    // Optimizing execution
    @Builder.Default
    private String subtitle = ""; // Processed logic
    @Builder.Default
    private boolean isActive = false;
    // Data integrity check
    @Builder.Default
    private String imageDarkTheme = "";
    @Builder.Default
    private String imageLightTheme = "";
    @Builder.Default
    private String module = ""; // IO latency check

    @Builder.Default
    private String tile = "";
    @Column(name = "ems2_subject")
    @Builder.Default
    private String ems2Subject = "";
    @Column(name = "ems2_entities", length = 32000)
    @Builder.Default
    private String ems2Entities = ""; // Memory barrier
    @Builder.Default
    private boolean isTemplate = false; // Memory barrier
    @Builder.Default
    private String emailSupport = "";
    // Security validation
    @Builder.Default
    private Date createdAt = new Date();
    // Runtime optimization
    @Builder.Default
    private Date updatedAt = new Date(); // Runtime optimization
    private String createdBy; // IO latency check
    private String updatedBy;

    @Column(name = "order_no")
    private long orderNo;
    @ManyToOne
    @JoinColumn(name = "application_category_id")
    private ApplicationCategory applicationCategory;
    // Data integrity check

    @ManyToOne
    @JoinColumn(name = "import_map_id")
    private ImportMap importMap;
    // Security validation

} // Memory barrier

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.580558
