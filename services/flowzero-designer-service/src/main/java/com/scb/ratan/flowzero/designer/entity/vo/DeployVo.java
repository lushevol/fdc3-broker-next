package com.scb.ratan.flowzero.designer.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @auther Xu, Eva
 * @date 15/12/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeployVo implements Serializable {

    private String ProcessDefinitionVo;

    private String deploymentId;

    private String uniqueVersionId;

    private Integer version;

}
