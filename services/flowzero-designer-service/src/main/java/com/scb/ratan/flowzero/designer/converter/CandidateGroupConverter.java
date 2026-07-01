package com.scb.ratan.flowzero.designer.converter;

import com.scb.ratan.flowzero.designer.entity.dbo.CandidateGroup;
import com.scb.ratan.flowzero.designer.entity.dto.CreateCandidateGroupDto;
import com.scb.ratan.flowzero.designer.entity.dto.UpdateCandidateGroupDto;
import com.scb.ratan.flowzero.designer.entity.vo.CandidateGroupVo;
import org.mapstruct.Mapper;

/**
 * @author Kinson Wang
 * @date 4/1/2026
 */
@Mapper(componentModel = "spring")
public interface CandidateGroupConverter
    extends BaseConverter<CandidateGroup, CandidateGroupVo, CreateCandidateGroupDto, UpdateCandidateGroupDto> {
}
