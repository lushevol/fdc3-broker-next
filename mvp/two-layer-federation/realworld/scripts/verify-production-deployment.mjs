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
  registries[environment] = validateRuntimeRegistry(
    await readJson(path.join(runtimeRoot, 'registries', 'active', `${environment}.json`)),
    { trustedOrigins: [publicOrigin] },
  );
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
  const registry = validateRuntimeRegistry(JSON.parse(registryResponse.body), {
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
