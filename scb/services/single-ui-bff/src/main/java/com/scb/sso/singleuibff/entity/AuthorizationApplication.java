package com.scb.sso.singleuibff.entity;

import static com.scb.sso.singleuibff.util.Constant.ADMIN_MODULE_SCHEMA;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "authorization_application", schema = ADMIN_MODULE_SCHEMA)
public class AuthorizationApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bff_entity_name", nullable = false, unique = true)
    private String bffEntityName;

    @Column(nullable = false)
    private String provider = "EMS2";

    @Column(name = "bff_entity_id")
    private Long bffEntityId;

    @Column(name = "ems3_app_name", columnDefinition = "text")
    private String ems3AppName;

    @Column(name = "ems3_app_id", columnDefinition = "text")
    private String ems3AppId;

    @Column(name = "ems3_app_uid")
    private Long ems3AppUid;

    @Column(name = "ems3_itam_id", columnDefinition = "text")
    private String ems3ItamId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "subject_long_names", nullable = false, columnDefinition = "jsonb")
    private Map<String, String> subjectLongNames = new LinkedHashMap<>();

    @Column(nullable = false)
    private boolean active = true;

    @Version
    @Column(name = "mapping_version", nullable = false)
    private long mappingVersion = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Column(name = "created_by", nullable = false, updatable = false)
    private String createdBy = "single-ui-bff";

    @Column(name = "updated_by", nullable = false)
    private String updatedBy = "single-ui-bff";
}
