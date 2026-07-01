package com.scb.ratan.flowzero.designer.service;

import com.scb.ratan.flowzero.designer.entity.dbo.Dictionary;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.DictionaryQueryDto;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;

import java.util.List;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
public interface IDictionaryService {

    /**
     * Create a new dictionary
     */
    Dictionary create(Dictionary dictionary);

    /**
     * Update an existing dictionary
     */
    Dictionary update(Dictionary dictionary);

    /**
     * Delete a dictionary by ID
     */
    void delete(String id);

    /**
     * Get dictionary by ID
     */
    Dictionary findById(String id);

    /**
     * Get dictionary by name
     */
    Dictionary findByName(String name);

    /**
     * Get dictionaries by multiple names
     */
    List<Dictionary> findByNames(List<String> names);

    /**
     * Get all dictionaries
     */
    List<Dictionary> findAll();

    /**
     * Query dictionaries with pagination
     */
    PageResponseVo<Dictionary> page(DictionaryQueryDto queryDto, BasePageDto basePageDto);

}
