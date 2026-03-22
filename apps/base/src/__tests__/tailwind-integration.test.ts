import fs from 'node:fs';
import path from 'node:path';

describe('apps/base Tailwind integration', () => {
  it('configures webpack css handling with postcss-loader', () => {
    process.env.orgName = 'fm';
    process.env.port = '8080';

    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const configFactory = require('../../webpack.config.js');
    const config = configFactory({}, { mode: 'development' });
    const cssRule = config.module.rules.find(
      (rule: { test?: RegExp }) => String(rule.test) === '/\\.css$/i',
    );

    expect(cssRule).toBeDefined();
    expect(cssRule.use).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          loader: expect.stringContaining('postcss-loader'),
        }),
      ]),
    );
  });

  it('imports the global Tailwind stylesheet from the root entrypoint', () => {
    const rootPath = path.resolve(__dirname, '..', 'root.tsx');
    const rootSource = fs.readFileSync(rootPath, 'utf8');

    expect(rootSource).toContain("import './styles/tailwind.css';");
  });

  it('keeps standalone publicPath relative so single-spa standalone loading works', () => {
    process.env.orgName = 'fm';
    process.env.port = '8001';

    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const configFactory = require('../../webpack.config.js');
    const config = configFactory({ standalone: true }, { mode: 'development' });

    expect(config.output.publicPath).toBe('');
  });
});
