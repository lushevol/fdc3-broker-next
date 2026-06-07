package com.scb.ratan.flowzero.designer.service;

import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.CreateCandidateGroupDto;
import com.scb.ratan.flowzero.designer.entity.dto.UpdateCandidateGroupDto;
import com.scb.ratan.flowzero.designer.entity.dto.CandidateGroupQueryDto;
import com.scb.ratan.flowzero.designer.entity.vo.CandidateGroupVo;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;

import java.util.List;

/**
 * @author Kinson Wang
 * @date 3/30/2026
 */
public interface ICandidateGroupService {

    CandidateGroupVo create(CreateCandidateGroupDto candidateGroupDto);

    CandidateGroupVo update(UpdateCandidateGroupDto candidateGroupDto);

    void delete(String id);

    CandidateGroupVo findById(String id);

    PageResponseVo<CandidateGroupVo> page(CandidateGroupQueryDto queryDto, BasePageDto basePageDto);

    /**
     * Query candidate group list by conditions
     */
    List<CandidateGroupVo> searchByConditions(CandidateGroupQueryDto queryDto);

}
