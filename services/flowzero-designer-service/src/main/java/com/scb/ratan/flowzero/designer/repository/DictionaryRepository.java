package com.scb.ratan.flowzero.designer.repository;

import com.scb.ratan.flowzero.designer.entity.dbo.Dictionary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@Repository
public interface DictionaryRepository extends JpaRepository<Dictionary, String>, JpaSpecificationExecutor<Dictionary> {

    Optional<Dictionary> findByName(String name);

    List<Dictionary> findByNameIn(Collection<String> names);

}
