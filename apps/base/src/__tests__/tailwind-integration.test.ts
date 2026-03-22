import fs from 'node:fs';
import path from 'node:path';

describe('apps/base Tailwind integration', () => {
  it('keeps Tailwind wired through the shared stylesheet entrypoint', () => {
    const tailwindPath = path.resolve(__dirname, '..', 'styles', 'tailwind.css');
    const tailwindSource = fs.readFileSync(tailwindPath, 'utf8');

    expect(tailwindSource).toContain('@import "tailwindcss/theme" layer(theme);');
    expect(tailwindSource).toContain('@import "tailwindcss/utilities" layer(utilities);');
    expect(tailwindSource).not.toContain('@import "tailwindcss";');
    expect(tailwindSource).toContain(':where(.aui-root :where(button, input, textarea, select))');
  });

  it('imports the global Tailwind stylesheet from the root entrypoint', () => {
    const rootPath = path.resolve(__dirname, '..', 'root.tsx');
    const rootSource = fs.readFileSync(rootPath, 'utf8');

    expect(rootSource).toContain("import './styles/tailwind.css';");
  });

  it('injects emitted CSS through the SystemJS-loaded JavaScript bundle', () => {
    const rsbuildConfigPath = path.resolve(__dirname, '..', '..', 'rsbuild.config.ts');
    const rsbuildConfigSource = fs.readFileSync(rsbuildConfigPath, 'utf8');

    expect(rsbuildConfigSource).toContain('injectStyles: true');
  });

  it('keeps emitted JavaScript and CSS at the asset root for the remote entry', () => {
    const rsbuildConfigPath = path.resolve(__dirname, '..', '..', 'rsbuild.config.ts');
    const rsbuildConfigSource = fs.readFileSync(rsbuildConfigPath, 'utf8');

    expect(rsbuildConfigSource).toContain('js: \'\'');
    expect(rsbuildConfigSource).toContain('css: \'\'');
  });
});
