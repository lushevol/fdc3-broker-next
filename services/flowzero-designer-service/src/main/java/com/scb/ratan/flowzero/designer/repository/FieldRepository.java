package com.scb.ratan.flowzero.designer.repository;

import com.scb.ratan.flowzero.designer.entity.dbo.Field;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

/**
 * @auther Xu, Eva
 * @date 19/12/2025
 **/
@Repository
public interface FieldRepository extends JpaRepository<Field, String>, JpaSpecificationExecutor<Field> {

    @Query(value = """
            SELECT f FROM Field f
            WHERE f.status!='DELETED' AND
            function('lower',function('regexp_replace', f.label, '\\s+', '', 'g')) in (:normalizedLabels)
            """ )
    List<Field> findByNormalizedLabels(@Param("normalizedLabels") Set<String> normalizedLabels);

    @Query(value = """
        SELECT f.label FROM field f
        WHERE f.status='ACTIVE' AND
        lower(regexp_replace(f.label, '\\s+', '', 'g')) LIKE CONCAT('%', :keyword, '%')
        """, nativeQuery = true)
    Page<String> findActiveLabelsByLabelContaining(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
            SELECT f.indexedTerm FROM Field f
            WHERE (:currentFieldId IS NULL OR f.id <> :currentFieldId)
              AND (f.indexedTerm = :baseIndexedTerm OR f.indexedTerm LIKE :likePattern ESCAPE '\\')
            """)
    List<String> findIndexedTermsByPattern(@Param("baseIndexedTerm") String baseIndexedTerm,
                                           @Param("likePattern") String likePattern,
                                           @Param("currentFieldId") String currentFieldId);

    List<Field> findByIdIn(Collection<String> ids);

}
