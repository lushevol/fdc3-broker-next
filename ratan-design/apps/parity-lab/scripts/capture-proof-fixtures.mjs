import assert from 'node:assert/strict';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';
import axe from 'axe-core';
import pixelmatch from 'pixelmatch';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const parityRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(parityRoot, '../../..');
const publicPackageRoot = path.join(repositoryRoot, 'ratan-design/packages/react');
const fixturesRoot = path.join(parityRoot, 'fixtures');
const evidenceRoot = path.join(parityRoot, 'evidence/proof-cohort');
const screenshotThresholdPercent = 0.1;

const computedStyleProperties = Object.freeze([
  'display', 'position', 'box-sizing', 'width', 'height', 'font-family', 'font-size',
  'font-weight', 'line-height', 'color', 'background-color', 'border-top-color',
  'border-top-style', 'border-top-width', 'border-radius', 'padding-top',
  'padding-right', 'padding-bottom', 'padding-left', 'gap', 'opacity', 'outline-color',
  'outline-style', 'outline-width',
]);

export const PROOF_FIXTURE_IDS = Object.freeze([
  'sc-button',
  'sc-text-input',
  'sc-dialog',
  'sc-date-picker',
  'sc-tab-group',
  'sc-data-grid',
]);

const defaultChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const defaultEdge = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';
const temporaryEdge = '/tmp/ratan-msedge-app-20260806/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

export async function readProofFoundationCss() {
  const frozenRoot = path.join(publicPackageRoot, 'dist/styles/frozen');
  const files = ['ScStyleguide.css', 'ScGDSStyleGuide.css', 'ScLightMode.css', 'ScTypography.css', 'ScGrid.css'];
  return (
    await Promise.all(files.map(async (file) => {
      const css = await readFile(path.join(frozenRoot, file), 'utf8');
      return css.replace(/^@import[^;]+;\s*/gm, '');
    }))
  ).join('\n');
}

export function ratanSourceAliases() {
  return {
    '@fm/ratan-design/button': path.join(publicPackageRoot, 'src/components/button/button.tsx'),
    '@fm/ratan-design/text-input': path.join(publicPackageRoot, 'src/components/text-input/text-input.tsx'),
    '@fm/ratan-design/dialog': path.join(publicPackageRoot, 'src/components/dialog/dialog.tsx'),
    '@fm/ratan-design/date-picker': path.join(publicPackageRoot, 'src/components/date-picker/date-picker.tsx'),
    '@fm/ratan-design/tabs': path.join(publicPackageRoot, 'src/components/tabs/tabs.tsx'),
    '@fm/ratan-design/data-grid': path.join(repositoryRoot, 'ratan-design/packages/data-grid/src/index.ts'),
  };
}

export async function resolveManagedBrowsers(environment = process.env) {
  const chrome = environment.RATAN_CHROME_EXECUTABLE ?? defaultChrome;
  const edgeCandidates = [environment.RATAN_EDGE_EXECUTABLE, defaultEdge, temporaryEdge].filter(Boolean);
  const edge = (await Promise.all(edgeCandidates.map(async (candidate) => [candidate, await exists(candidate)]))).find(([, present]) => present)?.[0];
  assert.ok(await exists(chrome), `Managed Chrome executable is missing: ${chrome}`);
  assert.ok(edge, 'Managed Microsoft Edge is missing. Set RATAN_EDGE_EXECUTABLE.');
  return Object.freeze([
    { id: 'chrome', executablePath: chrome },
    { id: 'edge', executablePath: edge },
  ]);
}

export async function buildProofFixtureBundles() {
  const legacy = await esbuild.build({
    stdin: { contents: "import '@scdevkit/webkit/elements';", resolveDir: repositoryRoot, sourcefile: 'proof-webkit-entry.js' },
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'chrome120',
    write: false,
    logLevel: 'silent',
  });
  const react = await esbuild.build({
    stdin: {
      contents: `
        import React from 'react';
        import { createRoot } from 'react-dom/client';
        import { Button } from '@fm/ratan-design/button';
        import { TextInput } from '@fm/ratan-design/text-input';
        import { Dialog } from '@fm/ratan-design/dialog';
        import { DatePicker } from '@fm/ratan-design/date-picker';
        import { Tab, TabList, TabPanel, Tabs } from '@fm/ratan-design/tabs';
        import { DataGrid } from '@fm/ratan-design/data-grid';
        const columns=[{id:'symbol',header:'Symbol',accessor:'symbol'},{id:'quantity',header:'Quantity',accessor:'quantity'}];
        const fixtures={
          'sc-button': <Button variant="primary" tone="default" size="sm">Action</Button>,
          'sc-text-input': <TextInput label="Account name" value="Ratan" />,
          'sc-dialog': <Dialog open label="Confirm action">Review the order.</Dialog>,
          'sc-date-picker': <DatePicker label="Settlement date" value="2026-08-06" />,
          'sc-tab-group': <Tabs defaultSelectedKey="positions" aria-label="Workspace"><TabList><Tab id="positions">Positions</Tab><Tab id="orders">Orders</Tab></TabList><TabPanel id="positions">Position content</TabPanel><TabPanel id="orders">Order content</TabPanel></Tabs>,
          'sc-data-grid': <DataGrid aria-label="Trades" height={320} data={[{id:'1',symbol:'ALUM',quantity:10},{id:'2',symbol:'ZINC',quantity:20}]} columns={columns} />,
        };
        const fixture=fixtures[document.body.dataset.fixture];
        createRoot(document.getElementById('root')).render(fixture);
        requestAnimationFrame(()=>requestAnimationFrame(()=>{document.body.dataset.fixtureReady='true'}));
      `,
      loader: 'tsx',
      resolveDir: repositoryRoot,
      sourcefile: 'proof-ratan-entry.tsx',
    },
    bundle: true,
    alias: ratanSourceAliases(),
    format: 'iife',
    platform: 'browser',
    target: 'chrome120',
    write: false,
    logLevel: 'silent',
  });
  const reactCss = (
    await Promise.all(
      ['styles.css', 'button.css', 'text-input.css', 'dialog.css', 'date-picker.css', 'tabs.css', 'data-grid.css']
        .map((file) => readFile(path.join(publicPackageRoot, 'dist', file), 'utf8')),
    )
  ).join('\n');
  return {
    legacyJavaScript: legacy.outputFiles[0]?.text ?? '',
    reactJavaScript: react.outputFiles[0]?.text ?? '',
    reactCss,
  };
}

function fixtureMain(html) {
  const match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  assert.ok(match, 'Runtime fixture has no main element.');
  return match[1];
}

async function settle(page, selector) {
  await page.waitForSelector(selector, { state: 'attached' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function identifyBrowser(page, expected) {
  const userAgent = await page.evaluate(() => navigator.userAgent);
  if (expected === 'edge') assert.match(userAgent, /Edg\//, 'Edge fixture must run in Microsoft Edge.');
  else {
    assert.match(userAgent, /Chrome\//, 'Chrome fixture must run in Google Chrome.');
    assert.doesNotMatch(userAgent, /Edg\//, 'Chrome fixture may not use Microsoft Edge.');
  }
  return userAgent;
}

async function createCapturePage(context, browserId) {
  const page = await context.newPage();
  page.on('pageerror', (error) => process.stderr.write(`[${browserId}] page error: ${error.stack ?? error}\n`));
  page.on('console', (message) => {
    if (message.type() === 'error') process.stderr.write(`[${browserId}] console error: ${message.text()}\n`);
  });
  return page;
}

export async function captureComputedStyle(page, selector, shadow = false) {
  return page.evaluate(({ selector, shadow, properties }) => {
    const host = document.querySelector(selector);
    const target = shadow
      ? host?.shadowRoot?.querySelector('button, input, [role], [tabindex], div, span') ?? host
      : host;
    if (!target) return null;
    const rect = target.getBoundingClientRect();
    const style = getComputedStyle(target);
    return {
      selector,
      tag: target.localName,
      geometry: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      styles: Object.fromEntries(properties.map((property) => [property, style.getPropertyValue(property)])),
    };
  }, { selector, shadow, properties: computedStyleProperties });
}

export async function captureAccessibility(page) {
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(async () => {
    const result = await globalThis.axe.run(document, {
      resultTypes: ['violations', 'incomplete'],
      rules: {
        'document-title': { enabled: false },
        'page-has-heading-one': { enabled: false },
      },
    });
    const simplify = ({ id, impact, help, nodes }) => ({
      id,
      impact,
      help,
      targets: nodes.map(({ target }) => target),
    });
    return { violations: result.violations.map(simplify), incomplete: result.incomplete.map(simplify) };
  });
}

export async function compareFixtureScreenshots(webkitPath, ratanPath, diffPath) {
  const [webkitBuffer, ratanBuffer] = await Promise.all([readFile(webkitPath), readFile(ratanPath)]);
  const webkit = PNG.sync.read(webkitBuffer);
  const ratan = PNG.sync.read(ratanBuffer);
  assert.equal(webkit.width, ratan.width, 'Screenshot widths must match.');
  assert.equal(webkit.height, ratan.height, 'Screenshot heights must match.');
  const diff = new PNG({ width: webkit.width, height: webkit.height });
  const changedPixels = pixelmatch(webkit.data, ratan.data, diff.data, webkit.width, webkit.height, { threshold: 0.1 });
  await writeFile(diffPath, PNG.sync.write(diff));
  const totalPixels = webkit.width * webkit.height;
  const changedPercent = (changedPixels / totalPixels) * 100;
  return { changedPixels, totalPixels, changedPercent, thresholdPercent: screenshotThresholdPercent, passed: changedPercent < screenshotThresholdPercent };
}

export async function captureProofParityFixtures() {
  const browsers = await resolveManagedBrowsers();
  const bundles = await buildProofFixtureBundles();
  const foundationCss = await readProofFoundationCss();
  const deviationManifest = JSON.parse(await readFile(path.join(publicPackageRoot, 'deviation-manifest.json'), 'utf8'));
  const evidence = { capturedAt: new Date().toISOString(), viewport: { width: 640, height: 480 }, deviceScaleFactor: 1, browsers: [] };
  await mkdir(evidenceRoot, { recursive: true });

  for (const browserConfig of browsers) {
    const browser = await chromium.launch({ executablePath: browserConfig.executablePath, headless: true });
    try {
      const context = await browser.newContext({ viewport: evidence.viewport, deviceScaleFactor: evidence.deviceScaleFactor, locale: 'en-SG', colorScheme: 'light', reducedMotion: 'no-preference' });
      const identityPage = await createCapturePage(context, browserConfig.id);
      const userAgent = await identifyBrowser(identityPage, browserConfig.id);
      await identityPage.close();
      const browserEvidence = { id: browserConfig.id, version: browser.version(), userAgent, fixtures: [] };
      const outputDirectory = path.join(evidenceRoot, browserConfig.id);
      await mkdir(outputDirectory, { recursive: true });

      for (const fixtureId of PROOF_FIXTURE_IDS) {
        const runtimeHtml = await readFile(path.join(fixturesRoot, 'runtime', `${fixtureId}.html`), 'utf8');
        const webkitPage = await createCapturePage(context, browserConfig.id);
        await webkitPage.setContent(`<!doctype html><html class="sc-mode-light" lang="en-SG"><head><meta charset="utf-8"></head><body data-fixture="${fixtureId}"><main style="box-sizing:border-box;padding:24px;width:640px">${fixtureMain(runtimeHtml)}</main></body></html>`);
        await webkitPage.addStyleTag({ content: foundationCss });
        await webkitPage.addScriptTag({ content: bundles.legacyJavaScript });
        await webkitPage.evaluate((tag) => customElements.whenDefined(tag), fixtureId);
        await settle(webkitPage, fixtureId);
        const webkitComputedStyle = await captureComputedStyle(webkitPage, fixtureId, true);
        const webkitAccessibility = await captureAccessibility(webkitPage);
        const webkitPath = path.join(outputDirectory, `${fixtureId}-webkit.png`);
        await webkitPage.screenshot({ path: webkitPath, fullPage: true });
        await webkitPage.close();

        const ratanPage = await createCapturePage(context, browserConfig.id);
        await ratanPage.setContent(`<!doctype html><html class="sc-mode-light" lang="en-SG"><head><meta charset="utf-8"></head><body data-fixture="${fixtureId}"><main id="root" style="box-sizing:border-box;padding:24px;width:640px"></main></body></html>`);
        await ratanPage.addStyleTag({ content: `${foundationCss}\n${bundles.reactCss}` });
        await ratanPage.addScriptTag({ content: bundles.reactJavaScript });
        await ratanPage.waitForFunction(() => document.body.dataset.fixtureReady === 'true');
        await settle(ratanPage, '[data-ratan-component]');
        const ratanComputedStyle = await captureComputedStyle(ratanPage, '[data-ratan-component]');
        const ratanAccessibility = await captureAccessibility(ratanPage);
        const ratanPath = path.join(outputDirectory, `${fixtureId}-ratan.png`);
        await ratanPage.screenshot({ path: ratanPath, fullPage: true });
        await ratanPage.close();
        const diffPath = path.join(outputDirectory, `${fixtureId}-diff.png`);
        const screenshot = await compareFixtureScreenshots(webkitPath, ratanPath, diffPath);
        const approvedDeviations = deviationManifest.deviations
          .filter(({ legacyTag, category }) => legacyTag === fixtureId && category === 'visual')
          .map(({ id }) => id);
        browserEvidence.fixtures.push({
          id: fixtureId,
          webkitScreenshot: path.relative(parityRoot, webkitPath),
          ratanScreenshot: path.relative(parityRoot, ratanPath),
          diffScreenshot: path.relative(parityRoot, diffPath),
          screenshot,
          approvedDeviations,
          computedStyle: { webkit: webkitComputedStyle, ratan: ratanComputedStyle },
          accessibility: { webkit: webkitAccessibility, ratan: ratanAccessibility },
        });
      }
      evidence.browsers.push(browserEvidence);
      await context.close();
    } finally {
      await browser.close();
    }
  }
  assert.deepEqual(evidence.browsers.map(({ id }) => id), ['chrome', 'edge']);
  evidence.summary = {
    fixtures: evidence.browsers.reduce((total, browser) => total + browser.fixtures.length, 0),
    unexplainedScreenshotFailures: evidence.browsers.flatMap(({ fixtures }) => fixtures).filter(({ screenshot, approvedDeviations }) => !screenshot.passed && approvedDeviations.length === 0).length,
    ratanAccessibilityViolations: evidence.browsers.flatMap(({ fixtures }) => fixtures).reduce((total, { accessibility }) => total + accessibility.ratan.violations.length, 0),
  };
  const evidencePath = path.join(evidenceRoot, 'capture.json');
  await writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
  process.stdout.write(`Captured ${PROOF_FIXTURE_IDS.length} matched fixtures in managed Chrome and Edge.\n`);
  return evidence;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await captureProofParityFixtures();
}
