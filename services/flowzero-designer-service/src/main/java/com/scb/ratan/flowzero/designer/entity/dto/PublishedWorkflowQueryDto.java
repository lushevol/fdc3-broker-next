package com.scb.ratan.flowzero.designer.entity.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Tian, Terry
 * @date 13/3/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublishedWorkflowQueryDto implements Serializable {

    private static final long serialVersionUID = -6003954547427151637L;

    private String name;

}
