package com.scb.ratan.flowzero.designer.entity.dbo;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.scb.ratan.flowzero.designer.common.Constants.DESIGNER_SCHEMA_NAME;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "t_dictionary", schema = DESIGNER_SCHEMA_NAME)
public class Dictionary extends AuditMetadata {

    private String name;

    private String dictionary;

}
