package com.scb.ratan.flowzero.designer.entity.vo;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Tian, Terry
 * @date 1/4/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormVariableVo implements Serializable {

    private static final long serialVersionUID = -4817168133778242316L;

    private String namespace;

    private String formId;

    private String variables;

}
