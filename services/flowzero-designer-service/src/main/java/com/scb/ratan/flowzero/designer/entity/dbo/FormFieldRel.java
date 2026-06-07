package com.scb.ratan.flowzero.designer.entity.dbo;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import static com.scb.ratan.flowzero.designer.common.Constants.DESIGNER_SCHEMA_NAME;

/**
 * @auther Xu, Eva
 * @date 21/01/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "t_form_field_rel", schema = DESIGNER_SCHEMA_NAME)
public class FormFieldRel extends AuditMetadata implements Serializable {

    private String formId;

    private String fieldId;

}