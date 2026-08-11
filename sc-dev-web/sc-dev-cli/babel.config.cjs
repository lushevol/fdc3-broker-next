module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
  plugins: [
    'babel-plugin-transform-import-meta',
    '@babel/plugin-syntax-decorators',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
        decoratorsBeforeExport: true,
      },
    ],
    '@babel/plugin-syntax-jsx',
  ],
};
