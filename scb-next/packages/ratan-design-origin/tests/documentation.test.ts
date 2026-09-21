import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readPackageFile = (name: string) => readFileSync(resolve(process.cwd(), name), 'utf8');

describe('public contract documentation', () => {
  const readme = readPackageFile('README.md');
  const packageJson = JSON.parse(readPackageFile('package.json')) as {
    peerDependenciesMeta: Record<string, { optional?: boolean }>;
  };
  const webkitSources = JSON.parse(readPackageFile('assets/webkit-sources.json')) as {
    fonts: string[];
  };

  it('names every packaged font and makes legacy Poppins ownership explicit', () => {
    expect(readme).toContain('Poppins is host-provided');
    expect(readme).toContain("import 'ratan-design-origin/styles.css'");
    for (const font of webkitSources.fonts) expect(readme).toContain(font);
  });

  it('lists every optional peer as host-owned', () => {
    const optionalPeers = Object.entries(packageJson.peerDependenciesMeta)
      .filter(([, metadata]) => metadata.optional)
      .map(([name]) => name);

    expect(optionalPeers.length).toBeGreaterThan(0);
    for (const peer of optionalPeers) expect(readme).toContain(`\`${peer}\``);
    expect(readme).toMatch(/Hosts own localization,\s+timezone, format and validation policy/);
    expect(readme).toContain('MUI X Pro licensing and license initialization');
  });

  it('links contract examples and every public catalog source', () => {
    expect(readme).toContain('fixtures/consumer/src/contracts.tsx');
    expect(readme).toContain('fixtures/consumer/src/dates.tsx');
    for (const story of [
      'Controls.stories.tsx',
      'Dates.stories.tsx',
      'Builder.stories.tsx',
      'Dialog.stories.tsx',
      'Feedback.stories.tsx',
      'StatePresentation.stories.tsx',
    ]) {
      expect(readme).toContain(`stories/${story}`);
    }
  });

  it('publishes the required contract-matrix dimensions', () => {
    expect(readme).toContain('## Public contract matrix');
    for (const dimension of [
      'Values and defaults',
      'Callbacks and refs',
      'Accessibility and keyboard',
      'Customization and precedence',
    ]) {
      expect(readme).toContain(dimension);
    }
    expect(readme).toContain('Compatibility-only exports');
  });
});
