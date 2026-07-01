package com.scb.ratan.flowzero.designer.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @auther Xu, Eva
 * @date 11/02/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormNameCheckDto implements Serializable {

    private String id;

    private String name;

}
