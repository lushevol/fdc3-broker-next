package com.scb.ratan.flowzero.designer.service;

import java.util.Collection;
import java.util.List;

import com.scb.ratan.flowzero.designer.entity.dbo.Form;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.CreateFormDto;
import com.scb.ratan.flowzero.designer.entity.dto.FormNameCheckDto;
import com.scb.ratan.flowzero.designer.entity.dto.FormPageQueryDto;
import com.scb.ratan.flowzero.designer.entity.dto.UpdateFormDto;
import com.scb.ratan.flowzero.designer.entity.vo.FormDetailVo;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;

/**
 * @author Tian, Terry
 * @date 20/3/2025
 */
public interface IFormService {

    void delete(String formId);

    Form create(CreateFormDto createFormDto);

    Form update(UpdateFormDto updateFormDto);

    List<Form> findByIds(Collection<String> ids);

    Form findById(String id);

    void checkFormName(String name, String id);

    boolean checkFormName(FormNameCheckDto formNameCheckDto);

    PageResponseVo<Form> page(FormPageQueryDto queryDto, BasePageDto basePageDto);

    List<Form> publishedForms(FormPageQueryDto queryDto);

    FormDetailVo detail(String workflowId);

    void publish(String formId);

    Form copy(String formId);

}
