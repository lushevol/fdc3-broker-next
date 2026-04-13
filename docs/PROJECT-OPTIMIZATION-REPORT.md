# fdc3-broker-next Project Optimization Report

**Date**: 2025-04-11  
**Scope**: Full project structure audit — tool configs, specification systems, duplicate content, and stale artifacts  
**Status**: Findings + Recommendations

---

## Executive Summary

Over months of development with multiple AI-assisted tools (Claude Code, OpenAI Codex, Roo Code, and others), the project has accumulated **1.37 MB of duplicated tool configuration**, **3 identical root instruction files**, **2 competing specification systems**, and dozens of stale artifacts. This report identifies all issues, quantifies the bloat, and provides a prioritized cleanup plan that reduces ~130 markdown files to ~90 and eliminates ~1 MB of redundant configuration.

### Key Findings

| Finding                                                           | Severity    | Impact                           |
| ----------------------------------------------------------------- | ----------- | -------------------------------- |
| 6 duplicate tool-config directories (44 identical SKILL.md files) | 🔴 Critical | Wastes ~1MB, creates sync burden |
| 3 identical root instruction files                                | 🔴 Critical | Conflicting source of truth      |
| 2 competing specification systems (OpenSpec + SpecKit)            | 🟡 Moderate | Fragments project knowledge      |
| 1 legacy planning system (`docs/superpowers/`) overlapping specs  | 🟡 Moderate | 26 stale/orphaned files          |
| 21 OpenSpec spec dirs (5+ likely completed/stale)                 | 🟡 Moderate | Dead spec clutter                |
| 4 temporary/debug files at project root                           | 🟠 Low      | Noise and confusion              |

---

## 1. Tool Configuration Duplication 🔴

### 1.1 Directory Inventory

Six AI tool configuration directories exist at the project root, each duplicating the same OpenSpec and SpecKit skills:

| Directory   | Tool               | Size   | Skills      | Commands/Prompts       | Other                                  |
| ----------- | ------------------ | ------ | ----------- | ---------------------- | -------------------------------------- |
| `.claude/`  | Claude Code        | 356 KB | 11 OpenSpec | 10 (9 SpecKit + opsx/) | CLAUDE.md, settings.local.json         |
| `.codex/`   | OpenAI Codex       | 252 KB | 11 OpenSpec | 9 SpecKit prompts      | —                                      |
| `.agent/`   | Unknown AI agent   | 256 KB | 11 OpenSpec | 11 workflows           | 2 rules,                               |
| `.agents/`  | Another agent tool | 144 KB | 9 SpecKit   | —                      | —                                      |
| `.roo/`     | Roo Code           | 224 KB | 10 OpenSpec | 10 commands            | —                                      |
| `.specify/` | SpecKit CLI        | 140 KB | —           | —                      | constitution.md, 6 templates, scripts/ |

**Total**: 1,372 KB across 6 directories.

### 1.2 Skill Duplication Matrix

The same OpenSpec skills exist as identical copies across 4 directories:

| Skill                        | .claude | .codex | .agent | .roo | Copies |
| ---------------------------- | :-----: | :----: | :----: | :--: | :----: |
| openspec-apply-change        |    ✓    |   ✓    |   ✓    |  ✓   |   4    |
| openspec-archive-change      |    ✓    |   ✓    |   ✓    |  ✓   |   4    |
| openspec-bulk-archive-change |    ✓    |   ✓    |   ✓    |  ✓   |   4    |
| openspec-continue-change     |    ✓    |   ✓    |   ✓    |  ✓   |   4    |
| openspec-explore             |    ✓    |   ✓    |   ✓    |  ✓   |   4    |
| openspec-ff-change           |    ✓    |   ✓    |   ✓    |  ✓   |   4    |
| openspec-new-change          |    ✓    |   ✓    |   ✓    |  ✓   |   4    |
| openspec-onboard             |    ✓    |   ✓    |   ✓    |  ✓   |   4    |
| openspec-propose             |    ✓    |   ✓    |   ✓    |  ✓   |   4    |
| openspec-sync-specs          |    ✓    |   ✓    |   ✓    |  ✓   |   4    |
| openspec-verify-change       |    ✓    |   ✓    |   ✓    |  ✓   |   4    |

**11 skills × 4 copies = 44 identical SKILL.md files totaling ~354 KB**

SpecKit skills have 3副本 (`.agents/skills/`, `.claude/commands/`, `.codex/prompts/`) — 9 skills × 3 formats = 27 additional files.

### 1.3 Recommendation: Consolidate to Single Source

**Option A — Shared Config with Symlinks** (preserves multi-tool workflow):

```
.shared-ai-config/
├── skills/
│   ├── openspec/          # 11 skills, one copy
│   └── speckit/           # 9 skills, one copy
├── rules/
│   └── project-rules.md   # Single source of truth
└── commands/
    └── (consolidated commands)

# Symlink from each tool:
.claude/skills → ../../.shared-ai-config/skills
.codex/skills → ../../.shared-ai-config/skills
.agent/skills → ../../.shared-ai-config/skills
.roo/skills → ../../.shared-ai-config/skills
```

**Option B — Prune Unused Tools** (simpler, recommended if primarily using Claude Code):

```bash
# Keep only .claude/ and .specify/ (if SpecKit still needed)
rm -rf .codex/ .agent/ .agents/ .roo/ sigma/
```

**Savings**: ~1 MB config, ~71 redundant files eliminated.

---

## 2. Root Instruction File Triplication 🔴

### 2.1 Current State

Three files contain identical or near-identical project rules content:

| File                         | Lines | Content                                           |
| ---------------------------- | ----- | ------------------------------------------------- |
| `AGENTS.md` (root)           | 101   | Full project guidelines + verification            |
| `CLAUDE.md` (root)           | 101   | **Identical** to AGENTS.md                        |
| `.agent/rules/root-rules.md` | 67    | **Truncated copy** (missing verification section) |

A fourth file contains **different, valuable** content:

| File                | Lines | Content                                                               |
| ------------------- | ----- | --------------------------------------------------------------------- |
| `.claude/CLAUDE.md` | 153   | Architecture overview, port table, commands, Module Federation config |

### 2.2 Content Comparison

`AGENTS.md` and root `CLAUDE.md` are **byte-for-byte identical**:

- Both contain: Core Tech Stack, TDD & SDD methodology, UI/UX rules, Code Quality, Security, Documentation standards, Agent Verification commands
- Neither contains: Architecture details, port mappings, development commands, Module Federation configuration

`.claude/CLAUDE.md` contains **unique value**:

- Workspace structure with port mapping table
- Module Federation configuration patterns
- Development commands per MFE type
- Import map examples
- FDC3 communication patterns

### 2.3 Recommendation: Merge into Single `AGENTS.md`

```markdown
# AGENTS.md (PROPOSED STRUCTURE)

## Part 1: Project Engineering Standards

# (Current AGENTS.md content — unchanged)

## Part 2: Architecture & Development Reference

# (Content from .claude/CLAUDE.md — merged in)

# - Workspace structure

# - Port mapping table

# - Development commands

# - Module Federation configuration

# - Key files reference
```

Then delete:

- `CLAUDE.md` (root) — duplicated by `AGENTS.md`
- `.agent/rules/root-rules.md` — truncated duplicate
- `.claude/CLAUDE.md` — content merged into root `AGENTS.md`

**Savings**: 2–3 redundant files, single source of truth for project instructions.

---

## 3. Competing Specification Systems 🟡

### 3.1 OpenSpec vs SpecKit Overlap

Two specification frameworks operate in parallel, covering the same concerns:

| Feature                 | OpenSpec (`openspec/`)  | SpecKit (`.specify/`)              |
| ----------------------- | ----------------------- | ---------------------------------- |
| Project context         | `project.md` (57 lines) | `constitution.md` (291 lines)      |
| Specification templates | Built-in per change     | 6 explicit templates               |
| Change tracking         | ✅ 18+ archived changes | ❌ None                            |
| Active specs            | 21 feature directories  | 0 visible                          |
| Configuration           | `config.yaml`           | `init-options.json`                |
| Legal/governance        | Basic                   | Full amendment process, versioning |

**The problem**: OpenSpec tracks active and archived changes. SpecKit tracks principles and templates. They overlap on specs and plans but neither references the other.

### 3.2 Third Planning System: `docs/superpowers/`

An additional 26 files from the "superpowers" planning tool:

| Type          | Count | Date Range               |
| ------------- | ----- | ------------------------ |
| Plans         | 13    | 2026-03-11 to 2026-04-03 |
| Specs/Designs | 13    | Matching dates           |

These plans are for features that may already be implemented (chatbot work, dark theme, rsbuild migration, etc.) — they should be archived or removed.

### 3.3 Recommendation: Consolidate to OpenSpec

**Keep**: OpenSpec (active specs, change tracking, archived history)  
**Merge**: SpecKit constitution → `AGENTS.md` or `openspec/project.md`  
**Archive**: `docs/superpowers/` → move to `docs/archive/superpowers/` or remove  
**Delete**: `.specify/` once constitution content is preserved

```bash
# Step 1: Extract constitution content
# Merge .specify/memory/constitution.md principles into AGENTS.md

# Step 2: Archive superpowers plans
mkdir -p docs/archive/superpowers
mv docs/superpowers/* docs/archive/superpowers/

# Step 3: Remove SpecKit config (after constitution is preserved)
rm -rf .specify/
```

---

## 4. Stale and Temporary Artifacts 🟡🟠

### 4.1 OpenSpec Specs — Likely Completed

These 5 spec directories under `openspec/specs/` appear to be completed implementation tasks:

| Spec                     | Evidence of Completion                 |
| ------------------------ | -------------------------------------- |
| `css-cleanup`            | "cleanup" implies one-time task        |
| `css-extraction-tooling` | "tooling" implies build-phase work     |
| `clean-html-output`      | Implementation task, likely done       |
| `component-mapping`      | Analysis artifact, not ongoing feature |
| `layout-analysis`        | Analysis artifact, not ongoing feature |

**Recommendation**: Archive completed specs to `openspec/changes/archive/` to keep the active spec list clean.

### 4.2 Temporary/Debug Files at Root

| File                            | Lines | Nature                  | Recommendation                        |
| ------------------------------- | ----- | ----------------------- | ------------------------------------- |
| `cashflow-layout.md`            | 528   | DOM snapshot/debug dump | **Delete** — not real documentation   |
| `convert_base64_to_targz.sh`    | 32    | One-off utility script  | **Delete** or move to `scripts/util/` |
| `decode_base64.py`              | 30    | One-off utility script  | **Delete** or move to `scripts/util/` |
| `scripts/compress-and-slice.js` | —     | One-off utility         | **Delete** if no longer needed        |
| `scripts/revert-compressed.js`  | —     | One-off utility         | **Delete** if no longer needed        |

### 4.3 Incomplete/O orphaned Artifacts

| Item                    | Issue                               | Recommendation                |
| ----------------------- | ----------------------------------- | ----------------------------- |
| `skills/gds-ui-design/` | Only has `references/`, no SKILL.md | **Delete** — incomplete skill |
| `sigma/agent/`          | Unknown AI agent artifact           | **Delete** if unused          |
| `.changeset/`           | Legitimate (version management)     | **Keep**                      |
| `proxy/`                | Likely legitimate service           | **Keep**                      |

---

## 5. Documentation Structure Audit 🟡

### 5.1 Current Documentation Map

```
docs/
├── architecture/
│   ├── ARCHITECTURE.md
│   ├── ARCHITECTURE_DIAGRAMS.md
│   ├── PACKAGE_VERSIONING.md
│   ├── PERFORMANCE_ISSUES.md
│   └── PERFORMANCE_OPTIMIZATION.md
├── prd/
│   └── ai-chatbot-agent.md
├── previews/
│   ├── GDS-Leadership-Presentation.html
│   └── GDS-Migration-Analysis.md
├── QUICK_REFERENCE.md
└── superpowers/           ← STALE: superseded by OpenSpec
    ├── plans/ (13 files)
    └── specs/ (13 files)

openspec/
├── config.yaml
├── project.md
├── specs/ (21 directories)
└── changes/
    └── archive/ (18 items)

.specify/
├── init-options.json
├── memory/
│   └── constitution.md
├── scripts/
│   └── bash/
└── templates/ (6 templates)

specs/
└── 002-fdc3-interoperability/
    ├── checklists/
    ├── contracts/
    ├── data-model.md
    ├── plan.md
    ├── quickstart.md
    ├── research.md
    ├── spec.md
    └── tasks.md
```

### 5.2 Content Overlap Analysis

| Knowledge Domain          | Where It Lives (Duplicates)                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| Project engineering rules | `AGENTS.md`, `CLAUDE.md`, `.agent/rules/root-rules.md`, `.specify/memory/constitution.md` |
| Architecture overview     | `.claude/CLAUDE.md`, `docs/QUICK_REFERENCE.md`, `openspec/project.md`                     |
| Tech stack description    | `AGENTS.md`, `openspec/project.md`, `openspec/config.yaml`                                |
| Development commands      | `.claude/CLAUDE.md`, `README.md`, `AGENTS.md`                                             |
| Design principles         | `.specify/memory/constitution.md`, `AGENTS.md`                                            |
| Feature specifications    | `openspec/specs/`, `specs/002-*/`, `docs/superpowers/specs/`                              |
| Feature planning          | `openspec/changes/`, `docs/superpowers/plans/`                                            |

**Each domain has 2–4 overlapping sources. No single place gives a complete picture.**

---

## 6. Prioritized Action Plan

### Phase 1: Quick Wins (Low risk, high clarity impact)

| #   | Action                                                     | Risk | Effort | Savings             |
| --- | ---------------------------------------------------------- | ---- | ------ | ------------------- |
| 1.1 | Delete root `CLAUDE.md` (duplicate of `AGENTS.md`)         | None | 1 min  | 1 file              |
| 1.2 | Delete `.agent/rules/root-rules.md` (truncated duplicate)  | None | 1 min  | 1 file              |
| 1.3 | Merge `.claude/CLAUDE.md` content into `AGENTS.md`         | Low  | 15 min | 1 file consolidated |
| 1.4 | Delete `cashflow-layout.md` (debug dump)                   | None | 1 min  | 528 lines removed   |
| 1.5 | Delete `convert_base64_to_targz.sh` and `decode_base64.py` | None | 1 min  | 2 files             |
| 1.6 | Delete `skills/gds-ui-design/` (incomplete)                | None | 1 min  | ~12 KB              |

**Phase 1 Total**: 5–6 files removed, 528 lines of debug noise eliminated, single source of truth for project rules established.

### Phase 2: Specification Consolidation (Medium risk, structural improvement)

| #   | Action                                                                                  | Risk   | Effort | Savings                                      |
| --- | --------------------------------------------------------------------------------------- | ------ | ------ | -------------------------------------------- |
| 2.1 | Merge `.specify/memory/constitution.md` into `AGENTS.md` or `openspec/project.md`       | Low    | 30 min | Constitution preserved in canonical location |
| 2.2 | Delete `.specify/` (after 2.1)                                                          | Low    | 1 min  | 140 KB                                       |
| 2.3 | Archive `docs/superpowers/` to `docs/archive/superpowers/`                              | None   | 2 min  | 26 files moved out of active dirs            |
| 2.4 | Archive completed OpenSpec specs (5 identified)                                         | Low    | 10 min | 5 directories cleaned                        |
| 2.5 | Evaluate `specs/002-fdc3-interoperability/` vs `openspec/specs/` — merge or archive one | Medium | 30 min | Consolidated spec location                   |

**Phase 2 Total**: ~166 KB + 26 stale planning files archived, spec system consolidated to OpenSpec only.

### Phase 3: Tool Config Consolidation (Medium risk, largest savings)

| #    | Action                                                                              | Risk   | Effort | Savings             |
| ---- | ----------------------------------------------------------------------------------- | ------ | ------ | ------------------- |
| 3.1  | Determine which AI tools are actively used                                          | None   | 5 min  | —                   |
| 3.2a | **If only Claude Code**: Delete `.codex/`, `.agent/`, `.agents/`, `.roo/`, `sigma/` | Low\*  | 2 min  | ~772 KB, 44+ files  |
| 3.2b | **If multi-tool**: Create `.shared-ai-config/` with symlinks                        | Medium | 1 hour | ~1 MB logical dedup |
| 3.3  | Delete orphaned `.agent/workflows/` (11 files) if 3.2a                              | Low    | 1 min  | ~83 KB              |

_If tools are no longer used, there's zero risk in removing their configs. However, verify with the team first._

**Phase 3 Total**: Up to ~1 MB of duplicated configuration removed.

### Phase 4: Documentation Polish (Low risk, high readability)

| #   | Action                                                      | Risk | Effort | Outcome                          |
| --- | ----------------------------------------------------------- | ---- | ------ | -------------------------------- |
| 4.1 | Create consolidated `AGENTS.md` with full project reference | Low  | 30 min | Single onboarding document       |
| 4.2 | Verify `README.md` is current (it looks good)               | None | 5 min  | Confirmed accurate               |
| 4.3 | Add `.gitignore` entries for temp files if needed           | None | 2 min  | Prevent future temp file commits |

---

## 7. Metrics Summary

### Current State

| Metric                                               | Value        |
| ---------------------------------------------------- | ------------ |
| AI tool config directories                           | 6            |
| Total config size                                    | 1,372 KB     |
| Duplicate SKILL.md files                             | 44           |
| Duplicate SpecKit files                              | 27           |
| Root instruction files (identical content)           | 3            |
| Spec systems (competing)                             | 2            |
| Legacy planning directories                          | 1 (26 files) |
| OpenSpec specs (potentially stale)                   | 5+           |
| Temporary/debug root files                           | 3            |
| Total markdown files in project (excl. node_modules) | ~130         |

### Target State (After All Phases)

| Metric                       | Value               |
| ---------------------------- | ------------------- |
| AI tool config directories   | 1 (`.claude/` only) |
| Config size                  | ~350 KB             |
| Duplicate SKILL.md files     | 0                   |
| Duplicate SpecKit files      | 0                   |
| Root instruction files       | 1 (`AGENTS.md`)     |
| Spec systems                 | 1 (OpenSpec)        |
| Legacy planning directories  | 0 (archived)        |
| OpenSpec specs (active only) | ~16                 |
| Temporary/debug root files   | 0                   |
| Total markdown files         | ~90                 |

### Savings

| Category               | Before      | After       | Reduction |
| ---------------------- | ----------- | ----------- | --------- |
| Config size            | 1,372 KB    | ~350 KB     | **74%**   |
| Duplicate skill files  | 71          | 0           | **100%**  |
| Root instruction files | 3 identical | 1 canonical | **67%**   |
| Markdown files total   | ~130        | ~90         | **31%**   |
| Spec system overlap    | 2 systems   | 1 system    | **50%**   |

---

## 8. Risk Assessment

| Action                                        | Risk Level | Mitigation                                             |
| --------------------------------------------- | ---------- | ------------------------------------------------------ |
| Delete duplicate root instruction files       | 🟢 None    | Git tracks history; restore anytime                    |
| Delete debug/temp files                       | 🟢 None    | No functional code in these files                      |
| Archive stale specs                           | 🟢 Low     | Archive, don't delete; fully reversible                |
| Merge `.claude/CLAUDE.md` into `AGENTS.md`    | 🟡 Low     | Git diff review before committing                      |
| Delete unused tool directories                | 🟡 Medium  | Confirm with team which tools are still active         |
| Remove `.specify/` after merging constitution | 🟡 Medium  | Verify constitution content is preserved in target     |
| Consolidate `specs/` into `openspec/specs/`   | 🟠 Higher  | Requires迁移 of structured directories; test carefully |

**General principle**: Archive before deleting. Every removal should go through git commit so it's reversible.

---

## Appendix A: Full Directory Tree (AI Config Directories)

```
.claude/                          (356 KB)
├── CLAUDE.md                     ← UNIQUE (architecture + commands)
├── settings.local.json
├── commands/
│   ├── opsx/                     (directory)
│   ├── speckit.analyze.md
│   ├── speckit.checklist.md
│   ├── speckit.clarify.md
│   ├── speckit.constitution.md
│   ├── speckit.implement.md
│   ├── speckit.plan.md
│   ├── speckit.specify.md
│   ├── speckit.tasks.md
│   └── speckit.taskstoissues.md
└── skills/                       (11 OpenSpec skills)

.codex/                           (252 KB)
├── prompts/                      (9 SpecKit prompts)
└── skills/                       (11 OpenSpec skills, identical to .claude)

.agent/                           (256 KB)
├── rules/
│   ├── root-rules.md             ← DUPLICATE of AGENTS.md
│   └── verification-guide.md
├── skills/                       (11 OpenSpec skills, identical)
└── workflows/                    (11 opsx-*.md files)

.agents/                          (144 KB)
└── skills/                       (9 SpecKit skills)

.roo/                             (224 KB)
├── commands/                     (10 opsx-*.md files)
└── skills/                       (10 OpenSpec skills)

.specify/                         (140 KB)
├── init-options.json
├── memory/
│   └── constitution.md           (291 lines)
├── scripts/
│   └── bash/
└── templates/                    (6 files)

sigma/                            (16 KB)
└── agent/

skills/                           (12 KB)
└── gds-ui-design/                (INCOMPLETE — no SKILL.md)
    └── references/
```

## Appendix B: OpenSpec Specs Inventory

| Spec Directory                     | Likely Status        |
| ---------------------------------- | -------------------- |
| assistant-ui-integration           | 🟡 Active            |
| chatbot-backend                    | 🟡 Active            |
| chatbot-sidebar                    | 🟡 Active            |
| clean-html-output                  | 🔴 Likely completed  |
| component-mapping                  | 🔴 Analysis artifact |
| component-styles                   | 🟡 Active            |
| css-cleanup                        | 🔴 Likely completed  |
| css-extraction-tooling             | 🔴 Likely completed  |
| design-tokens                      | 🟡 Active            |
| fdc3-declaration                   | 🟡 Active            |
| generative-ui                      | 🟡 Active            |
| html-sanitization                  | 🟡 Active            |
| layout-analysis                    | 🔴 Analysis artifact |
| lazy-loading                       | 🟡 Active            |
| local-declarations                 | 🟡 Active            |
| local-loader                       | 🟡 Active            |
| openfin-bridge-intent-subscription | 🟡 Active            |
| postmessage-bridge                 | 🟡 Active            |
| repo-tooling                       | 🟡 Active            |
| user-channels                      | 🟡 Active            |
| workspace-management               | 🟡 Active            |

## Appendix C: Archived OpenSpec Changes

18 changes already archived in `openspec/changes/archive/`:

1. local-first-app-directory
2. migrate-to-yarn-lerna
3. migrate-to-npm-workspaces
4. add-postmessage-bridge
5. manage-fdc3-declarations
6. migrate-lint-format
7. use-local-fdc3-declarations
8. fix-fdc3-tests
9. add-open-tile-failure-alert
10. chatbot-sidebar-mfe-base
11. refactor-fdc3-packages
12. extract-css-from-html
13. html-sanitization-analysis
14. refactor-openfin-bridge-intent-subscription
15. remove-unused-css
16. migrate-chatbot-to-assistant-ui
17. refactor-chatbot-front-to-back-assistant-ui
18. enable-channels

---

_Report generated by Sisyphus — Project Optimization Audit_
