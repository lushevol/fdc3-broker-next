package com.scb.ratan.flowzero.designer.entity.dto;

import java.io.Serializable;
import java.util.Collection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Tian, Terry
 * @date 14/3/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowQueryDto implements Serializable {

    private static final long serialVersionUID = -6103954547427150637L;

    private String name;

    private Collection<String> ids;

}
