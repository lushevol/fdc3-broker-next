import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import { fetchParameters } from '../../app/fetchInputParameters.js';
import { loadConfig } from '../../app/knowledgeBaseConfig.js';
import { resolveKnowledgeBase } from '../../app/knowledgeBaseResolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Static constants ───────────────────────────────────────────────────────────

const TYPE_LABELS = {
  'service-bench-plugin-lit':             'UI - Plugin (Lit)',
  'service-bench-plugin-lit-ts':          'UI - Plugin (Lit + TypeScript)',
  'service-bench-plugin-react':           'UI - Plugin (React)',
  'service-bench-widget-lit-ts':          'UI - Widget (Lit + TypeScript)',
  'service-bench-experience-api-kotlin':  'API - Experience (Kotlin)',
  'service-bench-experience-api-java':    'API - Experience (Java)',
  'service-bench-experience-api-python':  'API - Experience (Python)',
  'service-bench-experience-api-golang':  'API - Experience (Go)',
  'service-bench-process-api-java':       'API - Process (Java)',
  'service-bench-process-api-kotlin':     'API - Process (Kotlin)',
  'service-bench-process-api-nodejs':     'API - Process (Node.js)',
  'service-bench-process-api-python':     'API - Process (Python)',
  'service-bench-process-api-golang':     'API - Process (Go)',
  'service-bench-mcp-process-api-java':   'MCP - Process API (Java)',
  'service-bench-mcp-process-api-kotlin': 'MCP - Process API (Kotlin)',
  'service-bench-batch-job-java':         'Batch Job (Java)',
  'service-bench-batch-job-python':       'Batch Job (Python)',
  'service-bench-notification':           'Notification Service',
  'webkit-basic':                         'Basic (No framework)',
  'webkit-basic-react':                   'Basic (React)',
  'webkit-basic-lit':                     'Basic (Lit)',
  'faas-java-quarkus':                    'Java (Quarkus)',
  'generic-process-api-java-quarkus':     'Java Quarkus Process API (OpenAPI)',
};

const CATEGORY_CHOICES = [
  { title: 'Service Bench', value: 'sb' },
  { title: 'WebKit',        value: 'webkit' },
  { title: 'FaaS',          value: 'faas' },
  { title: 'Generic',       value: 'generic' },
];

// Additional skill/agent group names to include per category that don't follow
// the standard "<category>-" prefix or "-<category>" suffix naming convention.
const CATEGORY_EXTRA_GROUPS = {
  sb:     ['sc-webkit','leap-kit'],
  webkit: ['sc-webkit'],
};

const CATEGORY_TYPES = {
  sb: [
    { title: 'UI - Plugin (Lit)',              value: 'service-bench-plugin-lit' },
    { title: 'UI - Plugin (Lit + TypeScript)', value: 'service-bench-plugin-lit-ts' },
    { title: 'UI - Plugin (React)',            value: 'service-bench-plugin-react' },
    { title: 'UI - Widget (Lit + TypeScript)', value: 'service-bench-widget-lit-ts' },
    { title: 'API - Experience (Kotlin)',      value: 'service-bench-experience-api-kotlin' },
    { title: 'API - Experience (Java)',        value: 'service-bench-experience-api-java' },
    { title: 'API - Experience (Python)',      value: 'service-bench-experience-api-python' },
    { title: 'API - Experience (Go)',          value: 'service-bench-experience-api-golang' },
    { title: 'API - Process (Java)',           value: 'service-bench-process-api-java' },
    { title: 'API - Process (Kotlin)',         value: 'service-bench-process-api-kotlin' },
    { title: 'API - Process (Node.js)',        value: 'service-bench-process-api-nodejs' },
    { title: 'API - Process (Python)',         value: 'service-bench-process-api-python' },
    { title: 'API - Process (Go)',             value: 'service-bench-process-api-golang' },
    { title: 'MCP - Process API (Java)',       value: 'service-bench-mcp-process-api-java' },
    { title: 'MCP - Process API (Kotlin)',     value: 'service-bench-mcp-process-api-kotlin' },
    { title: 'Batch Job (Java)',               value: 'service-bench-batch-job-java' },
    { title: 'Batch Job (Python)',             value: 'service-bench-batch-job-python' },
    { title: 'Notification Service',           value: 'service-bench-notification' },
  ],
  webkit: [
    { title: 'Basic (No framework)', value: 'webkit-basic' },
    { title: 'Basic (React)',        value: 'webkit-basic-react' },
    { title: 'Basic (Lit)',          value: 'webkit-basic-lit' },
  ],
  faas: [
    { title: 'Java (Quarkus)', value: 'faas-java-quarkus' },
  ],
  generic: [
    { title: 'Java Quarkus Process API (OpenAPI)', value: 'generic-process-api-java-quarkus' },
  ],
};

// ── Directory resolution ───────────────────────────────────────────────────────

/**
 * Build the ordered list of source directories for skills given a base dir,
 * category, and type. Only directories that actually exist are included.
 *
 * Load order: generic/ → <category>/ → <type>/
 * (later entries override earlier ones for same-name labels)
 *
 * @param {string} baseDir   – e.g. path to generators/ai-agent-skill/skills
 * @param {string} category  – e.g. 'sb', 'webkit', 'faas', 'generic'
 * @param {string} type      – e.g. 'service-bench-plugin-lit-ts'
 * @returns {string[]}
 */
function getSourceDirs(baseDir, category, type) {
  const dirs = [];
  const add = (sub) => {
    const d = path.join(baseDir, sub);
    if (fs.existsSync(d)) dirs.push(d);
  };
  add('generic');
  if (category && category !== 'generic') add(category);
  if (type && type !== category) add(type);
  return dirs;
}

/**
 * Collect all agent package directories from the knowledge-base agents root.
 *
 * knowledge-base agents structure:
 *   agents/
 *     sb-plugin-ui/        ← plugin-type group (prefix "sb-" matches category "sb")
 *       figma-to-scwebkit/ ← agent package (contains *.agent.md)
 *       sb-plugin-agent/   ← agent package
 *     sb-plugin-api/       ← another group with prefix "sb-"
 *       compile-to-native/ ← agent package
 *
 * For a given category (e.g. "sb"), this returns all agent package directories
 * nested under any first-level group whose name starts with "<category>-".
 *
 * @param {string} agentsBaseDir  – e.g. path to knowledge-base/agents or fallback agents/
 * @param {string} category       – e.g. 'sb', 'webkit', 'faas', 'generic'
 * @returns {string[]}  list of agent package directory paths
 */
function getAgentSourceDirs(agentsBaseDir, category) {
  const result = [];
  if (!fs.existsSync(agentsBaseDir)) return result;

  const prefix = `${category}-`;
  const suffix = `-${category}`;
  const extraGroups = CATEGORY_EXTRA_GROUPS[category] ?? [];

  for (const groupEntry of fs.readdirSync(agentsBaseDir, { withFileTypes: true })) {
    if (!groupEntry.isDirectory()) continue;
    // Match groups whose name starts with "<category>-" (e.g. "sb-plugin-ui"),
    // ends with "-<category>" (e.g. "sc-webkit" for "webkit"), exactly equals category,
    // or is listed in CATEGORY_EXTRA_GROUPS (e.g. "leap-kit" for "sb")
    if (!groupEntry.name.startsWith(prefix) && groupEntry.name !== category && !groupEntry.name.endsWith(suffix) && !extraGroups.includes(groupEntry.name)) continue;

    const groupDir = path.join(agentsBaseDir, groupEntry.name);
    for (const agentEntry of fs.readdirSync(groupDir, { withFileTypes: true })) {
      if (agentEntry.isDirectory()) {
        const agentDir = path.join(groupDir, agentEntry.name);
        result.push(agentDir);
      }
    }
  }

  return result;
}

// ── Template collectors (Map-based dedup) ─────────────────────────────────────

/**
 * Collect all agent packages from the agents base directory for a given category.
 *
 * Structure:
 *   agents/
 *     <category-group>/     ← group whose name starts with "<category>-"
 *       <agent-pkg>/        ← agent package (contains *.agent.md)
 *
 * Packages with the same name in different groups are kept as separate items,
 * keyed by "<group>/<pkg>" to avoid collision.
 *
 * @param {string} agentsBaseDir  – e.g. path to knowledge-base/agents or fallback agents/
 * @param {string} category       – e.g. 'sb', 'webkit', 'faas', 'generic'
 * @returns {{ label: string, srcDir: string }[]}
 */
function collectAgentItems(agentsBaseDir, category) {
  const map = new Map();
  if (!fs.existsSync(agentsBaseDir)) return [];
  const prefix = `${category}-`;
  const suffix = `-${category}`;
  const extraGroups = CATEGORY_EXTRA_GROUPS[category] ?? [];
  for (const groupEntry of fs.readdirSync(agentsBaseDir, { withFileTypes: true })) {
    if (!groupEntry.isDirectory()) continue;
    if (!groupEntry.name.startsWith(prefix) && groupEntry.name !== category && !groupEntry.name.endsWith(suffix) && !extraGroups.includes(groupEntry.name)) continue;
    const groupDir = path.join(agentsBaseDir, groupEntry.name);
    for (const agentEntry of fs.readdirSync(groupDir, { withFileTypes: true })) {
      if (!agentEntry.isDirectory()) continue;
      const agentDir = path.join(groupDir, agentEntry.name);
      const hasAgentFile = fs.readdirSync(agentDir, { withFileTypes: true }).some(
        (e) => e.isFile() && e.name.endsWith('.agent.md'),
      );
      if (hasAgentFile) {
        const key = `${groupEntry.name}/${agentEntry.name}`;
        const label = key;
        map.set(key, { label, srcDir: agentDir });
      }
    }
  }
  return [...map.values()];
}

/**
 * Collect all skill packages from the skills base directory for a given category.
 *
 * Structure:
 *   skills/
 *     <category-group>/     ← group whose name starts with "<category>-"
 *       <skill-pkg>/        ← skill package (contains SKILL.md)
 *
 * Packages with the same name in different groups are kept as separate items,
 * keyed by "<group>/<pkg>" to avoid collision.
 *
 * @param {string} skillsBaseDir  – e.g. path to knowledge-base/skills or fallback skills/
 * @param {string} category       – e.g. 'sb', 'webkit', 'faas', 'generic'
 * @returns {{ label: string, srcDir: string }[]}
 */
function collectSkillItems(skillsBaseDir, category) {
  const map = new Map();
  if (!fs.existsSync(skillsBaseDir)) return [];
  const prefix = `${category}-`;
  const suffix = `-${category}`;
  const extraGroups = CATEGORY_EXTRA_GROUPS[category] ?? [];
  for (const groupEntry of fs.readdirSync(skillsBaseDir, { withFileTypes: true })) {
    if (!groupEntry.isDirectory()) continue;
    if (!groupEntry.name.startsWith(prefix) && groupEntry.name !== category && !groupEntry.name.endsWith(suffix) && !extraGroups.includes(groupEntry.name)) continue;
    const groupDir = path.join(skillsBaseDir, groupEntry.name);
    for (const entry of fs.readdirSync(groupDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const skillDir = path.join(groupDir, entry.name);
      if (fs.existsSync(path.join(skillDir, 'SKILL.md'))) {
        const key = `${groupEntry.name}/${entry.name}`;
        map.set(key, { label: key, srcDir: skillDir });
      }
    }
  }
  return [...map.values()];
}

// ── Type detection / selection ─────────────────────────────────────────────────

/**
 * Attempt to read category+type from answers.xml; ask the user to confirm or
 * manually select if not found.
 * Returns { category, type } or null if the user cancels.
 *
 * @param {string} projectRoot
 * @returns {Promise<{ category: string, type: string } | null>}
 */
async function detectOrSelectProjectType(projectRoot) {
  let persisted = {};
  try {
    persisted = fetchParameters(projectRoot) ?? {};
  } catch {
    persisted = {};
  }

  const detectedCategory = persisted.category ?? null;
  // Filter out the sentinel value written by the ai-agent-skill action itself
  const detectedType =
    persisted.type && persisted.type !== 'ai-agent-skill' ? persisted.type : null;

  // Branch A: full info detected → confirm prompt
  if (detectedCategory && detectedType) {
    return _confirmDetected(detectedCategory, detectedType);
  }
  // Branch B: only category → select type
  if (detectedCategory) {
    return _selectType(detectedCategory);
  }
  // Branch C: nothing → full selection
  return _fullSelection();
}

async function _confirmDetected(category, type) {
  const typeLabel = TYPE_LABELS[type] ?? type;
  const catLabel  = CATEGORY_CHOICES.find((c) => c.value === category)?.title ?? category;
  const answer = await prompts({
    type: 'select',
    name: 'action',
    message: `Detected: ${chalk.cyan(typeLabel)} (${chalk.dim(catLabel)})`,
    choices: [
      { title: `Use this type  ${chalk.dim(`[${type}]`)}`, value: 'use' },
      { title: 'Choose a different type',                   value: 'change' },
    ],
    initial: 0,
  });
  if (answer.action === undefined) return null;
  if (answer.action === 'use') return { category, type };
  return _fullSelection();
}

async function _fullSelection() {
  const { category } = await prompts({
    type: 'select',
    name: 'category',
    message: 'Select project category:',
    choices: CATEGORY_CHOICES,
  });
  if (category === undefined) return null;
  return _selectType(category);
}

async function _selectType(category) {
  const choices = CATEGORY_TYPES[category] ?? [];
  if (choices.length === 0) {
    console.log(chalk.yellow(`  No types defined for category "${category}".`));
    return null;
  }
  // Single type (e.g. faas) → skip the prompt entirely
  if (choices.length === 1) {
    console.log(chalk.dim(`  Auto-selected: ${choices[0].title}`));
    return { category, type: choices[0].value };
  }
  const { type } = await prompts({
    type: 'select',
    name: 'type',
    message: 'Select project type:',
    choices,
  });
  if (type === undefined) return null;
  return { category, type };
}

// ── Knowledge-base resolution ────────────────────────────────────────────────

/**
 * Resolve the agents and skills base directories from Artifactory (or the
 * bundled fallback).  Returns null and logs an error when the remote is
 * unreachable and fallbackToLocal is false.
 *
 * @returns {Promise<{ agentsBaseDir: string, skillsBaseDir: string } | null>}
 */
async function resolveKnowledgeBaseDirs() {
  const kbConfig = loadConfig();
  try {
    const resolved = await resolveKnowledgeBase(kbConfig);
    return { agentsBaseDir: resolved.agentsDir, skillsBaseDir: resolved.skillsDir };
  } catch (err) {
    if (kbConfig.fallbackToLocal) {
      console.warn(chalk.yellow(`\n  ⚠  Remote knowledge-base unavailable: ${err.message}`));
      console.warn(chalk.yellow('     Falling back to bundled templates (may be outdated).\n'));
      return {
        agentsBaseDir: path.join(__dirname, 'agents'),
        skillsBaseDir: path.join(__dirname, 'skills'),
      };
    }
    console.error(chalk.red(`\n  ✖  Cannot load knowledge-base: ${err.message}`));
    console.error(chalk.red('     Set fallbackToLocal=true in ~/.scdevkit/config.json to use bundled templates.\n'));
    return null;
  }
}

// ── Utility helpers ───────────────────────────────────────────────────────────

/**
 * Detect .claude/ and .github/ directories in the given project root.
 * @param {string} projectRoot
 * @returns {{ hasClaude: boolean, hasGithub: boolean }}
 */
function detectAITargets(projectRoot) {
  return {
    hasClaude: fs.existsSync(path.join(projectRoot, '.claude')),
    hasGithub: fs.existsSync(path.join(projectRoot, '.github')),
  };
}

/**
 * Recursively collect all file paths inside a directory.
 * @param {string} dir
 * @returns {string[]}
 */
function collectFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Back up a file as <filePath>.bak before overwriting.
 * @param {string} filePath
 */
function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, `${filePath}.bak`);
  }
}

/**
 * Copy an entire agent package directory into targetDir/<agentName>/,
 * preserving internal subdirectory structure (rules/, resources/, etc.).
 * Backs up any pre-existing files with a .bak extension.
 *
 * @param {string} agentSrcDir  – source agent package directory path
 * @param {string} targetDir    – destination parent (e.g. .claude/agents/)
 * @returns {number} number of files copied
 */
function copyAgentDir(agentSrcDir, targetDir) {
  // If the agent package contains a `.flat` marker file, copy all files
  // directly into targetDir (flat layout) instead of a named subdirectory.
  // This is used for single-file agents (e.g. sb-plugin-agent) that must live
  // at the root of .github/agents/ so VS Code Copilot can discover them.
  const isFlat = fs.existsSync(path.join(agentSrcDir, '.flat'));
  const agentName = path.basename(agentSrcDir);
  const destBase = isFlat ? targetDir : path.join(targetDir, agentName);
  const files = collectFiles(agentSrcDir);
  let copied = 0;
  for (const srcFile of files) {
    // Skip the .flat marker itself — it's an internal convention, not a deliverable
    if (path.basename(srcFile) === '.flat') continue;
    const relative = path.relative(agentSrcDir, srcFile);
    const destFile = path.join(destBase, relative);
    const destParent = path.dirname(destFile);
    if (!fs.existsSync(destParent)) {
      fs.mkdirSync(destParent, { recursive: true });
    }
    backupFile(destFile);
    fs.copyFileSync(srcFile, destFile);
    console.log(chalk.green(`  ✔ ${path.relative(process.cwd(), destFile)}`));
    copied++;
  }
  return copied;
}

/**
 * Copy all files from a skill source dir into targetDir/<skillName>/,
 * preserving internal subdirectory structure.
 * @param {string} skillSrcDir
 * @param {string} targetDir
 * @returns {number} number of files copied
 */
function copySkillFiles(skillSrcDir, targetDir) {
  const skillName = path.basename(skillSrcDir);
  const destBase = path.join(targetDir, skillName);
  const files = collectFiles(skillSrcDir);
  for (const srcFile of files) {
    const relative = path.relative(skillSrcDir, srcFile);
    const destFile = path.join(destBase, relative);
    const destParent = path.dirname(destFile);
    if (!fs.existsSync(destParent)) {
      fs.mkdirSync(destParent, { recursive: true });
    }
    backupFile(destFile);
    fs.copyFileSync(srcFile, destFile);
    console.log(chalk.green(`  ✔ ${path.relative(process.cwd(), destFile)}`));
  }
  return files.length;
}

/**
 * Ask the user to multi-select from a list of choices.
 * All items are pre-selected by default.
 * Returns the selected values, or null if cancelled.
 * @param {string} message
 * @param {{ title: string, value: string }[]} choices
 * @returns {Promise<string[] | null>}
 */
async function multiSelect(message, choices) {
  const answer = await prompts({
    type: 'multiselect',
    name: 'selected',
    message,
    choices: choices.map((c) => ({ ...c, selected: true })),
    instructions: chalk.gray('  Space to toggle · A to select all · Enter to confirm'),
    min: 0,
  });
  // prompts returns undefined for 'selected' when the user hits Ctrl+C
  if (answer.selected === undefined) return null;
  return answer.selected;
}

// ── Main mixin ─────────────────────────────────────────────────────────────────

export const AIAgentSkillMixin = (subclass) =>
  class extends subclass {
    name() {
      return 'AIAgentSkill';
    }

    async execute() {
      await super.execute();

      const projectRoot = this.destinationPath
        ? (typeof this.destinationPath === 'function' ? this.destinationPath() : this.destinationPath)
        : process.cwd();

      console.log(chalk.cyan('\n🤖 AI Agents & Skills Update'));
      console.log(chalk.gray(`   Project root : ${projectRoot}\n`));

      // ── Step 0: Detect or select project category + type ──────────────────
      const projectType = await detectOrSelectProjectType(projectRoot);
      if (!projectType) {
        console.log(chalk.yellow('  Cancelled.'));
        return;
      }
      const { category, type } = projectType;

      console.log(chalk.gray(`   Category      : ${category}`));
      console.log(chalk.gray(`   Type          : ${type}\n`));

      // ── Step 1: Resolve available agents & skills ──────────────────────────
      // Try to pull the latest definitions from Artifactory (knowledge-base npm
      // package).  Falls back to the CLI's bundled templates when the remote is
      // unreachable or config.fallbackToLocal is true.
      const kbDirs = await resolveKnowledgeBaseDirs();
      if (!kbDirs) return;
      const { agentsBaseDir, skillsBaseDir } = kbDirs;

      // Agents: agents/<category-group>/<agent-pkg>/*.agent.md
      // Skills: skills/<category-group>/<skill-pkg>/SKILL.md
      const allAgents = collectAgentItems(agentsBaseDir, category);
      const allSkills = collectSkillItems(skillsBaseDir, category);

      if (allAgents.length === 0 && allSkills.length === 0) {
        console.log(chalk.yellow('  ⚠ No agent or skill templates found for this type. Nothing was copied.'));
        return;
      }

      // ── Step 2: Let user choose which agents to install ───────────────────
      let selectedAgents = [];
      if (allAgents.length > 0) {
        const chosen = await multiSelect(
          'Select agents to install:',
          allAgents.map((a) => ({ title: a.label, value: a.label })),
        );
        if (chosen === null) {
          console.log(chalk.yellow('  Cancelled.'));
          return;
        }
        selectedAgents = allAgents.filter((a) => chosen.includes(a.label));
      }

      // ── Step 3: Let user choose which skills to install ───────────────────
      let selectedSkills = [];
      if (allSkills.length > 0) {
        const chosen = await multiSelect(
          'Select skills to install:',
          allSkills.map((s) => ({ title: s.label, value: s.label })),
        );
        if (chosen === null) {
          console.log(chalk.yellow('  Cancelled.'));
          return;
        }
        selectedSkills = allSkills.filter((s) => chosen.includes(s.label));
      }

      if (selectedAgents.length === 0 && selectedSkills.length === 0) {
        console.log(chalk.yellow('\n  Nothing selected. No files were copied.'));
        return;
      }

      // ── Step 4: Ask where to install ──────────────────────────────────────
      const { hasClaude, hasGithub } = detectAITargets(projectRoot);
      let targets = []; // 'claude' | 'github'

      if (hasClaude && hasGithub) {
        const answer = await prompts({
          type: 'select',
          name: 'target',
          message: 'Both .claude/ and .github/ found. Where should the files be installed?',
          choices: [
            { title: 'Both .claude/ and .github/', value: 'both' },
            { title: 'Only .claude/', value: 'claude' },
            { title: 'Only .github/', value: 'github' },
          ],
        });
        if (!answer.target) {
          console.log(chalk.yellow('  Cancelled. No files were copied.'));
          return;
        }
        targets = answer.target === 'both' ? ['claude', 'github'] : [answer.target];
      } else if (hasClaude) {
        targets = ['claude'];
        console.log(chalk.blue('  Auto-targeting .claude/ (no .github/ found)'));
      } else if (hasGithub) {
        targets = ['github'];
        console.log(chalk.blue('  Auto-targeting .github/ (no .claude/ found)'));
      } else {
        const answer = await prompts({
          type: 'select',
          name: 'target',
          message: 'No .claude/ or .github/ found. Where should the files be created?',
          choices: [
            { title: 'Create .claude/', value: 'claude' },
            { title: 'Create .github/', value: 'github' },
            { title: 'Create both', value: 'both' },
          ],
        });
        if (!answer.target) {
          console.log(chalk.yellow('  Cancelled. No files were copied.'));
          return;
        }
        targets = answer.target === 'both' ? ['claude', 'github'] : [answer.target];
      }

      // ── Step 5: Copy selected files to each target ────────────────────────
      let totalCopied = 0;

      for (const target of targets) {
        const baseName = target === 'claude' ? '.claude' : '.github';
        const base = path.join(projectRoot, baseName);

        if (selectedAgents.length > 0) {
          const agentsTarget = path.join(base, 'agents');
          console.log(chalk.cyan(`\n  → Installing agents to ${baseName}/agents/`));
          for (const agent of selectedAgents) {
            totalCopied += copyAgentDir(agent.srcDir, agentsTarget);
          }
        }

        if (selectedSkills.length > 0) {
          const skillsTarget = path.join(base, 'skills');
          console.log(chalk.cyan(`\n  → Installing skills to ${baseName}/skills/`));
          for (const skill of selectedSkills) {
            totalCopied += copySkillFiles(skill.srcDir, skillsTarget);
          }
        }
      }

      if (totalCopied === 0) {
        console.log(chalk.yellow('\n  ⚠ No files were copied.'));
      } else {
        console.log(chalk.green(`\n  ✅ Done! ${totalCopied} file(s) installed.`));
        console.log(chalk.gray('  Existing files were backed up with a .bak extension.\n'));
      }
    }
  };

/**
 * Programmatically install all agents and skills for the given category into a
 * target directory (e.g. .github).  Loads definitions from Artifactory when
 * available, falling back to the bundled templates when not.
 *
 * @param {{ category: string, type?: string, targetDir: string }} options
 * @returns {Promise<void>}
 */
export async function installAgentsAndSkills({ category, type, targetDir }) {
  const kbDirs = await resolveKnowledgeBaseDirs();
  if (!kbDirs) return;
  const { agentsBaseDir, skillsBaseDir } = kbDirs;

  const allAgents = collectAgentItems(agentsBaseDir, category);
  const allSkills = collectSkillItems(skillsBaseDir, category);

  if (allAgents.length === 0 && allSkills.length === 0) {
    console.log(chalk.yellow('  ⚠ No agent or skill templates found for this category. Nothing was copied.'));
    return;
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (allAgents.length > 0) {
    const agentsTarget = path.join(targetDir, 'agents');
    console.log(chalk.cyan(`\n  → Installing agents to ${path.basename(targetDir)}/agents/`));
    for (const agent of allAgents) {
      copyAgentDir(agent.srcDir, agentsTarget);
    }
  }

  if (allSkills.length > 0) {
    const skillsTarget = path.join(targetDir, 'skills');
    console.log(chalk.cyan(`\n  → Installing skills to ${path.basename(targetDir)}/skills/`));
    for (const skill of allSkills) {
      copySkillFiles(skill.srcDir, skillsTarget);
    }
  }
}
