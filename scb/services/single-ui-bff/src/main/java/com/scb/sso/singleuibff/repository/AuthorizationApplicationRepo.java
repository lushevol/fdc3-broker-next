package com.scb.sso.singleuibff.repository;

import com.scb.sso.singleuibff.entity.AuthorizationApplication;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorizationApplicationRepo extends JpaRepository<AuthorizationApplication, Long> {
    List<AuthorizationApplication> findByBffEntityNameIn(Collection<String> entityNames);
}
