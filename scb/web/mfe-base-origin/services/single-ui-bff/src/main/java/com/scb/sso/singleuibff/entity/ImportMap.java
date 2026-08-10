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
public class ImportMap {

    @Id
    private long importMapId;
    @Column(nullable = false, name = "ems2_role")
    @Builder.Default
    private String ems2Role = "";
    @Column(nullable = false, unique = true)
    @Builder.Default
    private String keyName = "";
    @Column(nullable = false)
    @Builder.Default
    private String path = "";
    @Builder.Default
    private boolean isActive = false;
    @Builder.Default
    private Date createdAt = new Date();
    @Builder.Default
    private Date updatedAt = new Date();
    private String createdBy;
    private String updatedBy;

    @OneToMany(mappedBy = "importMap")
    @JsonIgnore
    private List<ApplicationTile> applicationTiles;

}
