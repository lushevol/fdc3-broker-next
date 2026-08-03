<!-- TOC -->
* [What is this template](#what-is-this-template)
* [Prerequisite](#prerequisite)
  * [Node.js installation](#nodejs-installation)
  * [Node.js setup](#nodejs-setup)
* [Getting Started](#getting-started)
  * [Create New Project](#create-new-project)
  * [Project Structure](#project-structure)
  * [Run Locally](#run-locally)
  * [Test the MCP Server](#test-the-mcp-server)
* [Development](#development)
  * [How MCP Works](#how-mcp-works)
  * [Add a New Tool](#add-a-new-tool)
  * [Add a Tool with Input Parameters](#add-a-tool-with-input-parameters)
  * [Connect an AI Client](#connect-an-ai-client)
  * [How to deploy and run function in local vm](#how-to-deploy-and-run-function-in-local-vm)
  * [How to test deployed function with curl](#how-to-test-deployed-function-with-curl)
* [Support](#support)
<!-- TOC -->

# What is this template

This template generates a **NodeJS MCP (Model Context Protocol) server** that runs on Service Bench.

MCP is an open standard that lets AI systems (LLMs / AI agents) call your backend functions as **tools**. This server exposes tools over **Streamable HTTP** so any MCP-compatible AI client (Claude Desktop, Cursor, LangChain agents, etc.) can discover and invoke them.

![service bench diagram](.devkit/sb.drawio.svg)

# Prerequisite
## Node.js installation
1. Download Node v20.x+ from Axess: https://axess.sc.net/marketplace/golden-versions/gv-nodejs-v1
2. Extract the binary and make sure `node` and `npm` are added to your PATH.
3. Verify:
```shell
node -v
npm -v
```

## Node.js setup
Point npm registry to SCB Artifactory:
```shell
npm config set registry https://artifactory.global.standardchartered.com/artifactory/api/npm/npm-release
```

# Getting Started
## Create New Project
Use SC DevKit CLI to scaffold a new project:

1. Run `npx @scdevkit/cli@latest`, enter `y` when prompted.\
   [<img src=".devkit/cli1.png" width="500"/>](.devkit/cli1.png)
2. Select **Service Bench**.\
   [<img src=".devkit/cli2.png" width="500"/>](.devkit/cli2.png)
3. Choose **MCP API (NodeJS)**.\
   [<img src=".devkit/cli3.png" width="500"/>](.devkit/cli3.png)
4. Enter project name, application id and bank id.\
   [<img src=".devkit/cli4.png" width="500"/>](.devkit/cli4.png)
5. After generation completes, you should see a success message.\
   [<img src=".devkit/cli5.png" width="500"/>](.devkit/cli5.png)
6. `cd` into the project and run `npm install && npm start`.\
   [<img src=".devkit/cli6.png" width="500"/>](.devkit/cli6.png)

## Project Structure

```
.
├── server.mjs                   ← MCP server entry point
├── healthcheck.mjs              ← /q/health endpoint
├── info.mjs                     ← /q/info/env endpoint
├── jest.config.mjs
├── eslint.config.mjs
├── package.json
├── src/
│   └── tools/
│       ├── index.mjs            ← registerTools() – add new tools here
│       └── time-tools.mjs       ← example tool implementations
├── test/
│   └── tools/
│       └── time-tools.test.mjs  ← example unit tests
└── env/
    └── local/
        ├── env.properties       ← non-sensitive local config
        └── secret.properties    ← secrets (not committed)
```

| File / Directory              | Description                                          |
|-------------------------------|------------------------------------------------------|
| `server.mjs`                  | Creates McpServer, registers tools, starts Express   |
| `src/tools/index.mjs`         | Central tool registration – import new tools here    |
| `src/tools/<feature>.mjs`     | Individual tool implementations (one file per domain)|
| `test/tools/<feature>.test.mjs` | Unit tests using in-memory MCP transport           |
| `env/local/env.properties`    | Local environment variables loaded via ConfigMap     |
| `env/local/secret.properties` | Local secrets loaded via Kubernetes Secret           |

## Run Locally
```shell
npm install
npm start
# Server starts at http://localhost:8080
# MCP endpoint: http://localhost:8080/mcp
```

For live-reload during development:
```shell
npm run dev
```

Run unit tests:
```shell
npm test
```

## Test the MCP Server
Once the server is running you can interact with it using `curl`:

### List all available tools
```shell
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

### Call getServerTime
```shell
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"getServerTime","arguments":{}}}'
```

### Call getTimeWithTimeZone
```shell
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"getTimeWithTimeZone","arguments":{"timeZone":"Asia/Manila"}}}'
```

---

# Development

## How MCP Works

```
AI Client (Claude / Cursor / agent)
        │
        │  POST /mcp  (JSON-RPC 2.0)
        ▼
  MCP Server  (this service)
        │
        ├─ tools/list   → returns tool schemas to the AI
        └─ tools/call   → executes the requested tool and returns the result
```

Each **tool** is a function you expose to AI clients. A tool has:
- A **name** – how the AI refers to it
- A **description** – natural language description used by the AI to decide when to call it
- An **input schema** (optional) – JSON Schema / zod that validates arguments
- A **handler** – your NodeJS function that does the actual work

## Add a New Tool

1. Create `src/tools/my-feature-tools.mjs`:

```javascript
// No input parameters – simplest possible tool
export function registerMyTool(server) {
  server.tool(
    "myToolName",                    // tool name the AI will use
    "What this tool does (for AI)",  // description
    {},                              // input schema – {} means no arguments
    async () => {
      const result = "Hello from my tool!";
      return {
        content: [{ type: "text", text: result }],
      };
    },
  );
}
```

2. Register it in `src/tools/index.mjs`:

```javascript
import { registerMyTool } from "./my-feature-tools.mjs";

export function registerTools(server) {
  // ... existing tools ...
  registerMyTool(server);
}
```

## Add a Tool with Input Parameters

Use `zod` to define a typed input schema:

```javascript
import { z } from "zod";

export function registerEchoTool(server) {
  server.tool(
    "echo",
    "Echo back the message provided by the caller",
    {
      message: z.string().describe("The message to echo"),
    },
    async ({ message }) => {
      return {
        content: [{ type: "text", text: `Echo: ${message}` }],
      };
    },
  );
}
```

The zod schema is validated automatically – the AI client receives a JSON Schema
generated from it so it knows exactly what arguments to supply.

## Connect an AI Client

### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "my-service": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

### Cursor / VS Code MCP extension
Add the server URL `http://localhost:8080/mcp` in your MCP client settings.

### Deployed endpoint
Replace `localhost:8080` with the Service Bench knative URL of your deployed function:
```
http://<name>.local.api.servicebench.global.standardchartered.com/mcp
```

## How to deploy and run function in local vm

Open Git Bash and run the following command from your project folder.\
The first deployment may take a few minutes as it downloads the JDK and dependencies. Subsequent deployments are faster due to caching.

```shell
./faas-cli.sh run
```

## How to test deployed function with curl
```shell
curl -X POST 'http://127.0.0.1:30901/mcp' \
  --header 'Host: <%= applicationId %>-<%= name %>.local.api.servicebench.global.standardchartered.com' \
  --header 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"getServerTime","arguments":{}}}'
```

# Support
Support channel: http://go/chat/sc-app-platform
