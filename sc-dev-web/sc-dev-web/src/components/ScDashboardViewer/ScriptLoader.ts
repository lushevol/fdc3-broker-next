type PromiseState = 'pending' | 'resolved' | 'rejected';

export class ScriptLoader {
  private static loadedScripts: { [key: string]: Promise<void> } = {};

  private static getPromiseState(promise: Promise<any>): Promise<PromiseState> {
    const pending = {};
    return Promise.race([promise, pending])
      .then(value => (value === pending ? 'pending' : 'resolved'))
      .catch(() => 'rejected');
  }

  public static async getLoadedScripts(): Promise<{ pending: string[]; resolved: string[]; rejected: string[] }> {
    const pending: string[] = [];
    const resolved: string[] = [];
    const rejected: string[] = [];
    for (const key in this.loadedScripts) {
      await this.getPromiseState(this.loadedScripts[key]).then(state => {
        switch (state) {
        case 'pending':
          pending.push(key);
          break;
        case 'resolved':
          resolved.push(key);
          break;
        case 'rejected':
          rejected.push(key);
          break;
        }
      });
    }
    return { pending, resolved, rejected };
  }


  static async loadScript(scriptSource: string): Promise<void> {
    if (!scriptSource || scriptSource.length === 0) {
      throw new Error('Script source is required');
    }

    if (!this.loadedScripts[scriptSource]) {
      this.loadedScripts[scriptSource] = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scriptSource;
        script.type = 'module';
        script.async = true;
        script.onload = () => {
          resolve();
        };
        script.onerror = () => {
          reject(new Error(`Failed to load script: ${scriptSource}`));
        };
        document.body.appendChild(script);
      });
    }

    await this.loadedScripts[scriptSource];
  }
}
