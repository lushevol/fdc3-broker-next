package com.scb.ratan.flowzero.workflow.repository;

import com.scb.ratan.flowzero.workflow.entity.dto.CandidateIdentityLinkDto;
import com.scb.ratan.flowzero.workflow.entity.dto.HistoricTaskInstanceDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class CamundaNativeTaskRepository {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Find finished tasks by process definition id and instance ids
     */
    @SuppressWarnings("unchecked")
    public List<HistoricTaskInstanceDto> findFinishedTasksByProcDefAndInstanceIds(String procDefId, Set<String> instanceIds) {
        if (instanceIds == null || instanceIds.isEmpty())
            return Collections.emptyList();
        String sql = "SELECT ID_, NAME_, ASSIGNEE_, PROC_DEF_ID_, PROC_INST_ID_, TASK_DEF_KEY_, START_TIME_, END_TIME_ FROM ACT_HI_TASKINST WHERE PROC_DEF_ID_ = :procDefId AND PROC_INST_ID_ IN (:instanceIds) AND END_TIME_ IS NOT NULL";
        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery(sql)
            .setParameter("procDefId", procDefId)
            .setParameter("instanceIds", instanceIds)
            .getResultList();
        List<HistoricTaskInstanceDto> result = new java.util.ArrayList<>();
        for (Object[] row : rows) {
            HistoricTaskInstanceDto dto = new HistoricTaskInstanceDto();
            dto.setId(row[0] != null ? row[0].toString() : null);
            dto.setName(row[1] != null ? row[1].toString() : null);
            dto.setAssignee(row[2] != null ? row[2].toString() : null);
            dto.setProcessDefinitionId(row[3] != null ? row[3].toString() : null);
            dto.setProcessInstanceId(row[4] != null ? row[4].toString() : null);
            dto.setTaskDefinitionKey(row[5] != null ? row[5].toString() : null);
            dto.setStartTime(row[6] instanceof java.sql.Timestamp ? new java.util.Date(((java.sql.Timestamp) row[6]).getTime()) : null);
            dto.setEndTime(row[7] instanceof java.sql.Timestamp ? new java.util.Date(((java.sql.Timestamp) row[7]).getTime()) : null);
            result.add(dto);
        }
        return result;
    }

    /**
     * Find candidate task ids for a user (and optional role/group)
     */
    public Set<String> findCandidateTaskIds(List<String> taskIds, String userId, String userRoleName) {
        if (taskIds == null || taskIds.isEmpty()) {
            return Collections.emptySet();
        }
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT DISTINCT T.ID_ FROM ACT_RU_TASK T ")
            .append("JOIN ACT_RU_IDENTITYLINK L ON T.ID_ = L.TASK_ID_ ")
            .append("WHERE L.TYPE_ = 'candidate' AND ");

        if (StringUtils.isBlank(userRoleName)) {
            sql.append("L.USER_ID_ = :userId ");
        } else {
            sql.append("(L.USER_ID_ = :userId OR L.GROUP_ID_ = :groupId) ");
        }

        sql.append("AND T.ID_ IN (:taskIds)");

        var query = entityManager.createNativeQuery(sql.toString())
            .setParameter("userId", userId)
            .setParameter("taskIds", taskIds);

        if (StringUtils.isNotBlank(userRoleName)) {
            query.setParameter("groupId", userRoleName);
        }

        @SuppressWarnings("unchecked")
        List<Object> rows = query.getResultList();
        return rows.stream()
            .filter(Objects::nonNull)
            .map(Object::toString)
            .collect(Collectors.toSet());
    }

    /**
     * Find candidate task ids for a group
     */
    public Set<String> findCandidateGroupTaskIds(List<String> taskIds, String userRoleName) {
        if (taskIds == null || taskIds.isEmpty()) {
            return Collections.emptySet();
        }
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT DISTINCT T.ID_ FROM ACT_RU_TASK T ")
            .append("JOIN ACT_RU_IDENTITYLINK L ON T.ID_ = L.TASK_ID_ ")
            .append("WHERE L.TYPE_ = 'candidate' AND L.GROUP_ID_ = :groupId ")
            .append("AND T.ID_ IN (:taskIds)");

        List<Object> rows = entityManager.createNativeQuery(sql.toString())
            .setParameter("groupId", userRoleName)
            .setParameter("taskIds", taskIds)
            .getResultList();

        return rows.stream()
            .filter(Objects::nonNull)
            .map(Object::toString)
            .collect(Collectors.toSet());
    }

    /**
     * Find candidate identity-link rows for task IDs.
     */
    @SuppressWarnings("unchecked")
    public List<CandidateIdentityLinkDto> findCandidateIdentityLinksByTaskIds(List<String> taskIds) {
        if (taskIds == null || taskIds.isEmpty()) {
            return Collections.emptyList();
        }
        String sql = "SELECT TASK_ID_, USER_ID_, GROUP_ID_ "
            + "FROM ACT_RU_IDENTITYLINK "
            + "WHERE TYPE_ = 'candidate' AND TASK_ID_ IN (:taskIds)";
        List<Object[]> rows = entityManager.createNativeQuery(sql)
            .setParameter("taskIds", taskIds)
            .getResultList();

        if (rows == null || rows.isEmpty()) {
            return Collections.emptyList();
        }

        return rows.stream()
            .map(row -> new CandidateIdentityLinkDto(
                row[0] != null ? row[0].toString() : null,
                row[1] != null ? row[1].toString() : null,
                row[2] != null ? row[2].toString() : null))
            .toList();
    }

}
