import https from 'node:https';
import { lstat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { digestDirectory, validateRuntimeRegistry } from './production-deployment-lib.mjs';

const realworldRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runtimeRoot = path.join(realworldRoot, 'devops', 'runtime');

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

function request(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { rejectUnauthorized: false }, (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () =>
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          }),
        );
      })
      .on('error', reject);
  });
}

const build = await readJson(path.join(runtimeRoot, 'catalog', 'build.json'));
const environmentConfiguration = await readJson(
  path.join(realworldRoot, 'devops', 'registry', 'environments.json'),
);
for (const metadata of Object.values(build.releases)) {
  const artifactRoot = path.join(runtimeRoot, metadata.artifactPath);
  const actualDigest = await digestDirectory(artifactRoot);
  if (actualDigest !== metadata.digest)
    throw new Error(`Digest mismatch for ${metadata.applicationId}`);
}

const registries = {};
for (const environment of ['dev', 'test']) {
  const publicOrigin = new URL(environmentConfiguration[environment].publicOrigin).origin;
  const pointer = await readJson(
    path.join(runtimeRoot, 'registries', 'active', `${environment}.pointer.json`),
  );
  const revision = await readJson(path.join(runtimeRoot, pointer.revisionUrl.replace(/^\//, '')));
  if (revision.revisionId !== pointer.revisionId) {
    throw new Error(`${environment} registry pointer does not match its immutable revision`);
  }
  registries[environment] = validateRuntimeRegistry(revision.registry, {
    trustedOrigins: [publicOrigin],
  });
  const hostLink = await lstat(path.join(runtimeRoot, 'environments', environment, 'host'));
  if (!hostLink.isSymbolicLink())
    throw new Error(`${environment} host activation is not an atomic symlink`);
}

for (const devEntry of registries.dev.applications) {
  const testEntry = registries.test.applications.find((entry) => entry.id === devEntry.id);
  if (new URL(testEntry?.manifestUrl).pathname !== new URL(devEntry.manifestUrl).pathname) {
    throw new Error(`${devEntry.id} was rebuilt between dev and test`);
  }
  const manifest = await readJson(path.join(runtimeRoot, new URL(devEntry.manifestUrl).pathname));
  if (manifest.metaData?.publicPath !== 'auto') {
    throw new Error(`${devEntry.id} manifest does not use deployment-relative publicPath`);
  }
}

const urls = process.argv
  .filter((argument) => argument.startsWith('--url='))
  .map((argument) => argument.slice(6));
for (const baseUrl of urls) {
  const registryResponse = await request(`${baseUrl}/registry.json`);
  if (registryResponse.status !== 200)
    throw new Error(`${baseUrl} registry returned ${registryResponse.status}`);
  if (!String(registryResponse.headers['cache-control']).includes('no-store')) {
    throw new Error(`${baseUrl} active registry is cacheable`);
  }
  const trustedOrigin = new URL(baseUrl).origin;
  const pointer = JSON.parse(registryResponse.body);
  const revisionResponse = await request(`${baseUrl}${pointer.revisionUrl}`);
  if (revisionResponse.status !== 200) {
    throw new Error(`${baseUrl} registry revision returned ${revisionResponse.status}`);
  }
  if (!String(revisionResponse.headers['cache-control']).includes('immutable')) {
    throw new Error(`${baseUrl} registry revision lacks immutable cache policy`);
  }
  const revision = JSON.parse(revisionResponse.body);
  if (revision.revisionId !== pointer.revisionId) {
    throw new Error(`${baseUrl} registry pointer does not match its immutable revision`);
  }
  const registry = validateRuntimeRegistry(revision.registry, {
    trustedOrigins: [trustedOrigin],
  });
  const manifestResponse = await request(registry.applications[0].manifestUrl);
  if (manifestResponse.status !== 200)
    throw new Error(`${baseUrl} manifest returned ${manifestResponse.status}`);
  if (!String(manifestResponse.headers['cache-control']).includes('immutable')) {
    throw new Error(`${baseUrl} immutable artifact lacks immutable cache policy`);
  }
  const health = await request(`${baseUrl}/healthz`);
  if (health.status !== 200) throw new Error(`${baseUrl} health returned ${health.status}`);
}

console.log(
  `Verified ${Object.keys(build.releases).length} releases across dev and test${urls.length ? ' with live HTTPS checks' : ''}.`,
);
