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
    private long applicationCategoryId;
    @Column(nullable = false, unique = true)
    @Builder.Default
    private String label = "";
    @Column(nullable = false, name = "ems2_role")
    @Builder.Default
    private String ems2Role = "";
    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = false;
    @Column(nullable = false)
    @Builder.Default
    private Date createdAt = new Date();
    @Column(nullable = false)
    @Builder.Default
    private Date updatedAt = new Date();
    @Column(nullable = false)
    private String createdBy;
    @Column(nullable = false)
    private String updatedBy;
    @Column(name = "order_no")
    private long orderNo;

    @OneToMany(mappedBy = "applicationCategory")
    @JsonIgnore
    private List<ApplicationTile> applicationTiles;

}
