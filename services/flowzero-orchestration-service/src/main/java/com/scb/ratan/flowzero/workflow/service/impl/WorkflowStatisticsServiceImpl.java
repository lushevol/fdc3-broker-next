package com.scb.ratan.flowzero.workflow.service.impl;

import com.scb.ratan.flowzero.workflow.common.enums.StatisticsScopeEnum;
import com.scb.ratan.flowzero.workflow.common.enums.TimeInterval;
import com.scb.ratan.flowzero.workflow.common.exception.BusinessException;
import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowRequest;
import com.scb.ratan.flowzero.workflow.entity.dto.PendingDistributionQueryDto;
import com.scb.ratan.flowzero.workflow.entity.dto.RequestCountQueryDto;
import com.scb.ratan.flowzero.workflow.entity.dto.RequestTrendQueryDto;
import com.scb.ratan.flowzero.workflow.entity.vo.*;
import com.scb.ratan.flowzero.workflow.feign.DesignerServiceClient;
import com.scb.ratan.flowzero.workflow.feign.DesignerServiceClient.NavigationQueryTypeEnum;
import com.scb.ratan.flowzero.workflow.repository.CamundaNativeTaskRepository;
import com.scb.ratan.flowzero.workflow.repository.WorkflowRequestRepository;
import com.scb.ratan.flowzero.workflow.service.IWorkflowStatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.history.HistoricProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of {@link IWorkflowStatisticsService}.
 * Covers 3.2.1 (request-count), 3.2.2 (pending-distribution), 3.2.3 (request-trend).
 *
 * <p>Each API supports three data scopes via {@link StatisticsScopeEnum}:
 * <ul>
 *   <li>{@code ALL}       – No user restriction; returns all requests.</li>
 *   <li>{@code INITIATOR} – Only requests initiated by the current user (createdBy).</li>
 *   <li>{@code APPROVER}  – Only requests for workflows where the current user has approver access.</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WorkflowStatisticsServiceImpl implements IWorkflowStatisticsService {

    private final HistoryService historyService;
    private final TaskService taskService;
    private final DesignerServiceClient designerServiceClient;
    private final CamundaNativeTaskRepository camundaNativeTaskRepository;
    private final WorkflowRequestRepository workflowRequestRepository;

    @Override
    public RequestCountVo getRequestCount(RequestCountQueryDto queryDto, String currentUserId) {
        LocalDate start = resolveStart(queryDto.getStartDate());
        LocalDate end = resolveEnd(queryDto.getEndDate());
        StatisticsScopeEnum scope = resolveScope(queryDto.getScope());

        // RequestCountQueryDto has no workflowName filter, so pass null to get ALL
        // workflows.
        Map<String, String> workflowIdToName = resolveWorkflowIdToNameMap(
            null, currentUserId, NavigationQueryTypeEnum.ALL_WORKFLOWS);
        if (workflowIdToName.isEmpty())
            return new RequestCountVo(0, 0, 0);

        Map<String, HistoricProcessInstance> hpiById = queryAndDeduplicateHpis(toDate(end.plusDays(1)), toDate(start));
        if (hpiById.isEmpty()) {
            return new RequestCountVo(0, 0, 0);
        }

        String filterUserId = (scope == StatisticsScopeEnum.INITIATOR) ? currentUserId : null;
        // Apply same workflowIdToName filter as getPendingDistribution for consistent
        // scope
        Set<String> allowedInstanceIds = workflowRequestRepository
            .findByStatusInAndInstanceIdIn(hpiById.keySet(), filterUserId)
            .stream()
            .filter(r -> r.getInstanceId() != null && workflowIdToName.containsKey(r.getWorkflowId()))
            .map(WorkflowRequest::getInstanceId)
            .collect(Collectors.toSet());
        if (allowedInstanceIds.isEmpty()) {
            return new RequestCountVo(0, 0, 0);
        }

        int open = 0, closed = 0;
        for (HistoricProcessInstance hpi : hpiById.values()) {
            if (!allowedInstanceIds.contains(hpi.getId())) {
                continue;
            }
            if (hpi.getStartTime() == null) {
                continue;
            }
            LocalDate instanceStart = toLocalDate(hpi.getStartTime());
            LocalDate instanceEnd = hpi.getEndTime() != null ? toLocalDate(hpi.getEndTime()) : null;

            if (isClosedInRange(instanceEnd, start, end)) {
                closed++;
            } else if (isActiveDuringRange(instanceStart, instanceEnd, start, end)) {
                open++;
            }
        }
        return new RequestCountVo(open + closed, open, closed);
    }

    @Override
    public List<WorkflowPendingNode> getPendingDistribution(PendingDistributionQueryDto queryDto, String currentUserId) {
        LocalDate start = resolveStart(queryDto.getStartDate());
        LocalDate end = resolveEnd(queryDto.getEndDate());
        StatisticsScopeEnum scope = resolveScope(queryDto.getScope());

        if (scope == StatisticsScopeEnum.TASK_EXECUTOR) {
            return getPendingDistributionForTaskExecutor(queryDto, currentUserId);
        }

        // 1. Resolve workflowId → workflowName via navigation.
        // APPROVER → ACCESSIBLE_TASKS (enforce task-level permission)
        // INITIATOR / ALL → ALL_WORKFLOWS (return all workflows, user filter applied at
        // DB level)
        NavigationQueryTypeEnum navType = NavigationQueryTypeEnum.ALL_WORKFLOWS;
        Map<String, String> workflowIdToName = resolveWorkflowIdToNameMap(
            queryDto.getWorkflowName(), currentUserId, navType);
        if (workflowIdToName.isEmpty())
            return Collections.emptyList();

        Map<String, HistoricProcessInstance> hpiById = queryAndDeduplicateHpis(toDate(end.plusDays(1)), toDate(start));
        if (hpiById.isEmpty()) {
            return Collections.emptyList();
        }

        String filterUserId = (scope == StatisticsScopeEnum.INITIATOR) ? currentUserId : null;
        List<WorkflowRequest> requests = workflowRequestRepository
            .findByStatusInAndInstanceIdIn(hpiById.keySet(), filterUserId)
            .stream()
            .filter(r -> r.getInstanceId() != null && workflowIdToName.containsKey(r.getWorkflowId()))
            .toList();

        if (requests.isEmpty()) {
            return Collections.emptyList();
        }

        Set<String> pendingInstanceIds = new LinkedHashSet<>();
        for (WorkflowRequest request : requests) {
            HistoricProcessInstance hpi = hpiById.get(request.getInstanceId());
            if (hpi == null || hpi.getStartTime() == null) {
                continue;
            }
            LocalDate instanceStart = toLocalDate(hpi.getStartTime());
            LocalDate instanceEnd = hpi.getEndTime() != null ? toLocalDate(hpi.getEndTime()) : null;

            if (!isClosedInRange(instanceEnd, start, end) && isActiveDuringRange(instanceStart, instanceEnd, start, end)) {
                pendingInstanceIds.add(request.getInstanceId());
            }
        }

        if (pendingInstanceIds.isEmpty()) {
            return Collections.emptyList();
        }

        // ── Branch A: workflowName is blank → request dimension ──────────────────
        // Only count INPROGRESS requests per workflow; no Camunda task query needed.
        if (!StringUtils.hasText(queryDto.getWorkflowName())) {
            Map<String, Long> countByWorkflowName = requests.stream()
                .filter(r -> pendingInstanceIds.contains(r.getInstanceId()))
                .filter(r -> r.getWorkflowId() != null)
                .collect(Collectors.groupingBy(
                    r -> workflowIdToName.getOrDefault(r.getWorkflowId(), r.getWorkflowId()),
                    Collectors.counting()));
            List<WorkflowPendingNode> result = new ArrayList<>();
            countByWorkflowName
                .forEach((wfName, count) -> result.add(new WorkflowPendingNode(wfName, count.intValue(), Collections.emptyList())));
            return result;
        }

        // ── Branch B: workflowName has value → task dimension ────────────────────
        // 3. Build instanceId → workflowName for active instances.
        Map<String, String> instanceIdToWorkflowName = requests.stream()
            .filter(r -> pendingInstanceIds.contains(r.getInstanceId()))
            .filter(r -> r.getInstanceId() != null && r.getWorkflowId() != null)
            .collect(Collectors.toMap(
                WorkflowRequest::getInstanceId,
                r -> workflowIdToName.get(r.getWorkflowId())));
        if (instanceIdToWorkflowName.isEmpty())
            return Collections.emptyList();

        // 4. Query active Camunda tasks for those instances.
        List<Task> tasks = taskService.createTaskQuery()
            .processInstanceIdIn(instanceIdToWorkflowName.keySet().toArray(new String[0]))
            .active()
            .list();
        if (tasks.isEmpty())
            return Collections.emptyList();

        // 5. Group tasks: workflowName → taskKey → [tasks]
        Map<String, Map<String, Integer>> workflowTaskCounts = new LinkedHashMap<>();
        Map<String, Map<String, String>> workflowTaskNames = new LinkedHashMap<>();
        for (Task task : tasks) {
            String wfName = instanceIdToWorkflowName.get(task.getProcessInstanceId());
            if (wfName == null)
                continue;
            if (task.getCreateTime() == null) {
                continue;
            }
            LocalDate taskStart = task.getCreateTime().toInstant()
                .atZone(ZoneId.systemDefault()).toLocalDate();
            boolean activeDuringRange = !taskStart.isAfter(end);
            if (!activeDuringRange) {
                continue;
            }
            String taskKey = task.getTaskDefinitionKey();
            String taskName = task.getName() != null ? task.getName() : taskKey;
            workflowTaskCounts
                .computeIfAbsent(wfName, k -> new LinkedHashMap<>())
                .merge(taskKey, 1, Integer::sum);
            workflowTaskNames
                .computeIfAbsent(wfName, k -> new LinkedHashMap<>())
                .putIfAbsent(taskKey, taskName);
        }

        Map<String, Set<String>> procDefToInstanceIds = requests.stream()
            .filter(r -> pendingInstanceIds.contains(r.getInstanceId()))
            .filter(r -> r.getUniqueVersionId() != null && r.getInstanceId() != null)
            .collect(Collectors.groupingBy(
                WorkflowRequest::getUniqueVersionId,
                Collectors.mapping(WorkflowRequest::getInstanceId, Collectors.toSet())));

        for (Map.Entry<String, Set<String>> procEntry : procDefToInstanceIds.entrySet()) {
            String procDefId = procEntry.getKey();
            Set<String> procInstanceIds = procEntry.getValue();
            camundaNativeTaskRepository.findFinishedTasksByProcDefAndInstanceIds(procDefId, procInstanceIds)
                .forEach(ht -> {
                    if (!procInstanceIds.contains(ht.getProcessInstanceId())) {
                        return;
                    }
                    String wfName = instanceIdToWorkflowName.get(ht.getProcessInstanceId());
                    if (wfName == null) {
                        return;
                    }
                    if (ht.getStartTime() == null || ht.getEndTime() == null) {
                        return;
                    }
                    LocalDate taskStart = toLocalDate(ht.getStartTime());
                    LocalDate taskEnd = toLocalDate(ht.getEndTime());

                    if (isClosedInRange(taskEnd, start, end) || !isActiveDuringRange(taskStart, taskEnd, start, end)) {
                        return;
                    }

                    String taskKey = ht.getTaskDefinitionKey();
                    String taskName = ht.getName() != null ? ht.getName() : taskKey;
                    workflowTaskCounts
                        .computeIfAbsent(wfName, k -> new LinkedHashMap<>())
                        .merge(taskKey, 1, Integer::sum);
                    workflowTaskNames
                        .computeIfAbsent(wfName, k -> new LinkedHashMap<>())
                        .putIfAbsent(taskKey, taskName);
                });
        }

        // 6. Build result list.
        // WorkflowPendingNode.pendingCount = total active task-instance count across
        // all nodes.
        // TaskPendingNode.pendingCount = active task-instance count at that node.
        List<WorkflowPendingNode> result = new ArrayList<>();
        for (Map.Entry<String, Map<String, Integer>> wfEntry : workflowTaskCounts.entrySet()) {
            List<TaskPendingNode> taskNodes = new ArrayList<>();
            Map<String, String> nameMap = workflowTaskNames.getOrDefault(wfEntry.getKey(), Collections.emptyMap());
            for (Map.Entry<String, Integer> taskEntry : wfEntry.getValue().entrySet()) {
                String taskKey = taskEntry.getKey();
                String taskName = nameMap.getOrDefault(taskKey, taskKey);
                taskNodes.add(new TaskPendingNode(taskKey, taskName, taskEntry.getValue()));
            }
            int pendingCount = taskNodes.stream().mapToInt(TaskPendingNode::getPendingCount).sum();
            result.add(new WorkflowPendingNode(wfEntry.getKey(), pendingCount, taskNodes));
        }
        return result;
    }

    private List<WorkflowPendingNode> getPendingDistributionForTaskExecutor(
        PendingDistributionQueryDto queryDto,
        String currentUserId) {

        if (!StringUtils.hasText(queryDto.getWorkflowName())) {
            throw new BusinessException("workflowName is required for TASK_EXECUTOR");
        }

        // ── Step 1: Nav → processDefId/workflowName/taskKey/workflowIds ──────────
        DesignerServiceClient.WorkflowNavigationQueryDto navQuery = new DesignerServiceClient.WorkflowNavigationQueryDto();
        navQuery.setWorkflowName(queryDto.getWorkflowName());
        navQuery.setUserId(currentUserId);
        navQuery.setQueryType(NavigationQueryTypeEnum.ACCESSIBLE_TASKS);

        List<DesignerServiceClient.WorkflowVersionNavigationVo> navVos = designerServiceClient.queryNavigationByCondition(navQuery);
        if (CollectionUtils.isEmpty(navVos)) {
            return Collections.emptyList();
        }

        Map<String, String> procDefIdToWorkflowName = new LinkedHashMap<>();
        Map<String, Map<String, String>> procDefIdToTaskName = new LinkedHashMap<>();
        Set<String> navWorkflowIds = new LinkedHashSet<>();

        for (DesignerServiceClient.WorkflowVersionNavigationVo nav : navVos) {
            String procDefId = nav.getProcessDefinitionId();
            String workflowName = nav.getWorkflowName();
            if (!StringUtils.hasText(procDefId) || !StringUtils.hasText(workflowName)) {
                continue;
            }
            procDefIdToWorkflowName.put(procDefId, workflowName);
            if (StringUtils.hasText(nav.getWorkflowId())) {
                navWorkflowIds.add(nav.getWorkflowId());
            }
            if (!CollectionUtils.isEmpty(nav.getTasks())) {
                Map<String, String> taskNameMap = procDefIdToTaskName
                    .computeIfAbsent(procDefId, k -> new LinkedHashMap<>());
                for (DesignerServiceClient.TaskNavigationVo task : nav.getTasks()) {
                    if (StringUtils.hasText(task.getTaskKey())) {
                        taskNameMap.put(task.getTaskKey(), task.getTaskName());
                    }
                }
            }
        }

        if (procDefIdToWorkflowName.isEmpty() || procDefIdToTaskName.isEmpty()) {
            return Collections.emptyList();
        }

        Set<String> allTaskKeys = procDefIdToTaskName.values().stream()
            .flatMap(map -> map.keySet().stream())
            .collect(Collectors.toCollection(LinkedHashSet::new));
        if (allTaskKeys.isEmpty()) {
            return Collections.emptyList();
        }

        // ── Step 2: WorkflowRequest WHERE status=INPROGRESS AND workflowId IN nav ─
        // Mirrors executeTaskQuery's queryMatchingRequests — ensures task counts only
        // cover INPROGRESS requests (same scope as the task list API).
        Set<String> workflowIds = navWorkflowIds.isEmpty() ? null : navWorkflowIds;
        List<WorkflowRequest> requests = workflowRequestRepository.findInProgressByWorkflowIds(workflowIds);
        if (requests.isEmpty()) {
            return Collections.emptyList();
        }

        Set<String> processInstanceIds = requests.stream()
            .map(WorkflowRequest::getInstanceId)
            .filter(Objects::nonNull)
            .collect(Collectors.toCollection(LinkedHashSet::new));
        if (processInstanceIds.isEmpty()) {
            return Collections.emptyList();
        }

        // ── Step 3: Camunda TaskQuery — same filter as executeTaskQuery ───────────
        // processInstanceIdIn → only INPROGRESS instances
        // taskDefinitionKeyIn → only nav-accessible task nodes
        // active() → only active (non-suspended) tasks
        List<Task> tasks = taskService.createTaskQuery()
            .processInstanceIdIn(processInstanceIds.toArray(new String[0]))
            .taskDefinitionKeyIn(allTaskKeys.toArray(new String[0]))
            .active()
            .list();
        if (tasks.isEmpty()) {
            return Collections.emptyList();
        }

        // ── Step 4: Group workflowName → taskKey → count ──────────────────────────
        // workflowTaskNodes : workflowName → taskKey → TaskPendingNode (task-instance
        // count)
        // workflowInstanceIds: workflowName → set of distinct processInstanceIds
        // (request count)
        Map<String, Map<String, TaskPendingNode>> workflowTaskNodes = new LinkedHashMap<>();
        Map<String, Set<String>> workflowInstanceIds = new LinkedHashMap<>();
        for (Task task : tasks) {
            String procDefId = task.getProcessDefinitionId();
            String taskKey = task.getTaskDefinitionKey();

            Map<String, String> taskNameMap = procDefIdToTaskName.get(procDefId);
            if (taskNameMap == null || !taskNameMap.containsKey(taskKey)) {
                continue;
            }
            String workflowName = procDefIdToWorkflowName.get(procDefId);
            if (!StringUtils.hasText(workflowName)) {
                continue;
            }
            String taskName = taskNameMap.getOrDefault(taskKey, taskKey);
            // task-instance count
            Map<String, TaskPendingNode> taskNodes = workflowTaskNodes
                .computeIfAbsent(workflowName, k -> new LinkedHashMap<>());
            TaskPendingNode node = taskNodes.get(taskKey);
            if (node == null) {
                taskNodes.put(taskKey, new TaskPendingNode(taskKey, taskName, 1));
            } else {
                node.setPendingCount(node.getPendingCount() + 1);
            }
            // request-instance count
            workflowInstanceIds
                .computeIfAbsent(workflowName, k -> new LinkedHashSet<>())
                .add(task.getProcessInstanceId());
        }

        List<WorkflowPendingNode> result = new ArrayList<>();
        for (Map.Entry<String, Map<String, TaskPendingNode>> entry : workflowTaskNodes.entrySet()) {
            List<TaskPendingNode> taskNodes = new ArrayList<>(entry.getValue().values());
            // WorkflowPendingNode.pendingCount = distinct request count
            int requestCount = workflowInstanceIds
                .getOrDefault(entry.getKey(), Collections.emptySet()).size();
            if (!taskNodes.isEmpty()) {
                result.add(new WorkflowPendingNode(entry.getKey(), requestCount, taskNodes));
            }
        }
        return result;
    }

    @Override
    public RequestTrendVo getRequestTrend(RequestTrendQueryDto queryDto, String currentUserId) {
        LocalDate start = resolveStart(queryDto.getStartDate());
        LocalDate end = resolveEnd(queryDto.getEndDate());
        TimeInterval interval = TimeInterval.fromValue(queryDto.getInterval());
        StatisticsScopeEnum scope = resolveScope(queryDto.getScope());

        // Build time-series skeleton
        List<LocalDate> labelDates = buildLabelDates(start, end, interval);
        List<String> labels = labelDates.stream()
            .map(d -> d.format(DateTimeFormatter.ISO_LOCAL_DATE))
            .collect(Collectors.toList());
        List<Integer> openValues = new ArrayList<>(Collections.nCopies(labelDates.size(), 0));
        List<Integer> closedValues = new ArrayList<>(Collections.nCopies(labelDates.size(), 0));

        if (!StringUtils.hasText(queryDto.getWorkflowName())) {
            // ── Branch A: request dimension ───────────────────────────────────────
            // Step 1: Resolve workflowId → workflowName via navigation (same scope as
            // getRequestCount, so closed/open totals are consistent between the two APIs).
            Map<String, String> trendWorkflowIdToName = resolveWorkflowIdToNameMap(
                null, currentUserId, NavigationQueryTypeEnum.ALL_WORKFLOWS);
            if (trendWorkflowIdToName.isEmpty()) {
                return zeroTrendVo(interval, labels, openValues, closedValues);
            }

            // Step 2: Query and deduplicate ACT_HI_PROCINST.
            Map<String, HistoricProcessInstance> trendHpiById = queryAndDeduplicateHpis(toDate(end.plusDays(1)), toDate(start));
            if (trendHpiById.isEmpty()) {
                return zeroTrendVo(interval, labels, openValues, closedValues);
            }

            // Step 3: Filter by WorkflowRequest + workflowIdToName (same scope as
            // getRequestCount).
            String trendUserId = (scope == StatisticsScopeEnum.INITIATOR) ? currentUserId : null;
            Set<String> allowedInstanceIds = workflowRequestRepository
                .findByStatusInAndInstanceIdIn(trendHpiById.keySet(), trendUserId)
                .stream()
                .filter(r -> r.getInstanceId() != null && trendWorkflowIdToName.containsKey(r.getWorkflowId()))
                .map(WorkflowRequest::getInstanceId)
                .collect(Collectors.toSet());

            if (allowedInstanceIds.isEmpty()) {
                return zeroTrendVo(interval, labels, openValues, closedValues);
            }

            // Step 4: Assign each allowed instance to open/closed per bucket.
            for (HistoricProcessInstance hpi : trendHpiById.values()) {
                if (!allowedInstanceIds.contains(hpi.getId()))
                    continue;
                if (hpi.getStartTime() == null)
                    continue;

                LocalDate instanceStart = toLocalDate(hpi.getStartTime());
                LocalDate instanceEnd = hpi.getEndTime() != null ? toLocalDate(hpi.getEndTime()) : null;

                for (int i = 0; i < labelDates.size(); i++) {
                    LocalDate bucketStart = labelDates.get(i);
                    LocalDate bucketEnd = bucketEnd(i, labelDates, end);

                    boolean closedInBucket = instanceEnd != null
                        && !instanceEnd.isBefore(bucketStart)
                        && instanceEnd.isBefore(bucketEnd);
                    boolean activeInBucket = !instanceStart.isAfter(bucketEnd.minusDays(1))
                        && (instanceEnd == null || !instanceEnd.isBefore(bucketStart));

                    if (closedInBucket) {
                        closedValues.set(i, closedValues.get(i) + 1);
                    } else if (activeInBucket) {
                        openValues.set(i, openValues.get(i) + 1);
                    }
                }
            }
        } else {
            // ── Branch B: task dimension ──────────────────────────────────────────
            Map<String, String> trendWorkflowIdToName = resolveWorkflowIdToNameMap(
                queryDto.getWorkflowName(), currentUserId, NavigationQueryTypeEnum.ALL_WORKFLOWS);
            if (trendWorkflowIdToName.isEmpty()) {
                return zeroTrendVo(interval, labels, openValues, closedValues);
            }

            String trendUserId = (scope == StatisticsScopeEnum.INITIATOR) ? currentUserId : null;
            List<WorkflowRequest> requests = workflowRequestRepository
                .findByStatusInAndCreatedBy(trendUserId)
                .stream()
                .filter(r -> r.getWorkflowId() != null && trendWorkflowIdToName.containsKey(r.getWorkflowId()))
                .toList();

            if (requests.isEmpty()) {
                return zeroTrendVo(interval, labels, openValues, closedValues);
            }

            Set<String> instanceIds = requests.stream()
                .map(WorkflowRequest::getInstanceId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

            if (instanceIds.isEmpty()) {
                return zeroTrendVo(interval, labels, openValues, closedValues);
            }

            Map<String, Set<String>> procDefToInstanceIds = requests.stream()
                .filter(r -> r.getUniqueVersionId() != null && r.getInstanceId() != null)
                .collect(Collectors.groupingBy(
                    WorkflowRequest::getUniqueVersionId,
                    Collectors.mapping(WorkflowRequest::getInstanceId, Collectors.toSet())));

            // Active tasks from ACT_RU_TASK
            taskService.createTaskQuery()
                .processInstanceIdIn(instanceIds.toArray(new String[0]))
                .active()
                .list()
                .forEach(t -> {
                    if (t.getCreateTime() == null)
                        return;
                    LocalDate taskStart = toLocalDate(t.getCreateTime());
                    for (int i = 0; i < labelDates.size(); i++) {
                        if (!taskStart.isAfter(bucketEnd(i, labelDates, end).minusDays(1))) {
                            openValues.set(i, openValues.get(i) + 1);
                        }
                    }
                });

            // Finished tasks from ACT_HI_TASKINST (Native SQL)
            for (Map.Entry<String, Set<String>> procEntry : procDefToInstanceIds.entrySet()) {
                String procDefId = procEntry.getKey();
                Set<String> procInstanceIds = procEntry.getValue();
                camundaNativeTaskRepository.findFinishedTasksByProcDefAndInstanceIds(procDefId, procInstanceIds)
                    .forEach(ht -> {
                        if (!procInstanceIds.contains(ht.getProcessInstanceId()))
                            return;
                        if (ht.getStartTime() == null || ht.getEndTime() == null)
                            return;
                        LocalDate taskStart = toLocalDate(ht.getStartTime());
                        LocalDate taskEnd = toLocalDate(ht.getEndTime());
                        for (int i = 0; i < labelDates.size(); i++) {
                            LocalDate bucketStart = labelDates.get(i);
                            LocalDate bucketEnd = bucketEnd(i, labelDates, end);
                            boolean closedInBucket = !taskEnd.isBefore(bucketStart)
                                && taskEnd.isBefore(bucketEnd);
                            boolean activeInBucket = !taskStart.isAfter(bucketEnd.minusDays(1))
                                && !taskEnd.isBefore(bucketStart);

                            if (closedInBucket) {
                                closedValues.set(i, closedValues.get(i) + 1);
                            } else if (activeInBucket) {
                                openValues.set(i, openValues.get(i) + 1);
                            }
                        }
                    });
            }
        }

        return zeroTrendVo(interval, labels, openValues, closedValues);
    }

    // ----------------------------------------------------------------
    // Private helpers
    // ----------------------------------------------------------------

    /** Returns {@code scope} as-is, defaulting to {@link StatisticsScopeEnum#ALL} if null. */
    private StatisticsScopeEnum resolveScope(StatisticsScopeEnum scope) {
        return scope != null ? scope : StatisticsScopeEnum.ALL;
    }

    private LocalDate resolveStart(LocalDate start) {
        return start != null ? start : LocalDate.now().minusDays(30);
    }

    private LocalDate resolveEnd(LocalDate end) {
        return end != null ? end : LocalDate.now();
    }

    /**
     * Calls the Designer navigation endpoint and returns a {@code workflowId → workflowName} map.
     * Returns an empty map when the navigation response is empty.
     */
    private Map<String, String> resolveWorkflowIdToNameMap(String workflowName, String userId,
        NavigationQueryTypeEnum queryType) {
        DesignerServiceClient.WorkflowNavigationQueryDto navQuery = new DesignerServiceClient.WorkflowNavigationQueryDto();
        navQuery.setWorkflowName(workflowName);
        navQuery.setUserId(userId);
        navQuery.setQueryType(queryType);

        List<DesignerServiceClient.WorkflowVersionNavigationVo> navVos = designerServiceClient.queryNavigationByCondition(navQuery);
        if (navVos == null || navVos.isEmpty())
            return Collections.emptyMap();

        Map<String, String> result = new LinkedHashMap<>();
        navVos.forEach(nav -> {
            String wfId = nav.getWorkflowId();
            String wfName = nav.getWorkflowName();
            if (StringUtils.hasText(wfId) && StringUtils.hasText(wfName)) {
                result.put(wfId, wfName);
            }
        });
        return result;
    }

    /**
     * Queries ACT_HI_PROCINST for unfinished instances started before
     * {@code rangeEndExclusive} and finished instances whose end is after
     * {@code rangeStart}. Deduplicates by id, preferring the record with an
     * endTime over the one without.
     */
    private Map<String, HistoricProcessInstance> queryAndDeduplicateHpis(Date rangeEndExclusive, Date rangeStart) {
        List<HistoricProcessInstance> hpis = new ArrayList<>();
        hpis.addAll(historyService.createHistoricProcessInstanceQuery()
            .startedBefore(rangeEndExclusive)
            .unfinished()
            .list());
        hpis.addAll(historyService.createHistoricProcessInstanceQuery()
            .startedBefore(rangeEndExclusive)
            .finishedAfter(rangeStart)
            .list());

        Map<String, HistoricProcessInstance> hpiById = new LinkedHashMap<>();
        for (HistoricProcessInstance hpi : hpis) {
            if (hpi.getId() == null)
                continue;
            HistoricProcessInstance existing = hpiById.get(hpi.getId());
            if (existing == null || (existing.getEndTime() == null && hpi.getEndTime() != null)) {
                hpiById.put(hpi.getId(), hpi);
            }
        }
        return hpiById;
    }

    /**
     * Returns {@code true} when {@code instanceEnd} falls within [{@code start}, {@code end}].
     * Used consistently across getRequestCount, getPendingDistribution, and getRequestTrend.
     */
    private boolean isClosedInRange(LocalDate instanceEnd, LocalDate start, LocalDate end) {
        return instanceEnd != null
            && !instanceEnd.isBefore(start)
            && !instanceEnd.isAfter(end);
    }

    /**
     * Returns {@code true} when the instance was active at any point within [{@code start}, {@code end}].
     * Accepts {@code null} as {@code instanceEnd} to indicate an open (unfinished) instance.
     */
    private boolean isActiveDuringRange(LocalDate instanceStart, LocalDate instanceEnd,
        LocalDate start, LocalDate end) {
        return !instanceStart.isAfter(end)
            && (instanceEnd == null || !instanceEnd.isBefore(start));
    }

    /** Converts a {@link LocalDate} to a midnight {@link Date} in the system default time-zone. */
    private Date toDate(LocalDate date) {
        return Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    /** Converts a {@link Date} to a {@link LocalDate} in the system default time-zone. */
    private LocalDate toLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    /**
     * Returns the exclusive end boundary for bucket {@code i} in the label series.
     * For the last bucket the boundary is capped at {@code queryEnd.plusDays(1)} so
     * that the closed count stays within the query range.
     */
    private LocalDate bucketEnd(int i, List<LocalDate> labelDates, LocalDate queryEnd) {
        return (i + 1 < labelDates.size()) ? labelDates.get(i + 1) : queryEnd.plusDays(1);
    }

    /** Builds a {@link RequestTrendVo} with the given (potentially zero) series values. */
    private RequestTrendVo zeroTrendVo(TimeInterval interval, List<String> labels,
        List<Integer> openValues, List<Integer> closedValues) {
        return new RequestTrendVo(interval.getValue(), labels, List.of(
            new TrendSeries("open", openValues),
            new TrendSeries("closed", closedValues)));
    }

    private List<LocalDate> buildLabelDates(LocalDate start, LocalDate end, TimeInterval interval) {
        List<LocalDate> dates = new ArrayList<>();
        LocalDate seed = switch (interval) {
            case Week -> {
                LocalDate monday = start.with(DayOfWeek.MONDAY);
                yield monday.isAfter(start) ? monday.minusWeeks(1) : monday;
            }
            case Month -> start.withDayOfMonth(1);
            default -> start; // Day
        };
        LocalDate current = seed;
        while (!current.isAfter(end)) {
            dates.add(current);
            current = switch (interval) {
                case Week -> current.plusWeeks(1);
                case Month -> current.plusMonths(1);
                default -> current.plusDays(1); // Day
            };
        }
        return dates;
    }

}
