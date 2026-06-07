package com.scb.ratan.flowzero.designer.entity.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Tian, Terry
 * @date 12/3/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormPageQueryDto implements Serializable {

    private static final long serialVersionUID = -6003964547427150637L;

    private String name;

    private String status;

}
