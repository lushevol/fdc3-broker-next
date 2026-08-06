import { createHash } from 'node:crypto';
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  APPROVED_DEVIATIONS,
  BUTTON_CONTRACT,
  COMPONENT_NAME_OVERRIDES,
  COMPONENT_PROPERTY_RENAMES,
  COMPONENT_SLOT_RENAMES,
  EVIDENCE_RESOLUTIONS,
  EXCLUDED_EXPORTS,
  EXCLUDED_TAGS,
  PROPERTY_RENAMES,
  SUBPATH_OVERRIDES,
  SUPPORTING_EXPORTS,
  SUPPORTING_TAGS,
  TEXT_INPUT_CONTRACT,
} from './baseline-config.mjs';

export const BASELINE_COMMIT = 'a8398ea6df30e4843e22fcb5a1d3343107463c60';
export const BASELINE_PACKAGE_VERSION = '2.0.5';

const PRECEDENCE = Object.freeze([
  'observed-runtime',
  'tests-and-source',
  'application-usage',
  'storybook',
  'documentation',
]);

const SOURCE_STYLES = 'sc-dev-web/sc-dev-web/public/styles';
const SOURCE_FONTS = 'sc-dev-web/sc-dev-web/public/fonts';
const SOURCE_ICONS = 'sc-dev-web/sc-dev-web/assets/icons';

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function kebabToPascal(value) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join('');
}

function camelToKebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll('_', '-')
    .toLowerCase();
}

function kebabToCamel(value) {
  return value.replace(/-([a-z0-9])/g, (_match, character) =>
    character.toUpperCase(),
  );
}

function eventToCallback(eventName) {
  const name = eventName.replace(/^sc-/, '');
  const overrides = {
    blur: 'onBlur',
    change: 'onChange',
    clear: 'onClear',
    focus: 'onFocus',
    input: 'onValueChange',
    mouseleave: 'onMouseLeave',
    mouseover: 'onMouseOver',
    select: 'onSelectionChange',
  };
  return overrides[name] ?? `on${kebabToPascal(name)}`;
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(absolutePath)));
    if (entry.isFile()) files.push(absolutePath);
  }
  return files;
}

async function inventoryFiles(directory) {
  const files = await listFiles(directory);
  return Promise.all(
    files.map(async (file) => {
      const content = await readFile(file);
      return {
        path: toPosix(path.relative(directory, file)),
        bytes: content.byteLength,
        sha256: sha256(content),
      };
    }),
  );
}

function parseImports(source) {
  const imports = new Map();
  for (const match of source.matchAll(
    /import\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["'];?/g,
  )) {
    for (const specifier of match[1].split(',')) {
      const [importedName, localName] = specifier.trim().split(/\s+as\s+/);
      if (!importedName) continue;
      imports.set(localName ?? importedName, {
        importedName,
        source: match[2],
      });
    }
  }
  return imports;
}

function resolveTypescriptImport(elementFile, importPath) {
  if (!importPath?.startsWith('.')) return undefined;
  const resolved = path.resolve(path.dirname(elementFile), importPath);
  return resolved.replace(/\.js$/, '.ts');
}

async function parseRegistrations(webkitRoot) {
  const elementsDirectory = path.join(webkitRoot, 'elements');
  const files = (await readdir(elementsDirectory))
    .filter((file) => /^sc-.*\.ts$/.test(file))
    .sort();
  const registrations = [];

  for (const file of files) {
    const absolutePath = path.join(elementsDirectory, file);
    const source = await readFile(absolutePath, 'utf8');
    const imports = parseImports(source);
    for (const match of source.matchAll(
      /defineElement\(["']([^"']+)["'],\s*([A-Za-z0-9_$]+)\)/g,
    )) {
      const imported = imports.get(match[2]);
      const declarationFile = resolveTypescriptImport(absolutePath, imported?.source);
      registrations.push({
        tag: match[1],
        className: match[2],
        elementModule: toPosix(path.relative(webkitRoot, absolutePath)),
        declarationModule: declarationFile
          ? toPosix(path.relative(webkitRoot, declarationFile))
          : undefined,
      });
    }
  }

  return registrations.sort((left, right) => left.tag.localeCompare(right.tag));
}

function selectDeclaration(declarationsByName, registration) {
  const candidates = declarationsByName.get(registration.className) ?? [];
  return (
    candidates.find(
      (candidate) => candidate.modulePath === registration.declarationModule,
    ) ?? candidates[0]
  );
}

function mapProperty(tag, member) {
  const override =
    COMPONENT_PROPERTY_RENAMES[tag]?.[member.name] ?? PROPERTY_RENAMES[member.name];
  return {
    legacyProperty: member.name,
    legacyAttribute: camelToKebab(member.name),
    reactProp: override?.reactProp ?? member.name,
    ...(override?.transform ? { transform: override.transform } : {}),
    type: member.type?.text ?? 'unknown',
    ...(member.default !== undefined ? { default: member.default } : {}),
    ...(member.description ? { description: member.description } : {}),
    ...(member.inheritedFrom ? { inheritedFrom: member.inheritedFrom } : {}),
  };
}

function publicProperties(tag, declaration, decoratedPropertyNames) {
  return (declaration?.members ?? [])
    .filter(
      (member) =>
        member.kind === 'field' &&
        decoratedPropertyNames.has(member.name) &&
        !member.static &&
        member.privacy !== 'private' &&
        member.privacy !== 'protected' &&
        !member.name.startsWith('_'),
    )
    .map((member) => mapProperty(tag, member));
}

function parseDecoratedPropertyNames(source) {
  const names = new Set();
  for (const match of source.matchAll(
    /@property(?:\([^)]*\))?\s*(?:(?:public|protected|private|readonly|declare)\s+)*([A-Za-z_$][\w$]*)/g,
  )) {
    names.add(match[1]);
  }
  return names;
}

function contractModules(registration, declaration) {
  return new Set(
    [
      registration.declarationModule,
      ...(declaration?.members ?? []).map((member) => member.inheritedFrom?.module),
    ].filter(Boolean),
  );
}

async function contractPropertyNames(webkitRoot, registration, declaration) {
  const modules = contractModules(registration, declaration);
  const names = new Set();
  for (const module of modules) {
    const source = await readFile(path.join(webkitRoot, module), 'utf8');
    for (const name of parseDecoratedPropertyNames(source)) names.add(name);
  }
  return names;
}

function publicMethods(declaration) {
  const internalPrefixes = ['bind', 'handle', 'observe', 'render'];
  const internalNames = new Set([
    'emit',
    'getStyles',
    'internalEmit',
    'stopDefaultEvent',
    'triggerInput',
  ]);
  return (declaration?.members ?? [])
    .filter(
      (member) =>
        member.kind === 'method' &&
        !member.inheritedFrom &&
        member.privacy !== 'private' &&
        member.privacy !== 'protected' &&
        !member.name.startsWith('_') &&
        !member.name.startsWith('[') &&
        !internalNames.has(member.name) &&
        !internalPrefixes.some((prefix) => member.name.startsWith(prefix)),
    )
    .map((member) => ({
      legacyMethod: member.name,
      reactHandleMethod: member.name,
      parameters: member.parameters ?? [],
      ...(member.return ? { return: member.return } : {}),
      ...(member.description ? { description: member.description } : {}),
    }));
}

function parseSourceEvents(source) {
  const events = new Set();
  const patterns = [
    /\b(?:this\.)?emit\(\s*["']([^"']+)["']/g,
    /new\s+CustomEvent(?:<[^>]+>)?\(\s*["']([^"']+)["']/g,
    /@(?:event|fires)(?:\s+\{[^}]+\})?\s+([A-Za-z0-9_-]+)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) events.add(match[1]);
  }
  return events;
}

async function componentEvents(webkitRoot, registration, declaration) {
  const names = new Set((declaration?.events ?? []).map((event) => event.name));
  for (const module of contractModules(registration, declaration)) {
    const source = await readFile(path.join(webkitRoot, module), 'utf8');
    for (const name of parseSourceEvents(source)) names.add(name);
  }
  return [...names]
    .sort()
    .map((legacyEvent) => ({
      legacyEvent,
      reactCallback: eventToCallback(legacyEvent),
    }));
}

function parseSourceSlots(source) {
  const slots = new Set();
  for (const match of source.matchAll(/<slot\b([^>]*)>/g)) {
    const name = match[1].match(/\bname\s*=\s*["']([^"']+)["']/)?.[1];
    slots.add(name || 'default');
  }
  return slots;
}

async function componentSlots(webkitRoot, registration, declaration) {
  const slotsByName = new Map(
    (declaration?.slots ?? []).map((slot) => [slot.name || 'default', slot]),
  );
  for (const module of contractModules(registration, declaration)) {
    const source = await readFile(path.join(webkitRoot, module), 'utf8');
    for (const name of parseSourceSlots(source)) {
      if (!slotsByName.has(name)) slotsByName.set(name, { name });
    }
  }
  return [...slotsByName.values()]
    .sort((left, right) =>
      (left.name || 'default').localeCompare(right.name || 'default'),
    )
    .map((slot) => ({
      legacySlot: slot.name || 'default',
      reactComposition:
        COMPONENT_SLOT_RENAMES[registration.tag]?.[slot.name] ??
        (slot.name && slot.name !== 'default' ? kebabToCamel(slot.name) : 'children'),
      ...(slot.description ? { description: slot.description } : {}),
    }));
}

function componentClassification(tag) {
  if (EXCLUDED_TAGS[tag]) return 'excluded';
  if (SUPPORTING_TAGS.has(tag)) return 'supporting-only';
  return 'included';
}

function componentName(registration) {
  return (
    COMPONENT_NAME_OVERRIDES[registration.tag] ??
    registration.className.replace(/^Sc/, '')
  );
}

function componentSubpath(registration) {
  return SUBPATH_OVERRIDES[registration.tag] ?? `./${registration.tag.slice(3)}`;
}

async function buildComponents(webkitRoot, customElementsManifest) {
  const declarationsByName = new Map();
  for (const module of customElementsManifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      const candidates = declarationsByName.get(declaration.name) ?? [];
      candidates.push({ ...declaration, modulePath: module.path });
      declarationsByName.set(declaration.name, candidates);
    }
  }

  const registrations = await parseRegistrations(webkitRoot);
  return Promise.all(
    registrations.map(async (registration) => {
      const declaration = selectDeclaration(declarationsByName, registration);
      const classification = componentClassification(registration.tag);
      const decoratedPropertyNames = await contractPropertyNames(
        webkitRoot,
        registration,
        declaration,
      );
      const props = publicProperties(
        registration.tag,
        declaration,
        decoratedPropertyNames,
      );
      const events = await componentEvents(webkitRoot, registration, declaration);
      const slots = await componentSlots(webkitRoot, registration, declaration);
      const methods = publicMethods(declaration);
      const contract =
        registration.tag === 'sc-button'
          ? BUTTON_CONTRACT
          : registration.tag === 'sc-text-input'
            ? TEXT_INPUT_CONTRACT
          : {
              variants: [],
              tones: [],
              sizes: [],
              defaults: Object.fromEntries(
                props
                  .filter((property) => property.default !== undefined)
                  .map((property) => [property.reactProp, property.default]),
              ),
            };

      return {
        classification,
        rationale:
          classification === 'excluded'
            ? EXCLUDED_TAGS[registration.tag]
            : classification === 'supporting-only'
              ? 'Required internally by an included compound component; not a standalone React export.'
              : 'Included in the frozen public WebKit UI catalogue.',
        legacy: {
          tag: registration.tag,
          className: registration.className,
          elementModule: registration.elementModule,
          ...(registration.declarationModule
            ? { declarationModule: registration.declarationModule }
            : {}),
        },
        react:
          classification === 'excluded'
            ? null
            : {
                component:
                  classification === 'included' ? componentName(registration) : null,
                subpath: componentSubpath(registration),
                props,
                callbacks: events,
                composition: slots,
                imperativeHandle: methods,
              },
        contract: {
          properties: props.map(({ reactProp: _reactProp, ...property }) => property),
          events: events.map(({ reactCallback: _reactCallback, ...event }) => event),
          slots: slots.map(({ reactComposition: _reactComposition, ...slot }) => slot),
          methods: methods.map(({ reactHandleMethod: _reactHandleMethod, ...method }) => method),
          ...contract,
        },
        evidence: {
          runtimeFixture: `fixtures/runtime/${registration.tag}.html`,
          reactFixture: `fixtures/react/${registration.tag}.tsx`,
          sources: [
            registration.elementModule,
            ...(registration.declarationModule ? [registration.declarationModule] : []),
          ],
          customElementsManifest: Boolean(declaration),
        },
        deviations: APPROVED_DEVIATIONS.filter(
          (deviation) => deviation.legacyTag === registration.tag,
        ).map((deviation) => deviation.id),
      };
    }),
  );
}

function parsePublicExports(source, components) {
  const componentByClass = new Map(
    components.map((component) => [component.legacy.className, component]),
  );
  const exports = [];
  for (const match of source.matchAll(/^export\s*\{([^}]+)\}\s*from\s*["']([^"']+)["'];?/gm)) {
    for (const rawSpecifier of match[1].split(',')) {
      const specifier = rawSpecifier.trim();
      if (!specifier) continue;
      const [sourceName, exportedName] = specifier.split(/\s+as\s+/);
      const name = exportedName ?? sourceName;
      const component = componentByClass.get(sourceName);
      const classification = EXCLUDED_EXPORTS.has(name)
        ? 'excluded'
        : SUPPORTING_EXPORTS.has(name)
          ? 'supporting-only'
          : 'included';
      exports.push({
        name,
        sourceName,
        source: match[2],
        classification,
        reactExport:
          classification === 'included'
            ? component?.react?.component ?? name.replace(/^Sc/, '')
            : null,
        rationale:
          classification === 'excluded'
            ? 'The corresponding component is explicitly outside v2 scope.'
            : classification === 'supporting-only'
              ? 'Implementation support is represented by React composition or private utilities.'
              : 'Included public WebKit export.',
      });
    }
  }
  return exports.sort((left, right) => left.name.localeCompare(right.name));
}

async function buildTokens(webkitRoot) {
  const sourceFiles = (await listFiles(path.join(webkitRoot, 'src'))).filter((file) =>
    /(?:\.css|\.styles?\.ts)$/.test(file),
  );
  sourceFiles.push(...(await listFiles(path.join(webkitRoot, 'public/styles'))));
  const tokens = new Map();

  for (const file of sourceFiles.sort()) {
    const source = await readFile(file, 'utf8');
    const relativePath = toPosix(path.relative(webkitRoot, file));
    const definitionsByName = new Map();
    for (const match of source.matchAll(/(--sc-[A-Za-z0-9_-]+)\s*:\s*([^;}\n]+)/g)) {
      const definitions = definitionsByName.get(match[1]) ?? [];
      definitions.push({ source: relativePath, value: match[2].trim() });
      definitionsByName.set(match[1], definitions);
    }
    for (const match of source.matchAll(/--sc-[A-Za-z0-9_-]+/g)) {
      const token = tokens.get(match[0]) ?? {
        name: match[0],
        definitions: [],
        references: [],
      };
      const definitions = definitionsByName.get(match[0]) ?? [];
      for (const definition of definitions) {
        if (!token.definitions.some((entry) => JSON.stringify(entry) === JSON.stringify(definition))) {
          token.definitions.push(definition);
        }
      }
      if (!token.references.includes(relativePath)) token.references.push(relativePath);
      tokens.set(match[0], token);
    }
  }

  return [...tokens.values()]
    .map((token) => ({
      ...token,
      definitions: token.definitions.sort((left, right) =>
        `${left.source}:${left.value}`.localeCompare(`${right.source}:${right.value}`),
      ),
      references: token.references.sort(),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function buildMigrationMap(components) {
  return {
    schemaVersion: 1,
    baseline: {
      package: '@scdevkit/webkit',
      packageVersion: BASELINE_PACKAGE_VERSION,
      repositoryCommit: BASELINE_COMMIT,
    },
    mappings: components.map((component) => ({
      legacyTag: component.legacy.tag,
      classification: component.classification,
      rationale: component.rationale,
      reactComponent: component.react?.component ?? null,
      reactSubpath: component.react?.subpath ?? null,
      subpath: component.react?.subpath ?? null,
      props: component.react?.props ?? [],
      callbacks: component.react?.callbacks ?? [],
      composition: component.react?.composition ?? [],
      imperativeHandle: component.react?.imperativeHandle ?? [],
    })),
  };
}

function fixtureStates(component) {
  const propertyNames = new Set(
    component.contract.properties.map((property) => property.legacyProperty),
  );
  const states = ['default'];
  for (const state of [
    'disabled',
    'readonly',
    'invalid',
    'loading',
    'selected',
    'checked',
    'expanded',
    'open',
  ]) {
    if (propertyNames.has(state)) states.push(state === 'readonly' ? 'read-only' : state);
  }
  if (component.classification === 'included') {
    states.push('hover', 'focus-visible');
  }
  return [...new Set(states)];
}

function buildFixtureMatrix(components) {
  return {
    schemaVersion: 1,
    baseline: {
      package: '@scdevkit/webkit',
      packageVersion: BASELINE_PACKAGE_VERSION,
      repositoryCommit: BASELINE_COMMIT,
    },
    environment: {
      themes: ['light', 'dark', 'cpbb'],
      fontModes: ['default', 'inter', 'roboto-mono', 'dyslexic'],
      directions: ['ltr', 'rtl'],
      reducedMotion: [false, true],
    },
    fixtures: components.map((component) => ({
      id: component.legacy.tag,
      classification: component.classification,
      legacyTag: component.legacy.tag,
      reactComponent: component.react?.component ?? null,
      reactSubpath: component.react?.subpath ?? null,
      runtimeFixture: `runtime/${component.legacy.tag}.html`,
      reactFixture: `react/${component.legacy.tag}.tsx`,
      states: fixtureStates(component),
      variants: component.contract.variants,
      tones: component.contract.tones,
      sizes: component.contract.sizes,
      defaults: component.contract.defaults,
      properties: component.contract.properties,
      events: component.contract.events,
      slots: component.contract.slots,
      methods: component.contract.methods,
      interactions:
        component.classification === 'included'
          ? ['pointer', 'keyboard', 'programmatic']
          : [],
    })),
  };
}

function buildDeviationManifest(components) {
  const knownTags = new Set(components.map((component) => component.legacy.tag));
  for (const deviation of APPROVED_DEVIATIONS) {
    if (!knownTags.has(deviation.legacyTag)) {
      throw new Error(`Deviation references unknown component ${deviation.legacyTag}.`);
    }
  }
  return {
    schemaVersion: 1,
    baseline: {
      package: '@scdevkit/webkit',
      packageVersion: BASELINE_PACKAGE_VERSION,
      repositoryCommit: BASELINE_COMMIT,
    },
    deviations: APPROVED_DEVIATIONS,
  };
}

function buildEvidenceResolutions() {
  return {
    schemaVersion: 1,
    precedence: PRECEDENCE,
    resolutions: EVIDENCE_RESOLUTIONS,
  };
}

function renderRuntimeFixture(fixture) {
  const contract = JSON.stringify(fixture).replaceAll('<', '\\u003c');
  const proofMarkup = {
    'sc-button': '<sc-button type="primary" state="default" size="sm">Action</sc-button>',
    'sc-text-input': '<sc-text-input label="Account name" value="Ratan"></sc-text-input>',
    'sc-dialog': '<sc-dialog open label="Confirm action">Review the order.</sc-dialog>',
    'sc-date-picker': '<sc-date-picker label="Settlement date" value="2026-08-06"></sc-date-picker>',
    'sc-tab-group': '<sc-tab-group><sc-tab slot="nav" panel="positions" active>Positions</sc-tab><sc-tab slot="nav" panel="orders">Orders</sc-tab><sc-tab-panel name="positions" active>Position content</sc-tab-panel><sc-tab-panel name="orders">Order content</sc-tab-panel></sc-tab-group>',
    'sc-data-grid': '<div style="height: 320px"><sc-data-grid id="proof-data-grid"></sc-data-grid></div><script>const grid=document.querySelector("#proof-data-grid");grid.columns=[{property:"symbol",header:"Symbol",flex:1},{property:"quantity",header:"Quantity",flex:1}];grid.data=[{id:"1",symbol:"ALUM",quantity:10},{id:"2",symbol:"ZINC",quantity:20}];</script>',
  }[fixture.legacyTag];
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${fixture.legacyTag} WebKit parity fixture</title>
  </head>
  <body class="sc-mode-light" data-ratan-parity-fixture="${fixture.id}">
    <main style="box-sizing:border-box;padding:24px;width:640px">${proofMarkup ?? `<${fixture.legacyTag}></${fixture.legacyTag}>`}</main>
    <script id="ratan-fixture-contract" type="application/json">${contract}</script>
  </body>
</html>
`;
}

function renderReactFixture(fixture) {
  if (!fixture.reactComponent || fixture.classification !== 'included') {
    return `// ${fixture.legacyTag} is ${fixture.classification}; it has no standalone React fixture.\nexport {};\n`;
  }
  const proofFixture = {
    'sc-button': `import { Button } from '@fm/ratan-design/button';\nexport default function ButtonParityFixture(){return <Button variant="primary" tone="default" size="sm">Action</Button>;}\n`,
    'sc-text-input': `import { TextInput } from '@fm/ratan-design/text-input';\nexport default function TextInputParityFixture(){return <TextInput label="Account name" value="Ratan" readOnly/>;}\n`,
    'sc-dialog': `import { Dialog } from '@fm/ratan-design/dialog';\nexport default function DialogParityFixture(){return <Dialog open label="Confirm action">Review the order.</Dialog>;}\n`,
    'sc-date-picker': `import { DatePicker } from '@fm/ratan-design/date-picker';\nexport default function DatePickerParityFixture(){return <DatePicker label="Settlement date" value="2026-08-06"/>;}\n`,
    'sc-tab-group': `import { Tab,TabList,TabPanel,Tabs } from '@fm/ratan-design/tabs';\nexport default function TabsParityFixture(){return <Tabs defaultSelectedKey="positions" aria-label="Workspace"><TabList><Tab id="positions">Positions</Tab><Tab id="orders">Orders</Tab></TabList><TabPanel id="positions">Position content</TabPanel><TabPanel id="orders">Order content</TabPanel></Tabs>;}\n`,
    'sc-data-grid': `import { DataGrid,type DataGridColumn } from '@fm/ratan-design/data-grid';\ninterface Row{id:string;symbol:string;quantity:number} const columns:DataGridColumn<Row>[]=[{id:'symbol',header:'Symbol',accessor:'symbol'},{id:'quantity',header:'Quantity',accessor:'quantity'}];\nexport default function DataGridParityFixture(){return <DataGrid aria-label="Trades" height={320} data={[{id:'1',symbol:'ALUM',quantity:10},{id:'2',symbol:'ZINC',quantity:20}]} columns={columns}/>;}\n`,
  }[fixture.legacyTag];
  if (proofFixture) return proofFixture;
  const subpath = fixture.reactSubpath.replace(/^\.\//, '');
  return `import { ${fixture.reactComponent} } from '@fm/ratan-design/${subpath}';

export default function ${fixture.reactComponent}ParityFixture() {
  return <${fixture.reactComponent} />;
}
`;
}

async function writeFixtureFiles(fixturesRoot, fixtureMatrix) {
  await rm(fixturesRoot, { force: true, recursive: true });
  const runtimeRoot = path.join(fixturesRoot, 'runtime');
  const reactRoot = path.join(fixturesRoot, 'react');
  await mkdir(runtimeRoot, { recursive: true });
  await mkdir(reactRoot, { recursive: true });
  for (const fixture of fixtureMatrix.fixtures) {
    await writeFile(
      path.join(runtimeRoot, `${fixture.id}.html`),
      renderRuntimeFixture(fixture),
    );
    await writeFile(
      path.join(reactRoot, `${fixture.id}.tsx`),
      renderReactFixture(fixture),
    );
  }
  await writeFile(
    path.join(fixturesRoot, 'fixture-matrix.json'),
    `${JSON.stringify(fixtureMatrix, null, 2)}\n`,
  );
}

export function buildGeneratedTextArtifacts(baseline) {
  const fixtureMatrix = buildFixtureMatrix(baseline.components);
  const artifacts = new Map([
    [
      'ratan-design/packages/react/parity-manifest.json',
      `${JSON.stringify(baseline, null, 2)}\n`,
    ],
    [
      'ratan-design/packages/react/migration-map.json',
      `${JSON.stringify(buildMigrationMap(baseline.components), null, 2)}\n`,
    ],
    [
      'ratan-design/packages/react/deviation-manifest.json',
      `${JSON.stringify(buildDeviationManifest(baseline.components), null, 2)}\n`,
    ],
    [
      'ratan-design/manifests/parity-manifest.json',
      `${JSON.stringify(baseline, null, 2)}\n`,
    ],
    [
      'ratan-design/manifests/migration-map.json',
      `${JSON.stringify(buildMigrationMap(baseline.components), null, 2)}\n`,
    ],
    [
      'ratan-design/manifests/deviations.json',
      `${JSON.stringify(buildDeviationManifest(baseline.components), null, 2)}\n`,
    ],
    [
      'ratan-design/packages/react/tokens.json',
      `${JSON.stringify(
        {
          schemaVersion: 1,
          baseline: baseline.baseline,
          tokens: baseline.tokens,
        },
        null,
        2,
      )}\n`,
    ],
    [
      'ratan-design/apps/parity-lab/evidence-resolutions.json',
      `${JSON.stringify(buildEvidenceResolutions(), null, 2)}\n`,
    ],
    [
      'ratan-design/apps/parity-lab/fixtures/fixture-matrix.json',
      `${JSON.stringify(fixtureMatrix, null, 2)}\n`,
    ],
  ]);
  for (const fixture of fixtureMatrix.fixtures) {
    artifacts.set(
      `ratan-design/apps/parity-lab/fixtures/runtime/${fixture.id}.html`,
      renderRuntimeFixture(fixture),
    );
    artifacts.set(
      `ratan-design/apps/parity-lab/fixtures/react/${fixture.id}.tsx`,
      renderReactFixture(fixture),
    );
  }
  return artifacts;
}

export async function buildBaseline({ repositoryRoot }) {
  const webkitRoot = path.join(repositoryRoot, 'sc-dev-web/sc-dev-web');
  const packageJson = JSON.parse(await readFile(path.join(webkitRoot, 'package.json'), 'utf8'));
  if (packageJson.version !== BASELINE_PACKAGE_VERSION) {
    throw new Error(
      `Expected @scdevkit/webkit ${BASELINE_PACKAGE_VERSION}, received ${packageJson.version}`,
    );
  }
  const customElementsManifest = JSON.parse(
    await readFile(path.join(webkitRoot, 'custom-elements.json'), 'utf8'),
  );
  const components = await buildComponents(webkitRoot, customElementsManifest);
  const sourceIndex = await readFile(path.join(webkitRoot, 'src/index.ts'), 'utf8');
  const exports = parsePublicExports(sourceIndex, components);
  const tokens = await buildTokens(webkitRoot);
  const assets = {
    styles: await inventoryFiles(path.join(repositoryRoot, SOURCE_STYLES)),
    fonts: await inventoryFiles(path.join(repositoryRoot, SOURCE_FONTS)),
    icons: await inventoryFiles(path.join(repositoryRoot, SOURCE_ICONS)),
  };
  const unresolvedComponents = components.filter(
    (component) =>
      component.classification === 'unresolved' ||
      (component.classification === 'included' && !component.react?.component),
  );
  const unresolvedExports = exports.filter(
    (entry) => entry.classification === 'unresolved',
  );
  const summary = {
    components: components.length,
    included: components.filter((component) => component.classification === 'included')
      .length,
    supportingOnly: components.filter(
      (component) => component.classification === 'supporting-only',
    ).length,
    excluded: components.filter((component) => component.classification === 'excluded')
      .length,
    exports: exports.length,
    tokens: tokens.length,
    unresolved: unresolvedComponents.length + unresolvedExports.length,
  };

  return {
    schemaVersion: 1,
    baseline: {
      package: '@scdevkit/webkit',
      packageVersion: BASELINE_PACKAGE_VERSION,
      repositoryCommit: BASELINE_COMMIT,
      customElementsManifestSchema: customElementsManifest.schemaVersion,
    },
    precedence: PRECEDENCE,
    scope: {
      included:
        'Public WebKit UI catalogue, supporting parts, built-in icons, Table, DataView, and complete DataGrid.',
      excluded: [
        'DashboardViewer and vendor dashboard integrations',
        'Tour',
        'Legacy RichTextEditor',
        'DocumentImageViewer',
        'Sibling sc-dev-web packages',
      ],
    },
    summary,
    components,
    exports,
    assets,
    tokens,
  };
}

async function copyInventory(sourceDirectory, targetDirectory) {
  await rm(targetDirectory, { force: true, recursive: true });
  for (const sourceFile of await listFiles(sourceDirectory)) {
    const relativePath = path.relative(sourceDirectory, sourceFile);
    const targetFile = path.join(targetDirectory, relativePath);
    await mkdir(path.dirname(targetFile), { recursive: true });
    await copyFile(sourceFile, targetFile);
  }
}

export async function generateBaseline({ repositoryRoot }) {
  const baseline = await buildBaseline({ repositoryRoot });
  if (baseline.summary.unresolved !== 0) {
    throw new Error(`Parity baseline has ${baseline.summary.unresolved} unresolved entries.`);
  }
  const packageRoot = path.join(repositoryRoot, 'ratan-design/packages/react');
  const parityRoot = path.join(repositoryRoot, 'ratan-design/apps/parity-lab');
  await rm(path.join(parityRoot, 'fixtures'), { force: true, recursive: true });
  for (const [relativePath, content] of buildGeneratedTextArtifacts(baseline)) {
    const target = path.join(repositoryRoot, relativePath);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content);
  }
  await copyInventory(
    path.join(repositoryRoot, SOURCE_STYLES),
    path.join(packageRoot, 'src/styles/frozen'),
  );
  await copyInventory(
    path.join(repositoryRoot, SOURCE_FONTS),
    path.join(packageRoot, 'src/assets/fonts'),
  );
  await copyInventory(
    path.join(repositoryRoot, SOURCE_ICONS),
    path.join(packageRoot, 'src/icons/svg'),
  );
  return baseline;
}

const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
if (invokedFile === fileURLToPath(import.meta.url)) {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
  const baseline = await generateBaseline({ repositoryRoot });
  process.stdout.write(
    `Generated ${baseline.summary.components} component contracts and ${baseline.summary.tokens} tokens.\n`,
  );
}
