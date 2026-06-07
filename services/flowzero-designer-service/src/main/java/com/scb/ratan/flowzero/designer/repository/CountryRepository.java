package com.scb.ratan.flowzero.designer.repository;

import com.scb.ratan.flowzero.designer.entity.dbo.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@Repository
public interface CountryRepository extends JpaRepository<Country, String>, JpaSpecificationExecutor<Country> {

    Optional<Country> findByAlpha2Code(String alpha2Code);

    Optional<Country> findByAlpha3Code(String alpha3Code);

    List<Country> findByStatus(String status);

}
