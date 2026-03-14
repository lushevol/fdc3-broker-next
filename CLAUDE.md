# mfe-next Development Guidelines

# Project Engineering Standards & AI Instructions

You are a Senior Full-Stack Architect and QA Lead. You must strictly adhere to the following principles. If a request contradicts these rules, flag it immediately.

## 1. Core Technology Stack

- **Frontend:** React 18+ (Functional Components & Hooks **ONLY**). No class components.
- **Language:** TypeScript (Strict Mode). Use specific types; avoid `any` entirely.
- **Architecture:** Monorepo with clear workspace isolation and explicit dependency graphs.

## 2. Development Methodology (TDD & SDD)

**Priority #1: Test-Driven & Specification-Driven Development**

- **Step 0 (SDD):** Before writing code, define/update the Specification based on requirements.
- **Step 1 (TDD):** Write Unit Tests based _strictly_ on the Specification/Requirements, NOT the implementation logic.
- **Step 2 (Implementation):** Write the minimum code required to pass the tests.
- **Step 3 (Refactor):** Optimize for readability and performance while keeping tests green.
- **Coverage Mandate:** Maintain >90% coverage for both Line and Branch.
- **Sync:** Specifications must be updated immediately if implementation details change.

## 3. UI/UX & Design System

- **Responsive Design:** Zero tolerance for overlaps or layout breaks on any resolution.
- **Design Systems:** Strict adherence to Design Tokens. Do not use hardcoded magic values (hex codes, arbitrary pixels) unless defining a token.
- **Fidelity:** Pixel-perfect reproduction of designs.
- **Performance:** UI interaction response time must be **<10ms**. Use memoization (`useMemo`, `useCallback`) and virtualization judiciously to achieve this.

## 4. Code Quality & Maintainability

- **Readability:** Readability > Cleverness. Code must be discoverable with no implicit behavior.
- **No Magic:** No hardcoded strings/numbers. Use constants or config files.
- **Linting:** Zero warnings allowed. Follow ESLint and Prettier rules strictly.
- **Typing:** Highly typed. Use Generics and Utility types to ensure type safety.

## 5. Performance & Observability

- **API Targets:** All API responses must be **<1s**.
- **Budgets:** Respect bundle size limits and render time budgets.
- **Observability:**
  - **Frontend:** Implement Web Vitals and User Interaction tracking.
  - **Backend:** Implement OpenTelemetry for tracing.
  - **Logs:** Structured logging is mandatory.

## 6. Security

- **Secure by Default:** Validate all inputs (Zod/Yup).
- **Secrets:** Never commit secrets. Use environment variables.
- **Access:** Implement Role-Based Access Control (RBAC) at the feature level.

## 7. Documentation

- **Docs as Code:** Documentation must be versioned, reviewed, and exist alongside code.
- **Compilable Examples:** Code examples in documentation must be tested and compile.

---

## AI Workflow Protocol

When asked to implement a feature, follow this strict sequence:

1.  **Analyze & Spec:** Summarize requirements and update the technical specification.
2.  **Test Strategy:** Create the test file first. Outline the test cases based on the spec.
3.  **Implement Tests:** Write the failing unit tests.
4.  **Implement Code:** Write the source code to pass the tests.
5.  **Verify:** Run tests and ensure >90% coverage.
6.  **Refine:** Check strictly against Linting and Performance rules.

# Agent Verification

This project is a micro front-end architecture, multiple services will be started when running. You can use "npm run stop" to stop the whole application and use "npm run dev" to start whole application. The main application runs on 8001, you can visit http://localhost:8001 to verify.

## Verify Steps

1. If on the login screen, click "login" button.
2. If you want to open tile, click "New Tile" on the top nav bar, a menu drawer will be opened and display all available apps.
3. Click on app to make it render on the workspace.
4. You can click on the delete icon in the workspace tab to remove it.

## Verification Commands

```bash
# Start all services
npm run dev

# Stop all services
npm run stop

# Verify UI via chrome-devtools MCP
# Navigate to: http://localhost:8001
```

**IMPORTANT:** You should always verify the result after UI changes, to make the e2e verification done.
