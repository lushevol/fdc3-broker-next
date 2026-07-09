package com.scb.sso.singleuibff.repository;

import com.scb.sso.singleuibff.entity.Fdc3Context;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Fdc3ContextRepo extends JpaRepository<Fdc3Context, String> {

    List<Fdc3Context> findByEms2RoleAndIsActiveOrderByUpdatedAtDesc(String ems2Role, boolean isActive);

    Optional<Fdc3Context> findByContextTypeAndEms2RoleAndIsActive(String contextType, String ems2Role, boolean isActive);

    boolean existsByContextTypeAndEms2RoleAndIsActive(String contextType, String ems2Role, boolean isActive);
}
