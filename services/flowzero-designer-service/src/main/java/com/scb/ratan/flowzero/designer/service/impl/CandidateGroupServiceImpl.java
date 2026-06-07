package com.scb.ratan.flowzero.designer.service.impl;

import com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum;
import com.scb.ratan.flowzero.designer.common.exception.BusinessException;
import com.scb.ratan.flowzero.designer.converter.CandidateGroupConverter;
import com.scb.ratan.flowzero.designer.entity.dbo.CandidateGroup;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.CandidateGroupQueryDto;
import com.scb.ratan.flowzero.designer.entity.dto.CreateCandidateGroupDto;
import com.scb.ratan.flowzero.designer.entity.dto.UpdateCandidateGroupDto;
import com.scb.ratan.flowzero.designer.entity.vo.CandidateGroupVo;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.designer.repository.CandidateGroupRepository;
import com.scb.ratan.flowzero.designer.service.ICandidateGroupService;
import com.scb.ratan.flowzero.designer.utils.SpecificationUtils;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author Kinson Wang
 * @date 3/30/2026
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateGroupServiceImpl implements ICandidateGroupService {

    private final CandidateGroupRepository candidateGroupRepository;

    private final CandidateGroupConverter candidateGroupConverter;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CandidateGroupVo create(CreateCandidateGroupDto candidateGroupDto) {
        CandidateGroup entity = candidateGroupConverter.toEntityFromCreateDto(candidateGroupDto);
        CandidateGroup candidateGroup = candidateGroupRepository.save(entity);
        return candidateGroupConverter.toVo(candidateGroup);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CandidateGroupVo update(UpdateCandidateGroupDto candidateGroupDto) {
        CandidateGroup candidateGroup = candidateGroupConverter.toEntityFromUpdateDto(candidateGroupDto);
        return candidateGroupConverter.toVo(candidateGroupRepository.save(candidateGroup));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(String id) {
        log.info("Candidate group deleted: id={}", id);
        CandidateGroup candidateGroup = getCandidateGroupById(id);
        candidateGroup.setStatus(DataStatusEnum.DISABLED);
        candidateGroupRepository.save(candidateGroup);
    }

    @Override
    public CandidateGroupVo findById(String id) {
        CandidateGroup candidateGroup = getCandidateGroupById(id);
        return candidateGroupConverter.toVo(candidateGroup);
    }

    @Override
    public PageResponseVo<CandidateGroupVo> page(CandidateGroupQueryDto queryDto, BasePageDto basePageDto) {
        Specification<CandidateGroup> spec = getCandidateGroupSpecification(queryDto);
        Page<CandidateGroup> page = candidateGroupRepository.findAllActive(spec, basePageDto.toPageable());
        return PageResponseVo.of(candidateGroupConverter.toVoPage(page));
    }

    @Override
    public List<CandidateGroupVo> searchByConditions(CandidateGroupQueryDto queryDto) {
        Specification<CandidateGroup> spec = getCandidateGroupSpecification(queryDto);
        return candidateGroupConverter.toVoList(candidateGroupRepository.findAllActive(spec));
    }

    private Specification<CandidateGroup> getCandidateGroupSpecification(CandidateGroupQueryDto queryDto) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            SpecificationUtils.addLikePredicate(predicates, root, cb, "name", queryDto.getName());
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private CandidateGroup getCandidateGroupById(String id) {
        Optional<CandidateGroup> candidateGroupOpt = candidateGroupRepository.findById(id);
        if (candidateGroupOpt.isEmpty()) {
            throw new BusinessException("Cannot find candidate group by ID: " + id);
        }

        return candidateGroupOpt.get();
    }

}
