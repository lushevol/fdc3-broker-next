package com.scb.ratan.flowzero.auth.entity.dbo;

import com.scb.ratan.flowzero.auth.constant.DataStatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "t_role", schema = "ratan_flowzero_auth_service")
public class Role extends AuditMetadata {

    @Column(name = "role_name")
    private String roleName;

    @Column(name = "description")
    private String description;

    @Column(name = "bank_id")
    private String bankId;

    @Enumerated(EnumType.STRING)
    private DataStatusEnum status;

}
