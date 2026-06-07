package com.scb.ratan.flowzero.designer.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CountryQueryDto implements Serializable {

    private String id;

    private String alpha2Code;

    private String alpha3Code;

    private String numericCode;

    private String shortName;

    private String status;

}
