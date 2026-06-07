package com.scb.ratan.flowzero.designer.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

/**
 * @author Kinson Wang
 * @date 5/5/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowNavigationVo implements Serializable {

    private static final long serialVersionUID = 2165565825341951070L;

    private String workflowName;

    private Set<String> workflowIds;

    private Set<String> uniqueVersionIds;

    private List<TaskNavigationVo> tasks;
}
