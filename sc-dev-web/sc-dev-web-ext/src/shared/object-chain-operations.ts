export const _get = (object: any, path: any, defaultValue?: any) => {
  if (typeof object !== 'object') return defaultValue;
  return _basePath(path).reduce((o: any, k: any) => (o || {})[k], object) || defaultValue;
};

function _basePath(path: any) {
  if (Array.isArray(path)) return path;
  return path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
}