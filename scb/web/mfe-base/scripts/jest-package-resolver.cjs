/** Select the package's ESM export without changing unrelated Jest dependencies. */
module.exports = (request, options) => options.defaultResolver(request,
  request === 'ratan-design-origin' || request.startsWith('ratan-design-origin/')
    ? { ...options, conditions: ['import', ...(options.conditions ?? []).filter(condition => condition !== 'require')] }
    : options);
