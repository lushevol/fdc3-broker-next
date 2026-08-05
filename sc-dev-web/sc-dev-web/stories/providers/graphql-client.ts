let _authToken = '';

const getAccessToken = async () => {
  const storybookAuth = (window as any).__SC_STORYBOOK_AUTH__;
  if (storybookAuth?.isAuthenticated) {
    await storybookAuth.refreshToken?.(10);
    const token = await storybookAuth.getToken?.();
    if (token) {
      _authToken = token;
    }
  }

  return _authToken;
};

export const graphQLClient = {
  setAuthToken: (authToken: string) => {
    _authToken = authToken;
  },
  query: async (query: string) => {
    const accessToken = await getAccessToken();

    return fetch('/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ query }),
    });
  },
};
