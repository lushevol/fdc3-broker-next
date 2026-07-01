package com.scb.ratan.flowzero.designer.service;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import com.scb.ratan.flowzero.designer.common.enums.FieldStatusEnum;
import com.scb.ratan.flowzero.designer.entity.dbo.Field;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.FieldLabelCheckDto;
import com.scb.ratan.flowzero.designer.entity.dto.FieldQueryDto;
import com.scb.ratan.flowzero.designer.entity.vo.FieldDetailVo;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

/**
 * @auther Xu, Eva
 * @date 19/12/2025
 **/
public interface IFieldService {

    List<Field> create(List<Field> fields);

    Set<String> delete(@NotNull Set<String> fieldIds);

    Field update(Field field);

    Set<Field> updateStatus(Set<String> fieldIds, FieldStatusEnum status);

    FieldDetailVo findFieldId(String id);

    PageResponseVo<FieldDetailVo> findFieldByCondition(FieldQueryDto field, BasePageDto basePageDto);

    PageResponseVo<String> findKeyword(String keyword, BasePageDto basePageDto);

    boolean checkFieldLabel(@Valid FieldLabelCheckDto fieldLabelCheckDto);

    List<Field> findByIds(Collection<String> ids);

}
