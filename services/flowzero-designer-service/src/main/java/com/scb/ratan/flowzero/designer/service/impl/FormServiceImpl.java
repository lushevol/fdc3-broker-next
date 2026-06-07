package com.scb.ratan.flowzero.designer.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scb.ratan.flowzero.designer.common.Constants;
import com.scb.ratan.flowzero.designer.common.enums.FieldStatusEnum;
import com.scb.ratan.flowzero.designer.common.enums.FormStatusEnum;
import com.scb.ratan.flowzero.designer.common.exception.BusinessException;
import com.scb.ratan.flowzero.designer.entity.dbo.Field;
import com.scb.ratan.flowzero.designer.entity.dbo.Form;
import com.scb.ratan.flowzero.designer.entity.dbo.FormFieldRel;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.CreateFormDto;
import com.scb.ratan.flowzero.designer.entity.dto.FormNameCheckDto;
import com.scb.ratan.flowzero.designer.entity.dto.FormPageQueryDto;
import com.scb.ratan.flowzero.designer.entity.dto.UpdateFormDto;
import com.scb.ratan.flowzero.designer.entity.vo.FormDetailVo;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.designer.repository.FormFieldRelRepository;
import com.scb.ratan.flowzero.designer.repository.FormRepository;
import com.scb.ratan.flowzero.designer.service.IFieldService;
import com.scb.ratan.flowzero.designer.service.IFileService;
import com.scb.ratan.flowzero.designer.service.IFormService;
import com.scb.ratan.flowzero.designer.utils.SpecificationUtils;
import com.scb.ratan.flowzero.designer.utils.StringUtils;

import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Tian, Terry
 * @date 20/3/2025
 */
@Service
@Slf4j
public class FormServiceImpl implements IFormService {

    @Autowired
    public FormRepository formRepository;

    @Autowired
    public FormFieldRelRepository formFieldRelRepository;

    @Autowired
    public IFieldService fieldService;

    @Autowired
    public IFileService fileService;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void delete(String formId) {
        log.info("deleting form id {} ", formId);
        Form form = findById(formId);
        if (!FormStatusEnum.DRAFT.getName().equals(form.getStatus())) {
            throw new BusinessException("only draft form can be deleted");
        }
        formRepository.deleteById(formId);
        formFieldRelRepository.deleteByFormId(formId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Form create(CreateFormDto createFormDto) {
        Form form = new Form();
        checkFormName(createFormDto.getName(), "");

        form.setName(createFormDto.getName());
        form.setDescription(createFormDto.getDescription());
        form.setStatus(FormStatusEnum.DRAFT.getName());
        formRepository.save(form);

        return form;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Form update(UpdateFormDto updateFormDto) {
        Form form = findById(updateFormDto.getId());
        if (FormStatusEnum.PUBLISHED.getName().equals(form.getStatus())) {
            throw new BusinessException("published form can not be modified!");
        }
        if (updateFormDto.getName() != null && !updateFormDto.getName().equals(form.getName())) {
            checkFormName(updateFormDto.getName(), updateFormDto.getId());
        }

        form.setName(updateFormDto.getName());
        form.setDescription(updateFormDto.getDescription());
        form.setStatus(FormStatusEnum.DRAFT.getName());
        if (updateFormDto.getFormModel() != null) {
            form.setFormModelUrl(fileService.uploadFile(form.getId() + ".json",
                updateFormDto.getFormModel(), Constants.STORAGE_TYPE));
        }

        formRepository.save(form);

        if (updateFormDto.getFieldIds() != null) {
            updateFormFieldRels(form.getId(), updateFormDto.getFieldIds());
        }
        return form;
    }

    private void saveFormFieldRels(String formId, Set<String> fieldIds) {
        List<FormFieldRel> rels = fieldIds.stream().map(fieldId -> new FormFieldRel(
            formId, fieldId)).collect(Collectors.toList());
        formFieldRelRepository.saveAll(rels);
    }

    private void updateFormFieldRels(String formId, Set<String> fieldIds) {
        if (fieldIds.isEmpty()) {
            formFieldRelRepository.deleteByFormId(formId);
        } else {
            checkFields(fieldIds);
            formFieldRelRepository.deleteByFormId(formId);
            saveFormFieldRels(formId, fieldIds);
        }
    }

    private void checkFields(Set<String> fieldIds) {
        List<Field> fields = fieldService.findByIds(fieldIds);
        if (fields.size() != fieldIds.size()) {
            throw new BusinessException("deleted field can not be binded to form!");
        }
        for (Field field : fields) {
            if (FieldStatusEnum.ACTIVE != field.getStatus()) {
                throw new BusinessException("only active field can be binded to form!");
            }
        }
    }

    @Override
    public void checkFormName(String name, String id) {
        List<String> list = formRepository.duplicateNameCheck(name, id);
        if (!list.isEmpty()) {
            throw new BusinessException("duplicate form name!");
        }
    }

    @Override
    public boolean checkFormName(FormNameCheckDto formNameCheckDto) {
        try {
            if (formNameCheckDto.getId() == null) {
                formNameCheckDto.setId("");
            }
            checkFormName(formNameCheckDto.getName(), formNameCheckDto.getId());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Form findById(String id) {
        Optional<Form> workflowOpt = formRepository.findById(id);
        if (workflowOpt.isEmpty()) {
            throw new BusinessException("can not find form by Id: " + id);
        }
        return workflowOpt.get();
    }

    @Override
    public List<Form> findByIds(Collection<String> ids) {
        return formRepository.findByIdIn(ids);
    }

    @Override
    public PageResponseVo<Form> page(FormPageQueryDto queryDto, BasePageDto basePageDto) {
        basePageDto.setSortBy("updatedAt");
        Specification<Form> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            SpecificationUtils.addLikePredicate(predicates, root, cb, "name", queryDto.getName());
            SpecificationUtils.addInPredicate(predicates, root, "status", queryDto.getStatus());
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Page<Form> forms = formRepository.findAll(spec, basePageDto.toPageable());

        return PageResponseVo.of(forms);
    }

    @Override
    public List<Form> publishedForms(FormPageQueryDto queryDto) {
        Specification<Form> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            SpecificationUtils.addLikePredicate(predicates, root, cb, "name", queryDto.getName());
            SpecificationUtils.addEqualPredicate(predicates, root, cb, "status", FormStatusEnum.PUBLISHED.getName());
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return formRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "updatedAt"));
    }

    @Override
    public FormDetailVo detail(String formId) {
        Form form = findById(formId);
        FormDetailVo formDetailVo = new FormDetailVo(form);
        Set<String> fieldIds = formFieldRelRepository.findFieldIdByFormId(formId);
        if (!fieldIds.isEmpty()) {
            List<Field> fields = fieldService.findByIds(fieldIds);
            formDetailVo.setFields(fields);
        }
        if (form.getFormModelUrl() != null) {
            formDetailVo.setUrl(fileService.generateDownloadUrl(form.getFormModelUrl(), Constants.STORAGE_TYPE));
        }

        return formDetailVo;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void publish(String formId) {
        Form form = findById(formId);
        if (!FormStatusEnum.DRAFT.getName().equals(form.getStatus())) {
            throw new BusinessException("only draft form can be published!");
        }
        if (form.getFormModelUrl() == null) {
            throw new BusinessException("empty form can not be published!");
        }
        form.setStatus(FormStatusEnum.PUBLISHED.getName());
        formRepository.save(form);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public Form copy(String formId) {
        Form form = findById(formId);

        Form newForm = new Form();
        newForm.setName(buildCopyName(form.getName()));
        newForm.setStatus(FormStatusEnum.DRAFT.getName());
        newForm.setFormModelUrl(form.getFormModelUrl());
        newForm.setDescription(form.getDescription());
        formRepository.save(newForm);

        Set<String> fieldIds = formFieldRelRepository.findFieldIdByFormId(formId);
        if (!fieldIds.isEmpty()) {
            saveFormFieldRels(newForm.getId(), fieldIds);
        }
        return newForm;
    }

    private String buildCopyName(String baseName) {
        String likePattern;
        if (baseName.length() + 3 > Constants.MAX_NAME_LENGTH) {
            // Truncation will happen: broaden query prefix so truncated copies are found.
            // Reserve 10 chars for the suffix "(n)" to cover numbers up to 9,999,999.
            String queryBase = baseName.substring(0, Constants.MAX_NAME_LENGTH - 10);
            likePattern = StringUtils.escapeLike(queryBase) + "%";
        } else {
            likePattern = StringUtils.escapeLike(baseName) + "(%";
        }
        List<String> existingNames = formRepository.findNamesByPattern(likePattern);
        return StringUtils.buildCopyName(baseName, existingNames, Constants.MAX_NAME_LENGTH);
    }

}
