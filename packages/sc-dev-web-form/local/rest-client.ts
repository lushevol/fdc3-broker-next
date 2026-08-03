export const restClient = {
  request: async (
    module: string,
    resource: string,
    method = 'GET',
    body = null,
    headers = {},
    options = {}
  ) =>
    fetch(`/rest/v1/${module}/${resource}`, {
      method,
      body,
      headers,
      ...options,
    }),
};