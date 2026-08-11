import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fileURLToPath } from 'url';
import { playwrightLauncher } from '@web/test-runner-playwright';
// eslint-disable-next-line import/extensions
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { locator } from './scripts/locator.mjs';
import { defaultReporter } from '@web/test-runner';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

/**
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
export default {
  // port: Math.floor(Math.random() * (65535 - 1024 + 1) + 1024),
  files: [
    '**/*.test.unit.ts',
    '**/*.test.e2e.ts',
    '**/*.test.integration.ts',
    '**/*.test.visual.ts',
    '!node_modules/**/*',
  ],
  rootDir: fileURLToPath(new URL('./', import.meta.url)),
  /** Resolve bare module imports */
  nodeResolve: true,
  plugins: [
    esbuildPlugin({
      ts: true,
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    }),
    visualRegressionPlugin({
      baseDir: fileURLToPath(new URL('./test/screenshots', import.meta.url)),
      update: process.argv.includes('--update-visual-baseline'),
      failureThresholdType: 'percent',
      failureThreshold: 0.5,
    }),
  ],
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        executablePath: locator('edge') || locator('chrome'),
      },
    }),
  ],

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    if (log.type !== 'error') {
      return false;
    }
    return true;
  },
  reporters: [
    defaultReporter({
      reportTestResults: true,
      reportTestProgress: argv['silent'] ? false : true,
    }),
  ],
  coverage: false,
  testFramework: {
    config: {
      timeout: '10000',
    },
  },
};
