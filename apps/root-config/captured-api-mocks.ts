import type { IncomingMessage, ServerResponse } from 'node:http';
import type { RequestHandler } from '@rsbuild/core';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type CapturedApiRequest = {
  method: HttpMethod;
  pathname: string;
  query?: Record<string, string>;
  bodyIncludes?: string[];
};

type CapturedApiResponse = {
  status: number;
  body: unknown;
};

export type CapturedApiFixture = {
  name: string;
  request: CapturedApiRequest;
  response: CapturedApiResponse;
};

export type CapturedApiMockMiddleware = RequestHandler & {
  path?: string;
};

function toBodyText(body: unknown): string {
  if (body === undefined || body === null) {
    return '';
  }

  if (typeof body === 'string') {
    return body;
  }

  return JSON.stringify(body);
}

function fixtureMatchesRequestMetadata(
  fixture: CapturedApiFixture,
  method: string,
  requestUrl: URL,
): boolean {
  if (fixture.request.method !== method.toUpperCase()) {
    return false;
  }

  if (fixture.request.pathname !== requestUrl.pathname) {
    return false;
  }

  const query = fixture.request.query ?? {};
  return Object.entries(query).every(([key, value]) => requestUrl.searchParams.get(key) === value);
}

function countFixtureMarkers(fixture: CapturedApiFixture): number {
  return (
    Object.keys(fixture.request.query ?? {}).length + (fixture.request.bodyIncludes ?? []).length
  );
}

function compareFixtureSpecificity(
  fixtureA: CapturedApiFixture,
  fixtureB: CapturedApiFixture,
): number {
  return countFixtureMarkers(fixtureB) - countFixtureMarkers(fixtureA);
}

async function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let body = '';

    req.on('data', (chunk: Buffer | string) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      resolve(body);
    });
  });
}

export function findCapturedApiFixture(
  fixtures: CapturedApiFixture[],
  method: string,
  originalUrl: string,
  body: unknown,
): CapturedApiFixture | undefined {
  const requestUrl = new URL(originalUrl, 'http://localhost');
  const bodyText = toBodyText(body);

  return [...fixtures]
    .sort(compareFixtureSpecificity)
    .find((fixture) => {
      if (!fixtureMatchesRequestMetadata(fixture, method, requestUrl)) {
        return false;
      }

      return (fixture.request.bodyIncludes ?? []).every((marker) => bodyText.includes(marker));
    });
}

export function createCapturedApiMockMiddleware(
  fixtures: CapturedApiFixture[],
): CapturedApiMockMiddleware {
  const middleware = (async (req, res, next) => {
    const method = req.method ?? 'GET';
    const originalUrl = req.url ?? '';
    const requestUrl = new URL(originalUrl, 'http://localhost');
    const candidateFixtures = fixtures.filter((fixture) =>
      fixtureMatchesRequestMetadata(fixture, method, requestUrl),
    );

    if (candidateFixtures.length === 0) {
      if (typeof next === 'function') {
        next();
      }
      return;
    }

    const shouldReadBody =
      ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) &&
      candidateFixtures.some((fixture) => (fixture.request.bodyIncludes ?? []).length > 0);
    const body = shouldReadBody ? await readRequestBody(req) : '';
    const fixture = findCapturedApiFixture(candidateFixtures, method, originalUrl, body);

    if (!fixture) {
      if (typeof next === 'function') {
        next();
      }
      return;
    }

    (res as ServerResponse).statusCode = fixture.response.status;
    (res as ServerResponse).setHeader('Content-Type', 'application/json');
    (res as ServerResponse).end(JSON.stringify(fixture.response.body));
  }) as CapturedApiMockMiddleware;

  middleware.path = '__capturedApiMocks';

  return middleware;
}
