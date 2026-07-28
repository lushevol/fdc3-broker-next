import {
  COLOR_TOKEN_NAMES,
  DENSITY_TOKEN_NAMES,
  type SemanticTokens,
} from './tokens';

function kebabCase(value: string): string {
  return value
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function declarations(
  prefix: string,
  names: readonly string[],
  values: Readonly<Record<string, string>>,
) {
  return names
    .map((name) => `    --ratan-${prefix}-${kebabCase(name)}: ${values[name]};`)
    .join('\n');
}

export function generateTokenCss(tokens: SemanticTokens): string {
  const foundationNames = Object.keys(tokens.foundation);
  return `@layer ratan.tokens, ratan.foundation, ratan.components;

@layer ratan.tokens {
  .ratan-design-root {
${declarations('', foundationNames, tokens.foundation).replaceAll('--ratan--', '--ratan-')}
    min-height: inherit;
    color: var(--ratan-color-content-primary);
    background: var(--ratan-color-surface-default);
    font-family: var(--ratan-font-family);
    font-size: var(--ratan-font-size-body);
    line-height: var(--ratan-line-height-body);
  }

  .ratan-design-root[data-ratan-theme="light"] {
${declarations('color', COLOR_TOKEN_NAMES, tokens.color.light)}
    color-scheme: light;
  }

  .ratan-design-root[data-ratan-theme="dark"] {
${declarations('color', COLOR_TOKEN_NAMES, tokens.color.dark)}
    color-scheme: dark;
  }

  .ratan-design-root[data-ratan-density="compact"] {
${declarations('', DENSITY_TOKEN_NAMES, tokens.density.compact).replaceAll('--ratan--', '--ratan-')}
  }

  .ratan-design-root[data-ratan-density="comfortable"] {
${declarations('', DENSITY_TOKEN_NAMES, tokens.density.comfortable).replaceAll('--ratan--', '--ratan-')}
  }
}

@layer ratan.foundation {
  .ratan-design-root :where(button, input, textarea, select):focus-visible {
    outline: var(--ratan-focus-width) solid var(--ratan-color-focus-ring);
    outline-offset: var(--ratan-focus-offset);
  }
}
`;
}
