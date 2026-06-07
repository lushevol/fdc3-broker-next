package com.scb.ratan.flowzero.designer.entity.dto;

import java.io.Serializable;

import com.scb.ratan.flowzero.designer.common.enums.WorkflowStopTypeEnum;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Tian, Terry
 * @date 4/2/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowPublishDto implements Serializable {

    @NotBlank
    private String id;

    private String stopType = WorkflowStopTypeEnum.GRACEFUL_STOP.getName();

}
