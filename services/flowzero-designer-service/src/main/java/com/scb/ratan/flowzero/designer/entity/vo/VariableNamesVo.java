package com.scb.ratan.flowzero.designer.entity.vo;

import java.io.Serializable;
import java.util.List;

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
public class VariableNamesVo implements Serializable {

    private static final long serialVersionUID = -4917168133778242316L;

    private List<FormVariableVo> formVariables;

}
