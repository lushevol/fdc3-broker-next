package com.scb.ratan.flowzero.designer.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scb.ratan.flowzero.designer.common.exception.BusinessException;
import com.scb.ratan.flowzero.designer.entity.dbo.Country;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.CountryQueryDto;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.designer.repository.CountryRepository;
import com.scb.ratan.flowzero.designer.service.ICountryService;

import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@Service
@Slf4j
public class CountryServiceImpl implements ICountryService {

    @Autowired
    private CountryRepository countryRepository;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Country create(Country country) {
        if (country.getId() != null) {
            throw new BusinessException("Country ID should be null when creating");
        }
        try {
            return countryRepository.save(country);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException("Country with the same alpha2Code or alpha3Code already exists");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Country update(Country country) {
        if (country.getId() == null) {
            throw new BusinessException("Country ID is required for update");
        }

        findById(country.getId());

        try {
            return countryRepository.save(country);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException("Country with the same alpha2Code or alpha3Code already exists");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(String id) {
        Country country = findById(id);
        countryRepository.delete(country);
        log.info("Country deleted: id={}", id);
    }

    @Override
    public Country findById(String id) {
        Optional<Country> countryOpt = countryRepository.findById(id);
        if (countryOpt.isEmpty()) {
            throw new BusinessException("Cannot find country by ID: " + id);
        }
        return countryOpt.get();
    }

    @Override
    public Country findByAlpha2Code(String alpha2Code) {
        Optional<Country> countryOpt = countryRepository.findByAlpha2Code(alpha2Code);
        if (countryOpt.isEmpty()) {
            throw new BusinessException("Cannot find country by alpha2Code: " + alpha2Code);
        }
        return countryOpt.get();
    }

    @Override
    public Country findByAlpha3Code(String alpha3Code) {
        Optional<Country> countryOpt = countryRepository.findByAlpha3Code(alpha3Code);
        if (countryOpt.isEmpty()) {
            throw new BusinessException("Cannot find country by alpha3Code: " + alpha3Code);
        }
        return countryOpt.get();
    }

    @Override
    public List<Country> findAll() {
        return countryRepository.findAll();
    }

    @Override
    public PageResponseVo<Country> page(CountryQueryDto queryDto, BasePageDto basePageDto) {
        Specification<Country> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (queryDto != null) {
                if (StringUtils.isNotBlank(queryDto.getId())) {
                    predicates.add(cb.equal(root.get("id"), queryDto.getId()));
                }

                if (StringUtils.isNotBlank(queryDto.getAlpha2Code())) {
                    predicates.add(cb.like(cb.lower(root.get("alpha2Code")),
                        "%" + queryDto.getAlpha2Code().toLowerCase() + "%"));
                }

                if (StringUtils.isNotBlank(queryDto.getAlpha3Code())) {
                    predicates.add(cb.like(cb.lower(root.get("alpha3Code")),
                        "%" + queryDto.getAlpha3Code().toLowerCase() + "%"));
                }

                if (StringUtils.isNotBlank(queryDto.getNumericCode())) {
                    predicates.add(cb.like(root.get("numericCode"),
                        "%" + queryDto.getNumericCode() + "%"));
                }

                if (StringUtils.isNotBlank(queryDto.getShortName())) {
                    predicates.add(cb.like(cb.lower(root.get("shortName")),
                        "%" + queryDto.getShortName().toLowerCase() + "%"));
                }

                if (StringUtils.isNotBlank(queryDto.getStatus())) {
                    predicates.add(cb.equal(root.get("status"), queryDto.getStatus()));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Country> page = countryRepository.findAll(spec, basePageDto.toPageable());
        return PageResponseVo.of(page);
    }

}
