import process from "node:process";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { expressMiddleware } from "@apollo/server/express4";
import { shutdown as shutdownOtel } from "./otel.mjs";
import healthcheck from "./healthcheck.mjs";
import info from "./info.mjs";
import { typeDefs } from "./src/schema.mjs";
import { resolvers } from "./src/resolvers/index.mjs";

const app = express();
app.disable("x-powered-by");
app.use(express.json());

// REST endpoints
app.use("/q/health", healthcheck);
app.use("/q/info", info);

// GraphQL endpoint
const apolloServer = new ApolloServer({ 
  typeDefs, 
  resolvers,
  plugins: [ApolloServerPluginLandingPageDisabled()]
});
await apolloServer.start();
app.use("/graphql", expressMiddleware(apolloServer));

const port = process.env.PORT_NO || 8080;
const server = app.listen(port, () => {
  console.log("Node GraphQL API is listening on port", port);
  console.log(`  → GraphQL endpoint : http://localhost:${port}/graphql`);
  console.log(`  → Health check     : http://localhost:${port}/q/health`);
});

process.on("SIGTERM", () => {
  console.debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.debug("HTTP server closed");
    shutdownOtel().catch(console.error);
  });
});
