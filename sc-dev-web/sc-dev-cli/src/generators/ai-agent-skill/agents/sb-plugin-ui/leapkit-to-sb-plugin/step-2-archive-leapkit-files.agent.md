---
tools: ['execute/runInTerminal', 'execute/getTerminalOutput', 'edit/editFiles']
description: 'Step 2 of leapkit-to-sb-plugin migration — Archives all existing leap-kit React source files into _leapkit-archive/ and removes them from the active project, leaving a clean slate for the SB plugin structure.'
---

# Step 2 — Archive Existing Leap-Kit Files

## Role

You are archiving the original leap-kit React project files into a `_leapkit-archive/` directory at the project root, then removing them from the active workspace. This leaves a clean directory for the incoming SB plugin structure.

The archive is **preserved in the repository** as a reference — it is not deleted.

---

## Autonomous Execution Rules

- ✅ Execute all `mv` commands immediately without asking
- ✅ Create `_leapkit-archive/` if it does not exist
- ✅ Add `_leapkit-archive/` to `.gitignore` if requested, otherwise leave it tracked
- ❌ NEVER delete files — only move them into the archive folder
- ❌ NEVER touch `.git/`, `.github/`, `.env`, `.env.local`, or any IDE config (`.vscode/`, `.idea/`)
- ❌ NEVER archive `package-lock.json` or `yarn.lock` — delete those instead (they will be regenerated)

---

## What to Archive

Run the following commands **in sequence**, checking the exit code after each batch:

### Step 2A — Create archive root

```bash
mkdir -p _leapkit-archive
```

### Step 2B — Move source directories

```bash
# Application source (React pages, components, services, etc.)
[ -d src ]         && mv src         _leapkit-archive/src

# Existing tests (Enzyme / Jest)
[ -d test ]        && mv test        _leapkit-archive/test

# React build scripts (start.js, build.js, test.js)
[ -d scripts ]     && mv scripts     _leapkit-archive/scripts

# Webpack / CRA config directory
[ -d config ]      && mv config      _leapkit-archive/config

# Lite portal (public html, system.js, fonts, etc.)
[ -d lite-portal ] && mv lite-portal _leapkit-archive/lite-portal
```

### Step 2C — Move loose config files

```bash
# React/CRA-specific root files
[ -f setupProxy.js ]  && mv setupProxy.js  _leapkit-archive/setupProxy.js
[ -f setupTests.js ]  && mv setupTests.js  _leapkit-archive/setupTests.js
[ -f jest.config.js ] && mv jest.config.js _leapkit-archive/jest.config.js
```

### Step 2D — Archive (copy) package.json and pipeline YAML

Keep originals in place for Step 3 to read — copy (do not move) them into the archive for reference:

```bash
cp package.json              _leapkit-archive/package.json
cp azure-pipelines-npm.yml   _leapkit-archive/azure-pipelines-npm.yml 2>/dev/null || true
```

### Step 2E — Remove lockfiles from the active root

Lockfiles will be regenerated after `npm install` in Step 3:

```bash
[ -f package-lock.json ] && rm package-lock.json
[ -f yarn.lock ]         && rm yarn.lock
```

### Step 2F — Remove node_modules (optional but recommended)

```bash
[ -d node_modules ] && rm -rf node_modules
```

> **Note:** `node_modules` will be restored by `npm install` in Step 3 after the new `package.json` is written.

---

## Verify Clean State

After all moves, run:

```bash
ls -1
```

The root directory should contain only:
```
_leapkit-archive/
.github/
.git/              (hidden)
.gitignore         (if present)
.env.local         (if present — keep)
package.json       (original leap-kit — Step 3 will replace this)
azure-pipelines-npm.yml  (if present — Step 3 will replace this)
README.md          (if present — keep)
```

If any unexpected `src/`, `test/`, `scripts/`, `config/`, or `lite-portal/` directories remain in the root, move them into `_leapkit-archive/` now.

---

## .gitignore Update

If a `.gitignore` exists, check whether `_leapkit-archive/` is already listed:

```bash
grep -q '_leapkit-archive' .gitignore 2>/dev/null && echo "already ignored" || echo "not ignored"
```

**Do NOT add it to `.gitignore`** — the archive should be tracked in source control so the migration history is preserved. Only add it if the user explicitly requests it.

---

## Completion Message

```
✅ Archive complete.

Moved to _leapkit-archive/:
  src/           (React pages, components, services)
  test/          (Enzyme/Jest tests)
  scripts/       (CRA build scripts)
  config/        (Webpack config)
  lite-portal/   (public HTML shell)
  setupProxy.js
  setupTests.js
  jest.config.js
  package.json   (reference copy)
  azure-pipelines-npm.yml  (reference copy)

Removed:
  package-lock.json / yarn.lock  (will be regenerated)
  node_modules/                  (will be restored after npm install)

Active project root is now clean.

> Proceed to Step 3 to scaffold the SB plugin project structure.
```
