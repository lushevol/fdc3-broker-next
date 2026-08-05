import { helloWorldResolver } from "./hello-world.mjs";

export const resolvers = {
  Query: {
    helloWorld: helloWorldResolver,
  },
};
