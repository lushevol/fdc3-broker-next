package com.scb.ratan.flowzero.auth.repository;

import com.scb.ratan.flowzero.auth.entity.dbo.Role;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

    long deleteByBankId(String bankId);

    @Cacheable(cacheNames = "roleNameCache", key = "#bankId")
    @Query("select r.roleName from Role r where r.bankId = :bankId and r.status = DataStatusEnum.ACTIVE")
    List<String> findRoleNameByBankId(String bankId);

}
