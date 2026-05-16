package com.fdc3.memory.repository;

import com.fdc3.memory.domain.MemoryEntry;
import com.fdc3.memory.domain.MemoryStatus;
import com.fdc3.memory.domain.MemoryType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemoryEntryRepository extends JpaRepository<MemoryEntry, String> {
    Optional<MemoryEntry> findByIdAndTenantIdAndUserId(String id, String tenantId, String userId);

    @Query("""
            select entry from MemoryEntry entry
            where entry.tenantId = :tenantId
              and entry.userId = :userId
              and (:desk is null or entry.desk = :desk)
              and (:type is null or entry.type = :type)
              and entry.status = :status
              and (:q is null
                or lower(entry.title) like lower(concat('%', :q, '%'))
                or lower(entry.body) like lower(concat('%', :q, '%')))
            order by entry.updatedAt desc
            """)
    List<MemoryEntry> search(
            @Param("tenantId") String tenantId,
            @Param("userId") String userId,
            @Param("desk") String desk,
            @Param("type") MemoryType type,
            @Param("q") String q,
            @Param("status") MemoryStatus status,
            Pageable pageable
    );
}
