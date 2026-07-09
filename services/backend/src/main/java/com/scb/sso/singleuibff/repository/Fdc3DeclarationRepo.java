package com.scb.sso.singleuibff.repository;

import com.scb.sso.singleuibff.entity.Fdc3Declaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Fdc3DeclarationRepo extends JpaRepository<Fdc3Declaration, String> {

    List<Fdc3Declaration> findByEms2RoleAndIsActiveOrderByUpdatedAtDesc(String ems2Role, boolean isActive);

    Optional<Fdc3Declaration> findByAppIdAndEms2RoleAndIsActive(String appId, String ems2Role, boolean isActive);

    boolean existsByAppIdAndEms2RoleAndIsActive(String appId, String ems2Role, boolean isActive);
}
