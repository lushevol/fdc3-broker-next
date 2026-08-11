import assert from 'node:assert/strict';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

import * as esbuild from 'esbuild';
import { chromium } from 'playwright';

import { readProofFoundationCss, resolveManagedBrowsers, ratanSourceAliases } from './capture-proof-fixtures.mjs';

const parityRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(parityRoot, '../../..');
const publicDist = path.join(repositoryRoot, 'ratan-design/packages/react/dist');
const evidencePath = path.join(parityRoot, 'evidence/proof-cohort/performance.json');

function percentile(values, quantile) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * quantile))] ?? 0;
}

export async function buildBenchmarkBundle() {
  const result = await esbuild.build({
    stdin: {
      contents: `
        import React, { useState } from 'react';
        import { createRoot } from 'react-dom/client';
        import { Button } from '@fm/ratan-design/button';
        import { Dialog } from '@fm/ratan-design/dialog';
        function Benchmark(){const [open,setOpen]=useState(false);return <><Button id="benchmark-trigger" onPress={()=>setOpen(true)}>Open benchmark</Button><Dialog open={open} onOpenChange={setOpen} label="Benchmark dialog"><Button onPress={()=>setOpen(false)}>Close benchmark</Button></Dialog></>}
        let root;
        globalThis.__mountRatanBenchmark=()=>{root=createRoot(document.getElementById('root'));root.render(<Benchmark/>)};
        globalThis.__unmountRatanBenchmark=()=>{root?.unmount();root=undefined};
      `,
      loader: 'tsx',
      resolveDir: repositoryRoot,
      sourcefile: 'ratan-proof-benchmark.tsx',
    },
    alias: ratanSourceAliases(),
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'chrome120',
    write: false,
    logLevel: 'silent',
  });
  return result.outputFiles[0]?.text ?? '';
}

export async function measureBundleFiles() {
  const names = await readdir(publicDist);
  const commonFiles = names.filter((name) => /\.(js|css)$/.test(name) && !/^(data-grid|testing|tokens)/.test(name));
  const dataGridFiles = names.filter((name) => /^data-grid\.(js|css)$/.test(name));
  const summarize = async (files) => {
    const records = await Promise.all(files.map(async (name) => {
      const file = path.join(publicDist, name);
      const [metadata, contents] = await Promise.all([stat(file), readFile(file)]);
      return { name, bytes: metadata.size, gzipBytes: gzipSync(contents).byteLength };
    }));
    return { files: records, bytes: records.reduce((total, file) => total + file.bytes, 0), gzipBytes: records.reduce((total, file) => total + file.gzipBytes, 0) };
  };
  return { common: await summarize(commonFiles), dataGridSubpath: await summarize(dataGridFiles) };
}

export async function measureProofPerformance() {
  const [chrome] = await resolveManagedBrowsers();
  assert.equal(chrome.id, 'chrome');
  const [bundle, foundationCss, buttonCss, dialogCss, bundleFiles] = await Promise.all([
    buildBenchmarkBundle(),
    readProofFoundationCss(),
    readFile(path.join(publicDist, 'button.css'), 'utf8'),
    readFile(path.join(publicDist, 'dialog.css'), 'utf8'),
    measureBundleFiles(),
  ]);
  const browser = await chromium.launch({ executablePath: chrome.executablePath, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 640, height: 480 } });
    await page.setContent('<!doctype html><html class="sc-mode-light"><body><main id="root"></main></body></html>');
    await page.evaluate(() => {
      const counts = { windowDocumentListeners: 0, resizeObservers: 0, mutationObservers: 0 };
      const add = EventTarget.prototype.addEventListener;
      const remove = EventTarget.prototype.removeEventListener;
      EventTarget.prototype.addEventListener = function (...args) { if (this === window || this === document) counts.windowDocumentListeners += 1; return add.apply(this, args); };
      EventTarget.prototype.removeEventListener = function (...args) { if (this === window || this === document) counts.windowDocumentListeners -= 1; return remove.apply(this, args); };
      const NativeResizeObserver = globalThis.ResizeObserver;
      if (NativeResizeObserver) globalThis.ResizeObserver = class extends NativeResizeObserver { constructor(callback) { super(callback); counts.resizeObservers += 1; this.__active = true; } disconnect() { if (this.__active) { counts.resizeObservers -= 1; this.__active = false; } super.disconnect(); } };
      const NativeMutationObserver = globalThis.MutationObserver;
      globalThis.MutationObserver = class extends NativeMutationObserver { constructor(callback) { super(callback); counts.mutationObservers += 1; this.__active = true; } disconnect() { if (this.__active) { counts.mutationObservers -= 1; this.__active = false; } super.disconnect(); } };
      globalThis.__ratanResourceCounts = counts;
    });
    await page.addStyleTag({ content: `${foundationCss}\n${buttonCss}\n${dialogCss}` });
    await page.addScriptTag({ content: bundle });
    const metrics = await page.evaluate(async () => {
      const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const mountSync = [];
      const unmountSync = [];
      const openSync = [];
      globalThis.__mountRatanBenchmark();
      await frame();
      globalThis.__unmountRatanBenchmark();
      await frame();
      const baseline = { ...globalThis.__ratanResourceCounts };
      for (let index = 0; index < 25; index += 1) {
        let start = performance.now();
        globalThis.__mountRatanBenchmark();
        mountSync.push(performance.now() - start);
        await frame();
        const trigger = document.getElementById('benchmark-trigger');
        start = performance.now();
        trigger.click();
        openSync.push(performance.now() - start);
        await frame();
        start = performance.now();
        globalThis.__unmountRatanBenchmark();
        unmountSync.push(performance.now() - start);
        await frame();
      }
      return {
        mountSync,
        openSync,
        unmountSync,
        baseline,
        after: { ...globalThis.__ratanResourceCounts },
        remainingOverlays: document.querySelectorAll('[data-ratan-component="DialogOverlay"]').length,
      };
    });
    const evidence = {
      capturedAt: new Date().toISOString(),
      browser: { id: 'chrome', version: browser.version() },
      iterations: metrics.mountSync.length,
      bundle: bundleFiles,
      synchronousMilliseconds: {
        mountP95: percentile(metrics.mountSync, 0.95),
        overlayOpenP95: percentile(metrics.openSync, 0.95),
        unmountP95: percentile(metrics.unmountSync, 0.95),
        budgetP95: 10,
      },
      cleanup: {
        baseline: metrics.baseline,
        after: metrics.after,
        remainingOverlays: metrics.remainingOverlays,
        passed: metrics.remainingOverlays === 0 && metrics.after.windowDocumentListeners === metrics.baseline.windowDocumentListeners && metrics.after.resizeObservers === metrics.baseline.resizeObservers && metrics.after.mutationObservers === metrics.baseline.mutationObservers,
      },
    };
    await writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
    process.stdout.write(`Measured ${evidence.iterations} proof mount/open/unmount cycles in Chrome.\n`);
    return evidence;
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await measureProofPerformance();
}
