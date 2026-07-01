package com.scb.ratan.flowzero.designer.converter;

import com.scb.ratan.flowzero.designer.entity.dbo.Field;
import com.scb.ratan.flowzero.designer.entity.vo.FieldDetailVo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * @auther Xu, Eva
 * @date 10/02/2026
 **/
@Mapper(componentModel = "spring")
public interface FieldToFieldDetailVoConverter {

    @Mapping(target = "formNames", ignore = true)
    FieldDetailVo toFieldEntity(@MappingTarget FieldDetailVo target, Field source);

}
