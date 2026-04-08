# Package Version Management & Publishing Guide

This monorepo uses [Changesets](https://github.com/changesets/changesets) for multi-package version management and Azure DevOps pipelines for automated NPM publishing.

---

## Quick Reference

| Command                 | Description                                   |
| ----------------------- | --------------------------------------------- |
| `yarn changeset`        | Create a new changeset (after making changes) |
| `yarn changeset status` | View pending changesets and version bumps     |
| `yarn version`          | Apply changesets and bump versions locally    |
| `yarn release`          | Build packages and publish to NPM             |

---

## Workflow Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Make Changes   │───▶│ Create Changeset│───▶│   Open PR       │
│  to packages/   │    │ yarn changeset  │    │                 │
└─────────────────┘    └─────────────────┘    └────────┬────────┘
                                                       │
                       ┌─────────────────┐    ┌────────▼────────┐
                       │  Publish to NPM │◀───│  Merge to main  │
                       │  (automatic)    │    │                 │
                       └─────────────────┘    └─────────────────┘
```

---

## Step-by-Step Guide

### 1. Making Package Changes

When you modify code in any package under `packages/`:

```bash
# Example: fixing a bug in fdc3-broker
cd packages/fdc3-broker
# ... make your changes ...
```

### 2. Creating a Changeset

After making changes, create a changeset to document the change:

```bash
yarn changeset
```

This interactive CLI will ask:

1. **Which packages should be included?**
   - Use arrow keys to navigate, space to select
   - Select all packages affected by your change

2. **What type of version bump?**
   - `patch` (0.0.X) — Bug fixes, minor changes
   - `minor` (0.X.0) — New features, backwards-compatible
   - `major` (X.0.0) — Breaking changes

3. **Summary of changes**
   - Write a brief description (appears in CHANGELOG)

**Example output:**

```
🦋  Which packages would you like to include?
   ◯ ratan-fdc3-agent
   ◉ ratan-fdc3-broker
   ◯ ratan-fdc3-app-directory
   ◯ ratan-fdc3-resolver-ui

🦋  Which packages should have a major bump?
   (leave empty for minor/patch)

🦋  Which packages should have a minor bump?
   (leave empty for patch)

🦋  Please enter a summary for this change:
   Fixed memory leak in intent listener cleanup
```

This creates a file like `.changeset/fuzzy-lions-dance.md`:

```markdown
---
'ratan-fdc3-broker': patch
---

Fixed memory leak in intent listener cleanup
```

### 3. Commit the Changeset

Commit the changeset file along with your code changes:

```bash
git add .changeset/fuzzy-lions-dance.md
git add packages/fdc3-broker/src/broker.ts
git commit -m "fix(broker): memory leak in intent listener cleanup"
```

### 4. Open a Pull Request

Push your branch and open a PR to `main`. The PR pipeline will:

- ✅ Build all packages
- ✅ Run tests
- ⚠️ Warn if package files changed without a changeset

### 5. Merge and Release (Automatic)

When your PR is merged to `main`, the release pipeline automatically:

1. Finds all changeset files in `.changeset/`
2. Bumps package versions in `package.json` files
3. Generates/updates `CHANGELOG.md` for each package
4. Commits the version changes
5. Publishes updated packages to NPM

---

## Special Cases

### Empty Changesets (Non-Release Changes)

For changes that shouldn't trigger a release (docs, tests, internal refactors):

```bash
yarn changeset --empty
```

This creates a changeset that documents the change without bumping versions.

### Checking Pending Changesets

View what versions will be bumped:

```bash
yarn changeset status
```

**Example output:**

```
🦋  info Packages to be bumped at patch:
🦋  - ratan-fdc3-broker

🦋  packages will be released:
🦋  ratan-fdc3-broker: 0.0.1 → 0.0.2
```

### Linked Packages

The FDC3 packages are **linked**, meaning if one gets a major bump, they all do:

- `ratan-fdc3-broker`
- `ratan-fdc3-agent`
- `ratan-fdc3-app-directory`
- `ratan-fdc3-resolver-ui`

This ensures compatible versions across the suite.

### Manual Version Bump & Publish

If you need to manually apply versions and publish (not recommended for normal workflow):

```bash
# 1. Apply changesets locally
yarn version

# 2. Review the changes
git diff

# 3. Build and publish
yarn release
```

---

## Configuration

### Changeset Config (`.changeset/config.json`)

| Setting      | Value                    | Description                                              |
| ------------ | ------------------------ | -------------------------------------------------------- |
| `access`     | `restricted`             | Packages are private (change to `public` for public npm) |
| `baseBranch` | `main`                   | Branch that triggers releases                            |
| `linked`     | FDC3 packages            | Packages that version together                           |
| `ignore`     | `ratan-design`, `mf_lib` | Private packages excluded from releases                  |

### Adding a New Publishable Package

1. Ensure `package.json` has:
   - Unique `name`
   - `"version": "0.0.0"` (or starting version)
   - `"files"` array specifying what to publish
   - NO `"private": true`

2. If it should be linked with other packages, update `.changeset/config.json`:

   ```json
   "linked": [
     ["existing-package", "new-package"]
   ]
   ```

3. If it should NOT be published, add to ignore list:
   ```json
   "ignore": ["new-private-package"]
   ```

---

## Troubleshooting

### "No changesets found" Error

```
🦋  error Some packages have been changed but no changesets were found.
```

**Solution**: Run `yarn changeset` to create one, or `yarn changeset --empty` if no release needed.

### Package Not Publishing

Check:

1. Package is NOT in `.changeset/config.json` `ignore` list
2. Package does NOT have `"private": true` in its `package.json`
3. `NPM_TOKEN` is configured in Azure DevOps pipeline variables

### Version Not Bumping

Changesets only bump versions when merged to `main`. Check:

1. Changeset file exists in `.changeset/` directory
2. Changeset includes the correct package name
3. PR was merged (not closed)

---

## Azure DevOps Pipeline Setup

### Required Pipeline Variables

Configure these in your ADO pipeline settings:

| Variable    | Description                              |
| ----------- | ---------------------------------------- |
| `NPM_TOKEN` | NPM access token with publish permission |

### Pipeline Files

| File                          | Purpose                                               |
| ----------------------------- | ----------------------------------------------------- |
| `azure-pipelines-release.yml` | Runs on `main` push, handles versioning & publishing  |
| `azure-pipelines-pr.yml`      | Runs on PRs, validates builds & checks for changesets |

To set up in Azure DevOps:

1. Go to Pipelines → New Pipeline
2. Select your repository
3. Choose "Existing Azure Pipelines YAML file"
4. Select `azure-pipelines-release.yml` or `azure-pipelines-pr.yml`
5. Save and run
