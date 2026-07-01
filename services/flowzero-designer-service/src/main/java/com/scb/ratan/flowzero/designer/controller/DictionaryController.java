package com.scb.ratan.flowzero.designer.controller;

import com.scb.ratan.flowzero.designer.entity.dbo.Dictionary;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.DictionaryQueryDto;
import com.scb.ratan.flowzero.designer.service.IDictionaryService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@RestController
@RequestMapping(value = "/api/v1/dictionary")
@Slf4j
public class DictionaryController {

    @Autowired
    private IDictionaryService dictionaryService;

    /**
     * Create a new dictionary
     */
    @PostMapping(value = "/create")
    public ResponseEntity<?> create(@RequestBody Dictionary dictionary) {
        return ResponseEntity.ok(dictionaryService.create(dictionary));
    }

    /**
     * Update an existing dictionary
     */
    @PostMapping(value = "/update")
    public ResponseEntity<?> update(@RequestBody Dictionary dictionary) {
        return ResponseEntity.ok(dictionaryService.update(dictionary));
    }

    /**
     * Delete a dictionary by ID
     */
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        dictionaryService.delete(id);
        return ResponseEntity.ok("Dictionary deleted successfully");
    }

    /**
     * Get dictionary detail by ID
     */
    @GetMapping(value = "/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable String id) {
        return ResponseEntity.ok(dictionaryService.findById(id));
    }

    /**
     * Get dictionary by name
     */
    @GetMapping(value = "/name/{name}")
    public ResponseEntity<?> findByName(@PathVariable String name) {
        return ResponseEntity.ok(dictionaryService.findByName(name));
    }

    /**
     * Get dictionaries by multiple names
     */
    @PostMapping(value = "/findByNames")
    public ResponseEntity<?> findByNames(@RequestBody List<String> names) {
        return ResponseEntity.ok(dictionaryService.findByNames(names));
    }

    /**
     * Get all dictionaries
     */
    @GetMapping(value = "/all")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(dictionaryService.findAll());
    }

    /**
     * Query dictionaries with pagination
     */
    @GetMapping(value = "/page")
    public ResponseEntity<?> page(DictionaryQueryDto queryDto, @Valid BasePageDto basePageDto) {
        return ResponseEntity.ok(dictionaryService.page(queryDto, basePageDto));
    }

}
