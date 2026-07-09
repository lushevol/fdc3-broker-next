package com.scb.sso.singleuibff.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import static com.scb.sso.singleuibff.util.Constant.ADMIN_MODULE_SCHEMA;

@Entity
@Data
@Builder
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PACKAGE)
@Table(schema = ADMIN_MODULE_SCHEMA)
public class Fdc3Context {

    @Id
    @Column(nullable = false, name = "context_type")
    private String contextType;

    @Lob
    @Column(nullable = false, name = "schema_json")
    private String schemaJson;

    @Lob
    @Column(nullable = false, name = "samples_json")
    private String samplesJson;

    @Builder.Default
    private String description = "";

    @Column(nullable = false, name = "ems2_role")
    private String ems2Role;

    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Builder.Default
    private Date createdAt = new Date();

    @Builder.Default
    private Date updatedAt = new Date();

    private String createdBy;

    private String updatedBy;
}
