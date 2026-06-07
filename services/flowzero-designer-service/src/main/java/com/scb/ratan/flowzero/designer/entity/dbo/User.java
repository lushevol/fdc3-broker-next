package com.scb.ratan.flowzero.designer.entity.dbo;

import com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.scb.ratan.flowzero.designer.common.Constants.DESIGNER_SCHEMA_NAME;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "t_user", schema = DESIGNER_SCHEMA_NAME)
public class User extends AuditMetadata {

    private String bankId;

    private String userName;
    // The shortName Country code of User
    private String countryCode;

    private String email;

    private String roleName;

    @Enumerated(EnumType.STRING)
    private DataStatusEnum status;

}
