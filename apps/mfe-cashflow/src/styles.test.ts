import { readFileSync } from 'node:fs';

it('keeps application styles below the application root', () => {
  const css = readFileSync('src/styles.css', 'utf8');
  expect(css).not.toMatch(/(^|[}\s,])(html|body|:root|\*)\s*[{,]/m);
  expect(css).toContain('.cashflow-app');
});
