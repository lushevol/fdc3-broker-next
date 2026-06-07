package com.scb.ratan.flowzero.designer.entity.dbo;

import jakarta.persistence.Column;
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
@Table(name = "t_country", schema = DESIGNER_SCHEMA_NAME)
public class Country extends AuditMetadata {

    @Column(name = "alpha2_code")
    private String alpha2Code;

    @Column(name = "alpha3_code")
    private String alpha3Code;
    // The Numeric code of Country, exp. United States is 840, India is 356, etc.
    @Column(name = "numeric_code")
    private String numericCode;

    @Column(name = "short_name")
    private String shortName;

    @Column(name = "short_name_uppercase")
    private String shortNameUpperCase;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "independent")
    private boolean independent;

    @Column(name = "status")
    private String status;

}
