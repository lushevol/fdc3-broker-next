import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const fixturesRoot = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');
const mockAuthorization =
  'Bearer eyJhbGciOiJub25lIn0.eyJzdWIiOiJtb2NrLmNhc2hmbG93IiwiZXhwIjo0MTAyNDQ0ODAwLCJpYXQiOjE3MDAwMDAwMDB9.';

function sendFixture(response, fixtureName) {
  response.statusCode = 200;
  response.setHeader('content-type', 'application/json');
  response.setHeader('single-ui-authorization', mockAuthorization);
  response.end(readFileSync(join(fixturesRoot, fixtureName), 'utf8'));
}

function sendJson(response, body) {
  response.statusCode = 200;
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(body));
}

function sendText(response, body, contentType) {
  response.statusCode = 200;
  response.setHeader('content-type', contentType);
  response.end(body);
}

function journeyFixture(selector) {
  const fixture = JSON.parse(readFileSync(join(fixturesRoot, 'cashflow-journey.json'), 'utf8'));
  return fixture[selector];
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

export function createMockApiMiddleware({ serviceName = 'single-ui-bff' } = {}) {
  const notificationSessions = new Map();
  const responseServiceName = /^[a-z0-9][a-z0-9-]*$/.test(serviceName) ? serviceName : 'unknown';

  return async (request, response, next) => {
    response.setHeader('x-scb-next-mock-service', responseServiceName);
    const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1');
    const { pathname } = requestUrl;

    if (pathname.startsWith('/api/alpha-payments/')) {
      next();
      return;
    }

    if (pathname === '/healthz') {
      sendJson(response, { status: 'ok', service: 'scb-next-mock-bff' });
      return;
    }

    if (request.method === 'POST' && pathname === '/api/auth/v2/sso/login') {
      sendFixture(response, 'login.json');
      return;
    }

    if (pathname === '/api/auth/v2/sso/validate') {
      sendJson(response, { result: true });
      return;
    }

    if (pathname === '/api/ratan/rule/v1/fields/versions') {
      sendJson(response, {
        ratan_suppression_fields_config: { activedVersion: 'acceptance-v1' },
        ratan_suppression_fields: { activedVersion: 'acceptance-v1' },
      });
      return;
    }

    if (pathname === '/api/ratan/rule/v1/fields') {
      sendFixture(response, 'fields.json');
      return;
    }

    if (pathname === '/api/ratan/notification/subscriptions/info') {
      sendJson(response, { websocket: false, cookie_needed: false, origins: ['*:*'], entropy: 1 });
      return;
    }

    const notificationTransport = pathname.match(
      /^(\/api\/ratan\/notification\/subscriptions\/\d+\/[^/]+)\/(jsonp|jsonp_send|xhr|xhr_send)$/,
    );
    if (notificationTransport?.[2] === 'xhr_send') {
      await readBody(request);
      response.statusCode = 204;
      response.end();
      return;
    }
    if (notificationTransport?.[2] === 'jsonp_send') {
      await readBody(request);
      sendText(response, 'ok', 'text/plain; charset=UTF-8');
      return;
    }
    if (['jsonp', 'xhr'].includes(notificationTransport?.[2])) {
      const session = notificationTransport[1];
      const pollCount = notificationSessions.get(session) ?? 0;
      notificationSessions.set(session, pollCount + 1);
      const callbackCandidate = requestUrl.searchParams.get('c') ?? '_jp';
      const callback = /^[A-Za-z_$][\w.$]*$/.test(callbackCandidate) ? callbackCandidate : '_jp';
      const connectedFrame = 'CONNECTED\nversion:1.1\nheart-beat:0,0\n\n\u0000';
      const frame =
        pollCount === 0 ? 'o' : pollCount === 1 ? `a[${JSON.stringify(connectedFrame)}]` : 'h';
      if (notificationTransport[2] === 'xhr') {
        // Keep heartbeat polling bounded; JSONP fallback can race a removed workspace.
        if (pollCount > 1) await new Promise((resolve) => setTimeout(resolve, 100));
        sendText(response, `${frame}\n`, 'application/javascript; charset=UTF-8');
        return;
      }
      sendText(
        response,
        `${callback}(${JSON.stringify(frame)});\r\n`,
        'application/javascript; charset=UTF-8',
      );
      return;
    }

    if (/^\/api\/ratan\/v[23]\/customview\/filters/.test(pathname)) {
      sendJson(response, journeyFixture('filters'));
      return;
    }

    if (/^\/api\/ratan\/v[23]\/customview\/views/.test(pathname)) {
      sendJson(response, journeyFixture('views'));
      return;
    }

    if (pathname === '/api/ratan/v1/accounting/fetch/M0P56753524') {
      sendJson(response, []);
      return;
    }

    if (pathname === '/api/ratan/v1/cashflow/currency/holiday') {
      sendJson(response, journeyFixture('holiday'));
      return;
    }

    if (/^\/api\/ratan\/.*cashflows/.test(pathname)) {
      const body = request.method === 'POST' ? await readBody(request) : '';
      if (body.includes('graphCashFlowDetails') && body.includes('M0P56753524')) {
        sendJson(response, journeyFixture('details'));
        return;
      }
      if (body.includes('RatanUltraQuery') && body.includes('M0P56753524')) {
        sendJson(response, journeyFixture('search'));
        return;
      }
      if (body.includes('Pending Verification')) {
        sendJson(response, journeyFixture('emptyMetric'));
        return;
      }
      if (body.includes('Pending Operator')) {
        sendJson(response, journeyFixture('metric'));
        return;
      }
      sendFixture(response, 'cashflows.json');
      return;
    }

    if (pathname.startsWith('/api/')) {
      sendJson(response, { data: [], items: [], results: [], total: 0 });
      return;
    }

    next();
  };
}
