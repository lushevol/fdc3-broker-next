#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { cpus, platform, arch, release } from 'node:os';
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { brotliCompressSync, gzipSync } from 'node:zlib';
import { chromium } from '@playwright/test';

import { createMockApiMiddleware } from '../devops/mock-bff/mock-api.mjs';

const scriptRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultBudgetPath = join(scriptRoot, 'performance/design-origin-budget.json');
const UI_PACKAGE_PREFIXES = [
  '@emotion/',
  '@mui/',
  '@ant-design/',
  'antd',
  'ratan-design-origin',
];

function parseArguments(argv) {
  const options = {
    baseUrl: 'http://127.0.0.1:9081',
    budgetPath: defaultBudgetPath,
    build: false,
    enforce: true,
    iterations: 3,
    outputPath: undefined,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--build') options.build = true;
    else if (argument === '--no-enforce') options.enforce = false;
    else if (argument === '--base-url') options.baseUrl = argv[++index];
    else if (argument === '--budget') options.budgetPath = resolve(argv[++index]);
    else if (argument === '--iterations') options.iterations = Number(argv[++index]);
    else if (argument === '--output') options.outputPath = resolve(argv[++index]);
    else if (argument === '--help') options.help = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!Number.isInteger(options.iterations) || options.iterations < 1) {
    throw new Error('--iterations must be a positive integer');
  }
  return options;
}

function run(command, args, environment = {}) {
  const result = spawnSync(command, args, {
    cwd: scriptRoot,
    env: { ...process.env, ...environment },
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with status ${result.status}`);
  }
}

function buildProductionWithMaps(baseUrl) {
  run('npm', ['run', 'build:packages']);
  run(
    'npm',
    [
      'run',
      'build',
      '--workspace',
      '@fm/ratan_cashflow_blotter-origin',
      '--',
      '--sourcemap',
      'hidden',
    ],
    { VITE_PUBLIC_BASE: '/remotes/cashflow/' },
  );
  run(
    'npm',
    [
      'run',
      'build',
      '--workspace',
      '@fm/ratan_container-origin',
      '--',
      '--sourcemap',
      'hidden',
    ],
    {
      VITE_PUBLIC_BASE: '/remotes/ratan/',
      VITE_CASHFLOW_REMOTE_URL: `${baseUrl}/remotes/cashflow/remoteEntry.js`,
    },
  );
  run(
    'npm',
    ['run', 'build', '--workspace', '@fm/base-origin', '--', '--sourcemap', 'hidden'],
    { VITE_RATAN_REMOTE_URL: `${baseUrl}/remotes/ratan/remoteEntry.js` },
  );
}

function walkFiles(directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...walkFiles(path));
    else result.push(path);
  }
  return result;
}

function dependencyFromSource(source) {
  const normalized = source.replaceAll('\\', '/');
  if (normalized.includes('/packages/ratan-design-origin/')) {
    return {
      module: normalized.split('/packages/ratan-design-origin/')[1],
      packageName: 'ratan-design-origin',
    };
  }
  const nodeModulesIndex = normalized.lastIndexOf('/node_modules/');
  if (nodeModulesIndex === -1) return undefined;
  let modulePath = normalized.slice(nodeModulesIndex + '/node_modules/'.length);
  if (modulePath.startsWith('.pnpm/')) {
    const nestedIndex = modulePath.indexOf('/node_modules/');
    if (nestedIndex === -1) return undefined;
    modulePath = modulePath.slice(nestedIndex + '/node_modules/'.length);
  }
  const parts = modulePath.split('/');
  const packageName = parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
  const module = parts.slice(packageName.startsWith('@') ? 2 : 1).join('/');
  return { module, packageName };
}

function isUiDependency(packageName) {
  return UI_PACKAGE_PREFIXES.some(
    (prefix) => packageName === prefix || packageName.startsWith(prefix),
  );
}

function summarize(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const percentile = (value) => sorted[Math.min(sorted.length - 1, Math.ceil(value * sorted.length) - 1)];
  return {
    min: sorted[0],
    median: percentile(0.5),
    p95: percentile(0.95),
    max: sorted.at(-1),
  };
}

function round(value, digits = 1) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

function aggregateIterations(iterations) {
  const numericKeys = Object.keys(iterations[0]).filter((key) => typeof iterations[0][key] === 'number');
  return Object.fromEntries(
    numericKeys.map((key) => [key, summarize(iterations.map((iteration) => iteration[key]))]),
  );
}

function collectStaticBuildMetrics() {
  const hosts = {
    base: join(scriptRoot, 'web/mfe-base-origin/dist'),
    ratan: join(scriptRoot, 'web/mfe-ratan-container-origin/dist'),
    cashflow: join(scriptRoot, 'web/mfe-cashflow-blotter-origin/dist'),
  };
  const moduleHosts = new Map();
  const hostMetrics = {};

  for (const [host, directory] of Object.entries(hosts)) {
    if (!existsSync(directory)) throw new Error(`Missing production output: ${directory}`);
    const transferFiles = walkFiles(directory).filter((file) => ['.js', '.css'].includes(extname(file)));
    const files = transferFiles.map((file) => {
      const bytes = readFileSync(file);
      return {
        path: relative(directory, file),
        rawBytes: bytes.length,
        gzipBytes: gzipSync(bytes, { level: 9 }).length,
        brotliBytes: brotliCompressSync(bytes).length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      };
    });
    for (const mapFile of walkFiles(directory).filter((file) => file.endsWith('.map'))) {
      const sourceMap = JSON.parse(readFileSync(mapFile, 'utf8'));
      for (const source of sourceMap.sources ?? []) {
        const dependency = dependencyFromSource(source);
        if (!dependency || !isUiDependency(dependency.packageName)) continue;
        const key = `${dependency.packageName}/${dependency.module}`;
        const record = moduleHosts.get(key) ?? { hosts: new Set(), packageName: dependency.packageName };
        record.hosts.add(host);
        moduleHosts.set(key, record);
      }
    }
    const total = (key) => files.reduce((sum, file) => sum + file[key], 0);
    hostMetrics[host] = {
      jsCssFiles: files.length,
      rawBytes: total('rawBytes'),
      gzipBytes: total('gzipBytes'),
      brotliBytes: total('brotliBytes'),
      largestGzipFiles: files
        .sort((left, right) => right.gzipBytes - left.gzipBytes)
        .slice(0, 10),
    };
  }

  const duplicatedModules = [...moduleHosts.entries()]
    .filter(([, value]) => value.hosts.size > 1)
    .map(([module, value]) => ({ module, hosts: [...value.hosts].sort(), packageName: value.packageName }));
  const duplicatedByPackage = {};
  for (const duplicate of duplicatedModules) {
    duplicatedByPackage[duplicate.packageName] = (duplicatedByPackage[duplicate.packageName] ?? 0) + 1;
  }
  return {
    hosts: hostMetrics,
    duplicatedUiModules: duplicatedModules.length,
    duplicatedUiModulesByPackage: Object.fromEntries(
      Object.entries(duplicatedByPackage).sort((left, right) => right[1] - left[1]),
    ),
  };
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function safeAssetPath(root, pathname) {
  const candidate = resolve(root, `.${pathname}`);
  return candidate === root || candidate.startsWith(`${root}${sep}`) ? candidate : undefined;
}

function startProductionEdge(port) {
  const roots = {
    base: join(scriptRoot, 'web/mfe-base-origin/dist'),
    cashflow: join(scriptRoot, 'web/mfe-cashflow-blotter-origin/dist'),
    ratan: join(scriptRoot, 'web/mfe-ratan-container-origin/dist'),
  };
  const mockApi = createMockApiMiddleware({ serviceName: 'design-origin-performance' });
  const server = createServer((request, response) => {
    const requestUrl = new URL(request.url ?? '/', `http://127.0.0.1:${port}`);
    if (requestUrl.pathname.startsWith('/api/')) {
      void mockApi(request, response, () => {
        response.statusCode = 404;
        response.end('Not found');
      });
      return;
    }

    let root = roots.base;
    let pathname = requestUrl.pathname;
    if (pathname.startsWith('/remotes/ratan/')) {
      root = roots.ratan;
      pathname = pathname.slice('/remotes/ratan'.length);
    } else if (pathname.startsWith('/remotes/cashflow/')) {
      root = roots.cashflow;
      pathname = pathname.slice('/remotes/cashflow'.length);
    }
    let file = safeAssetPath(root, pathname);
    if (file && existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!file || !existsSync(file)) file = root === roots.base ? join(root, 'index.html') : undefined;
    if (!file || !existsSync(file)) {
      console.error(`Performance edge 404: ${requestUrl.pathname}`);
      response.statusCode = 404;
      response.end('Not found');
      return;
    }

    const body = readFileSync(file);
    const contentType = mimeTypes[extname(file)] ?? 'application/octet-stream';
    const compressible = /^(?:text\/|application\/(?:javascript|json))/.test(contentType);
    const encoded = compressible && request.headers['accept-encoding']?.includes('gzip')
      ? gzipSync(body, { level: 9 })
      : body;
    response.statusCode = 200;
    response.setHeader('content-type', contentType);
    response.setHeader('content-length', encoded.length);
    response.setHeader(
      'cache-control',
      basename(file) === 'remoteEntry.js' || extname(file) === '.html'
        ? 'no-store, max-age=0'
        : 'public, max-age=31536000, immutable',
    );
    if (encoded !== body) {
      response.setHeader('content-encoding', 'gzip');
      response.setHeader('vary', 'Accept-Encoding');
    }
    response.end(encoded);
  });
  return new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolvePromise(server));
  });
}

function elapsedMs(start) {
  return round(Number(process.hrtime.bigint() - start) / 1_000_000);
}

async function measureIteration(browser, baseUrl, generation) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await context.addInitScript(() => {
    window.__designOriginLongTasks = [];
    new PerformanceObserver((list) => {
      window.__designOriginLongTasks.push(
        ...list.getEntries().map((entry) => ({ duration: entry.duration, startTime: entry.startTime })),
      );
    }).observe({ type: 'longtask', buffered: true });
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Performance.enable');
  const pageErrors = [];
  const consoleErrors = [];
  const failedRequests = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.url()}: ${request.failure()?.errorText ?? 'unknown failure'}`);
  });

  const navigationStart = process.hrtime.bigint();
  await page.goto(
    `${baseUrl}/?show_normal_login=Y&survey=no&new-styles=${generation === 'webkit'}`,
    { waitUntil: 'domcontentloaded' },
  );
  await page.getByPlaceholder('Enter Username').waitFor();
  const loginReadyMs = elapsedMs(navigationStart);
  await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
  await page.getByPlaceholder('Enter Password').fill('acceptance');
  const shellStart = process.hrtime.bigint();
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByText('New Tile', { exact: true }).waitFor();
  const shellReadyMs = elapsedMs(shellStart);
  await page.getByText('New Tile', { exact: true }).click();
  const tileStart = process.hrtime.bigint();
  await page.getByText('Cashflow Blotter', { exact: true }).click();
  try {
    await page.getByText('CF-ACCEPT-001', { exact: true }).waitFor({ timeout: 20_000 });
  } catch (error) {
    throw new Error(
      `${error.message}\nPage errors: ${pageErrors.join('; ') || 'none'}\n` +
        `Console errors: ${consoleErrors.join('; ') || 'none'}\n` +
        `Failed requests: ${failedRequests.join('; ') || 'none'}`,
    );
  }
  const coldTileMs = elapsedMs(tileStart);

  const expectedGeneration = generation;
  await page.waitForFunction(
    ({ expected }) => {
      const roots = [...document.querySelectorAll('.ratan-design-root')];
      return roots.length >= 2 && roots.every((root) => root.getAttribute('data-generation') === expected);
    },
    { expected: expectedGeneration },
  );
  const styleElementsBeforeSwitch = await page.locator('style').count();
  const themeStart = process.hrtime.bigint();
  await page.getByLabel('Theme Switch').click();
  await page.waitForFunction(() => {
    const roots = [...document.querySelectorAll('.ratan-design-root')];
    return roots.length >= 2 && roots.every((root) => root.getAttribute('data-mode') === 'light');
  });
  await page.evaluate(() => new Promise((resolveAnimation) => requestAnimationFrame(() => requestAnimationFrame(resolveAnimation))));
  const themeSwitchMs = elapsedMs(themeStart);

  const browserMetrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    const resourceSummary = resources.reduce(
      (summary, entry) => {
        summary.requests += 1;
        summary.transferBytes += entry.transferSize;
        summary.encodedBodyBytes += entry.encodedBodySize;
        if (/\.(?:js|mjs)(?:\?|$)/.test(entry.name)) summary.scriptEncodedBytes += entry.encodedBodySize;
        if (/\.css(?:\?|$)/.test(entry.name)) summary.styleEncodedBytes += entry.encodedBodySize;
        return summary;
      },
      { requests: 0, transferBytes: 0, encodedBodyBytes: 0, scriptEncodedBytes: 0, styleEncodedBytes: 0 },
    );
    const longTasks = window.__designOriginLongTasks ?? [];
    return {
      ...resourceSummary,
      longTaskCount: longTasks.length,
      longTaskMs: longTasks.reduce((sum, task) => sum + task.duration, 0),
      styleElements: document.querySelectorAll('style').length,
      styleSheets: document.styleSheets.length,
    };
  });
  const cdpMetrics = await cdp.send('Performance.getMetrics');
  const metric = (name) => cdpMetrics.metrics.find((entry) => entry.name === name)?.value ?? 0;
  const result = {
    loginReadyMs,
    shellReadyMs,
    coldTileMs,
    themeSwitchMs,
    styleElementsBeforeSwitch,
    ...browserMetrics,
    taskMs: round(metric('TaskDuration') * 1000),
    scriptMs: round(metric('ScriptDuration') * 1000),
    layoutMs: round(metric('LayoutDuration') * 1000),
    recalcStyleMs: round(metric('RecalcStyleDuration') * 1000),
  };
  await context.close();
  if (pageErrors.length > 0) throw new Error(`Page errors: ${pageErrors.join('; ')}`);
  return result;
}

async function measureRuntime(baseUrl, iterations) {
  const browser = await chromium.launch({ headless: true });
  try {
    const scenarios = {};
    for (const generation of ['legacy', 'webkit']) {
      const samples = [];
      for (let index = 0; index < iterations; index += 1) {
        samples.push(await measureIteration(browser, baseUrl, generation));
      }
      scenarios[generation] = { samples, aggregate: aggregateIterations(samples) };
    }
    return { browserVersion: browser.version(), scenarios };
  } finally {
    await browser.close();
  }
}

function getPath(value, path) {
  return path.split('.').reduce((current, part) => current?.[part], value);
}

function evaluateBudget(report, budget) {
  const failures = [];
  for (const check of budget.checks ?? []) {
    const actual = getPath(report, check.path);
    if (typeof actual !== 'number') {
      failures.push(`${check.path}: missing numeric metric`);
      continue;
    }
    if (actual > check.max) failures.push(`${check.path}: ${actual} exceeds ${check.max}`);
  }
  for (const comparison of budget.comparisons ?? []) {
    const candidate = getPath(report, comparison.candidatePath);
    const baseline = getPath(report, comparison.baselinePath);
    if (typeof candidate !== 'number' || typeof baseline !== 'number' || baseline === 0) {
      failures.push(`${comparison.candidatePath}: cannot compare with ${comparison.baselinePath}`);
      continue;
    }
    const ratio = candidate / baseline;
    if (ratio > comparison.maxRatio) {
      failures.push(
        `${comparison.candidatePath}: ratio ${round(ratio, 3)} exceeds ${comparison.maxRatio}`,
      );
    }
  }
  return failures;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log(`Usage: node scripts/measure-design-origin-host.mjs [options]\n\n` +
      `  --build              build Base/Ratan/Cashflow production outputs with hidden source maps\n` +
      `  --base-url URL       controlled local edge URL (default http://127.0.0.1:9081)\n` +
      `  --iterations N       cold runs per generation (default 3)\n` +
      `  --budget PATH        budget file (default performance/design-origin-budget.json)\n` +
      `  --no-enforce         collect evidence without applying the budget\n` +
      `  --output PATH        write the complete JSON report`);
    return;
  }
  const edge = new URL(options.baseUrl);
  if (edge.hostname !== '127.0.0.1' && edge.hostname !== 'localhost') {
    throw new Error('The controlled performance edge must be local');
  }
  if (options.build) buildProductionWithMaps(options.baseUrl);
  const server = await startProductionEdge(Number(edge.port || 80));
  try {
    const staticMetrics = collectStaticBuildMetrics();
    const runtime = await measureRuntime(options.baseUrl, options.iterations);
    const commitResult = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: scriptRoot, encoding: 'utf8' });
    const report = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      commit: commitResult.stdout.trim(),
      conditions: {
        architecture: arch(),
        cache: 'disabled per fresh browser context',
        cpu: cpus()[0]?.model ?? 'unknown',
        cpuCount: cpus().length,
        headless: true,
        iterations: options.iterations,
        operatingSystem: `${platform()} ${release()}`,
        viewport: '1280x720',
      },
      static: staticMetrics,
      runtime,
    };
    if (options.outputPath) writeFileSync(options.outputPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    if (options.enforce) {
      if (!existsSync(options.budgetPath)) throw new Error(`Missing budget: ${options.budgetPath}`);
      const failures = evaluateBudget(report, JSON.parse(readFileSync(options.budgetPath, 'utf8')));
      if (failures.length > 0) throw new Error(`Performance budget failed:\n- ${failures.join('\n- ')}`);
      console.log(`Performance budget passed: ${options.budgetPath}`);
    }
  } finally {
    await new Promise((resolveClose, reject) => server.close((error) => (error ? reject(error) : resolveClose())));
  }
}

export { dependencyFromSource, evaluateBudget, summarize };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
