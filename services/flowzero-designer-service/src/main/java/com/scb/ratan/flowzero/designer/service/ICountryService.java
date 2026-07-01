package com.scb.ratan.flowzero.designer.service;

import com.scb.ratan.flowzero.designer.entity.dbo.Country;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.CountryQueryDto;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;

import java.util.List;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
public interface ICountryService {

    /**
     * Create a new country
     */
    Country create(Country country);

    /**
     * Update an existing country
     */
    Country update(Country country);

    /**
     * Delete a country by ID
     */
    void delete(String id);

    /**
     * Get country by ID
     */
    Country findById(String id);

    /**
     * Get country by alpha2Code
     */
    Country findByAlpha2Code(String alpha2Code);

    /**
     * Get country by alpha3Code
     */
    Country findByAlpha3Code(String alpha3Code);

    /**
     * Get all countries
     */
    List<Country> findAll();

    /**
     * Query countries with pagination
     */
    PageResponseVo<Country> page(CountryQueryDto queryDto, BasePageDto basePageDto);

}
