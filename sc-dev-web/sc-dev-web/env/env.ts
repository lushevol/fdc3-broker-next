if (typeof window.process === 'undefined') {
  // @ts-ignore
  window.process = {
    env: {},
  };
}
