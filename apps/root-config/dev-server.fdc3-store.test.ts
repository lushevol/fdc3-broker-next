import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createFileBackedFdc3Store } from './dev-server';

describe('file-backed FDC3 store', () => {
  let dir: string;
  let declarationsPath: string;
  let intentsPath: string;
  let contextsPath: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fdc3-store-'));
    declarationsPath = path.join(dir, 'fdc3-definitions.json');
    intentsPath = path.join(dir, 'intents.json');
    contextsPath = path.join(dir, 'contexts.json');
    fs.writeFileSync(declarationsPath, '[]');
    fs.writeFileSync(intentsPath, '[]');
    fs.writeFileSync(contextsPath, '[]');
  });

  test('creates, updates, and deletes declarations in the JSON file', () => {
    const store = createFileBackedFdc3Store({
      declarations: declarationsPath,
      intents: intentsPath,
      contexts: contextsPath,
    });

    store.createDeclaration({ appId: 'demo', interop: { intents: { listensFor: [] } } });
    store.updateDeclaration({ appId: 'demo', interop: { intents: { raises: [] } } });

    expect(JSON.parse(fs.readFileSync(declarationsPath, 'utf8'))).toEqual([
      { appId: 'demo', interop: { intents: { raises: [] } } },
    ]);

    store.deleteDeclaration({ appId: 'demo' });

    expect(JSON.parse(fs.readFileSync(declarationsPath, 'utf8'))).toEqual([]);
  });
});
