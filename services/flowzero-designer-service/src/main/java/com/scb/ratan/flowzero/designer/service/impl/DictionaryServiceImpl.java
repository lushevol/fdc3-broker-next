package com.scb.ratan.flowzero.designer.service.impl;

import com.scb.ratan.flowzero.designer.common.exception.BusinessException;
import com.scb.ratan.flowzero.designer.entity.dbo.Dictionary;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.DictionaryQueryDto;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.designer.repository.DictionaryRepository;
import com.scb.ratan.flowzero.designer.service.IDictionaryService;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@Service
@Slf4j
public class DictionaryServiceImpl implements IDictionaryService {

    @Autowired
    private DictionaryRepository dictionaryRepository;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Dictionary create(Dictionary dictionary) {
        if (dictionary.getId() != null) {
            throw new BusinessException("Dictionary ID should be null when creating");
        }

        return dictionaryRepository.save(dictionary);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Dictionary update(Dictionary dictionary) {
        if (dictionary.getId() == null) {
            throw new BusinessException("Dictionary ID is required for update");
        }
        return dictionaryRepository.save(dictionary);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(String id) {
        Dictionary dictionary = findById(id);
        dictionaryRepository.delete(dictionary);
        log.info("Dictionary deleted: id={}", id);
    }

    @Override
    public Dictionary findById(String id) {
        Optional<Dictionary> dictionaryOpt = dictionaryRepository.findById(id);
        if (dictionaryOpt.isEmpty()) {
            throw new BusinessException("Cannot find dictionary by ID: " + id);
        }
        return dictionaryOpt.get();
    }

    @Override
    public Dictionary findByName(String name) {
        Optional<Dictionary> dictionaryOpt = dictionaryRepository.findByName(name);
        if (dictionaryOpt.isEmpty()) {
            throw new BusinessException("Cannot find dictionary by name: " + name);
        }
        return dictionaryOpt.get();
    }

    @Override
    public List<Dictionary> findByNames(List<String> names) {
        if (names == null || names.isEmpty()) {
            throw new BusinessException("Dictionary names list cannot be empty");
        }
        return dictionaryRepository.findByNameIn(names);
    }

    @Override
    public List<Dictionary> findAll() {
        return dictionaryRepository.findAll();
    }

    @Override
    public PageResponseVo<Dictionary> page(DictionaryQueryDto queryDto, BasePageDto basePageDto) {
        Specification<Dictionary> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (queryDto != null) {
                if (StringUtils.isNotBlank(queryDto.getId())) {
                    predicates.add(cb.equal(root.get("id"), queryDto.getId()));
                }

                if (StringUtils.isNotBlank(queryDto.getName())) {
                    predicates.add(cb.like(cb.lower(root.get("name")),
                        "%" + queryDto.getName().toLowerCase() + "%"));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Dictionary> page = dictionaryRepository.findAll(spec, basePageDto.toPageable());
        return PageResponseVo.of(page);
    }

}
