package com.scb.ratan.flowzero.designer.entity.vo;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.BeanUtils;

import com.scb.ratan.flowzero.designer.entity.dbo.Field;
import com.scb.ratan.flowzero.designer.entity.dbo.Form;

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
public class FormDetailVo extends Form implements Serializable {

    private static final long serialVersionUID = -4817158143778242316L;

    private String url;

    private List<Field> fields;

    public FormDetailVo(Form form) {
        BeanUtils.copyProperties(form, this);
    }

}
