async function main() {
  const status = document.getElementById('status');
  const root = document.getElementById('container-root');

  const [React, ReactDOMClient, baseModule, containerModule, tileModule] =
    await Promise.all([
      System.import('react'),
      System.import('react-dom/client'),
      System.import('@fm/base'),
      System.import('@fm/template_container'),
      System.import('@fm/template'),
    ]);

  const react = React?.default ?? React;
  const reactDomClient = ReactDOMClient?.default ?? ReactDOMClient;
  const App = containerModule?.default ?? containerModule;

  status.dataset.baseLoaded = String(Boolean(baseModule));
  status.dataset.containerLoaded = String(Boolean(App));
  status.dataset.tileLoaded = String(Boolean(tileModule?.default ?? tileModule));

  const reactRoot = reactDomClient.createRoot(root);

  reactRoot.render(
    react.createElement(App, {
      module: '/template_container1',
      tile: '/template_tile1',
    }),
  );

  status.textContent = 'ready';
}

main().catch((error) => {
  const status = document.getElementById('status');
  status.textContent = 'error';
  status.dataset.error = error?.message || String(error);
  console.error(error);
});
