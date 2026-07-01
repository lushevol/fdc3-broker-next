package com.scb.ratan.flowzero.designer.repository;

import com.scb.ratan.flowzero.designer.entity.dbo.CandidateGroup;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author Kinson Wang
 * @date 3/30/2026
 */
@Repository
public interface CandidateGroupRepository extends BaseRepository<CandidateGroup, String> {

    @Override
    @Query("SELECT cg FROM CandidateGroup cg WHERE cg.id = :id AND cg.status = com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum.ACTIVE")
    Optional<CandidateGroup> findById(@NotNull @Param("id") String id);

}