package com.scb.ratan.flowzero.designer.controller;

import com.scb.ratan.flowzero.designer.entity.dbo.Country;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.CountryQueryDto;
import com.scb.ratan.flowzero.designer.service.ICountryService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@RestController
@RequestMapping(value = "/api/v1/country")
@Slf4j
public class CountryController {

    @Autowired
    private ICountryService countryService;

    /**
     * Create a new country
     */
    @PostMapping(value = "/create")
    public ResponseEntity<?> create(@RequestBody Country country) {
        return ResponseEntity.ok(countryService.create(country));
    }

    /**
     * Update an existing country
     */
    @PostMapping(value = "/update")
    public ResponseEntity<?> update(@RequestBody Country country) {
        return ResponseEntity.ok(countryService.update(country));
    }

    /**
     * Delete a country by ID
     */
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        countryService.delete(id);
        return ResponseEntity.ok("Country deleted successfully");
    }

    /**
     * Get country detail by ID
     */
    @GetMapping(value = "/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable String id) {
        return ResponseEntity.ok(countryService.findById(id));
    }

    /**
     * Get country by alpha2Code
     */
    @GetMapping(value = "/alpha2/{alpha2Code}")
    public ResponseEntity<?> findByAlpha2Code(@PathVariable String alpha2Code) {
        return ResponseEntity.ok(countryService.findByAlpha2Code(alpha2Code));
    }

    /**
     * Get country by alpha3Code
     */
    @GetMapping(value = "/alpha3/{alpha3Code}")
    public ResponseEntity<?> findByAlpha3Code(@PathVariable String alpha3Code) {
        return ResponseEntity.ok(countryService.findByAlpha3Code(alpha3Code));
    }

    /**
     * Get all countries
     */
    @GetMapping(value = "/all")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(countryService.findAll());
    }

    /**
     * Query countries with pagination
     */
    @GetMapping(value = "/page")
    public ResponseEntity<?> page(CountryQueryDto queryDto, @Valid BasePageDto basePageDto) {
        return ResponseEntity.ok(countryService.page(queryDto, basePageDto));
    }

}
