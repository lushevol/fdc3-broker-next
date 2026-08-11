# Security Fix Agent

Automatic security scanning and fixing for Service Bench plugin projects.

## Usage

**Trigger:** User types `fix`, `scan`, `security`, or `validate` in Copilot Chat.

**Input:** None required. The agent operates on the current project root.

**Output:**
1. Summary of detected issues
2. Single confirmation before making any changes
3. All fixes applied at once
4. Report of what was changed, what was skipped, and what needs manual action

---

## Workflow

### Step 1 — Run the Scanner (and npm fix if triggered by `fix`)

**Branch based on what the user originally typed:**

- If the user typed **`fix`** or **`security-fix`** — run this single command:
  ```
  cmd /c "npx @scdevkit/cli@latest --action validate < NUL 2>&1"; npm audit fix 2>&1; git diff package-lock.json | Select-String -Pattern '^(@@|\s+"node_modules/|[-+]\s+"version")' | ForEach-Object { $_.Line } | Select-String -Pattern 'node_modules/|"version"'; Get-Content package.json | ConvertFrom-Json | Select-Object -Property dependencies, devDependencies | ConvertTo-Json -Depth 3
  ```
  This runs the scan, fixes npm vulnerabilities (without `--force`), and captures diff/scope data for the report — all in one confirmation.

- If the user typed **`scan`**, **`security`**, or **`validate`** — run only:
  ```
  cmd /c "npx @scdevkit/cli@latest --action validate < NUL 2>&1"
  ```
  Do **not** run `npm audit fix` at this stage.

If the output shows no issues (and no npm changes):
> ✅ No issues found. Your project is compliant.

Stop.

**If the scanner crashes before producing a Validation Result Summary** (e.g. a YAML parse error, file not found, or any unhandled exception):
- Read the error message to identify which file caused the crash and the exact line/column
- Fix **only** the specific syntax error at that location. Do **not** restructure sections, add blocks, remove content, or change any field values — touch nothing beyond the minimum characters needed to make the YAML valid
- Do **not** use `git` to restore files — fix in place from the current content
- Only re-run the scanner once after the crash is resolved to get the actual issue list
- Count this re-run as the one scan for this session — do not run any terminal command again after fixes are applied

---

### Step 2 — Present Issues & Decide

Display the issues exactly as reported by the CLI output:

```
🔍 Scan complete. Found the following issues:

  <issue message from CLI output>
  ...
```

Treat every reported message as an issue — do not dismiss any based on severity count or judgment.

**Branch based on what the user originally typed:**

- If the user typed **`fix`** or **`security-fix`** → npm audit fix already ran in Step 1. Reply "Applying fixes now..." and proceed directly to Step 3.
- If the user typed **`scan`**, **`security`**, or **`validate`** → ask once:

  > Reply **fix** to fix all issues.

  Wait for the user's reply. Do not touch any file until the user responds.
  - No reply or anything other than **fix** → do nothing, stop.
  - **fix** or **yes** → run the npm fix command before proceeding to Step 3:
    ```
    npm audit fix 2>&1; git diff package-lock.json | Select-String -Pattern '^(@@|\s+"node_modules/|[-+]\s+"version")' | ForEach-Object { $_.Line } | Select-String -Pattern 'node_modules/|"version"'; Get-Content package.json | ConvertFrom-Json | Select-Object -Property dependencies, devDependencies | ConvertTo-Json -Depth 3
    ```
    Then proceed to Step 3.

---

### Step 3 — Apply All Fixes

Apply fixes for **all** detected issues in a single pass. Do not ask for per-issue or per-file confirmation.

**For each issue reported by the CLI, derive the fix directly from the CLI output message.** The message tells you exactly what is wrong — use it as the source of truth. Do not rely on hardcoded knowledge of what each validator checks.

Examples of how to interpret CLI messages:
- `"<field> is not set to <value>"` → set that field to that value in the indicated file
- `"<field> should not be set"` → remove that field from the indicated file
- `"<field> = <x>, is older than recommended version: <y>"` → update that field's value to `<y>`
- `"<file> is no longer required"` → delete that file
- `"Found <N> critical vulnerabilities"` → npm audit fix already ran in Step 1; use the output captured there for the report"` → remove that specific environment entry from `deployEnvironments`; if removal could cause a regression, flag as ⚠️ instead
- If a message is ambiguous or cannot be safely resolved from the message alone → flag as ⚠️ for manual review

Apply config file changes. Do not run any further terminal commands.

**Hard constraints:**
- Only modify config files; never modify any file under `src/`
- Do **not** run `npm audit fix --force`
- If a file cannot be read or parsed, skip that fix and record the error as ⚠️
- Do **not** re-scan after fixing. Proceed directly to Step 4.

---

### Step 4 — Output the Report

Output this report after fixes are applied. Only include sections for issues that were actually detected. Populate all values from real results — do not invent values.

```
╔══════════════════════════════════════════════════════════╗
║          SB SECURITY SCAN — AUTO-FIX REPORT              ║
╚══════════════════════════════════════════════════════════╝
Scanned at : <timestamp>
Project    : <absolute project path>
Files Changed : <list every file that was modified or deleted, one per line, or "none" if fixes were not applied>

──────────────────────────────────────────────────────────
<Issue ID> — <Issue name>
──────────────────────────────────────────────────────────
  ✅  <description of what was fixed>
  ⚠️  <what could not be auto-fixed — reason — action required>
  ℹ️  <informational note, e.g. transitive dependency, potential break change>

  (For npm audit only, also include:)
  ✅  npm audit fix applied — `npm audit fix --force` was NOT run
  Changed packages:
    <name>  <before version> → <after version>  [<dependencies|devDependencies|transitive>]
    ...
  ⚠️  <name>  not fixed — requires --force (breaking change) — manual review needed

══════════════════════════════════════════════════════════
NEXT STEPS REQUIRED FROM DEVELOPER
══════════════════════════════════════════════════════════
  (List only items that actually need developer action based on this run)
  1. [ ] <action>
  ...
  N. [ ] Run `npm run test` to confirm no regressions
══════════════════════════════════════════════════════════
```
