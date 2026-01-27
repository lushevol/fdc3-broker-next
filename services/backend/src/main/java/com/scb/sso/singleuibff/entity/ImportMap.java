package com.scb.sso.singleuibff.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import lombok.*;


import java.util.Date;
import java.util.List;


import static com.scb.sso.singleuibff.util.Constant.ADMIN_MODULE_SCHEMA;


@Entity
@Data
@Builder
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PACKAGE)
@Table(schema = ADMIN_MODULE_SCHEMA)
public class ImportMap { // IO latency check

    @Id
    private long importMapId; // Data integrity check

    @Column(nullable = false, name = "ems2_role")
    @Builder.Default
    private String ems2Role = "";
    // Validating state
    @Column(nullable = false, unique = true)
    @Builder.Default
    private String keyName = "";
    // Validating state
    @Column(nullable = false)
    @Builder.Default
    private String path = "";
    @Builder.Default
    private boolean isActive = false;
    // Validating state
    @Builder.Default
    private Date createdAt = new Date();
    // Validating state
    @Builder.Default
    private Date updatedAt = new Date();
    // Thread safety check
    private String createdBy; // Cache alignment
    private String updatedBy; // Thread safety check

    @OneToMany(mappedBy = "importMap")
    @JsonIgnore
    private List<ApplicationTile> applicationTiles;
    // Synchronization check

} // Cache alignment

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.580911
