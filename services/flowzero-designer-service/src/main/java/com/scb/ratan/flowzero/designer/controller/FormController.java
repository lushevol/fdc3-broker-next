package com.scb.ratan.flowzero.designer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.CreateFormDto;
import com.scb.ratan.flowzero.designer.entity.dto.FormNameCheckDto;
import com.scb.ratan.flowzero.designer.entity.dto.FormPageQueryDto;
import com.scb.ratan.flowzero.designer.entity.dto.UpdateFormDto;
import com.scb.ratan.flowzero.designer.service.IFormService;

import jakarta.validation.Valid;

/**
 * @auther Tian, Terry
 * @date 19/3/2025
 **/
@RestController
@RequestMapping(value = "/api/v1/form")
public class FormController {

    @Autowired
    private IFormService formService;

    @PostMapping(value = "/create")
    public ResponseEntity<?> create(@Valid @RequestBody CreateFormDto createFormDto) {
        return ResponseEntity.ok(formService.create(createFormDto));
    }

    @PostMapping(value = "/save")
    public ResponseEntity<?> update(@Valid @RequestBody UpdateFormDto updateFormDto) {
        return ResponseEntity.ok(formService.update(updateFormDto));
    }

    @GetMapping(value = "/detail/{formId}")
    public ResponseEntity<?> detail(@PathVariable String formId) {
        return ResponseEntity.ok(formService.detail(formId));
    }

    @GetMapping(value = "/page")
    public ResponseEntity<?> page(FormPageQueryDto workflowPageQueryDto, @Valid BasePageDto basePageDto) {
        return ResponseEntity.ok(formService.page(workflowPageQueryDto, basePageDto));
    }

    @PostMapping(value = "/publish/{formId}")
    public ResponseEntity<?> publish(@PathVariable String formId) {
        formService.publish(formId);
        return ResponseEntity.ok("Form published successfully");
    }

    @PostMapping(value = "/check-name")
    public ResponseEntity<?> checkFormName(@Valid @RequestBody FormNameCheckDto workflowNameCheckDto) {
        return ResponseEntity.ok(formService.checkFormName(workflowNameCheckDto));
    }

    @PostMapping(value = "/delete/{formId}")
    public ResponseEntity<?> delete(@PathVariable String formId) {
        formService.delete(formId);
        return ResponseEntity.ok("Form deleted successfully");
    }

    @PostMapping(value = "/copy/{formId}")
    public ResponseEntity<?> copy(@PathVariable String formId) {
        return ResponseEntity.ok(formService.copy(formId));
    }

    @GetMapping(value = "/published-forms")
    public ResponseEntity<?> publishedForms(FormPageQueryDto queryDto) {
        return ResponseEntity.ok(formService.publishedForms(queryDto));
    }

}
