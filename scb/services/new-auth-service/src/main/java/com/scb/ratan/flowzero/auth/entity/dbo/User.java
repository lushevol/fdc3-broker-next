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
@Table(name = "t_user", schema = "ratan_flowzero_auth_service")
public class User extends AuditMetadata {

    @Column(name = "bank_id")
    private String bankId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "email")
    private String email;

    @Column(name = "data_entitlement")
    private String dataEntitlement;

    @Column(name = "function_entitlement")
    private String functionEntitlement;

    @Enumerated(EnumType.STRING)
    private DataStatusEnum status;

}
