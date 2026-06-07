package com.scb.ratan.flowzero.designer.repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.scb.ratan.flowzero.designer.entity.dbo.FormFieldRel;

/**
 * @auther Xu, Eva
 * @date 02/02/2026
 **/
@Repository
public interface FormFieldRelRepository extends JpaRepository<FormFieldRel, String>, JpaSpecificationExecutor<FormFieldRel> {

    List<FormFieldRel> findByFieldId(String fieldId);

    List<FormFieldRel> findAllByFieldIdIn(Set<String> fieldIds);

    @Query("SELECT ffr.fieldId FROM FormFieldRel ffr WHERE ffr.formId = ?1")
    Set<String> findFieldIdByFormId(String formId);

    @Modifying
    @Query("DELETE FROM FormFieldRel w WHERE w.formId = :formId")
    void deleteByFormId(String formId);

    List<FormFieldRel> findByFormId(String formId);

    List<FormFieldRel> findByFormIdIn(Collection<String> formIds);

}
