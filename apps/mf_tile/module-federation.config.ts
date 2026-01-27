import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import pkg from './package.json';

export default createModuleFederationConfig({
  name: pkg.name,
  filename: `${pkg.name}.js`,
  exposes: {
    '.': './src/index.tsx',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: pkg.dependencies.react,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: pkg.dependencies['react-dom'],
    },
  },
});
