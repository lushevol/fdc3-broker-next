const { readFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { resolve } = require('node:path');
const record = JSON.parse(readFileSync(resolve(__dirname, '../vendor/artifact.json'), 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
if (hash(readFileSync(resolve(__dirname, '../vendor', record.filename))) !== record.sha256) {
  throw new Error('Ratan Design artifact checksum does not match its source record');
}
for (const [path, expected] of Object.entries(record.packedFiles)) {
  if (hash(readFileSync(resolve(__dirname, '../node_modules/ratan-design-origin', path))) !== expected) {
    throw new Error(`Installed design package differs from the pinned artifact: ${path}`);
  }
}
console.info(`${record.name}@${record.version} artifact and installed files verified (source digest ${record.sourceFilesSha256})`);
