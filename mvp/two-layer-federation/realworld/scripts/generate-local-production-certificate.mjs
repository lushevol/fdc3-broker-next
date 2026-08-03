import { execFileSync } from 'node:child_process';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const realworldRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tlsDirectory = path.join(realworldRoot, 'devops', 'tls');
const certificate = path.join(tlsDirectory, 'tls.crt');
const privateKey = path.join(tlsDirectory, 'tls.key');

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

await mkdir(tlsDirectory, { recursive: true });
if (!(await exists(certificate)) || !(await exists(privateKey))) {
  execFileSync(
    'openssl',
    [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-nodes',
      '-sha256',
      '-days',
      '30',
      '-subj',
      '/CN=localhost',
      '-addext',
      'subjectAltName=DNS:localhost,IP:127.0.0.1',
      '-keyout',
      privateKey,
      '-out',
      certificate,
    ],
    { stdio: 'inherit' },
  );
  console.log(`Created local-only TLS certificate in ${tlsDirectory}`);
} else {
  console.log(`Reusing local-only TLS certificate in ${tlsDirectory}`);
}
