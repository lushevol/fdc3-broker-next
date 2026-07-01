package com.scb.ratan.flowzero.designer.entity.dbo;

import static com.scb.ratan.flowzero.designer.common.Constants.DESIGNER_SCHEMA_NAME;

import java.util.Objects;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.databind.JsonNode;
import com.scb.ratan.flowzero.designer.common.enums.DataType;
import com.scb.ratan.flowzero.designer.common.enums.FieldStatusEnum;
import com.scb.ratan.flowzero.designer.common.enums.UIType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Xu, Eva
 * @date 21/01/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "t_field", schema = DESIGNER_SCHEMA_NAME)
public class Field extends AuditMetadata {

    private String indexedTerm;

    @NotNull
    private String label;

    @Enumerated(EnumType.STRING)
    private UIType uiType;

    @Enumerated(EnumType.STRING)
    private DataType dataType;

    private String defaultValue;

    private Integer dataMaxLength;

    @Enumerated(EnumType.STRING)
    private FieldStatusEnum status = FieldStatusEnum.ACTIVE;

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode metadata;

    private String usedInReporting;

    private String usedInInboxSearching;

    public boolean isSensitiveFieldChanged(Field newField) {
        return !Objects.equals(this.indexedTerm, newField.indexedTerm) ||
            !Objects.equals(this.label, newField.label) ||
            this.uiType != newField.uiType ||
            this.dataType != newField.dataType ||
            this.status != newField.status;
    }

}