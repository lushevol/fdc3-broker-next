package com.scb.ratan.flowzero.workflow.service.impl;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.scb.ratan.flowzero.workflow.common.Constants;
import com.scb.ratan.flowzero.workflow.common.enums.BatchStatus;
import com.scb.ratan.flowzero.workflow.common.enums.ItemStatus;
import com.scb.ratan.flowzero.workflow.common.enums.VariableNamespaceEnum;
import com.scb.ratan.flowzero.workflow.common.enums.WorkflowRequestStatusEnum;
import com.scb.ratan.flowzero.workflow.common.exception.BusinessException;
import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowRequest;
import com.scb.ratan.flowzero.workflow.entity.dto.*;
import com.scb.ratan.flowzero.workflow.entity.vo.*;
import com.scb.ratan.flowzero.workflow.feign.DesignerServiceClient;
import com.scb.ratan.flowzero.workflow.repository.CamundaNativeTaskRepository;
import com.scb.ratan.flowzero.workflow.service.IProcessDefinitionService;
import com.scb.ratan.flowzero.workflow.service.IProcessInstanceService;
import com.scb.ratan.flowzero.workflow.service.ITaskOperationService;
import com.scb.ratan.flowzero.workflow.service.IWorkflowRequestService;
import com.scb.ratan.flowzero.workflow.utils.JsonUtil;
import com.scb.ratan.flowzero.workflow.utils.SpecificationUtils;
import com.scb.ratan.flowzero.workflow.utils.UserInfoUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.DelegationState;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.engine.task.TaskQuery;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.ExtensionElements;
import org.camunda.bpm.model.bpmn.instance.UserTask;
import org.camunda.bpm.model.bpmn.instance.camunda.CamundaProperties;
import org.camunda.bpm.model.bpmn.instance.camunda.CamundaProperty;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author MaYue
 * @date 8/12/2025
 */

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class TaskOperationServiceImpl implements ITaskOperationService {

    private final TaskService taskService;
    private final RuntimeService runtimeService;
    private final IProcessDefinitionService processDefinitionService;
    private final IWorkflowRequestService workflowRequestService;
    private final IProcessInstanceService processInstanceService;
    private final DesignerServiceClient designerServiceClient;
    private final CamundaNativeTaskRepository camundaNativeTaskRepository;
    private final EntityManager entityManager;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void approve(BaseTaskOperationDto dto) {
        Task task = getTaskById(dto.getTaskId());
        validateTaskButtonPermission(dto.getTaskId(), Constants.APPROVE_BUTTON);
        validateOperator(task, dto.getUserId());
        Map<String, Object> updatedVariables = buildUpdatedVariables(task.getProcessInstanceId(), dto.getVariables());
        taskService.complete(task.getId(), updatedVariables);
    }

    private Map<String, Object> buildUpdatedVariables(String processInstanceId, Map<String, Object> formData) {
        WorkflowRequest workflowRequest = workflowRequestService.findByInstanceId(processInstanceId);
        if (workflowRequest == null) {
            throw new BusinessException("WorkflowRequest doesn't exist");
        }
        Map<String, Object> mergedVariables = runtimeService.getVariables(processInstanceId);
        mergeVariables(mergedVariables, formData, workflowRequest);
        workflowRequestService.save(workflowRequest);
        return mergedVariables;
    }

    @SuppressWarnings("unchecked")
    private void mergeVariables(Map<String, Object> mergedVariables,
        Map<String, Object> formData,
        WorkflowRequest workflowRequest) {
        if (CollectionUtils.isEmpty(formData)) {
            return;
        }

        // ── 1. Merge into Camunda variable map ──────────────────────────────────
        // Same structure as buildStartVariables: top-level key = nodeId,
        // value = map of field names → values.
        formData.forEach((nodeId, nodeVars) -> {
            if (nodeVars instanceof Map && mergedVariables.containsKey(nodeId)) {
                Map<String, Object> target = (Map<String, Object>) mergedVariables.get(nodeId);
                ((Map<String, Object>) nodeVars).forEach((fieldKey, fieldValue) -> {
                    if (target.containsKey(fieldKey)) {
                        target.put(fieldKey, fieldValue);
                    }
                });
            }
        });

        // ── 2. Merge into workflowRequest.globalVariables (DB) ──────────────────
        // Read the existing snapshot, deep-merge at the node level, write back.
        Map<String, Object> globalVars = JsonUtil.toMap(workflowRequest.getGlobalVariables());
        if (globalVars == null) {
            globalVars = new HashMap<>();
        }
        for (Map.Entry<String, Object> entry : formData.entrySet()) {
            Object nodeVars = entry.getValue();
            if (nodeVars instanceof Map) {
                Map<String, Object> target = (Map<String, Object>) globalVars.computeIfAbsent(entry.getKey(), k -> new HashMap<>());
                target.putAll((Map<String, Object>) nodeVars);
            }
        }
        workflowRequest.setGlobalVariables(JsonUtil.toJsonStr(globalVars));
    }

    @Override
    public PageResponseVo<ProcessTaskVo> queryTasks(TaskPageQueryDto queryDto, BasePageDto pageDto, String currentUserId) {

        if (StringUtils.isNotBlank(queryDto.getCandidateUser()) && StringUtils.isNotBlank(queryDto.getCandidateGroup())) {
            throw new BusinessException("Invalid query usage: cannot set both candidateGroup and candidateUser");
        }

        boolean assigneeOnly = queryDto.getAssigneeOnly();
        // ── Step 1: Navigation ─────────────────────────────────────────────────────
        NavigationContext navCtx = resolveNavigation(queryDto, assigneeOnly, currentUserId);
        if (navCtx == null) {
            log.info("No accessible navigation for user [{}] workflow [{}]", currentUserId, queryDto.getWorkflowName());
            return emptyAssignPage(pageDto);
        }

        // ── Step 2: WorkflowRequest query → processInstanceIds ─────────────────────
        List<WorkflowRequest> matchingRequests = queryMatchingRequests(queryDto, navCtx.navWorkflowIds());
        if (matchingRequests.isEmpty()) {
            return emptyAssignPage(pageDto);
        }
        Set<String> processInstanceIds = matchingRequests.stream()
            .map(WorkflowRequest::getInstanceId)
            .filter(StringUtils::isNotBlank)
            .collect(Collectors.toCollection(LinkedHashSet::new));
        if (processInstanceIds.isEmpty()) {
            return emptyAssignPage(pageDto);
        }
        Map<String, WorkflowRequest> instanceToRequest = toRequestMap(matchingRequests);

        // ── Step 3: Build Camunda TaskQuery and paginate ────────────────────────────
        TaskQueryBundle bundle = buildBaseTaskQuery(queryDto, processInstanceIds, navCtx.accessibleTaskKeys(), assigneeOnly, currentUserId);
        PagedTaskResult pagedResult = fetchTasks(bundle.query(), pageDto, bundle.inMemoryFilter(), bundle.candidateUsers(),
            bundle.candidateGroups());
        if (pagedResult.total() == 0) {
            return emptyAssignPage(pageDto);
        }
        List<Task> tasks = pagedResult.tasks();

        // ── Step 4: Batch-enrich ───────────────────────────────────────────────────
        Set<String> taskInstanceIds = tasks.stream().map(Task::getProcessInstanceId).collect(Collectors.toSet());
        if (instanceToRequest.isEmpty() && !taskInstanceIds.isEmpty()) {
            instanceToRequest = toRequestMap(workflowRequestService.findByInstanceIds(taskInstanceIds));
        }
        Map<String, String> processDefIdToName = resolveWorkflowNames(tasks, navCtx.navProcessDefIdToName(),
            navCtx.useProcessDefFallback());
        Map<String, CandidateLinks> taskCandidateLinks = pagedResult.taskCandidateLinks();
        if (CollectionUtils.isEmpty(taskCandidateLinks) && !CollectionUtils.isEmpty(tasks)) {
            taskCandidateLinks = loadTaskCandidateLinks(tasks);
        }

        // ── Step 5: Assemble ───────────────────────────────────────────────────────
        List<ProcessTaskVo> voList = buildProcessTaskVoList(tasks, processDefIdToName, instanceToRequest, taskCandidateLinks);
        return PageResponseVo.of(new PageImpl<>(voList, pageDto.toPageable(), pagedResult.total()));
    }

    /**
     * Decides whether to call the designer navigation API and wraps the result.
     * Returns {@code null} when no accessible tasks exist (caller should return an empty page).
     * When nav is skipped (assigneeOnly=true with no name filters) the returned context carries
     * {@code useProcessDefFallback=true} so the caller resolves workflowName via ACT_RE_PROCDEF.
     */
    private NavigationContext resolveNavigation(TaskPageQueryDto queryDto, boolean assigneeOnly, String currentUserId) {
        // assigneeOnly=false → always query nav (permission-scoped task list required)
        // assigneeOnly=true → only query nav when a workflow/task name filter is
        // present
        boolean shouldQueryNav = !assigneeOnly
            || StringUtils.isNotBlank(queryDto.getWorkflowName())
            || StringUtils.isNotBlank(queryDto.getTaskName());

        if (!shouldQueryNav) {
            return new NavigationContext(null, null, Collections.emptyMap(), true);
        }
        NavigationQueryResult navResult = queryAccessibleNavigation(queryDto, currentUserId);
        if (navResult == null) {
            return null;
        }
        return new NavigationContext(navResult.taskKeys(), navResult.workflowIds(), navResult.processDefIdToName(), false);
    }

    /**
     * Builds a Camunda {@link TaskQuery} scoped to the given process instances and task keys,
     * applying all optional filters from the query DTO.
     * <p>
     * Fields with native Camunda support are pushed to the DB query directly.
     * Filters that Camunda cannot handle natively (multiple assignees, multiple task-names)
     * are returned as an in-memory {@link Predicate} inside the {@link TaskQueryBundle}.
     */
    private TaskQueryBundle buildBaseTaskQuery(TaskPageQueryDto queryDto,
        Set<String> processInstanceIds,
        Set<String> accessibleTaskKeys,
        boolean assigneeOnly,
        String currentUserId) {

        // processInstanceIdIn → index-scan on ACT_RU_TASK.PROC_INST_ID_
        // taskDefinitionKeyIn → single-column filter on ACT_RU_TASK.TASK_DEF_KEY_
        TaskQuery taskQuery = taskService.createTaskQuery()
            .processInstanceIdIn(processInstanceIds.toArray(new String[0]))
            .active();

        // ── taskId IN (always DB-level: Camunda has native taskIdIn) ─────────────────
        List<String> taskIds = splitValues(queryDto.getTaskId());
        if (!taskIds.isEmpty()) {
            taskQuery = taskQuery.taskIdIn(taskIds.toArray(new String[0]));
        }

        // ── Assignee: single value → DB-level taskAssignee; multiple → in-memory
        // ──────
        List<String> assignees = splitValues(queryDto.getAssignee());
        if (assigneeOnly) {
            taskQuery = taskQuery.taskAssignee(currentUserId);
        } else if (assignees.size() == 1) {
            taskQuery = taskQuery.taskAssignee(assignees.get(0));
        }

        // ── Candidate filters ───────────────────────────────────────────────────────
        Set<String> candidateUsersForInMemory = Collections.emptySet();
        Set<String> candidateGroupsForInMemory = Collections.emptySet();
        List<String> candidateUsers = splitValues(queryDto.getCandidateUser());
        List<String> candidateGroups = splitValues(queryDto.getCandidateGroup());

        if (!candidateUsers.isEmpty()) {
            if (candidateUsers.size() == 1) {
                taskQuery = taskQuery.taskCandidateUser(candidateUsers.get(0)).includeAssignedTasks();
            } else {
                candidateUsersForInMemory = new LinkedHashSet<>(candidateUsers);
            }
        } else if (!candidateGroups.isEmpty()) {
            if (candidateGroups.size() == 1) {
                taskQuery = taskQuery.taskCandidateGroup(candidateGroups.get(0)).includeAssignedTasks();
            } else {
                candidateGroupsForInMemory = new LinkedHashSet<>(candidateGroups);
            }
        }

        if (!CollectionUtils.isEmpty(accessibleTaskKeys)) {
            taskQuery = taskQuery.taskDefinitionKeyIn(accessibleTaskKeys.toArray(new String[0]));
        }

        // ── In-memory predicate for multi-value fields Camunda can't filter natively
        java.util.function.Predicate<Task> inMemoryFilter = null;
        if (!assigneeOnly && assignees.size() > 1) {
            Set<String> assigneeSet = new LinkedHashSet<>(assignees);
            java.util.function.Predicate<Task> assigneeFilter = task -> assigneeSet.contains(task.getAssignee());
            inMemoryFilter = inMemoryFilter == null ? assigneeFilter : inMemoryFilter.and(assigneeFilter);
        }

        return new TaskQueryBundle(taskQuery, inMemoryFilter, candidateUsersForInMemory, candidateGroupsForInMemory);
    }

    /**
     * Counts total matches then fetches the requested page, sorted by create-time desc.
     * When {@code inMemoryFilter} is non-null, all matching tasks are fetched first,
     * filtered in-memory, and then paginated manually (necessary for fields Camunda
     * cannot filter at the DB level, e.g. multiple assignees or multiple task names).
     */
    private PagedTaskResult fetchTasks(TaskQuery taskQuery,
        BasePageDto pageDto,
        java.util.function.Predicate<Task> inMemoryFilter,
        Set<String> candidateUsers,
        Set<String> candidateGroups) {

        boolean hasCandidateInMemoryFilter = !CollectionUtils.isEmpty(candidateUsers) || !CollectionUtils.isEmpty(candidateGroups);
        if (inMemoryFilter == null && !hasCandidateInMemoryFilter) {
            long total = taskQuery.count();
            if (total == 0) {
                return new PagedTaskResult(List.of(), 0L, Collections.emptyMap());
            }
            int first = pageDto.getPage() * pageDto.getSize();
            List<Task> tasks = taskQuery.orderByTaskCreateTime().desc().listPage(first, pageDto.getSize());
            return new PagedTaskResult(tasks, total, Collections.emptyMap());
        }
        // In-memory filtering: fetch all, filter, then paginate manually
        List<Task> all = taskQuery.orderByTaskCreateTime().desc().list();
        List<Task> filtered = applyCommonInMemoryFilter(all, inMemoryFilter);

        CandidateFilterResult candidateResult = applyCandidateInMemoryFilter(filtered, candidateUsers, candidateGroups,
            hasCandidateInMemoryFilter);
        filtered = candidateResult.filteredTasks();
        Map<String, CandidateLinks> taskCandidateLinks = candidateResult.candidateLinks();

        long total = filtered.size();
        int first = pageDto.getPage() * pageDto.getSize();
        int last = (int) Math.min(first + pageDto.getSize(), total);
        List<Task> pageTasks = first >= total ? List.of() : filtered.subList(first, last);
        if (!CollectionUtils.isEmpty(taskCandidateLinks) && !CollectionUtils.isEmpty(pageTasks)) {
            Set<String> pageTaskIds = pageTasks.stream().map(Task::getId).collect(Collectors.toSet());
            taskCandidateLinks = taskCandidateLinks.entrySet().stream()
                .filter(e -> pageTaskIds.contains(e.getKey()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new));
        }
        return new PagedTaskResult(pageTasks, total, taskCandidateLinks);
    }

    private List<Task> applyCommonInMemoryFilter(List<Task> tasks, java.util.function.Predicate<Task> inMemoryFilter) {
        return inMemoryFilter == null ? tasks : tasks.stream().filter(inMemoryFilter).collect(Collectors.toList());
    }

    private CandidateFilterResult applyCandidateInMemoryFilter(List<Task> tasks,
        Set<String> candidateUsers,
        Set<String> candidateGroups,
        boolean hasCandidateInMemoryFilter) {

        if (!hasCandidateInMemoryFilter || CollectionUtils.isEmpty(tasks)) {
            return new CandidateFilterResult(tasks, Collections.emptyMap());
        }

        Map<String, CandidateLinks> taskCandidateLinks = loadTaskCandidateLinks(tasks);
        final Map<String, CandidateLinks> linksMap = taskCandidateLinks;
        List<Task> filtered = tasks.stream()
            .filter(task -> {
                CandidateLinks links = linksMap.get(task.getId());
                boolean matchUsers = CollectionUtils.isEmpty(candidateUsers)
                    || (links != null && !Collections.disjoint(links.users, candidateUsers));
                boolean matchGroups = CollectionUtils.isEmpty(candidateGroups)
                    || (links != null && !Collections.disjoint(links.groups, candidateGroups));
                return matchUsers && matchGroups;
            })
            .collect(Collectors.toList());

        return new CandidateFilterResult(filtered, taskCandidateLinks);
    }

    /**
     * Converts a {@link WorkflowRequest} list to a {@code instanceId → request} map,
     * skipping entries whose instanceId is blank.
     */
    private Map<String, WorkflowRequest> toRequestMap(List<WorkflowRequest> requests) {
        return requests.stream()
            .filter(r -> StringUtils.isNotBlank(r.getInstanceId()))
            .collect(Collectors.toMap(WorkflowRequest::getInstanceId, r -> r, (a, b) -> a));
    }

    /**
     * Resolves processDefinitionId → workflowName mapping.
     * Uses the nav result when available; falls back to {@link IProcessDefinitionService}
     * when nav was skipped or returned no processDefinitionId entries.
     */
    private Map<String, String> resolveWorkflowNames(List<Task> tasks,
        Map<String, String> navProcessDefIdToName,
        boolean useProcessDefFallback) {

        if ((useProcessDefFallback || navProcessDefIdToName.isEmpty()) && !tasks.isEmpty()) {
            Set<String> processDefIds = tasks.stream()
                .map(Task::getProcessDefinitionId)
                .filter(StringUtils::isNotBlank)
                .collect(Collectors.toSet());
            return processDefinitionService.getIdNameMapByProcessDefinitionIds(processDefIds);
        }
        return navProcessDefIdToName;
    }

    /**
     * Carries the result of the navigation API call plus a flag indicating whether
     * workflowNames must be resolved later via {@link IProcessDefinitionService}.
     *
     * @param accessibleTaskKeys    BPMN task-definition keys the current user may see
     * @param navWorkflowIds        designer workflowIds used to scope the WorkflowRequest query
     * @param navProcessDefIdToName processDefinitionId → workflowName map (may be empty)
     * @param useProcessDefFallback true when nav was skipped; names must come from ACT_RE_PROCDEF
     */
    private record NavigationContext(
        Set<String> accessibleTaskKeys,
        Set<String> navWorkflowIds,
        Map<String, String> navProcessDefIdToName,
        boolean useProcessDefFallback) {
    }

    private record PagedTaskResult(List<Task> tasks, long total, Map<String, CandidateLinks> taskCandidateLinks) {
    }

    private record CandidateFilterResult(List<Task> filteredTasks, Map<String, CandidateLinks> candidateLinks) {
    }

    /**
     * Shared helper: convert a page of Camunda {@link Task}s into {@link ProcessTaskVo}s.
     *
     * @param tasks              the (already-paged) task list
     * @param processDefIdToName processDefinitionId → workflowName mapping
     * @param instanceToRequest  processInstanceId → {@link WorkflowRequest} mapping
     * @param taskCandidateLinks taskId → candidate users/groups mapping
     */
    private List<ProcessTaskVo> buildProcessTaskVoList(
        List<Task> tasks,
        Map<String, String> processDefIdToName,
        Map<String, WorkflowRequest> instanceToRequest,
        Map<String, CandidateLinks> taskCandidateLinks) {

        return tasks.stream().map(task -> {
            ProcessTaskVo vo = new ProcessTaskVo();
            vo.setTaskId(task.getId());
            vo.setTaskName(task.getName());
            vo.setAssignee(task.getAssignee());

            vo.setWorkflowName(processDefIdToName.getOrDefault(task.getProcessDefinitionId(), ""));

            // ── Fields from WorkflowRequest ──
            WorkflowRequest req = instanceToRequest.get(task.getProcessInstanceId());
            if (req != null) {
                vo.setRequestId(req.getId());
                vo.setCreatedBy(req.getCreatedBy());
                vo.setLastUpdatedBy(req.getUpdatedBy());
                vo.setCreateTime(req.getCreatedAt() != null ? Date.from(req.getCreatedAt().toInstant(ZoneOffset.UTC)) : null);
                vo.setUpdateTime(req.getUpdatedAt() != null ? Date.from(req.getUpdatedAt().toInstant(ZoneOffset.UTC)) : null);
                vo.setVariables(resolveTaskVariables(req.getGlobalVariables(), task.getTaskDefinitionKey()));
            }

            // ── Candidate users/groups from preloaded identity links ──
            CandidateLinks links = taskCandidateLinks.get(task.getId());
            if (links != null) {
                String candidateUser = String.join(",", links.users);
                String candidateGroup = String.join(",", links.groups);
                vo.setCandidateUser(StringUtils.isBlank(candidateUser) ? null : candidateUser);
                vo.setCandidateGroup(StringUtils.isBlank(candidateGroup) ? null : candidateGroup);
            }

            // ── Internal fields for downstream use ──
            vo.setTaskDefinitionKey(task.getTaskDefinitionKey());
            vo.setProcessDefinitionId(task.getProcessDefinitionId());
            vo.setProcessInstanceId(task.getProcessInstanceId());
            return vo;
        }).collect(Collectors.toList());
    }

    private Map<String, CandidateLinks> loadTaskCandidateLinks(List<Task> tasks) {
        if (CollectionUtils.isEmpty(tasks)) {
            return Collections.emptyMap();
        }
        List<String> taskIds = tasks.stream().map(Task::getId).filter(StringUtils::isNotBlank).toList();
        if (taskIds.isEmpty()) {
            return Collections.emptyMap();
        }

        List<CandidateIdentityLinkDto> rows = camundaNativeTaskRepository.findCandidateIdentityLinksByTaskIds(taskIds);

        if (rows == null || rows.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<String, CandidateLinks> result = new LinkedHashMap<>();
        for (CandidateIdentityLinkDto row : rows) {
            String taskId = row.getTaskId();
            if (StringUtils.isBlank(taskId)) {
                continue;
            }
            CandidateLinks links = result.computeIfAbsent(taskId, k -> new CandidateLinks());
            if (row.getUserId() != null) {
                links.users.add(row.getUserId());
            }
            if (row.getGroupId() != null) {
                links.groups.add(row.getGroupId());
            }
        }
        return result;
    }

    private static final class CandidateLinks {

        private final Set<String> users = new LinkedHashSet<>();
        private final Set<String> groups = new LinkedHashSet<>();

    }

    /** Pre-filter t_workflow_request and return matching requests (DB-level). */
    private List<WorkflowRequest> queryMatchingRequests(TaskPageQueryDto queryDto, Set<String> workflowIds) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<WorkflowRequest> cq = cb.createQuery(WorkflowRequest.class);
        Root<WorkflowRequest> root = cq.from(WorkflowRequest.class);
        cq.select(root);

        List<Predicate> predicates = new ArrayList<>();
        SpecificationUtils.addEqualPredicate(predicates, root, cb, "status", WorkflowRequestStatusEnum.INPROGRESS.getDesc());
        SpecificationUtils.addInPredicate(predicates, root, "createdBy", queryDto.getCreatedBy());
        SpecificationUtils.addInPredicate(predicates, root, "updatedBy", queryDto.getLastUpdatedBy());
        SpecificationUtils.addLikePredicate(predicates, root, cb, "id", queryDto.getRequestId());
        SpecificationUtils.addDateFromPredicate(predicates, root, cb, "createdAt", queryDto.getCreateStartDateTime());
        SpecificationUtils.addDateToPredicate(predicates, root, cb, "createdAt", queryDto.getCreateEndDateTime());
        SpecificationUtils.addDateFromPredicate(predicates, root, cb, "updatedAt", queryDto.getUpdateStartDateTime());
        SpecificationUtils.addDateToPredicate(predicates, root, cb, "updatedAt", queryDto.getUpdateEndDateTime());
        SpecificationUtils.addInPredicate(predicates, root, "workflowId", workflowIds);
        cq.where(predicates.toArray(new Predicate[0]));
        return entityManager.createQuery(cq).getResultList();
    }

    private PageResponseVo<ProcessTaskVo> emptyAssignPage(BasePageDto pageDto) {
        return PageResponseVo.of(new PageImpl<>(List.of(), pageDto.toPageable(), 0));
    }

    @SuppressWarnings("unchecked")
    private List<TaskVo> buildTaskVos(List<Task> tasks) {
        List<TaskVo> taskVos = Lists.newArrayList();
        Set<String> instanceIds = Sets.newHashSet();
        Set<String> processDefinitionIds = Sets.newHashSet();
        for (Task task : tasks) {
            TaskVo taskVo = new TaskVo(task);
            taskVos.add(taskVo);
            instanceIds.add(task.getProcessInstanceId());
            processDefinitionIds.add(task.getProcessDefinitionId());
        }
        Map<String, String> idNameMap = processDefinitionService.getIdNameMapByProcessDefinitionIds(processDefinitionIds);
        List<WorkflowRequest> requestList = workflowRequestService.findByInstanceIds(instanceIds);
        Map<String, WorkflowRequest> requestMap = requestList.stream()
            .collect(Collectors.toMap(WorkflowRequest::getInstanceId, Function.identity()));
        taskVos.forEach(taskVo -> {
            taskVo.setWorkflowName(idNameMap.get(taskVo.getProcessDefinitionId()));
            WorkflowRequest workflowRequest = requestMap.get(taskVo.getProcessInstanceId());
            attachTaskVariables(taskVo, workflowRequest);
        });
        return taskVos;
    }

    private static void attachTaskVariables(TaskVo taskVo, WorkflowRequest workflowRequest) {
        if (workflowRequest != null) {
            taskVo.setRequester(workflowRequest.getCreatedBy());
            Map<String, Object> allVariables = JsonUtil.toMap(workflowRequest.getGlobalVariables());
            if (allVariables != null) {
                // Try current task node first; fall back to "start" node
                String nodeKey = taskVo.getTaskDefinitionKey();
                Object matched = allVariables.get(nodeKey);
                String resolvedKey = matched instanceof Map ? nodeKey : VariableNamespaceEnum.START.getName();
                Object resolvedVars = matched instanceof Map ? matched : allVariables.get(VariableNamespaceEnum.START.getName());
                taskVo.setVariables(resolvedVars instanceof Map
                    ? Collections.singletonMap(resolvedKey, resolvedVars)
                    : Collections.emptyMap());
            }
        }
    }

    /**
     * get the task detail by taskId
     */
    @Override
    public TaskVo getTaskDetail(String taskId) {
        if (StringUtils.isBlank(taskId)) {
            throw new BusinessException("taskId can not be null");
        }
        Task camundaTask = getTaskById(taskId);
        List<TaskVo> vos = buildTaskVos(List.of(camundaTask));
        if (vos.isEmpty()) {
            throw new BusinessException("getTaskDetail failed!");
        }
        return vos.get(0);
    }

    public Task getTaskById(String taskId) {
        Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
        if (task == null) {
            throw new BusinessException("Task doesn't exist");
        }
        return task;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void reject(BaseTaskOperationDto dto) {
        Task task = getTaskById(dto.getTaskId());
        validateTaskButtonPermission(dto.getTaskId(), Constants.REJECT_BUTTON);
        validateOperator(task, dto.getUserId());

        String rejectToId = getTaskProperty(dto.getTaskId(), Constants.REJECT_TO_KEY)
            .orElseThrow(() -> new BusinessException("didn't get the reject to node property"));

        runtimeService.createProcessInstanceModification(task.getProcessInstanceId())
            .cancelAllForActivity(task.getTaskDefinitionKey())
            .startBeforeActivity(rejectToId)
            .setAnnotation(String.format("user [%s] reject task to [%s]", dto.getUserId(), rejectToId))
            .execute();
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void terminate(BaseTaskOperationDto dto) {
        if (StringUtils.isBlank(dto.getTaskId())) {
            throw new BusinessException("taskId can not be null");
        }
        Task task = taskService.createTaskQuery().taskId(dto.getTaskId()).singleResult();
        if (task == null) {
            throw new BusinessException("Task doesn't exist, taskId: " + dto.getTaskId());
        }
        validateTaskButtonPermission(dto.getTaskId(), Constants.TERMINATE_BUTTON);
        validateOperator(task, dto.getUserId());

        String processInstanceId = task.getProcessInstanceId();
        processInstanceService.terminate(processInstanceId, "terminated by taskId: " + dto.getTaskId(),
            WorkflowRequestStatusEnum.MANUALLY_TERMINATED);
        log.info("Terminated process instance {} by taskId {}", processInstanceId, dto.getTaskId());
    }

    @Override
    public List<NameValueVo> getTaskPropertieList(String taskId) {
        CamundaProperties camundaProperties = getTaskProperties(taskId);
        if (camundaProperties == null || CollectionUtils.isEmpty(camundaProperties.getCamundaProperties())) {
            return Collections.emptyList();
        }
        return camundaProperties.getCamundaProperties().stream()
            .map(p -> new NameValueVo(p.getCamundaName(), p.getCamundaValue()))
            .toList();
    }

    @Override
    public Optional<String> getTaskProperty(String taskId, String propertyKey) {
        if (StringUtils.isBlank(propertyKey)) {
            log.warn("propertyKey is empty, will return Optional.empty()");
            return Optional.empty();
        }
        CamundaProperties camundaProperties = getTaskProperties(taskId);
        if (camundaProperties == null) {
            return Optional.empty();
        }
        return camundaProperties.getCamundaProperties().stream()
            .filter(p -> propertyKey.equals(p.getCamundaName()))
            .findFirst()
            .map(CamundaProperty::getCamundaValue);
    }

    @Override
    public CamundaProperties getTaskProperties(String taskId) {
        Task task = getTaskById(taskId);

        String processDefinitionId = task.getProcessDefinitionId();
        BpmnModelInstance bpmnModelInstance = processDefinitionService.getBpmnModelInstance(processDefinitionId);
        if (bpmnModelInstance == null) {
            throw new BusinessException("BpmnModelInstance is null for processDefinitionId: " + processDefinitionId);
        }

        String taskDefinitionKey = task.getTaskDefinitionKey();
        UserTask userTask = bpmnModelInstance.getModelElementById(taskDefinitionKey);
        if (userTask == null) {
            throw new BusinessException("User Task doesn't exist，definition Key：" + taskDefinitionKey);
        }

        ExtensionElements extensionElements = userTask.getExtensionElements();
        if (extensionElements == null) {
            return null;
        }

        return extensionElements.getElementsQuery()
            .filterByType(CamundaProperties.class)
            .singleResult();
    }

    @Override
    public BatchOperationResultVo<BatchItemResultVo> batchClaim(BatchOperationDto batchOperationDto, String userId) {
        List<String> taskIds = batchOperationDto.getIdList();
        getUserDetailByBankId(userId);
        String userRoleName = getUserRoleName(userId);
        return batchOperate(taskIds, userId, userRoleName, false, taskId -> taskService.claim(taskId, userId));
    }

    @Override
    public BatchOperationResultVo<BatchItemResultVo> batchAssign(BatchOperationDto batchOperationDto) {
        List<String> taskIds = batchOperationDto.getIdList();
        String userId = batchOperationDto.getToUserId();
        getUserDetailByBankId(userId);
        String userRoleName = getUserRoleName(userId);
        return batchOperate(taskIds, userId, userRoleName, true, taskId -> taskService.setAssignee(taskId, userId));
    }

    private BatchOperationResultVo<BatchItemResultVo> batchOperate(List<String> taskIds,
        String userId,
        String userRoleName,
        boolean checkCandidateGroup,
        Consumer<String> operation) {

        Map<String, Task> taskMap = loadTaskMap(taskIds);
        Set<String> candidateTaskIds = camundaNativeTaskRepository.findCandidateTaskIds(taskIds, userId, userRoleName);
        String currentUserId = UserInfoUtils.getUserId();
        String currentUserRoleName = getUserRoleName(currentUserId);
        Set<String> candidateGroupTaskIds = checkCandidateGroup
            ? camundaNativeTaskRepository.findCandidateGroupTaskIds(taskIds, currentUserRoleName)
            : Collections.emptySet();
        List<BatchItemResultVo> itemResultVos = new ArrayList<>();
        AtomicInteger successCount = new AtomicInteger();
        for (String taskId : taskIds) {
            BatchItemResultVo itemResultVo = new BatchItemResultVo();
            itemResultVo.setId(taskId);
            try {
                Task task = taskMap.get(taskId);
                canUserClaimAndAssignTask(task, userId, candidateTaskIds);
                if (checkCandidateGroup) {
                    canUserInCandidateGroup(task, currentUserId, candidateGroupTaskIds);
                }
                operation.accept(taskId);
                itemResultVo.setStatus(ItemStatus.SUCCESS);
                itemResultVo.setMessage("Operation successful");
                successCount.getAndIncrement();
            } catch (Exception e) {
                itemResultVo.setStatus(ItemStatus.FAILED);
                itemResultVo.setMessage(e.getMessage());
            }
            itemResultVos.add(itemResultVo);
        }
        return buildBatchResult(taskIds.size(), successCount.intValue(), itemResultVos);
    }

    private void canUserInCandidateGroup(Task task, String userId, Set<String> candidateGroupTaskIds) {
        if (task == null) {
            throw new BusinessException("Task doesn't exist");
        }

        if (CollectionUtils.isEmpty(candidateGroupTaskIds)) {
            throw new BusinessException(
                String.format("Task is assigned to the target group and cannot be operated by user [%s]", userId));
        }

        String taskId = task.getId();
        if (taskId == null) {
            throw new BusinessException("Task id is null, cannot perform candidate-group check");
        }

        if (!candidateGroupTaskIds.contains(taskId)) {
            throw new BusinessException(
                String.format("Task [%s] is assigned to the target group and cannot be operated by user [%s]", taskId, userId));
        }
    }

    private Map<String, Task> loadTaskMap(List<String> taskIds) {
        List<Task> tasks = taskService.createTaskQuery()
            .taskIdIn(taskIds.toArray(new String[0]))
            .list();
        return tasks.stream()
            .collect(Collectors.toMap(Task::getId, Function.identity()));
    }

    private BatchOperationResultVo<BatchItemResultVo> buildBatchResult(int total,
        int successCount,
        List<BatchItemResultVo> itemResultVos) {

        BatchOperationResultVo<BatchItemResultVo> resultVo = new BatchOperationResultVo<>();
        resultVo.setResults(itemResultVos);
        if (successCount == total) {
            resultVo.setStatus(BatchStatus.SUCCESS);
        } else if (successCount == 0) {
            resultVo.setStatus(BatchStatus.FAILED);
        } else {
            resultVo.setStatus(BatchStatus.PARTIAL_SUCCESS);
        }
        return resultVo;
    }

    private void validateTaskButtonPermission(String taskId, String propertyKey) {
        boolean permitted = getTaskProperty(taskId, propertyKey)
            .map("1"::equals)
            .orElse(false);
        if (!permitted) {
            throw new BusinessException(String.format(
                "Operation [%s] is not permitted for task [%s]", propertyKey, taskId));
        }
    }

    private void validateOperator(Task task, String userId) {
        if (StringUtils.isBlank(userId)) {
            throw new BusinessException("userId must not be null or empty");
        }

        String assignee = task.getAssignee();
        String owner = task.getOwner();
        DelegationState delegationState = task.getDelegationState();

        boolean authorized;
        if (delegationState == DelegationState.PENDING) {
            // Task has been delegated: allow the delegate (assignee) or the original owner
            authorized = userId.equals(assignee) || userId.equals(owner);
        } else {
            // Normal state or resolved delegation: only the current assignee may operate
            authorized = userId.equals(assignee);
        }

        if (!authorized) {
            throw new BusinessException(String.format(
                "User [%s] is not authorized to operate task [%s]. Current assignee: [%s]",
                userId, task.getId(), assignee));
        }
    }

    private void canUserClaimAndAssignTask(Task task, String userId, Set<String> candidateTaskIds) {
        if (task == null) {
            throw new BusinessException("Task doesn't exist");
        }
        if (StringUtils.isNotBlank(task.getAssignee())) {
            throw new BusinessException("Current task is already assigned to " + task.getAssignee());
        }
        if (!candidateTaskIds.contains(task.getId())) {
            throw new BusinessException("User " + userId + " is not a candidate for this task and cannot be the assignee");
        }
    }

    private String getUserRoleName(String userId) {
        DesignerServiceClient.UserVo userDetail = getUserDetailByBankId(userId);
        return userDetail.getRoleName();
    }

    private DesignerServiceClient.UserVo getUserDetailByBankId(String userId) {
        DesignerServiceClient.UserVo userDetail = designerServiceClient.findByBankId(userId);
        if (userDetail == null) {
            throw new BusinessException("Failed to fetch user detail for userId: " + userId);
        }
        return userDetail;
    }

    /**
     * Resolves the variables to display for a task.
     * Uses the current task node's variables if available; falls back to the start node.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> resolveTaskVariables(String globalVariablesJson, String taskDefinitionKey) {
        Map<String, Object> allVars = JsonUtil.toMap(globalVariablesJson);
        if (allVars == null) {
            return Collections.emptyMap();
        }
        Object nodeVars = allVars.get(taskDefinitionKey);
        if (nodeVars instanceof Map) {
            return (Map<String, Object>) nodeVars;
        }
        Object startVars = allVars.get(VariableNamespaceEnum.START.getName());
        return startVars instanceof Map ? (Map<String, Object>) startVars : Collections.emptyMap();
    }
    // ----------------------------------------------------------------
    // 3.3.1 getAssignableUsers
    // ----------------------------------------------------------------

    @Override
    public List<AssignableUserVo> getAssignableUsers(AssignableUsersQueryDto queryDto) {
        List<DesignerServiceClient.UserVo> userVos = designerServiceClient.queryAssignableUser(queryDto.getWorkflowName(),
            queryDto.getTaskName(),
            queryDto.getWorkflowId());

        if (CollectionUtils.isEmpty(userVos)) {
            return Collections.emptyList();
        }

        return userVos.stream().map(u -> {
            AssignableUserVo vo = new AssignableUserVo();
            vo.setId(u.getId());
            vo.setBankId(u.getBankId());
            vo.setUserName(u.getUserName());
            vo.setCountryCode(u.getCountryCode());
            vo.setEmail(u.getEmail());
            vo.setRoleName(u.getRoleName());
            return vo;
        }).collect(Collectors.toList());
    }

    private NavigationQueryResult queryAccessibleNavigation(TaskPageQueryDto queryDto, String currentUserId) {
        DesignerServiceClient.WorkflowNavigationQueryDto navQueryDto = new DesignerServiceClient.WorkflowNavigationQueryDto();
        navQueryDto.setWorkflowName(queryDto.getWorkflowName());
        navQueryDto.setTaskName(queryDto.getTaskName());
        navQueryDto.setUserId(currentUserId);
        navQueryDto.setQueryType(DesignerServiceClient.NavigationQueryTypeEnum.ACCESSIBLE_TASKS);
        List<DesignerServiceClient.WorkflowVersionNavigationVo> navVos = designerServiceClient.queryNavigationByCondition(navQueryDto);

        if (CollectionUtils.isEmpty(navVos)) {
            return null;
        }

        Set<String> collectedTaskKeys = new LinkedHashSet<>();
        Set<String> collectedWorkflowIds = new LinkedHashSet<>();
        Map<String, String> collectedProcessDefToName = new LinkedHashMap<>();

        for (DesignerServiceClient.WorkflowVersionNavigationVo nav : navVos) {
            if (!CollectionUtils.isEmpty(nav.getTasks())) {
                for (DesignerServiceClient.TaskNavigationVo t : nav.getTasks()) {
                    collectedTaskKeys.add(t.getTaskKey());
                }
            }
            collectedWorkflowIds.add(nav.getWorkflowId());
            if (StringUtils.isNotBlank(nav.getProcessDefinitionId()) && StringUtils.isNotBlank(nav.getWorkflowName())) {
                collectedProcessDefToName.put(nav.getProcessDefinitionId(), nav.getWorkflowName());
            }
        }

        if (collectedTaskKeys.isEmpty()) {
            return null;
        }

        return new NavigationQueryResult(collectedTaskKeys, collectedWorkflowIds, collectedProcessDefToName);
    }

    private record NavigationQueryResult(Set<String> taskKeys, Set<String> workflowIds,
        Map<String, String> processDefIdToName) {
    }

    /**
     * Pairs a Camunda {@link TaskQuery} with an optional in-memory post-filter.
     * The in-memory filter is non-null only when one or more filter fields contain
     * multiple comma-separated values that Camunda cannot handle natively.
     */
    private record TaskQueryBundle(
        TaskQuery query,
        java.util.function.Predicate<Task> inMemoryFilter,
        Set<String> candidateUsers,
        Set<String> candidateGroups) {
    }

    /**
     * Parses a comma-separated string into a trimmed, non-blank value list.
     * Returns an empty list when the input is null or blank.
     */
    private static List<String> splitValues(String commaSeparated) {
        if (StringUtils.isBlank(commaSeparated)) {
            return Collections.emptyList();
        }
        return Arrays.stream(commaSeparated.trim().split(","))
            .map(String::trim)
            .filter(StringUtils::isNotBlank)
            .collect(Collectors.toList());
    }

}
