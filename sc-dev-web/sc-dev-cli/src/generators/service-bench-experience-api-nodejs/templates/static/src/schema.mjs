export const typeDefs = `#graphql
  type HelloWorld {
    message: String!
  }

  type Query {
    helloWorld: HelloWorld!
  }
`;
