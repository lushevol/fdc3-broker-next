package com.scb.ratan.flowzero.auth.repository;

import com.scb.ratan.flowzero.auth.entity.dbo.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {

    @Cacheable(cacheNames = "userCache", key = "#bankId")
    @Query("select u from User u where u.bankId = :bankId and u.status = DataStatusEnum.ACTIVE")
    Optional<User> findByBankId(@Param("bankId") String bankId);

    @Query("select u from User u where u.bankId in :bankIds and u.status = DataStatusEnum.ACTIVE")
    List<User> findByBankIdIn(@Param("bankIds") Collection<String> bankIds);

    @Query("select u from User u where u.status = DataStatusEnum.ACTIVE")
    List<User> findAllActive();

    @Modifying
    void deleteByBankIdIn(List<String> bankIds);

}
