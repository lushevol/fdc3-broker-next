package com.scb.ratan.flowzero.designer.repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scb.ratan.flowzero.designer.entity.dbo.Form;
import com.scb.ratan.flowzero.designer.entity.vo.IdNameVo;


/**
 * @auther Xu, Eva
 * @date 25/12/2025
 **/
@Repository
public interface FormRepository extends JpaRepository<Form, String>, JpaSpecificationExecutor<Form> {

    List<Form> findByIdIn(Collection<String> ids);

    Set<String> findNameByIdIn(Collection<String> collect);

    @Query("SELECT NEW com.scb.ratan.flowzero.designer.entity.vo.IdNameVo(f.id, f.name) FROM Form f WHERE f.id IN :ids")
    List<IdNameVo> queryIdAndNameByIds(@Param("ids") Collection<String> ids);
    
    @Query("""
            SELECT w.id FROM Form w
            WHERE function('lower', function('regexp_replace', w.name, '\\s+', '', 'g'))
                = function('lower', function('regexp_replace', :name, '\\s+', '', 'g'))
            AND w.id != :id
            """)
    List<String> duplicateNameCheck(@Param("name") String name, @Param("id") String id);

    /**
     * Find all form names that start with the given LIKE pattern.
     * Used in copy() to determine the next available copy-number suffix.
     * Caller should pass: escapedBaseName + "(%" as the pattern.
     */
    @Query("SELECT f.name FROM Form f WHERE f.name LIKE :pattern ESCAPE '\\'")
    List<String> findNamesByPattern(@Param("pattern") String pattern);

}
