package com.scb.ratan.flowzero.workflow.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @auther Tian, Terry
 * @date 12/3/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyRequestPageQueryDto implements Serializable {

    private static final long serialVersionUID = -6003954547437150637L;

    private String workflowName;

    private String status;

}
