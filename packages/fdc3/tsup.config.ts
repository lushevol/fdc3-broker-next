import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    agent: 'src/agent.ts',
    'app-directory': 'src/app-directory.ts',
    broker: 'src/broker.ts',
    finos: 'src/finos.ts',
    openfin: 'src/openfin.ts',
    react: 'src/react.ts',
    'resolver-ui': 'src/resolver-ui.ts',
    'workflow-orchestrator': 'src/workflow-orchestrator.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  splitting: false,
  minify: process.env.NODE_ENV === 'production',
});
