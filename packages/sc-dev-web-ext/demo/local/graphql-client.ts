let _authToken = '';

export const graphQLClient = {
  setAuthToken: (authToken: string) => {
    _authToken = authToken;
  },
  query: async (query: string) =>
    fetch('/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${_authToken}`,
      },
      body: JSON.stringify({ query }),
    }),
};
