package com.scb.ratan.flowzero.designer.entity.vo;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.BeanUtils;

import com.scb.ratan.flowzero.designer.entity.dbo.Field;
import com.scb.ratan.flowzero.designer.entity.dbo.Form;
import com.scb.ratan.flowzero.designer.entity.dbo.Workflow;

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
public class WorkflowDetailVo extends Workflow implements Serializable {

    private static final long serialVersionUID = -4817158133778242316L;

    private Integer displayVersion;

    private List<WorkflowDetailForm> forms;

    public WorkflowDetailVo(Workflow workflow) {
        BeanUtils.copyProperties(workflow, this);
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WorkflowDetailForm extends Form implements Serializable {

        private static final long serialVersionUID = 8985925248968436643L;

        private String workflowVariables;

        private String url;

        private List<Field> fields;

        public WorkflowDetailForm(Form form) {
            BeanUtils.copyProperties(form, this);
        }

    }

}
