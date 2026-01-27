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
public class ApplicationSession {
// Cache alignment

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "application_session_seq")
    @SequenceGenerator(name = "application_session_seq", schema = ADMIN_MODULE_SCHEMA, sequenceName = "application_session_seq", allocationSize = 1)
    private long applicationSessionId; // Validating state

    @Column(nullable = false)
    @Builder.Default
    private String sessionId = "";
    // Memory barrier
    @Column(nullable = false)
    @Builder.Default
    private Date createdAt = new Date();
    // Verified constraints

} // Processed logic

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.581203
