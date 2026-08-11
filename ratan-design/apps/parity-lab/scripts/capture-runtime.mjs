import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';
import { chromium } from 'playwright';

import { BASELINE_COMMIT, BASELINE_PACKAGE_VERSION } from './generate-baseline.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const webkitRoot = path.join(repositoryRoot, 'sc-dev-web/sc-dev-web');
const manifestPath = path.join(
  repositoryRoot,
  'ratan-design/packages/react/parity-manifest.json',
);
const outputPath = path.join(
  repositoryRoot,
  'ratan-design/apps/parity-lab/runtime-observations.json',
);
const chromeExecutable =
  process.env.RATAN_CAPTURE_BROWSER ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const computedStyleProperties = Object.freeze([
  'display',
  'position',
  'box-sizing',
  'width',
  'height',
  'min-width',
  'min-height',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'color',
  'background-color',
  'border-top-color',
  'border-top-style',
  'border-top-width',
  'border-radius',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'gap',
  'opacity',
  'visibility',
  'overflow',
]);

async function bundleWebkit(manifest) {
  const imports = manifest.components
    .map(({ legacy }) => {
      const modulePath = legacy.elementModule.replace(/\.ts$/, '.js');
      return `import ${JSON.stringify(`./sc-dev-web/sc-dev-web/dist/${modulePath}`)};`;
    })
    .join('\n');
  const result = await esbuild.build({
    stdin: {
      contents: imports,
      resolveDir: repositoryRoot,
      sourcefile: 'ratan-runtime-capture-entry.js',
    },
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'chrome120',
    write: false,
    logLevel: 'silent',
  });
  return result.outputFiles[0].text;
}

async function readFoundationStyles(manifest) {
  const cssFiles = manifest.assets.styles
    .map(({ path: relativePath }) => path.join(webkitRoot, 'public/styles', relativePath))
    .filter((file) => file.endsWith('.css'));
  return (await Promise.all(cssFiles.map((file) => readFile(file, 'utf8')))).join('\n');
}

async function observeComponent(page, component) {
  const observation = await page.evaluate(
    async ({ component, computedStyleProperties }) => {
      const serialize = (value) => {
        if (value === undefined) return { type: 'undefined' };
        if (value === null) return null;
        if (typeof value === 'number' && Number.isNaN(value)) return { type: 'number', value: 'NaN' };
        if (typeof value === 'bigint') return { type: 'bigint', value: String(value) };
        if (typeof value === 'function') return { type: 'function', name: value.name };
        if (value instanceof Date) return { type: 'Date', value: value.toISOString() };
        if (value instanceof Element) return { type: 'Element', tag: value.localName };
        if (Array.isArray(value)) return value.map(serialize);
        if (typeof value === 'object') {
          try {
            return JSON.parse(JSON.stringify(value));
          } catch {
            return { type: value.constructor?.name ?? 'object' };
          }
        }
        return value;
      };
      const stylesOf = (element) => {
        if (!element) return {};
        const styles = getComputedStyle(element);
        return Object.fromEntries(
          computedStyleProperties.map((property) => [property, styles.getPropertyValue(property)]),
        );
      };
      const settle = async (element) => {
        await element.updateComplete;
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      };
      const snapshot = (element) => {
        const rect = element.getBoundingClientRect();
        const shadowTarget = element.shadowRoot?.querySelector(
          'button, input, select, textarea, [role], a, [tabindex], div, span',
        );
        return {
          attributes: Object.fromEntries(
            [...element.attributes]
              .map((attribute) => [attribute.name, attribute.value])
              .sort(([left], [right]) => left.localeCompare(right)),
          ),
          geometry: {
            width: rect.width,
            height: rect.height,
          },
          hostStyles: stylesOf(element),
          shadowTarget: shadowTarget
            ? { tag: shadowTarget.localName, styles: stylesOf(shadowTarget) }
            : null,
        };
      };
      const propertyFor = (candidates) =>
        component.contract.properties.find(({ legacyProperty }) =>
          candidates.includes(legacyProperty),
        )?.legacyProperty;
      const captureAxis = async (element, values, propertyCandidates) => {
        const property = propertyFor(propertyCandidates);
        if (!property) return [];
        const original = element[property];
        const captures = [];
        for (const value of values) {
          try {
            element[property] = value;
            await settle(element);
            captures.push({ value, snapshot: snapshot(element) });
          } catch (error) {
            captures.push({ value, error: String(error) });
          }
        }
        element[property] = original;
        await settle(element);
        return captures;
      };
      const sampleFor = ({ type }, availableValues) => {
        if (/boolean/i.test(type)) return true;
        if (/number/i.test(type)) return 1;
        if (/=>|\(\)/.test(type)) return undefined;
        if (availableValues.length > 0) return availableValues[0];
        if (type.trim() === 'string') return 'capture';
        return undefined;
      };
      const emptyColumn = new Proxy(
        { id: 'capture-column', columnDef: { header: 'Capture column', meta: {} }, parent: undefined },
        {
          get(target, property) {
            if (property in target) return target[property];
            if (property === 'getFilterLookup') return () => undefined;
            if (property === 'getStaticFilterData') return () => [];
            if (property === 'getCanFilter') return () => false;
            if (property === 'getIsVisible') return () => true;
            if (property === 'getIsPinned') return () => false;
            if (property === 'getLeafHeaders') return () => [];
            if (property === 'getFilterValue') return () => undefined;
            return () => undefined;
          },
        },
      );
      const emptyTable = new Proxy(
        {},
        {
          get(_target, property) {
            if (
              [
                'getFlattenHeaders',
                'getHighestHeaders',
                'getVisibleLeafColumns',
                'getLeafHeaders',
              ].includes(property)
            ) {
              return () => [];
            }
            if (property === 'getState') return () => ({});
            return () => undefined;
          },
        },
      );

      const tag = component.legacy.tag;
      const errors = [];
      const events = [];
      const captureWindowError = (event) => {
        const message = String(event.error ?? event.message);
        if (!message.startsWith('ResizeObserver loop')) errors.push(message);
      };
      window.addEventListener('error', captureWindowError);
      await customElements.whenDefined(tag);
      const element = document.createElement(tag);
      const defaults = Object.fromEntries(
        component.contract.properties.map(({ legacyProperty }) => {
          try {
            return [legacyProperty, serialize(element[legacyProperty])];
          } catch (error) {
            return [legacyProperty, { error: String(error) }];
          }
        }),
      );
      if (tag === 'sc-data-grid-column-manager' || tag === 'sc-data-grid-composite-filter') {
        element.table = emptyTable;
      }
      if (tag === 'sc-data-grid-column-set-filter') {
        element.column = emptyColumn;
        element.bindFilterValue = () => undefined;
      }
      element.textContent = tag;
      for (const { legacySlot } of component.contract.slots) {
        if (legacySlot === 'default') continue;
        const slotContent = document.createElement('span');
        slotContent.slot = legacySlot;
        slotContent.textContent = legacySlot;
        element.append(slotContent);
      }
      for (const { legacyEvent } of component.contract.events) {
        element.addEventListener(legacyEvent, (event) => {
          events.push({
            name: event.type,
            bubbles: event.bubbles,
            composed: event.composed,
            cancelable: event.cancelable,
            detail: serialize(event.detail),
          });
        });
      }
      document.body.replaceChildren(element);
      await settle(element);
      const eventProbeErrors = [];
      for (const { legacyEvent } of component.contract.events) {
        try {
          if (typeof element.emit !== 'function') {
            eventProbeErrors.push({ event: legacyEvent, error: 'Runtime has no emit method' });
            continue;
          }
          element.emit(legacyEvent, { detail: { ratanRuntimeProbe: true } });
        } catch (error) {
          eventProbeErrors.push({ event: legacyEvent, error: String(error) });
        }
      }
      const methods = Object.fromEntries(
        component.contract.methods.map(({ legacyMethod }) => [
          legacyMethod,
          typeof element[legacyMethod] === 'function',
        ]),
      );
      const renderedSlots = [...(element.shadowRoot?.querySelectorAll('slot') ?? [])].map((slot) =>
        slot.getAttribute('name') || 'default',
      );
      const initial = snapshot(element);
      const variants = await captureAxis(element, component.contract.variants, [
        'type',
        'variant',
        'appearance',
      ]);
      const tones = await captureAxis(element, component.contract.tones, [
        'state',
        'tone',
        'status',
      ]);
      const sizes = await captureAxis(element, component.contract.sizes, ['size']);
      const stateSnapshots = {};
      for (const stateProperty of ['disabled', 'readonly', 'loading', 'selected']) {
        if (!component.contract.properties.some(({ legacyProperty }) => legacyProperty === stateProperty)) {
          continue;
        }
        const original = element[stateProperty];
        try {
          element[stateProperty] = true;
          await settle(element);
          stateSnapshots[stateProperty] = snapshot(element);
        } catch (error) {
          stateSnapshots[stateProperty] = { error: String(error) };
        }
        element[stateProperty] = original;
        await settle(element);
      }
      const propertyReflections = [];
      for (const property of component.contract.properties) {
        const availableValues =
          property.legacyProperty === 'size'
            ? component.contract.sizes
            : property.legacyProperty === 'state'
              ? component.contract.tones
              : component.contract.variants;
        const sample = sampleFor(property, availableValues);
        if (sample === undefined) {
          propertyReflections.push({
            property: property.legacyProperty,
            attribute: property.legacyAttribute,
            status: 'not-safely-sampleable',
          });
          continue;
        }
        const original = element[property.legacyProperty];
        try {
          element[property.legacyProperty] = sample;
          await settle(element);
          propertyReflections.push({
            property: property.legacyProperty,
            attribute: property.legacyAttribute,
            sample: serialize(sample),
            observedProperty: serialize(element[property.legacyProperty]),
            observedAttribute: element.getAttribute(property.legacyAttribute),
            hasAttribute: element.hasAttribute(property.legacyAttribute),
            status: 'captured',
          });
        } catch (error) {
          propertyReflections.push({
            property: property.legacyProperty,
            attribute: property.legacyAttribute,
            sample: serialize(sample),
            status: 'capture-error',
            error: String(error),
          });
        }
        element[property.legacyProperty] = original;
        await settle(element);
      }

      try {
        element.focus();
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        element.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        element.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        element.blur();
        await settle(element);
      } catch (error) {
        errors.push(String(error));
      }

      const themeSnapshots = {};
      for (const [theme, classes] of [
        ['light', 'sc-mode-light'],
        ['dark', 'sc-mode-dark'],
        ['cpbb', 'sc-mode-light sc-theme-cpbb'],
      ]) {
        document.documentElement.className = classes;
        document.body.className = classes;
        await settle(element);
        themeSnapshots[theme] = snapshot(element);
      }
      const fontModeSnapshots = {};
      for (const [mode, classes] of [
        ['default', 'sc-mode-light'],
        ['inter', 'sc-mode-light sc-mode-inter'],
        ['roboto-mono', 'sc-mode-light sc-mode-roboto-mono'],
        ['dyslexic', 'sc-mode-light sc-mode-dyslexic'],
      ]) {
        document.documentElement.className = classes;
        document.body.className = classes;
        await settle(element);
        fontModeSnapshots[mode] = snapshot(element);
      }
      const directionSnapshots = {};
      for (const direction of ['ltr', 'rtl']) {
        document.documentElement.dir = direction;
        await settle(element);
        directionSnapshots[direction] = snapshot(element);
      }
      document.documentElement.dir = '';
      document.documentElement.className = '';
      document.body.className = '';
      window.removeEventListener('error', captureWindowError);

      return {
        tag,
        defined: Boolean(customElements.get(tag)),
        constructorName: customElements.get(tag)?.name ?? null,
        defaults,
        initial,
        variants,
        tones,
        sizes,
        stateSnapshots,
        propertyReflections,
        renderedSlots: [...new Set(renderedSlots)].sort(),
        methods,
        observedEvents: events,
        eventProbeErrors,
        themeSnapshots,
        fontModeSnapshots,
        directionSnapshots,
        errors: [...new Set(errors)],
      };
    },
    { component, computedStyleProperties },
  );
  const interactionSnapshot = async (interaction) => {
    try {
      const locator = page.locator(component.legacy.tag);
      if (interaction === 'hover') await locator.hover({ force: true });
      if (interaction === 'focus-visible') {
        await page.locator('body').click({ position: { x: 1, y: 1 } });
        await page.keyboard.press('Tab');
        if (!(await locator.evaluate((element) => element.matches(':focus-visible')))) {
          await locator.focus();
        }
      }
      return await locator.evaluate(
        (element, properties) => {
          const collect = (target) => {
            const styles = getComputedStyle(target);
            return Object.fromEntries(
              properties.map((property) => [property, styles.getPropertyValue(property)]),
            );
          };
          const target = element.shadowRoot?.querySelector(
            'button, input, select, textarea, [role], a, [tabindex], div, span',
          );
          return {
            hostMatches: {
              hover: element.matches(':hover'),
              focus: element.matches(':focus'),
              focusVisible: element.matches(':focus-visible'),
            },
            hostStyles: collect(element),
            shadowTarget: target ? { tag: target.localName, styles: collect(target) } : null,
          };
        },
        computedStyleProperties,
      );
    } catch (error) {
      return { error: String(error) };
    }
  };
  observation.interactionSnapshots = {
    hover: await interactionSnapshot('hover'),
    focusVisible: await interactionSnapshot('focus-visible'),
  };
  await page.evaluate(() => document.body.replaceChildren());
  return observation;
}

export async function captureRuntime() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.baseline.repositoryCommit, BASELINE_COMMIT);
  assert.equal(manifest.baseline.packageVersion, BASELINE_PACKAGE_VERSION);
  const [bundle, foundationStyles] = await Promise.all([
    bundleWebkit(manifest),
    readFoundationStyles(manifest),
  ]);
  const browser = await chromium.launch({
    executablePath: chromeExecutable,
    headless: true,
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      colorScheme: 'light',
    });
    page.setDefaultTimeout(500);
    await page.setContent(
      `<!doctype html><html lang="en"><head><style>${foundationStyles}</style></head><body></body></html>`,
    );
    await page.addScriptTag({ content: bundle });
    const observations = [];
    for (const component of manifest.components) {
      try {
        observations.push(await observeComponent(page, component));
      } catch (error) {
        observations.push({
          tag: component.legacy.tag,
          defined: await page.evaluate(
            (tag) => Boolean(customElements.get(tag)),
            component.legacy.tag,
          ),
          captureError: String(error),
        });
      }
    }
    const document = {
      schemaVersion: 1,
      baseline: manifest.baseline,
      environment: {
        engine: 'Chromium',
        browserVersion: await browser.version(),
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        colorScheme: 'light',
        reducedMotion: 'reduce',
      },
      observations,
    };
    await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`);
    process.stdout.write(`Captured ${observations.length} WebKit runtime observations.\n`);
    return document;
  } finally {
    await browser.close();
  }
}

const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
if (invokedFile === fileURLToPath(import.meta.url)) await captureRuntime();
