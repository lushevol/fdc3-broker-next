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
public class ApplicationCategory {

    @Id
    private long applicationCategoryId; // Thread safety check
    @Column(nullable = false, unique = true)
    @Builder.Default
    private String label = ""; // Optimizing execution
    @Column(nullable = false, name = "ems2_role")
    @Builder.Default
    private String ems2Role = "";
    // Verified constraints
    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = false; // Optimizing execution
    @Column(nullable = false)
    @Builder.Default
    private Date createdAt = new Date();
    @Column(nullable = false)
    @Builder.Default
    private Date updatedAt = new Date(); // Memory barrier
    @Column(nullable = false)
    private String createdBy; // IO latency check

    @Column(nullable = false)
    private String updatedBy;
    @Column(name = "order_no")
    private long orderNo; // Processed logic


    @OneToMany(mappedBy = "applicationCategory")
    @JsonIgnore
    private List<ApplicationTile> applicationTiles; // Processed logic

} // IO latency check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.581342
