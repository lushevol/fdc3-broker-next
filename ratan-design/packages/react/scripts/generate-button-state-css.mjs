import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const variants = ['primary', 'secondary', 'text', 'link'];
const tones = ['default', 'error', 'alert', 'success'];
const states = ['default', 'hover', 'press', 'select'];
const channels = ['background', 'border', 'text'];
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function tokenName(variant, tone, state, channel) {
  const tonePart = tone === 'default' ? '' : `-${tone}`;
  const statePart = state === 'default' ? '' : `-${state}`;
  return `--sc-button-${variant}${tonePart}${statePart}-${channel}-color`;
}

const lines = [
  '/* Generated from the frozen Button state naming contract. */',
  '@layer ratan-components {',
];

for (const variant of variants) {
  for (const tone of tones) {
    lines.push(
      `  [data-ratan-component='Button'][data-variant='${variant}'][data-tone='${tone}'] {`,
    );
    for (const state of states) {
      for (const channel of channels) {
        const fallback = channel === 'text' && state === 'hover' ? ', var(--_default-text)' : '';
        lines.push(
          `    --_${state}-${channel}: var(${tokenName(variant, tone, state, channel)}${fallback});`,
        );
      }
    }
    lines.push('  }', '');
  }

  lines.push(
    `  [data-ratan-component='Button'][data-variant='${variant}']:disabled {`,
    `    --_default-background: var(--sc-button-${variant}-disabled-background-color);`,
    `    --_default-border: var(--sc-button-${variant}-disabled-border-color);`,
    `    --_default-text: var(--sc-button-${variant}-disabled-text-color);`,
    '  }',
    '',
  );
}

for (const variant of ['primary', 'secondary']) {
  lines.push(
    `  [data-ratan-component='Button'][data-variant='${variant}'][data-tone='default'][data-inverse='true'] {`,
  );
  for (const state of ['default', 'hover', 'press']) {
    for (const channel of channels) {
      const statePart = state === 'default' ? '' : `-${state}`;
      lines.push(
        `    --_${state}-${channel}: var(--sc-button-${variant}-inverse${statePart}-${channel}-color);`,
      );
    }
  }
  lines.push('  }', '');
}

lines.push('}', '');

await writeFile(
  path.join(packageRoot, 'src/components/button/button-states.css'),
  lines.join('\n'),
);
