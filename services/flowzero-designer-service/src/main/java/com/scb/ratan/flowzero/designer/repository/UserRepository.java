package com.scb.ratan.flowzero.designer.repository;

import com.scb.ratan.flowzero.designer.entity.dbo.User;
import org.jetbrains.annotations.NotNull;
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
public interface UserRepository extends BaseRepository<User, String> {

    @NotNull
    @Override
    @Query("select u from User u where u.id = :id and u.status = com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum.ACTIVE")
    Optional<User> findById(@NotNull @Param("id") String id);

    @Query("select u from User u where u.bankId = :bankId and u.status = com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum.ACTIVE")
    Optional<User> findByBankId(@Param("bankId") String bankId);

    @Query("select u from User u where u.countryCode = :countryCode and u.status = com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum.ACTIVE")
    List<User> findByCountryCode(@Param("countryCode") String countryCode);

    @Query("select u from User u where u.email = :email and u.status = com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum.ACTIVE")
    Optional<User> findByEmail(@Param("email") String email);

    @Query("select u from User u where lower(u.userName) like lower(concat('%', :userName, '%')) and u.status = com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum.ACTIVE")
    List<User> findByUserNameContainingIgnoreCase(@Param("userName") String userName);

    @Query("select u from User u where u.roleName = :roleName and u.status = com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum.ACTIVE")
    List<User> findByRoleName(@Param("roleName") String roleName);

    @Query("select u from User u where u.bankId in :bankIds and u.status = com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum.ACTIVE")
    List<User> findByBankIdIn(@Param("bankIds") Collection<String> bankIds);

}
