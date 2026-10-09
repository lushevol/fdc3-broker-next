import { readFileSync } from 'node:fs';
const login = JSON.parse(readFileSync(new URL('./fixtures/login.json', import.meta.url), 'utf8'));
const authorization = 'Bearer eyJhbGciOiJub25lIn0.eyJzdWIiOiJtb2NrLmNhc2hmbG93IiwiZXhwIjo0MTAyNDQ0ODAwLCJpYXQiOjE3MDAwMDAwMDB9.';

/** Only installed by webpack.host.config.js; no production API behavior. */
export function installMockApi(app) {
  app.use('/api', (request, response) => {
    response.setHeader('single-ui-authorization', authorization);
    response.setHeader('x-mfe-base-fixture', 'original-runtime-copy');
    response.setHeader('Cache-Control', 'no-store');
    if (request.path === '/auth/v2/sso/login' || request.path === '/auth/v3/sso/login') {
      response.json(login);
      return;
    }
    if (request.path === '/auth/v2/sso/validate') {
      response.json({ result: true });
      return;
    }
    if (request.path === '/auth/v2/sso/extend') {
      response.json({ result: 'success' });
      return;
    }
    response.json({ data: [], items: [], results: [], total: 0 });
  });
}
