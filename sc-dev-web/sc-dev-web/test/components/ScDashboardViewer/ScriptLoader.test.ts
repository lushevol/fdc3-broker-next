import { ScriptLoader } from '../../../src/components/ScDashboardViewer/ScriptLoader.js';

const scriptSource = 'https://uattreasuryanalytics.global.standardchartered.com/javascripts/api/tableau.embedding.3.latest.js';

describe('ScriptLoader', () => {
  beforeEach(() => {
    (ScriptLoader as any).loadedScripts = {};
  });

  it('should load a script successfully', async () => {
    jest.spyOn(document.body, 'appendChild').mockImplementation(node => {
      (node as HTMLBodyElement).onload?.(new Event('load'));
      return node;
    });

    expect(async () => await ScriptLoader.loadScript(scriptSource)).not.toThrow();

    const loadedScripts = await ScriptLoader.getLoadedScripts();
    expect(loadedScripts.pending.length).toBe(0);
    expect(loadedScripts.resolved.length).toBe(1);
    expect(loadedScripts.rejected.length).toBe(0);
  });

  it('should handle script loading error', async () => {
    jest.spyOn(document.body, 'appendChild').mockImplementation(node => {
      (node as HTMLBodyElement).onerror?.(new Event('Network error'));
      return node;
    });

    await expect(ScriptLoader.loadScript(scriptSource)).rejects.toThrow(`Failed to load script: ${scriptSource}`);

    const loadedScripts = await ScriptLoader.getLoadedScripts();
    expect(loadedScripts.pending.length).toBe(0);
    expect(loadedScripts.resolved.length).toBe(0);
    expect(loadedScripts.rejected.length).toBe(1);
  });

  it('should not load the same script multiple times', async () => {
    jest.spyOn(document.body, 'appendChild').mockImplementation(node => {
      // add 2 seconds timeout to simulate slow loading
      setTimeout(() => (node as HTMLBodyElement).onload?.(new Event('load')), 2000);
      return node;
    });

    ScriptLoader.loadScript(scriptSource);

    let loadedScripts = await ScriptLoader.getLoadedScripts();

    expect(loadedScripts.pending.length).toBe(1);
    expect(loadedScripts.resolved.length).toBe(0);
    expect(loadedScripts.rejected.length).toBe(0);

    await ScriptLoader.loadScript(scriptSource);

    loadedScripts = await ScriptLoader.getLoadedScripts();
    expect(loadedScripts.pending.length).toBe(0);
    expect(loadedScripts.resolved.length).toBe(1);
    expect(loadedScripts.rejected.length).toBe(0);
  });

  //write tests, ScripLoaded.loadScript throws error
  it('should throw error if script source is not provided', async () => {
    await expect(ScriptLoader.loadScript('')).rejects.toThrow('Script source is required');
  });
});
