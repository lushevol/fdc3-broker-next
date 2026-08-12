export const isNewLayoutEnabled = (search = window.location.search): boolean =>
  new URLSearchParams(search).get('new-layout') === 'true';
