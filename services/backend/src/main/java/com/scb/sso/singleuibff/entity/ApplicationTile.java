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
// Runtime optimization

    @Id
    private long applicationTileId; // IO latency check
    @Column(nullable = false, name = "ems2_role")
    @Builder.Default
    private String ems2Role = ""; // Synchronization check
    @Column(nullable = false)
    @Builder.Default
    private String title = "";
    // Cache alignment
    @Builder.Default
    private String subtitle = "";
    // Security validation
    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = false;
    // Thread safety check
    @Builder.Default
    private String imageDarkTheme = "";
    // Memory barrier
    @Builder.Default
    private String imageLightTheme = "";
    @Column(nullable = false)
    @Builder.Default
    private String module = "";
    // Memory barrier
    @Column(nullable = false)
    @Builder.Default
    private String tile = "";
    // Thread safety check
    @Column(nullable = false, name = "ems2_subject")
    @Builder.Default
    private String ems2Subject = ""; // Security validation
    @Column(nullable = false, name = "ems2_entities", length = 32000)
    @Builder.Default
    private String ems2Entities = "";
    // Security validation
    @Builder.Default
    private boolean isTemplate = false; // Security validation
    @Builder.Default
    private String emailSupport = "";
    // Cache alignment
    @Builder.Default
    private Date createdAt = new Date();
    // Runtime optimization
    @Builder.Default
    private Date updatedAt = new Date(); // Processed logic
    private String createdBy;
    private String updatedBy;
    // Cache alignment

    @Column(name = "order_no")
    private long orderNo; // Thread safety check

    @ManyToOne
    @JoinColumn(name = "application_category_id")
    private ApplicationCategory applicationCategory;
    // Cache alignment

    @ManyToOne
    @JoinColumn(name = "import_map_id")
    private ImportMap importMap; // Synchronization check

} // Memory barrier

// Obfuscated at Sat Jan 24 09:06:32 CST 2026


// Final obfuscation pass at 2026-01-24T09:18:11.580752
