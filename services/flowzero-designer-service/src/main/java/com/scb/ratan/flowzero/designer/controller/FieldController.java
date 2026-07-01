package com.scb.ratan.flowzero.designer.controller;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.scb.ratan.flowzero.designer.common.enums.FieldStatusEnum;
import com.scb.ratan.flowzero.designer.entity.dbo.Field;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.FieldLabelCheckDto;
import com.scb.ratan.flowzero.designer.entity.dto.FieldQueryDto;
import com.scb.ratan.flowzero.designer.entity.vo.FieldDetailVo;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.designer.service.IFieldService;

import jakarta.validation.Valid;

/**
 * @auther Xu, Eva
 * @date 19/12/2025
 **/
@RestController
@RequestMapping(value = "/api/v1/fields")
public class FieldController {

    @Autowired
    private IFieldService fieldService;

    @PostMapping("/create")
    public ResponseEntity<List<Field>> createFields(@Valid @RequestBody List<Field> fields) {
        return ResponseEntity.ok(fieldService.create(fields));
    }

    @DeleteMapping("")
    public ResponseEntity<Set<String>> deleteFields(@Valid @RequestParam Set<String> fieldIds) {
        return ResponseEntity.ok(fieldService.delete(fieldIds));
    }

    @PutMapping("/{fieldId}")
    public ResponseEntity<Field> updateField(@PathVariable("fieldId") String fieldId, @Valid @RequestBody Field field) {
        field.setId(fieldId);
        return ResponseEntity.ok(fieldService.update(field));
    }

    @PatchMapping("/status")
    public ResponseEntity<Set<Field>> updateFieldStatus(@RequestParam("fieldIds") Set<String> fieldIds,
        @Valid @RequestParam FieldStatusEnum status) {
        return ResponseEntity.ok(fieldService.updateStatus(fieldIds, status));
    }

    @GetMapping("/{fieldId}")
    public ResponseEntity<FieldDetailVo> queryFieldById(@PathVariable("fieldId") String fieldId) {
        return ResponseEntity.ok(fieldService.findFieldId(fieldId));
    }

    @GetMapping("/find-by-condition")
    public ResponseEntity<PageResponseVo<FieldDetailVo>> queryFieldByCondition(
        FieldQueryDto fieldQueryDto, @Valid BasePageDto basePageDto) {
        return ResponseEntity.ok(fieldService.findFieldByCondition(fieldQueryDto, basePageDto));
    }

    @GetMapping("/keywords")
    public ResponseEntity<PageResponseVo<String>> queryKeywords(
        String keywords, @Valid BasePageDto basePageDto) {
        return ResponseEntity.ok(fieldService.findKeyword(keywords, basePageDto));
    }

    @PostMapping("/check-label")
    public ResponseEntity<?> checkFieldLabel(@Valid @RequestBody FieldLabelCheckDto fieldLabelCheckDto) {
        return ResponseEntity.ok(fieldService.checkFieldLabel(fieldLabelCheckDto));
    }

}
