import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('native custom element runtime', () => {
  it('does not depend on scoped registry mixins', () => {
    const source = resolve(import.meta.dirname, '../src');
    const pending = [source];
    const files: string[] = [];
    while (pending.length) {
      const directory = pending.pop()!;
      readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory()) pending.push(path);
        else if (entry.name.endsWith('.ts')) files.push(path);
      });
    }
    const imports = files.filter((file) => {
      const sourceText = readFileSync(file, 'utf8');
      return sourceText.includes('ScopedElementsMixin') || sourceText.includes('@customElement(');
    });

    expect(imports).toEqual([]);
  });

  it('guards global registrations for independently loaded remotes', () => {
    const directory = resolve(import.meta.dirname, '../elements');
    const files = readdirSync(directory).filter((file) => file.endsWith('.ts'));
    const unguarded = files.flatMap((file) => {
      const lines = readFileSync(resolve(directory, file), 'utf8').split('\n');
      return lines.flatMap((line, index) => {
        if (!line.includes('window.customElements.define(')) return [];
        const guard = lines.slice(Math.max(0, index - 3), index + 1).join('\n');
        return guard.includes('if (!window.customElements.get(') ? [] : [`${file}: ${line.trim()}`];
      });
    });

    expect(unguarded).toEqual([]);
  });
});
