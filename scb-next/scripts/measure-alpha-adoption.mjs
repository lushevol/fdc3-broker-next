#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, gzipSync } from 'node:zlib';
import { chromium } from '@playwright/test';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const alphaDist = join(workspaceRoot, 'web/mfe-alpha-payments-origin/dist');

function parseArguments(argv) {
  const options = {
    baseUrl: 'http://127.0.0.1:8001',
    iterations: 3,
    outputPath: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--base-url') options.baseUrl = argv[++index];
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

function walkFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(path) : [path];
  });
}

function collectBundleMetrics() {
  const files = walkFiles(alphaDist)
    .filter((path) => ['.js', '.css'].includes(extname(path)))
    .map((path) => {
      const bytes = readFileSync(path);
      return {
        path: relative(alphaDist, path),
        rawBytes: bytes.length,
        gzipBytes: gzipSync(bytes, { level: 9 }).length,
        brotliBytes: brotliCompressSync(bytes).length,
      };
    });
  const total = (key) => files.reduce((sum, file) => sum + file[key], 0);

  return {
    jsCssFiles: files.length,
    rawBytes: total('rawBytes'),
    gzipBytes: total('gzipBytes'),
    brotliBytes: total('brotliBytes'),
    largestGzipFiles: [...files]
      .sort((left, right) => right.gzipBytes - left.gzipBytes)
      .slice(0, 8),
  };
}

function summarize(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const percentile = (fraction) =>
    sorted[Math.min(sorted.length - 1, Math.ceil(fraction * sorted.length) - 1)];
  return {
    min: sorted[0],
    median: percentile(0.5),
    p95: percentile(0.95),
    max: sorted.at(-1),
  };
}

async function measureRuntime(baseUrl, iterations) {
  const browser = await chromium.launch();
  const samples = [];

  try {
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const pageErrors = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await page.goto(`${baseUrl}/?show_normal_login=Y&survey=no`);
      await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
      await page.getByPlaceholder('Enter Password').fill('acceptance');
      await page.getByRole('button', { name: 'Sign In', exact: true }).click();
      await page.getByText('New Tile', { exact: true }).waitFor();
      await page.getByText('New Tile', { exact: true }).click();
      const tile = page.getByText('Payment Investigation', { exact: false }).first();
      await tile.waitFor();

      const openedAt = performance.now();
      await tile.click();
      await page.getByRole('heading', { name: 'Payment Investigation' }).waitFor({
        timeout: 20_000,
      });
      const coldTileMs = performance.now() - openedAt;

      const search = page.getByRole('searchbox', { name: 'Search cases' });
      const searchedAt = performance.now();
      await search.fill('northstar');
      await page.getByRole('row', { name: /AP-20482/ }).waitFor();
      const searchFilterMs = performance.now() - searchedAt;

      samples.push({
        coldTileMs: Math.round(coldTileMs * 10) / 10,
        searchFilterMs: Math.round(searchFilterMs * 10) / 10,
        pageErrors,
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }

  return {
    iterations: samples,
    coldTileMs: summarize(samples.map((sample) => sample.coldTileMs)),
    searchFilterMs: summarize(samples.map((sample) => sample.searchFilterMs)),
    pageErrors: samples.flatMap((sample) => sample.pageErrors),
  };
}

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  console.log(
    'Usage: node scripts/measure-alpha-adoption.mjs [--base-url URL] [--iterations N] [--output PATH]',
  );
  process.exit(0);
}

const report = {
  measuredAt: new Date().toISOString(),
  baseUrl: options.baseUrl,
  bundle: collectBundleMetrics(),
  runtime: await measureRuntime(options.baseUrl, options.iterations),
};

const serialized = `${JSON.stringify(report, null, 2)}\n`;
if (options.outputPath) writeFileSync(options.outputPath, serialized);
console.log(serialized);
