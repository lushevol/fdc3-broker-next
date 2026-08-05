export const restClient = {
  request: async (
    module: string,
    resource: string,
    method = 'GET',
    body = null,
    headers = {},
    options = {},
    callbacks: {
        onSend?: ((ev: any) => any) | null;
      } = {}
  ) => {
    const controller = new AbortController();
    if (callbacks?.onSend) {
      callbacks.onSend({
        abort: () => controller.abort(),
      });
    }
    return fetch(`/rest/v1/${module}/${resource}`, {
      method,
      body,
      headers,
      ...options,
      signal: controller.signal,
    });
  },
};