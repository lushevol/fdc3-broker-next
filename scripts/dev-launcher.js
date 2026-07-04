#!/usr/bin/env node

const { spawn, spawnSync } = require('node:child_process');

const WAIT_TIMEOUT_MS = 60000;

const SERVICE_REGISTRY = {
  ui: {
    id: 'ui',
    label: 'UI apps',
    port: 8001,
    healthUrl: 'http://127.0.0.1:8001/',
    command: 'npm run dev:ui',
    order: 10,
  },
  backend: {
    id: 'backend',
    label: 'Backend BFF',
    workspace: 'services/backend',
    port: 8088,
    healthUrl: 'http://127.0.0.1:8088/actuator/health',
    command: 'npm --workspace services/backend run dev',
    order: 20,
  },
  auth: {
    id: 'auth',
    label: 'Auth server',
    workspace: 'services/auth-server',
    port: 8082,
    healthUrl: 'http://127.0.0.1:8082/actuator/health',
    command: 'npm --workspace services/auth-server run dev',
    order: 30,
  },
  memory: {
    id: 'memory',
    label: 'Memory service',
    workspace: 'services/memory-service',
    port: 8084,
    healthUrl: 'http://127.0.0.1:8084/actuator/health',
    command: 'npm --workspace services/memory-service run dev',
    order: 40,
  },
  'elasticsearch-mcp': {
    id: 'elasticsearch-mcp',
    label: 'Elasticsearch MCP',
    workspace: 'services/elasticsearch-mcp-service',
    port: 8090,
    healthUrl: 'http://127.0.0.1:8090/actuator/health',
    command: 'npm --workspace services/elasticsearch-mcp-service run dev',
    order: 50,
  },
  rag: {
    id: 'rag',
    label: 'RAG knowledge base',
    workspace: 'services/rag-knowledge-base-service',
    port: 8091,
    healthUrl: 'http://127.0.0.1:8091/actuator/health',
    command: 'npm --workspace services/rag-knowledge-base-service run dev',
    order: 60,
  },
  'flowzero-mcp': {
    id: 'flowzero-mcp',
    label: 'FlowZero MCP',
    workspace: 'services/flowzero-mcp-service',
    port: 8092,
    healthUrl: 'http://127.0.0.1:8092/actuator/health',
    command: 'npm --workspace services/flowzero-mcp-service run dev',
    order: 70,
  },
  'flowzero-designer': {
    id: 'flowzero-designer',
    label: 'FlowZero designer',
    workspace: 'services/flowzero-designer-service',
    port: 11611,
    healthUrl: 'http://127.0.0.1:11611/actuator/health',
    command: 'npm --workspace services/flowzero-designer-service run dev',
    order: 80,
  },
  'flowzero-orchestration': {
    id: 'flowzero-orchestration',
    label: 'FlowZero orchestration',
    workspace: 'services/flowzero-orchestration-service',
    port: 11210,
    healthUrl: 'http://127.0.0.1:11210/actuator/health',
    command: 'npm --workspace services/flowzero-orchestration-service run dev',
    order: 90,
  },
  chatbot: {
    id: 'chatbot',
    label: 'Chatbot backend',
    workspace: 'services/chatbot-backend',
    port: 8080,
    healthUrl: 'http://127.0.0.1:8080/actuator/health',
    command: 'npm --workspace services/chatbot-backend run dev:local',
    order: 100,
  },
};

const PRESETS = {
  'flowzero-chatbot': {
    profile: 'flowzero-chatbot',
    components: ['ui', 'flowzero-mcp', 'chatbot'],
    validateChatbotModel: true,
  },
  'chatbot-memory-elasticsearch': {
    profile: 'dev',
    components: ['memory', 'elasticsearch-mcp', 'chatbot'],
  },
  services: {
    profile: 'dev',
    components: Object.keys(SERVICE_REGISTRY).filter((id) => id !== 'ui'),
  },
  'services-stub': {
    profile: 'stub',
    components: Object.keys(SERVICE_REGISTRY).filter((id) => id !== 'ui'),
  },
  full: {
    profile: 'dev',
    components: Object.keys(SERVICE_REGISTRY),
  },
};

const COMPONENT_FLAGS = new Map(
  Object.keys(SERVICE_REGISTRY).flatMap((id) => [
    [`--${id}`, { id, selected: true }],
    [`--no-${id}`, { id, selected: false }],
  ]),
);

function parseArgs(argv) {
  const options = {
    selected: new Map(),
    all: false,
    dryRun: false,
    shouldStopFirst: true,
    validateChatbotModel: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--profile') {
      options.profile = readValue(argv, (index += 1), arg);
      continue;
    }
    if (arg === '--preset') {
      options.preset = readValue(argv, (index += 1), arg);
      continue;
    }
    if (arg === '--all') {
      options.all = true;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--no-stop') {
      options.shouldStopFirst = false;
      continue;
    }
    if (arg === '--validate-chatbot-model') {
      options.validateChatbotModel = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    const componentFlag = COMPONENT_FLAGS.get(arg);
    if (componentFlag) {
      options.selected.set(componentFlag.id, componentFlag.selected);
      continue;
    }

    throw new Error(`Unknown argument "${arg}"`);
  }

  return options;
}

function readValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

function createLaunchPlan(options) {
  if (options.help) {
    return {
      help: true,
      profile: options.profile || 'dev',
      dryRun: options.dryRun,
      shouldStopFirst: false,
      validateChatbotModel: false,
      components: [],
      commands: [],
    };
  }

  const preset = resolvePreset(options.preset);
  const selected = new Map();

  if (preset) {
    for (const id of preset.components) {
      selected.set(id, true);
    }
  }
  if (options.all) {
    for (const id of Object.keys(SERVICE_REGISTRY)) {
      selected.set(id, true);
    }
  }
  for (const [id, isSelected] of options.selected.entries()) {
    selected.set(id, isSelected);
  }

  const componentIds = [...selected.entries()]
    .filter(([, isSelected]) => isSelected)
    .map(([id]) => id);

  if (componentIds.length === 0) {
    throw new Error('Select at least one component flag, --all, or --preset <name>');
  }

  const components = componentIds
    .map((id) => {
      const component = SERVICE_REGISTRY[id];
      if (!component) {
        throw new Error(`Unknown component "${id}"`);
      }
      return component;
    })
    .sort((left, right) => left.order - right.order);

  const profile = options.profile || preset?.profile || 'dev';
  const validateChatbotModel =
    options.validateChatbotModel || Boolean(preset?.validateChatbotModel);
  const selectedIds = new Set(components.map((component) => component.id));

  return {
    profile,
    dryRun: options.dryRun,
    shouldStopFirst: options.shouldStopFirst,
    validateChatbotModel,
    components,
    commands: components.map((component) => ({
      id: component.id,
      name: component.id,
      command: createComponentCommand(component, selectedIds),
    })),
  };
}

function resolvePreset(name) {
  if (!name) {
    return null;
  }

  const preset = PRESETS[name];
  if (!preset) {
    throw new Error(`Unknown preset "${name}". Available presets: ${Object.keys(PRESETS).join(', ')}`);
  }
  return preset;
}

function createComponentCommand(component, selectedIds) {
  if (component.id !== 'chatbot') {
    return component.command;
  }

  const waits = [...selectedIds]
    .filter((id) => id !== 'chatbot')
    .map((id) => SERVICE_REGISTRY[id])
    .filter((dependency) => dependency.healthUrl && dependency.id !== 'ui')
    .map(
      (dependency) =>
        `node scripts/wait-for-url.js ${dependency.healthUrl} ${WAIT_TIMEOUT_MS}`,
    );

  return [...waits, component.command].join(' && ');
}

function formatDryRun(plan) {
  const lines = [
    `Profile: ${plan.profile}`,
    `Stop first: ${plan.shouldStopFirst ? 'yes' : 'no'}`,
    `Validate chatbot model: ${plan.validateChatbotModel ? 'yes' : 'no'}`,
    'Components:',
  ];

  for (const component of plan.components) {
    lines.push(`  ${component.id.padEnd(24)} ${String(component.port).padEnd(5)} ${component.label}`);
  }

  lines.push('Commands:');
  for (const command of plan.commands) {
    lines.push(`  [${command.name}] ${command.command}`);
  }

  return lines.join('\n');
}

function printHelp() {
  console.log(`Usage: npm run dev:smart -- [options] [component flags]

Options:
  --preset <name>              Use a named preset: ${Object.keys(PRESETS).join(', ')}
  --profile <name>             Set ACTIVE_ENV, default dev or preset profile
  --all                        Start UI and every service
  --dry-run                    Print plan without starting services
  --no-stop                    Do not run npm run stop before launching
  --validate-chatbot-model     Validate real chatbot model configuration first
  --help                       Show this help

Components:
  ${Object.keys(SERVICE_REGISTRY).map((id) => `--${id}`).join('\n  ')}
`);
}

function runCommand(command, args, env) {
  return spawnSync(command, args, {
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  }).status;
}

function runCli(argv = process.argv.slice(2)) {
  let plan;
  try {
    plan = createLaunchPlan(parseArgs(argv));
  } catch (error) {
    console.error(error.message);
    console.error('Run npm run dev:smart -- --help for usage.');
    process.exitCode = 2;
    return;
  }

  if (plan.help) {
    printHelp();
    return;
  }

  if (plan.dryRun) {
    console.log(formatDryRun(plan));
    return;
  }

  const env = { ...process.env, ACTIVE_ENV: plan.profile };

  if (plan.shouldStopFirst) {
    const stopStatus = runCommand('npm', ['run', 'stop'], env);
    if (stopStatus !== 0) {
      process.exit(stopStatus || 1);
    }
  }

  if (plan.validateChatbotModel) {
    const validateStatus = runCommand('node', ['scripts/validate-chatbot-model-env.js'], env);
    if (validateStatus !== 0) {
      process.exit(validateStatus || 1);
    }
  }

  const child = spawn(
    'npx',
    [
      'concurrently',
      '--kill-others-on-fail',
      '--names',
      plan.commands.map((command) => command.name).join(','),
      ...plan.commands.map((command) => command.command),
    ],
    {
      env,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    },
  );

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

if (require.main === module) {
  runCli();
}

module.exports = {
  PRESETS,
  SERVICE_REGISTRY,
  createLaunchPlan,
  formatDryRun,
  parseArgs,
  runCli,
};
