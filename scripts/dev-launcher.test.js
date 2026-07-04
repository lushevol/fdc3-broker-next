const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  SERVICE_REGISTRY,
  createLaunchPlan,
  formatDryRun,
  parseArgs,
} = require('./dev-launcher');

const rootDir = path.resolve(__dirname, '..');

test('selects chatbot and flowzero MCP from flags', () => {
  const plan = createLaunchPlan(parseArgs(['--chatbot', '--flowzero-mcp', '--no-stop']));

  assert.equal(plan.profile, 'dev');
  assert.equal(plan.shouldStopFirst, false);
  assert.deepEqual(
    plan.components.map((component) => component.id),
    ['flowzero-mcp', 'chatbot'],
  );
});

test('flowzero chatbot preset selects UI, FlowZero MCP, chatbot, and model validation', () => {
  const plan = createLaunchPlan(parseArgs(['--preset', 'flowzero-chatbot']));

  assert.equal(plan.profile, 'flowzero-chatbot');
  assert.equal(plan.validateChatbotModel, true);
  assert.deepEqual(
    plan.components.map((component) => component.id),
    ['ui', 'flowzero-mcp', 'chatbot'],
  );
});

test('chatbot waits for selected dependency health checks', () => {
  const plan = createLaunchPlan(
    parseArgs(['--chatbot', '--memory', '--elasticsearch-mcp', '--no-stop']),
  );
  const chatbotCommand = plan.commands.find((command) => command.id === 'chatbot');

  assert.ok(chatbotCommand.command.includes('http://127.0.0.1:8084/actuator/health'));
  assert.ok(chatbotCommand.command.includes('http://127.0.0.1:8090/actuator/health'));
  assert.ok(chatbotCommand.command.endsWith('npm --workspace services/chatbot-backend run dev:local'));
});

test('--all includes UI and every service', () => {
  const plan = createLaunchPlan(parseArgs(['--all', '--no-stop']));
  const selectedIds = plan.components.map((component) => component.id);

  assert.deepEqual(selectedIds, Object.keys(SERVICE_REGISTRY));
});

test('dry run includes profile, components, ports, and commands', () => {
  const plan = createLaunchPlan(parseArgs(['--dry-run', '--chatbot', '--memory', '--no-stop']));
  const output = formatDryRun(plan);

  assert.equal(plan.dryRun, true);
  assert.match(output, /Profile: dev/);
  assert.match(output, /memory\s+8084/);
  assert.match(output, /chatbot\s+8080/);
  assert.match(output, /npm --workspace services\/chatbot-backend run dev:local/);
});

test('unknown preset fails with a clear error', () => {
  assert.throws(
    () => createLaunchPlan(parseArgs(['--preset', 'missing-demo'])),
    /Unknown preset "missing-demo"/,
  );
});

test('every service component has an aligned workspace dev script', () => {
  for (const component of Object.values(SERVICE_REGISTRY)) {
    if (!component.workspace) {
      continue;
    }

    const packagePath = path.join(rootDir, component.workspace, 'package.json');
    assert.equal(fs.existsSync(packagePath), true, `${component.workspace} package.json exists`);

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    assert.equal(typeof packageJson.scripts?.dev, 'string', `${component.id} has dev script`);
  }
});

test('root package exposes dev:smart and preserves existing dev scripts', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

  assert.equal(packageJson.scripts['dev:smart'], 'node scripts/dev-launcher.js');
  assert.equal(typeof packageJson.scripts.dev, 'string');
  assert.equal(typeof packageJson.scripts['dev:services'], 'string');
  assert.equal(typeof packageJson.scripts['dev:flowzero-chatbot'], 'string');
});

test('stop script covers every launched service port', () => {
  const stopScript = fs.readFileSync(path.join(rootDir, 'scripts/stop-ports.js'), 'utf8');
  const portMatch = stopScript.match(/const PORTS = \[([^\]]+)\]/);
  assert.ok(portMatch, 'stop-ports.js exposes a PORTS array');

  const stopPorts = portMatch[1]
    .split(',')
    .map((value) => Number(value.trim()))
    .filter(Boolean);
  const servicePorts = Object.values(SERVICE_REGISTRY).map((component) => component.port);

  for (const port of servicePorts) {
    assert.ok(stopPorts.includes(port), `stop script includes port ${port}`);
  }
});
