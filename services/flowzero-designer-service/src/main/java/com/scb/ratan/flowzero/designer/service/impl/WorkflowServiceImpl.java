package com.scb.ratan.flowzero.designer.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Functions;
import com.google.common.collect.Lists;
import com.scb.ratan.flowzero.designer.common.Constants;
import com.scb.ratan.flowzero.designer.common.ContextHolder;
import com.scb.ratan.flowzero.designer.common.enums.*;
import com.scb.ratan.flowzero.designer.common.event.WorkflowPublishedEvent;
import com.scb.ratan.flowzero.designer.common.exception.BusinessException;
import com.scb.ratan.flowzero.designer.entity.dbo.*;
import com.scb.ratan.flowzero.designer.entity.dto.*;
import com.scb.ratan.flowzero.designer.entity.vo.*;
import com.scb.ratan.flowzero.designer.entity.vo.WorkflowDetailVo.WorkflowDetailForm;
import com.scb.ratan.flowzero.designer.feign.OrchestrationServiceClient;
import com.scb.ratan.flowzero.designer.feign.OrchestrationServiceClient.RunningInstancesVo;
import com.scb.ratan.flowzero.designer.repository.*;
import com.scb.ratan.flowzero.designer.service.IFileService;
import com.scb.ratan.flowzero.designer.service.IFormService;
import com.scb.ratan.flowzero.designer.service.IWorkflowService;
import com.scb.ratan.flowzero.designer.utils.SpecificationUtils;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @auther Tian, Terry
 * @date 4/2/2026
 **/
@Service
@Slf4j
public class WorkflowServiceImpl implements IWorkflowService {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private WorkflowFormRelRepository workflowFormRelRepository;

    @Autowired
    private WorkflowNavigationRepository workflowNavigationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FormFieldRelRepository formFieldRelRepository;

    @Autowired
    private FieldRepository fieldRepository;

    @Autowired
    private IFormService formService;

    @Autowired
    private OrchestrationServiceClient orchestrationServiceClient;

    @Autowired
    public IFileService fileService;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    public Workflow create(CreateWorkflowDto createWorkflowDto) {
        Workflow workflow = new Workflow();
        BeanUtils.copyProperties(createWorkflowDto, workflow);
        workflow.setUniqueProcessId(Constants.PREFIX_PROCESS + RandomStringUtils.random(7, true, true));
        checkWorkflowName(workflow.getName(), workflow.getUniqueProcessId());
        workflow.setStatus(WorkflowStatusEnum.INIT.getName());
        workflow.setWorkflowVersion(0);
        workflow.setOwnerIds(ContextHolder.getUserId());
        return workflowRepository.save(workflow);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public Void save(SaveWorkflowDto saveWorkflowDto) {
        Workflow workflow = findById(saveWorkflowDto.getId());
        if (!WorkflowStatusEnum.INIT.getName().equals(workflow.getStatus()) &&
            !WorkflowStatusEnum.DRAFT.getName().equals(workflow.getStatus())) {
            throw new BusinessException("published workflow can not be modified!");
        }
        if (saveWorkflowDto.getName() != null && !saveWorkflowDto.getName().equals(workflow.getName())) {
            checkWorkflowName(saveWorkflowDto.getName(), workflow.getUniqueProcessId());
        }

        if (saveWorkflowDto.getRels() != null) {
            if (saveWorkflowDto.getRels().isEmpty()) {
                workflowFormRelRepository.deleteByWorkflowId(workflow.getId());
            } else {
                Set<String> formIds = saveWorkflowDto.getRels().stream().map(WorkflowFormRel::getFormId).collect(Collectors.toSet());
                List<Form> forms = formService.findByIds(formIds);
                if (forms.size() != saveWorkflowDto.getRels().size()) {
                    throw new BusinessException("deleted form can not be binded to workflow!");
                }
                for (Form form : forms) {
                    if (!FormStatusEnum.PUBLISHED.getName().equals(form.getStatus())) {
                        throw new BusinessException("only published form can be binded to workflow!");
                    }
                }
                saveWorkflowDto.getRels().forEach(rel -> rel.setWorkflowId(workflow.getId()));
                workflowFormRelRepository.deleteByWorkflowId(workflow.getId());
                workflowFormRelRepository.saveAll(saveWorkflowDto.getRels());
            }

        }
        BeanUtils.copyProperties(saveWorkflowDto, workflow);
        workflow.setStatus(WorkflowStatusEnum.DRAFT.getName());
        workflowRepository.save(workflow);
        return null;
    }

    @Override
    public void checkWorkflowName(String name, String uniqueProcessId) {
        List<String> list = workflowRepository.duplicateNameCheck(name, uniqueProcessId);
        if (!list.isEmpty()) {
            throw new BusinessException("duplicate workflow name!");
        }
    }

    @Override
    public boolean checkWorkflowName(WorkflowNameCheckDto workflowNameCheckDto) {
        try {
            if (workflowNameCheckDto.getUniqueProcessId() == null) {
                workflowNameCheckDto.setUniqueProcessId("");
            }
            checkWorkflowName(workflowNameCheckDto.getName(), workflowNameCheckDto.getUniqueProcessId());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public WorkflowDetailVo detail(String workflowId) {
        Workflow workflow = findById(workflowId);
        List<WorkflowFormRel> rels = workflowFormRelRepository.findByWorkflowId(workflowId);

        WorkflowDetailVo vo = new WorkflowDetailVo(workflow);
        vo.setForms(buildDetailForms(rels));
        vo.setDisplayVersion(workflow.getSucceedFromId() != null
            ? findById(workflow.getSucceedFromId()).getWorkflowVersion()
            : workflow.getWorkflowVersion());
        return vo;
    }

    private List<WorkflowDetailForm> buildDetailForms(List<WorkflowFormRel> rels) {
        if (rels.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, WorkflowFormRel> formIdRelMap = rels.stream()
            .collect(Collectors.toMap(WorkflowFormRel::getFormId, r -> r));

        Set<String> formIds = formIdRelMap.keySet();
        List<Form> forms = formService.findByIds(formIds);

        List<FormFieldRel> allRels = formFieldRelRepository.findByFormIdIn(formIds);

        Map<String, Field> fieldIdMap = allRels.isEmpty()
            ? Collections.emptyMap()
            : fieldRepository.findByIdIn(
                allRels.stream().map(FormFieldRel::getFieldId).collect(Collectors.toSet()))
                .stream().collect(Collectors.toMap(Field::getId, f -> f));

        // group fields by formId
        Map<String, List<Field>> formFieldsMap = allRels.stream()
            .collect(Collectors.groupingBy(
                FormFieldRel::getFormId,
                Collectors.collectingAndThen(Collectors.toList(), list -> list.stream()
                    .map(r -> fieldIdMap.get(r.getFieldId()))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList()))));

        return forms.stream().map(form -> {
            WorkflowDetailForm detailForm = new WorkflowDetailForm(form);
            Optional.ofNullable(formIdRelMap.get(form.getId()))
                .ifPresent(rel -> detailForm.setWorkflowVariables(rel.getWorkflowVariables()));
            detailForm.setFields(formFieldsMap.getOrDefault(form.getId(), Collections.emptyList()));
            if (form.getFormModelUrl() != null) {
                detailForm.setUrl(fileService.generateDownloadUrl(form.getFormModelUrl(), Constants.STORAGE_TYPE));
            }

            return detailForm;
        }).collect(Collectors.toList());
    }

    @Override
    public Workflow findById(String workflowId) {
        Optional<Workflow> workflowOpt = workflowRepository.findById(workflowId);
        if (workflowOpt.isEmpty()) {
            throw new BusinessException("can not find workflow by Id: " + workflowId);
        }
        return workflowOpt.get();
    }

    @Override
    public List<Workflow> findByIds(Collection<String> workflowIds) {
        return workflowRepository.findByIdIn(workflowIds);
    }

    @Override
    public PageResponseVo<WorkflowPageVo> page(WorkflowPageQueryDto workflowPageQueryDto, BasePageDto basePageDto) {
        basePageDto.setSortBy("updatedAt");
        Specification<Workflow> spec = (root, query, cb) -> {
            List<Predicate> predicates = Lists.newArrayList();
            SpecificationUtils.addLikePredicate(predicates, root, cb, "name", workflowPageQueryDto.getName());
            SpecificationUtils.addInPredicate(predicates, root, "status",
                List.of(WorkflowStatusEnum.INIT.getName(), WorkflowStatusEnum.DRAFT.getName()));
            SpecificationUtils.addCommaSeparatedContainsPredicate(predicates, root, cb, "countryCodes",
                workflowPageQueryDto.getCountryCodes());
            SpecificationUtils.addCommaSeparatedContainsPredicate(predicates, root, cb, "ownerIds", workflowPageQueryDto.getOwnerIds());
            SpecificationUtils.addInPredicate(predicates, root, "businessArea", workflowPageQueryDto.getBusinessArea());
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return page(spec, basePageDto);
    }

    private PageResponseVo<WorkflowPageVo> page(Specification<Workflow> spec, BasePageDto basePageDto) {
        Page<Workflow> result = workflowRepository.findAll(spec, basePageDto.toPageable());
        List<WorkflowPageVo> list = Lists.newArrayList();
        if (result.getTotalElements() > 0) {
            Set<String> parentIds = result.getContent().stream().map(Workflow::getSucceedFromId)
                .filter(Objects::nonNull).collect(Collectors.toSet());
            for (Workflow workflow : result.getContent()) {
                WorkflowPageVo vo = new WorkflowPageVo(workflow);
                vo.setDisplayVersion(vo.getWorkflowVersion());
                list.add(vo);
            }
            if (!parentIds.isEmpty()) {
                List<Workflow> workflows = workflowRepository.findByIdIn(parentIds);
                Map<String, Workflow> idWorkflowMap = workflows.stream()
                    .collect(Collectors.toMap(Workflow::getId, Functions.identity()));
                for (WorkflowPageVo vo : list) {
                    if (vo.getSucceedFromId() == null
                        || !idWorkflowMap.containsKey(vo.getSucceedFromId())) {
                        continue;
                    }
                    vo.setDisplayVersion(idWorkflowMap.get(vo.getSucceedFromId()).getWorkflowVersion());
                }
            }
        }
        return PageResponseVo.of(result, list);
    }

    @Override
    public PageResponseVo<Workflow> publishedWorkflowPage(PublishedWorkflowQueryDto queryDto, BasePageDto basePageDto) {
        Specification<Workflow> spec = (root, query, cb) -> {
            List<Predicate> predicates = Lists.newArrayList();
            SpecificationUtils.addLikePredicate(predicates, root, cb, "name", queryDto.getName());
            SpecificationUtils.addEqualPredicate(predicates, root, cb, "status", WorkflowStatusEnum.PUBLISHED.getName());
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Page<Workflow> page = workflowRepository.findAll(spec, basePageDto.toPageable());
        return PageResponseVo.of(page);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String publish(WorkflowPublishDto workflowPublishDto) {
        // TODO Lock
        Workflow workflow = findById(workflowPublishDto.getId());
        if (!WorkflowStatusEnum.DRAFT.getName().equals(workflow.getStatus())) {
            throw new BusinessException("only draft workflow can be published!");
        }

        DeployVo deploy = callOrchestrationService(workflow);
        workflow.setStatus(WorkflowStatusEnum.PUBLISHED.getName());
        workflow.setUniqueVersionId(deploy.getUniqueVersionId());
        workflow.setWorkflowVersion(deploy.getVersion());
        workflowRepository.save(workflow);
        boolean cleanStaleData = false;
        Workflow newWorkflow = copyWorkflow(workflow);
        if (workflow.getSucceedFromId() != null) {
            Workflow parentWorkflow = findById(workflow.getSucceedFromId());

            List<RunningInstancesVo> runningInstancesVoList = orchestrationServiceClient
                .getRunningInstancesByUniqueVersionId(parentWorkflow.getUniqueVersionId());
            int runningInstance = runningInstancesVoList.size();
            boolean shouldTerminate;
            if (Objects.equals(WorkflowStopTypeEnum.GRACEFUL_STOP.getName(), workflowPublishDto.getStopType())) {
                parentWorkflow.setStatus(runningInstance > 0
                    ? WorkflowStatusEnum.SUSPENDED.getName()
                    : WorkflowStatusEnum.TERMINATED.getName());
                shouldTerminate = false;
            } else {
                parentWorkflow.setStatus(WorkflowStatusEnum.TERMINATED.getName());
                shouldTerminate = true;
            }
            workflowRepository.save(parentWorkflow);
            if (shouldTerminate) {
                orchestrationServiceClient.terminateInstancesByUniqueVersionId(
                    new OrchestrationServiceClient.StopInstancesDto(
                        parentWorkflow.getUniqueVersionId(), "publish " + workflow.getId()));
                cleanStaleData = true;
            }

        }
        // Fire async event to rebuild navigation cache for this published version
        eventPublisher.publishEvent(new WorkflowPublishedEvent(this, workflow.getId(),
                workflow.getUniqueProcessId(), workflow.getUniqueVersionId(), workflow.getName(),
                cleanStaleData, workflow.getContent()));

        return newWorkflow.getId();
    }

    Workflow copyWorkflow(Workflow source) {
        Workflow newWorkflow = new Workflow();
        BeanUtils.copyProperties(source, newWorkflow);
        newWorkflow.setId(null);
        newWorkflow.setVersion(null);
        newWorkflow.setStatus(WorkflowStatusEnum.DRAFT.getName());
        newWorkflow.setUniqueVersionId(null);
        newWorkflow.setSucceedFromId(source.getId());
        newWorkflow.setWorkflowVersion(0);
        workflowRepository.save(newWorkflow);
        List<WorkflowFormRel> rels = workflowFormRelRepository.findByWorkflowId(source.getId());
        List<WorkflowFormRel> copyRels = Lists.newArrayList();
        for (WorkflowFormRel workflowFormRel : rels) {
            WorkflowFormRel rel = new WorkflowFormRel();
            rel.setFormId(workflowFormRel.getFormId());
            rel.setWorkflowVariables(workflowFormRel.getWorkflowVariables());
            rel.setWorkflowId(newWorkflow.getId());
            copyRels.add(rel);
        }
        workflowFormRelRepository.saveAll(copyRels);
        return newWorkflow;
    }

    DeployVo callOrchestrationService(Workflow workflow) {
        OrchestrationServiceClient.ProcessDefinitionDto processDefinitionDto = new OrchestrationServiceClient.ProcessDefinitionDto();
        processDefinitionDto.setResourceId(workflow.getId());
        processDefinitionDto.setContent(workflow.getContent());
        processDefinitionDto.setProcessName(workflow.getName());
        return orchestrationServiceClient.deploy(processDefinitionDto);
    }

    @Override
    public WorkflowBeforePublishCheckVo beforePublishCheck(String workflowId) {
        Workflow workflow = findById(workflowId);
        WorkflowBeforePublishCheckVo result = new WorkflowBeforePublishCheckVo();
        if (workflow.getSucceedFromId() != null) {
            Workflow parentWorkflow = findById(workflow.getSucceedFromId());
            List<RunningInstancesVo> runningInstancesVoList = orchestrationServiceClient
                .getRunningInstancesByUniqueVersionId(parentWorkflow.getUniqueVersionId());
            result.setRunningInstancesNum(runningInstancesVoList.size());
        } else {
            result.setRunningInstancesNum(0);
        }
        return result;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void turnSuspendWorkflowToTerminated() {
        List<Workflow> workflows = workflowRepository.findByStatus(WorkflowStatusEnum.SUSPENDED.getName());
        if (workflows.isEmpty()) {
            return;
        }
        Set<String> uniqueProcessIds = workflows.stream().map(Workflow::getUniqueProcessId).collect(Collectors.toSet());
        List<RunningInstancesVo> list = orchestrationServiceClient.getRunningInstancesByProcessDefinitionKeys(uniqueProcessIds);
        Map<String, List<RunningInstancesVo>> uniqueVersionIdToInstancesMap = list.stream().collect(
            Collectors.groupingBy(OrchestrationServiceClient.RunningInstancesVo::getUniqueVersionId));
        List<Workflow> toSavedWorkflows = Lists.newArrayList();
        for (Workflow workflow : workflows) {
            List<RunningInstancesVo> instances = uniqueVersionIdToInstancesMap.get(workflow.getUniqueVersionId());
            if (instances == null || instances.isEmpty()) {
                workflow.setStatus(WorkflowStatusEnum.TERMINATED.getName());
                toSavedWorkflows.add(workflow);
            }
        }
        if (!toSavedWorkflows.isEmpty()) {
            workflowRepository.saveAll(toSavedWorkflows);
        }
    }

    @Override
    public List<WorkflowFormRel> getWorkflowFormRelsByWorkflowId(String workflowId) {
        return workflowFormRelRepository.findByWorkflowId(workflowId);
    }

    @Override
    public List<WorkflowFormRel> getWorkflowFormRelsByFormId(String formId) {
        return workflowFormRelRepository.findByFormId(formId);
    }

    /**
     * feign client used to get workflow list for form
     * so only return published workflow, init and draft workflow will not be returned
     */
    @Override
    public List<WorkflowShortInfoVo> getWorkflowsByCondition(WorkflowQueryDto queryDto) {
        Specification<Workflow> spec = (root, query, cb) -> {
            List<Predicate> predicates = Lists.newArrayList();
            SpecificationUtils.addInPredicate(predicates, root, "id", queryDto.getIds());
            SpecificationUtils.addLikePredicate(predicates, root, cb, "name", queryDto.getName());
            SpecificationUtils.addNotInPredicate(predicates, root, "status",
                List.of(WorkflowStatusEnum.INIT.getName(), WorkflowStatusEnum.DRAFT.getName()));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return workflowRepository.findAll(spec).stream().map(WorkflowShortInfoVo::new).collect(Collectors.toList());
    }

    @Override
    public VariableNamesVo getVariableNames(String workflowId) {
        VariableNamesVo result = new VariableNamesVo();
        List<WorkflowFormRel> rels = workflowFormRelRepository.findByWorkflowId(workflowId);
        if (rels.isEmpty()) {
            return result;
        }
        result.setFormVariables(rels.stream().map(rel -> {
            FormVariableVo vo = new FormVariableVo();
            // for now, only support start form variables
            vo.setNamespace(VariableNamespaceEnum.START.getName());
            vo.setFormId(rel.getFormId());
            vo.setVariables(rel.getWorkflowVariables());
            return vo;
        }).collect(Collectors.toList()));
        return result;
    }

    @Override
    public void initNavigation() {
        // query all published workflow and base on the bpmns to init the data of
        // navigation

        // 1. Query all currently-published workflows
        List<Workflow> publishedWorkflows = workflowRepository.findByStatus(WorkflowStatusEnum.PUBLISHED.getName());
        if (publishedWorkflows.isEmpty()) {
            log.info("initNavigation: no published workflows found, nothing to do.");
            return;
        }

        // 2. Wipe the entire navigation cache so we start from a clean slate.
        // Individual listeners will re-insert rows per workflow.
        workflowNavigationRepository.deleteAll();
        log.info("initNavigation: cleared navigation cache, rebuilding for {} workflow(s).", publishedWorkflows.size());

        // 3. Fire an async WorkflowPublishedEvent for each published workflow.
        // TODO optimise
        for (Workflow workflow : publishedWorkflows) {
            if (workflow.getContent() == null || workflow.getContent().isBlank()) {
                log.warn("initNavigation: workflowId={} has no BPMN content, skipping.", workflow.getId());
                continue;
            }
            eventPublisher.publishEvent(new WorkflowPublishedEvent(
                this,
                workflow.getId(),
                workflow.getUniqueProcessId(),
                workflow.getUniqueVersionId(),
                workflow.getName(),
                false, // cleanStaleData: already cleared above
                workflow.getContent()));
            log.info("initNavigation: fired event for workflowId={}, name={}", workflow.getId(), workflow.getName());
        }
    }

    @Override
    public List<WorkflowNavigationVo> queryNavigation() {
        // 1. Resolve current user identity and role
        String bankId = ContextHolder.getUserId();
        String roleName = userRepository.findByBankId(bankId)
            .map(User::getRoleName)
            .orElse(null);

        // Build JSONB containment parameters: PostgreSQL @> expects a JSON array
        // literal
        String userIdJson = "[\"" + bankId + "\"]";
        String roleJson = roleName != null ? "[\"" + roleName + "\"]" : "[]";

        // 2. Query the navigation cache — one row per accessible (workflow, task)
        // combination
        List<WorkflowNavigationRepository.NavigationRow> rows = workflowNavigationRepository.findAccessibleNavigation(bankId, userIdJson,
            roleJson);

        if (rows.isEmpty()) {
            return Collections.emptyList();
        }

        // 3. Group by workflowName, collecting uniqueVersionIds and deduplicating tasks
        // LinkedHashMap preserves the ORDER BY workflow_name from the SQL result
        Map<String, WorkflowNavigationVo> byWorkflow = new java.util.LinkedHashMap<>();

        for (WorkflowNavigationRepository.NavigationRow row : rows) {
            WorkflowNavigationVo vo = byWorkflow.computeIfAbsent(row.getWorkflowName(), name -> {
                WorkflowNavigationVo newVo = new WorkflowNavigationVo();
                newVo.setWorkflowName(name);
                newVo.setWorkflowIds(new java.util.LinkedHashSet<>());
                newVo.setUniqueVersionIds(new java.util.LinkedHashSet<>());
                newVo.setTasks(new java.util.ArrayList<>());
                return newVo;
            });

            // Collect distinct uniqueVersionIds for this workflow
            if (row.getWorkflowId() != null) {
                vo.getWorkflowIds().add(row.getWorkflowId());
            }

            if (row.getUniqueVersionId() != null) {
                vo.getUniqueVersionIds().add(row.getUniqueVersionId());
            }

            // Deduplicate tasks by taskKey within the same workflow
            boolean taskAlreadyPresent = vo.getTasks().stream()
                .anyMatch(t -> t.getTaskKey().equals(row.getTaskKey()));
            if (!taskAlreadyPresent) {
                vo.getTasks().add(new TaskNavigationVo(row.getTaskKey(), row.getTaskName()));
            }
        }

        return new java.util.ArrayList<>(byWorkflow.values());
    }

    public List<WorkflowVersionNavigationVo> queryNavigationByCondition(WorkflowNavigationQueryDto dto) {
        List<WorkflowNavigationRepository.NavigationRow> rows;

        if (NavigationQueryTypeEnum.ALL_WORKFLOWS == dto.getQueryType()) {
            rows = workflowNavigationRepository.findAllNavigation(dto.getWorkflowName());
        } else if (NavigationQueryTypeEnum.ALL_TASKS == dto.getQueryType()) {
            rows = workflowNavigationRepository.findAllTasksByWorkflowName(dto.getWorkflowName());
        } else {
            // ── ACCESSIBLE_TASKS ───────────────────────────────────────────────────
            String userId = dto.getUserId() != null ? dto.getUserId().trim() : "";
            String roleName = "";
            if (!userId.isEmpty()) {
                roleName = userRepository.findByBankId(userId)
                    .map(User::getRoleName)
                    .orElse("");
            }

            String userIdJson = userId.isEmpty() ? null : "[\"" + userId + "\"]";
            String roleJson   = roleName.isEmpty() ? null : "[\"" + roleName + "\"]";

            rows = workflowNavigationRepository.findAccessibleNavigationByWorkflowName(
                dto.getWorkflowName(), dto.getWorkflowId(), dto.getTaskName(),
                userId.isEmpty() ? null : userId, userIdJson, roleJson);
        }

        if (rows.isEmpty()) {
            return Collections.emptyList();
        }

        // Group by workflowId so each version's task permissions are preserved independently
        Map<String, WorkflowVersionNavigationVo> byWorkflowId = new java.util.LinkedHashMap<>();
        for (WorkflowNavigationRepository.NavigationRow row : rows) {
            // fallback key when workflowId is absent (e.g. ALL_WORKFLOWS without a filter)
            String versionKey = row.getWorkflowId() != null ? row.getWorkflowId() : row.getWorkflowName();

            WorkflowVersionNavigationVo vo = byWorkflowId.computeIfAbsent(versionKey, k -> {
                WorkflowVersionNavigationVo newVo = new WorkflowVersionNavigationVo();
                newVo.setWorkflowName(row.getWorkflowName());
                newVo.setWorkflowId(row.getWorkflowId());
                newVo.setProcessDefinitionKey(row.getUniqueProcessId());
                newVo.setProcessDefinitionId(row.getUniqueVersionId());

                newVo.setTasks(new java.util.ArrayList<>());
                return newVo;
            });

            // Within the same version, deduplicate by taskKey (a version cannot have duplicate task keys)
            boolean taskAlreadyPresent = vo.getTasks().stream()
                .anyMatch(t -> t.getTaskKey().equals(row.getTaskKey()));
            if (!taskAlreadyPresent) {
                vo.getTasks().add(new TaskNavigationVo(row.getTaskKey(), row.getTaskName()));
            }
        }

        return new java.util.ArrayList<>(byWorkflowId.values());
    }

    @Override
    public Set<String> queryAccessibleWorkflowIds() {
        String bankId = ContextHolder.getUserId();
        String roleName = userRepository.findByBankId(bankId)
            .map(User::getRoleName)
            .orElse(null);

        String userIdJson = "[\"" + bankId + "\"]";
        String roleJson = roleName != null ? "[\"" + roleName + "\"]" : "[]";

        List<String> workflowIds = workflowNavigationRepository
            .findAccessibleWorkflowIds(bankId, userIdJson, roleJson);

        if (workflowIds.isEmpty()) {
            return Collections.emptySet();
        }

        return new java.util.HashSet<>(workflowIds);
    }

    @Override
    public List<UserVo> queryAssignableUser(String workflowName, String taskName, String workflowId) {
        List<WorkflowNavigation> navList = workflowNavigationRepository
            .findLatestByWorkflowNameAndTaskName(workflowName, taskName, workflowId);

        if (navList.isEmpty()) {
            log.info("queryAssignableUser: no navigation row found for workflowName={}, taskName={}, workflowId={}",
                workflowName, taskName, workflowId);
            return Collections.emptyList();
        }

        WorkflowNavigation nav = navList.get(0);

        Map<String, User> userMap = new LinkedHashMap<>();
        if (StringUtils.isNotBlank(nav.getAssignee())) {
            userRepository.findByBankId(nav.getAssignee().trim())
                .ifPresent(u -> userMap.put(u.getBankId(), u));
        }

        List<String> candidateUserIds = parseJsonArray(nav.getCandidateUsers());
        if (!candidateUserIds.isEmpty()) {
            userRepository.findByBankIdIn(candidateUserIds)
                .forEach(u -> userMap.put(u.getBankId(), u));
        }

        List<String> groups = parseJsonArray(nav.getCandidateGroups());
        for (String groupName : groups) {
            userRepository.findByRoleName(groupName)
                .forEach(u -> userMap.put(u.getBankId(), u));
        }

        if (userMap.isEmpty()) {
            return Collections.emptyList();
        }

        return userMap.values().stream()
            .map(u -> new UserVo(u.getId(), u.getBankId(), u.getUserName(),
                u.getCountryCode(), u.getEmail(), u.getRoleName()))
            .collect(Collectors.toList());
    }

    /**
     * Parses a JSONB array string (e.g. {@code ["a","b"]}) into a list of strings.
     * Returns an empty list for null / blank / empty-array inputs.
     */
    private List<String> parseJsonArray(String jsonArray) {
        if (jsonArray == null || jsonArray.isBlank() || "[]".equals(jsonArray.trim())) {
            return Collections.emptyList();
        }
        try {
            return OBJECT_MAPPER.readValue(jsonArray, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("parseJsonArray: failed to parse '{}', returning empty list", jsonArray);
            return Collections.emptyList();
        }
    }

}
