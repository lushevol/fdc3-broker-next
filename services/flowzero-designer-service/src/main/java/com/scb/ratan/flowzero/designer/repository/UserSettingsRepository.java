package com.scb.ratan.flowzero.designer.repository;

import com.scb.ratan.flowzero.designer.entity.dbo.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, String> {

    Optional<UserSettings> findByUserIdAndTypeAndName(String userId, String type, String name);

    @Transactional
    void deleteByUserIdAndTypeAndName(String userId, String type, String name);

    boolean existsByUserIdAndTypeAndName(String userId, String type, String name);

}

