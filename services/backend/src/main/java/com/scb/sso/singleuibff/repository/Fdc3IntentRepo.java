package com.scb.sso.singleuibff.repository;

import com.scb.sso.singleuibff.entity.Fdc3Intent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Fdc3IntentRepo extends JpaRepository<Fdc3Intent, String> {

    List<Fdc3Intent> findByEms2RoleAndIsActiveOrderByUpdatedAtDesc(String ems2Role, boolean isActive);

    Optional<Fdc3Intent> findByNameAndEms2RoleAndIsActive(String name, String ems2Role, boolean isActive);

    boolean existsByNameAndEms2RoleAndIsActive(String name, String ems2Role, boolean isActive);
}
