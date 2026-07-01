package com.scb.ratan.flowzero.designer.service.impl;

import com.google.common.collect.Sets;
import com.scb.ratan.flowzero.designer.common.Constants;
import com.scb.ratan.flowzero.designer.common.enums.FieldStatusEnum;
import com.scb.ratan.flowzero.designer.common.exception.BusinessException;
import com.scb.ratan.flowzero.designer.converter.FieldToFieldDetailVoConverter;
import com.scb.ratan.flowzero.designer.entity.dbo.AuditMetadata;
import com.scb.ratan.flowzero.designer.entity.dbo.Field;
import com.scb.ratan.flowzero.designer.entity.dbo.FormFieldRel;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.FieldLabelCheckDto;
import com.scb.ratan.flowzero.designer.entity.dto.FieldQueryDto;
import com.scb.ratan.flowzero.designer.entity.vo.FieldDetailVo;
import com.scb.ratan.flowzero.designer.entity.vo.IdNameVo;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.designer.repository.FieldRepository;
import com.scb.ratan.flowzero.designer.repository.FormFieldRelRepository;
import com.scb.ratan.flowzero.designer.repository.FormRepository;
import com.scb.ratan.flowzero.designer.service.IFieldService;
import com.scb.ratan.flowzero.designer.utils.SpecificationUtils;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

/**
 * @auther Xu, Eva
 * @date 19/12/2025
 **/
@Service
@Slf4j
public class FieldServiceImpl implements IFieldService {

    private static final Pattern CAMEL_CASE_SPACE_PATTERN = Pattern.compile(" (\\w)");

    private static final List<Function<Field, Object>> OTHER_FIELD_EXTRACTORS = Arrays.asList(
        Field::getLabel,
        Field::getUiType,
        Field::getDataType,
        Field::getDefaultValue,
        Field::getStatus,
        Field::getMetadata);

    @Autowired
    public FieldRepository fieldRepository;

    @Autowired
    public FormFieldRelRepository formFieldRelRepository;

    @Autowired
    public FormRepository formRepository;

    @Autowired
    public FieldToFieldDetailVoConverter fieldToFieldDetailVoConverter;

    @Override
    public List<Field> create(List<Field> fields) {

        duplicateNameCheckWhenCreation(fields);
        log.info("creating field {}", fields);
        // set field.label as camel case as default indexedTerm if indexedTerm is not
        // provided by request
        Set<String> usedIndexedTerms = new HashSet<>();
        for (Field field : fields) {
            if (StringUtils.isEmpty(field.getIndexedTerm())) {
                field.setIndexedTerm(toCamelCase(field.getLabel(), null, usedIndexedTerms));
            }
        }
        Iterable<Field> results = fieldRepository.saveAll(fields);

        return StreamSupport.stream(results.spliterator(), false).collect(toList());
    }

    @Override
    public Set<String> delete(@NotNull Set<String> fieldIds) {

        log.info("deleting field {}", fieldIds);
        List<FormFieldRel> rels = formFieldRelRepository.findAllByFieldIdIn(fieldIds);
        if (null == rels || rels.isEmpty()) {
            fieldRepository.deleteAllById(fieldIds);
            return new HashSet<>();
        }

        return rels.stream().map(FormFieldRel::getFieldId).collect(Collectors.toSet());
    }

    @Override
    public Field update(Field field) {

        log.info("updating field {}", field);

        Field exitingField = getFieldById(field.getId());

        if (exitingField.getStatus() != FieldStatusEnum.ACTIVE) {
            throw new BusinessException("Update Failed, only ACTIVE field can be updated");
        }

        if (exitingField.isSensitiveFieldChanged(field)) {
            referenceCheck(exitingField, field);
        }

        if (!exitingField.getLabel().equalsIgnoreCase(field.getLabel())) {
            duplicateNameCheckWhenUpdating(field);
        }

        field.setCreatedBy(exitingField.getCreatedBy());
        field.setCreatedAt(exitingField.getCreatedAt());
        field.setVersion(exitingField.getVersion());
        field.setIndexedTerm(toCamelCase(field.getLabel(), field.getId(), null));
        return fieldRepository.save(field);

    }

    @Override
    public Set<Field> updateStatus(Set<String> fieldIds, FieldStatusEnum status) {

        log.info("updating field id {} to {}", fieldIds, status);

        Set<Field> exitingFields = getFieldByIds(fieldIds);

        if (FieldStatusEnum.DISABLED == status) {
            referenceCheck(exitingFields);
        }

        Set<Field> results = exitingFields.stream().peek(f -> {
            f.setStatus(status);
        }).collect(Collectors.toSet());
        Iterable<Field> fields = fieldRepository.saveAll(results);

        return StreamSupport.stream(fields.spliterator(), false).collect(Collectors.toSet());
    }

    @Override
    public FieldDetailVo findFieldId(String fieldId) {

        log.info("querying field by id {}", fieldId);

        Optional<Field> fieldOpt = fieldRepository.findById(fieldId);

        if (fieldOpt.isEmpty()) {
            throw new BusinessException("no field " + fieldId);
        }

        Field field = fieldOpt.get();
        FieldDetailVo fieldDetailVo = new FieldDetailVo();
        fieldToFieldDetailVoConverter.toFieldEntity(fieldDetailVo, field);

        List<FormFieldRel> rels = formFieldRelRepository.findByFieldId(field.getId());
        if (!rels.isEmpty()) {
            Set<String> formIds = rels.stream().map(FormFieldRel::getFormId).collect(Collectors.toSet());
            Set<String> formNames = formRepository.findNameByIdIn(formIds);
            fieldDetailVo.setFormNames(formNames);
        }

        return fieldDetailVo;

    }

    @Override
    public PageResponseVo<FieldDetailVo> findFieldByCondition(FieldQueryDto fieldQueryDto, BasePageDto basePageDto) {

        log.info("querying fieldQueryDto by {}", fieldQueryDto);

        Specification<Field> fieldSpec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            SpecificationUtils.addEqualPredicate(predicates, root, cb, "indexedTerm", fieldQueryDto.getIndexedTerm());
            SpecificationUtils.addLikePredicate(predicates, root, cb, "label", fieldQueryDto.getLabel());
            SpecificationUtils.addInPredicate(predicates, root, "uiType", fieldQueryDto.getUiType());
            SpecificationUtils.addInPredicate(predicates, root, "dataType", fieldQueryDto.getDataType());
            SpecificationUtils.addEqualPredicate(predicates, root, cb, "status", fieldQueryDto.getStatus());
            SpecificationUtils.addEqualPredicate(predicates, root, cb, "usedInReporting", fieldQueryDto.getUsedInReporting());
            SpecificationUtils.addEqualPredicate(predicates, root, cb, "usedInInboxSearching", fieldQueryDto.getUsedInInboxSearching());
            SpecificationUtils.addInPredicate(predicates, root, "createdBy", fieldQueryDto.getCreatedBy());
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Page<Field> fields = fieldRepository.findAll(fieldSpec, basePageDto.toPageable());

        if (fields.isEmpty()) {
            return new PageResponseVo<>(basePageDto.getPage(), basePageDto.getSize(), 0, 0, null);
        }

        List<FieldDetailVo> fieldDetailVos = findRelForms(fields.getContent());

        return new PageResponseVo<>(fields.getNumber(), fields.getSize(), fields.getTotalElements(), fields.getTotalPages(),
            fieldDetailVos);

    }

    @Override
    public PageResponseVo<String> findKeyword(String keyword, BasePageDto basePageDto) {

        log.info("querying keyword by {}", keyword);

        Page<String> keywords = fieldRepository.findActiveLabelsByLabelContaining(keyword, basePageDto.toPageable());

        return new PageResponseVo<>(keywords.getNumber(), keywords.getSize(), keywords.getTotalElements(), keywords.getTotalPages(),
            keywords.getContent());

    }

    @Override
    public boolean checkFieldLabel(FieldLabelCheckDto fieldLabelCheckDto) {
        Set<String> normalizedLabels = Sets.newHashSet(normalizeLabel(fieldLabelCheckDto.getLabel()));
        List<Field> duplicateFields = fieldRepository.findByNormalizedLabels(normalizedLabels);
        return duplicateFields.stream().allMatch(f -> Objects.equals(f.getId(), fieldLabelCheckDto.getId()));
    }

    @Override
    public List<Field> findByIds(Collection<String> ids) {
        return fieldRepository.findByIdIn(ids);
    }

    private List<FieldDetailVo> findRelForms(List<Field> fields) {

        Set<String> fieldIds = fields.stream().map(AuditMetadata::getId).collect(toSet());
        List<FormFieldRel> rels = formFieldRelRepository.findAllByFieldIdIn(fieldIds);

        if (rels.isEmpty()) {
            return convertFieldToVo(fields, null);
        }

        Set<String> formIds = rels.stream().map(FormFieldRel::getFormId).collect(toSet());
        Map<String, String> formIdNameMap = formRepository.queryIdAndNameByIds(formIds)
            .stream().collect(Collectors.toMap(IdNameVo::getId, IdNameVo::getName));
        Map<String, Set<String>> relMap = new HashMap<>(fields.size());
        for (FormFieldRel rel : rels) {
            relMap.computeIfAbsent(rel.getFieldId(), k -> new HashSet<>()).add(formIdNameMap.get(rel.getFormId()));
        }

        return convertFieldToVo(fields, relMap);

    }

    private List<FieldDetailVo> convertFieldToVo(
        List<Field> fields, Map<String, Set<String>> relMap) {

        List<FieldDetailVo> fieldDetailVos = new ArrayList<>();
        for (Field field : fields) {

            FieldDetailVo fieldDetailVo = new FieldDetailVo();
            fieldToFieldDetailVoConverter.toFieldEntity(fieldDetailVo, field);

            if (relMap != null && relMap.containsKey(field.getId())) {
                fieldDetailVo.setFormNames(relMap.get(field.getId()));
            }

            fieldDetailVos.add(fieldDetailVo);
        }

        return fieldDetailVos;
    }

    public Field getFieldById(String fieldId) {

        log.info("querying field by id {}", fieldId);

        Optional<Field> fieldOpt = fieldRepository.findById(fieldId);

        if (fieldOpt.isPresent()) {
            return fieldOpt.get();
        }

        throw new BusinessException("no field " + fieldId);
    }

    private Set<Field> getFieldByIds(Set<String> fieldIds) {

        log.info("querying field by id {}", fieldIds);

        List<Field> fields = fieldRepository.findAllById(fieldIds);

        if (!fields.isEmpty()) {
            return new HashSet<>(fields);
        }

        throw new BusinessException("no field " + fieldIds);
    }

    private void referenceCheck(Field field, Field uploadField) {

        List<FormFieldRel> rels = formFieldRelRepository.findByFieldId(field.getId());

        if (null != rels && !rels.isEmpty()) {
            boolean reportingChanged = !Objects.equals(field.getUsedInReporting(), uploadField.getUsedInReporting());
            boolean inboxChanged = !Objects.equals(field.getUsedInInboxSearching(), uploadField.getUsedInInboxSearching());
            boolean otherChanged = OTHER_FIELD_EXTRACTORS.stream()
                .anyMatch(extractor -> !Objects.equals(extractor.apply(field), extractor.apply(uploadField)));
            if ((reportingChanged || inboxChanged) && !otherChanged) {
                return;
            }

            throw new BusinessException("Update Failed, Field has relationship with " +
                rels.stream().map(FormFieldRel::getFormId).collect(Collectors.toSet()));
        }

    }

    private void referenceCheck(Set<Field> fields) {

        Set<String> activeFields = fields.stream().filter(
            f -> f.getStatus() == FieldStatusEnum.ACTIVE).map(Field::getId).collect(Collectors.toSet());

        List<FormFieldRel> rels = formFieldRelRepository.findAllByFieldIdIn(activeFields);

        if (null != rels && !rels.isEmpty()) {
            throw new BusinessException("Update Failed, Field has relationship with " +
                rels.stream().map(FormFieldRel::getFieldId).collect(Collectors.toSet()));
        }

    }

    private void duplicateNameCheckWhenCreation(List<Field> fields) {

        List<String> labels = fields.stream().map(Field::getLabel).toList();
        Set<String> normalizedLabels = new HashSet<>(labels.size());

        // 1. Check input if duplicate label in request field list.
        for (String label : labels) {
            String normalizedLabel = normalizeLabel(label);
            if (normalizedLabels.contains(normalizedLabel)) {
                throw new BusinessException("the label: " + label + " has duplicate label in your list, please double check");
            }
            normalizedLabels.add(normalizeLabel(label));
        }

        // 2.Check input if duplicate label in database
        List<Field> duplicateFields = fieldRepository.findByNormalizedLabels(normalizedLabels);
        if (!duplicateFields.isEmpty()) {
            Set<String> duplicateLabels = duplicateFields.stream().map(Field::getLabel).collect(Collectors.toSet());
            log.warn("duplicate field label {}", duplicateLabels);
            throw new BusinessException("duplicate field label " + duplicateLabels);
        }
    }

    private void duplicateNameCheckWhenUpdating(Field field) {

        Set<String> normalizedLabels = Set.of(normalizeLabel(field.getLabel()));
        List<Field> duplicateFields = fieldRepository.findByNormalizedLabels(normalizedLabels);

        if (duplicateFields.stream().anyMatch(f -> !f.getId().equals(field.getId()))) {
            log.warn("duplicate field label {}", duplicateFields);
            throw new BusinessException("duplicate field label " + duplicateFields);
        }

    }

    private String normalizeLabel(String label) {
        return label == null ? null : label.replaceAll("\\s+", "").toLowerCase();
    }

    private String toCamelCase(String label, String currentFieldId, Set<String> usedIndexedTerms) {
        String baseIndexedTerm = buildBaseIndexedTerm(label);
        if (!StringUtils.hasText(baseIndexedTerm)) {
            return baseIndexedTerm;
        }

        return buildCopyIndexedTerm(baseIndexedTerm, currentFieldId, usedIndexedTerms);
    }

    private String buildBaseIndexedTerm(String label) {
        if (label == null || label.isBlank()) {
            return label;
        }
        // Remove configured special characters before applying camel-case conversion.
        String sanitized = label.replaceAll("[?./_:&(),\\-]", "");
        // Trim and collapse all whitespace sequences (spaces, tabs, etc.) into a single
        // space
        String normalized = sanitized.trim().replaceAll("\\s+", " ").toLowerCase();
        Matcher matcher = CAMEL_CASE_SPACE_PATTERN.matcher(normalized);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            matcher.appendReplacement(sb, matcher.group(1).toUpperCase());
        }
        matcher.appendTail(sb);

        return sb.toString();
    }

    private String buildCopyIndexedTerm(String baseIndexedTerm, String currentFieldId, Set<String> usedIndexedTerms) {
        String likePattern;
        if (baseIndexedTerm.length() + 3 > Constants.MAX_NAME_LENGTH) {
            String queryBase = baseIndexedTerm.substring(0, Constants.MAX_NAME_LENGTH - 10);
            likePattern = com.scb.ratan.flowzero.designer.utils.StringUtils.escapeLike(queryBase) + "%";
        } else {
            likePattern = com.scb.ratan.flowzero.designer.utils.StringUtils.escapeLike(baseIndexedTerm) + "(%";
        }

        List<String> existingIndexedTerms = new ArrayList<>();
        if (usedIndexedTerms != null) {
            existingIndexedTerms.addAll(usedIndexedTerms);
        }
        List<String> indexedTermsInDb = fieldRepository.findIndexedTermsByPattern(baseIndexedTerm, likePattern, currentFieldId);
        if (indexedTermsInDb != null) {
            existingIndexedTerms.addAll(indexedTermsInDb);
        }

        if (!existingIndexedTerms.contains(baseIndexedTerm)) {
            return baseIndexedTerm;
        }

        return com.scb.ratan.flowzero.designer.utils.StringUtils.buildCopyName(
            baseIndexedTerm,
            existingIndexedTerms,
            Constants.MAX_NAME_LENGTH);
    }

}
