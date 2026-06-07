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

/**
 * @author Kinson Wang
 * @date 3/30/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "t_role", schema = DESIGNER_SCHEMA_NAME)
public class CandidateGroup extends AuditMetadata {

    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    private DataStatusEnum status;

}
