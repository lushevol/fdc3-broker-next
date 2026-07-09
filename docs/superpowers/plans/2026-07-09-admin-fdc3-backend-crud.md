# Admin FDC3 Backend CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build durable Spring Boot backend CRUD APIs for the existing FDC3 Declaration admin UI.

**Architecture:** Add a focused FDC3 admin domain inside `services/backend` with DTOs, JPA entities, repositories, service logic, controller endpoints, and Flyway DDL. Keep the frontend contract unchanged by returning UI-shaped JSON through `ResponseOfAdminModule`.

**Tech Stack:** Java 21, Spring Boot 4, Spring MVC, Spring Data JPA, H2 local tests, Flyway migrations, JUnit 5, MockMvc, Jackson.

## Global Constraints

- Follow TDD: write failing tests before production code.
- Endpoint paths must match the existing frontend: `v1/fmo/admin/fdc3/{data,create,update,delete}`, `v1/fmo/admin/fdc3/intent/{data,create,update,delete}`, and `v1/fmo/admin/fdc3/context/{data,create,update,delete}`.
- Responses must use `ResponseOfAdminModule` with data under `data`.
- Every endpoint must validate `entitlementsToken` through `AdminModuleUtil.validate(...)`.
- CRUD results must be filtered by the caller's `ems2Role`.
- Delete is soft delete by setting `is_active=false`.
- Do not change `apps/base/src/admin/FDC3Declaration` unless backend verification proves a contract mismatch.

---

## File Structure

- Create `services/backend/src/test/java/com/scb/sso/singleuibff/controller/FDC3AdminControllerTest.java`: MockMvc tests for the API contract.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/dto/request/RequestOfFdc3Declaration.java`: declaration request body.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/dto/request/RequestOfFdc3Intent.java`: intent request body.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/dto/request/RequestOfFdc3Context.java`: context request body.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/entity/Fdc3Declaration.java`: declaration persistence entity.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/entity/Fdc3Intent.java`: intent persistence entity.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/entity/Fdc3Context.java`: context persistence entity.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/repository/Fdc3DeclarationRepo.java`: declaration repository.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/repository/Fdc3IntentRepo.java`: intent repository.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/repository/Fdc3ContextRepo.java`: context repository.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/service/v1/Fdc3AdminService.java`: service interface.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/service/v1/implementation/Fdc3AdminServiceImpl.java`: service implementation and JSON mapping.
- Create `services/backend/src/main/java/com/scb/sso/singleuibff/controller/v1/FDC3AdminController.java`: endpoint controller.
- Modify `services/backend/src/main/java/com/scb/sso/singleuibff/config/AuthConfig.java`: register `Fdc3AdminService`.
- Create `services/backend/src/main/resources/migration/V1_0_11__fdc3_admin_crud.sql`: DDL for FDC3 tables.

### Task 1: Declaration CRUD

**Files:**
- Create: `services/backend/src/test/java/com/scb/sso/singleuibff/controller/FDC3AdminControllerTest.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/dto/request/RequestOfFdc3Declaration.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/entity/Fdc3Declaration.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/repository/Fdc3DeclarationRepo.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/service/v1/Fdc3AdminService.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/service/v1/implementation/Fdc3AdminServiceImpl.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/controller/v1/FDC3AdminController.java`
- Modify: `services/backend/src/main/java/com/scb/sso/singleuibff/config/AuthConfig.java`
- Create: `services/backend/src/main/resources/migration/V1_0_11__fdc3_admin_crud.sql`

**Interfaces:**
- Produces: `Fdc3AdminService` methods `listDeclarations(String entitlementsToken, HttpServletRequest request)`, `createDeclaration(RequestOfFdc3Declaration dto, HttpServletRequest request)`, `updateDeclaration(RequestOfFdc3Declaration dto, HttpServletRequest request)`, `deleteDeclaration(RequestOfFdc3Declaration dto, HttpServletRequest request)`.
- Produces: declaration response maps with `appId` and `interop`.

- [ ] **Step 1: Write failing declaration API tests**

Add tests that create, list, update, delete, duplicate-create, and missing-update declarations. Use `/v1/sso/local-token` helper only if one exists; otherwise create a small `@MockBean AdminModuleUtil` in the test returning `sub=tester` and `ems2Role=SUPER_USER`.

- [ ] **Step 2: Run declaration tests to verify RED**

Run: `cd services/backend && mvn -Dtest=FDC3AdminControllerTest test`

Expected: compile failure or 404 because `FDC3AdminController` and FDC3 types do not exist yet.

- [ ] **Step 3: Implement declaration persistence and controller**

Implement DTO, entity, repo, service, controller, bean registration, and migration for declarations only. The declaration table columns are `app_id`, `interop_json`, `is_active`, `ems2_role`, `created_at`, `updated_at`, `created_by`, and `updated_by`.

- [ ] **Step 4: Run declaration tests to verify GREEN**

Run: `cd services/backend && mvn -Dtest=FDC3AdminControllerTest test`

Expected: declaration tests pass.

- [ ] **Step 5: Commit declaration slice**

Run: `git add services/backend && git commit -m "feat: add fdc3 declaration admin crud"`

### Task 2: Intent CRUD

**Files:**
- Modify: `services/backend/src/test/java/com/scb/sso/singleuibff/controller/FDC3AdminControllerTest.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/dto/request/RequestOfFdc3Intent.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/entity/Fdc3Intent.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/repository/Fdc3IntentRepo.java`
- Modify: `services/backend/src/main/java/com/scb/sso/singleuibff/service/v1/Fdc3AdminService.java`
- Modify: `services/backend/src/main/java/com/scb/sso/singleuibff/service/v1/implementation/Fdc3AdminServiceImpl.java`
- Modify: `services/backend/src/main/java/com/scb/sso/singleuibff/controller/v1/FDC3AdminController.java`
- Modify: `services/backend/src/main/resources/migration/V1_0_11__fdc3_admin_crud.sql`

**Interfaces:**
- Consumes: `Fdc3AdminServiceImpl` constructor dependencies from Task 1.
- Produces: `listIntents`, `createIntent`, `updateIntent`, and `deleteIntent`.
- Produces: intent response maps with `name` and `description`.

- [ ] **Step 1: Write failing intent API tests**

Add tests for `POST /v1/fmo/admin/fdc3/intent/create`, `/data`, `/update`, and `/delete`, plus duplicate create returning HTTP 400.

- [ ] **Step 2: Run intent tests to verify RED**

Run: `cd services/backend && mvn -Dtest=FDC3AdminControllerTest test`

Expected: intent tests fail with 404 or missing service methods.

- [ ] **Step 3: Implement intent persistence and controller routes**

Add the intent DTO, entity, repo, service methods, controller mappings, and DDL. The intent table columns are `name`, `description`, `is_active`, `ems2_role`, `created_at`, `updated_at`, `created_by`, and `updated_by`.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `cd services/backend && mvn -Dtest=FDC3AdminControllerTest test`

Expected: declaration and intent tests pass.

- [ ] **Step 5: Commit intent slice**

Run: `git add services/backend && git commit -m "feat: add fdc3 intent admin crud"`

### Task 3: Context CRUD

**Files:**
- Modify: `services/backend/src/test/java/com/scb/sso/singleuibff/controller/FDC3AdminControllerTest.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/dto/request/RequestOfFdc3Context.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/entity/Fdc3Context.java`
- Create: `services/backend/src/main/java/com/scb/sso/singleuibff/repository/Fdc3ContextRepo.java`
- Modify: `services/backend/src/main/java/com/scb/sso/singleuibff/service/v1/Fdc3AdminService.java`
- Modify: `services/backend/src/main/java/com/scb/sso/singleuibff/service/v1/implementation/Fdc3AdminServiceImpl.java`
- Modify: `services/backend/src/main/java/com/scb/sso/singleuibff/controller/v1/FDC3AdminController.java`
- Modify: `services/backend/src/main/resources/migration/V1_0_11__fdc3_admin_crud.sql`

**Interfaces:**
- Consumes: shared JSON helpers in `Fdc3AdminServiceImpl`.
- Produces: `listContexts`, `createContext`, `updateContext`, and `deleteContext`.
- Produces: context response maps with `schema`, `description`, and `samples`.

- [ ] **Step 1: Write failing context API tests**

Add tests for `POST /v1/fmo/admin/fdc3/context/create`, `/data`, `/update`, and `/delete`, plus missing delete returning HTTP 400. Test context type derivation from `schema.properties.type.const`.

- [ ] **Step 2: Run context tests to verify RED**

Run: `cd services/backend && mvn -Dtest=FDC3AdminControllerTest test`

Expected: context tests fail with 404 or missing service methods.

- [ ] **Step 3: Implement context persistence and controller routes**

Add the context DTO, entity, repo, service methods, controller mappings, and DDL. The context table columns are `context_type`, `schema_json`, `samples_json`, `description`, `is_active`, `ems2_role`, `created_at`, `updated_at`, `created_by`, and `updated_by`.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `cd services/backend && mvn -Dtest=FDC3AdminControllerTest test`

Expected: declaration, intent, and context tests pass.

- [ ] **Step 5: Commit context slice**

Run: `git add services/backend && git commit -m "feat: add fdc3 context admin crud"`

### Task 4: Backend Verification

**Files:**
- Modify only if verification reveals compile or migration issues in files from Tasks 1-3.

**Interfaces:**
- Consumes: all FDC3 admin endpoint implementations.
- Produces: verified backend test state.

- [ ] **Step 1: Run targeted tests**

Run: `cd services/backend && mvn -Dtest=FDC3AdminControllerTest test`

Expected: PASS.

- [ ] **Step 2: Run broader backend tests**

Run: `cd services/backend && mvn test`

Expected: PASS, or document unrelated existing failures with exact failing tests.

- [ ] **Step 3: Check git diff**

Run: `git diff --stat && git status --short`

Expected: only FDC3 backend CRUD files and the plan are changed or committed; unrelated untracked workspace files remain untouched.

- [ ] **Step 4: Commit verification fixes if needed**

Run: `git add services/backend docs/superpowers/plans/2026-07-09-admin-fdc3-backend-crud.md && git commit -m "test: verify fdc3 admin crud backend"`

Only run this commit if verification required additional changes after Task 3.
