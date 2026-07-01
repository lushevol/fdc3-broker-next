package com.scb.ratan.flowzero.workflow.entity.vo;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author MaYue
 * @date 1/8/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcessInstanceDetailVo implements Serializable {

    private static final long serialVersionUID = 2775192606349781014L;

    private List<TaskVo> taskVOList;

}
