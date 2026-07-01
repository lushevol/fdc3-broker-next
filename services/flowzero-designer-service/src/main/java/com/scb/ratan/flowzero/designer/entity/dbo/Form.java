package com.scb.ratan.flowzero.designer.entity.dbo;

import static com.scb.ratan.flowzero.designer.common.Constants.DESIGNER_SCHEMA_NAME;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
@Table(name = "t_form", schema = DESIGNER_SCHEMA_NAME)
public class Form extends AuditMetadata implements Serializable {

    private String name;

    private String description;

    private String status;

    private String formModelUrl;

}