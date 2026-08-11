# compile-to-native Agent

Enables Java/Kotlin Quarkus projects for GraalVM native compilation through a 2-step detection and configuration workflow.

## Overview

This agent automates the process of making a Quarkus project native-compilation ready using buildpack infrastructure. It first identifies whether the project is an Experience API (GraphQL) or a Process API (REST), then applies the correct set of native compilation changes by following the corresponding instruction rule file.

## Steps

| Step | Agent | Description |
|------|-------|-------------|
| 1 | [Identify Project Type](./sb-native-compile-agent.agent#step-1--identify-project-type) | Inspects `pom.xml` to determine if the project is an Experience API (GraphQL) or a Process API (REST) |
| 2 | [Follow Appropriate Instructions](./sb-native-compile-agent.agent#step-2--follow-the-appropriate-instructions) | Reads and executes every step in the matching rule file for the detected project type |

## Rules

| Project Type | Rule File | Steps Covered |
|---|---|---|
| Experience API (GraphQL) | [experience-api-native-compile](./rules/experience-api-native-compile) | 1. Update `pom.xml` versions · 2. Update `azure-pipelines-maven.yml` · 3. Create/update `reflect-config.json` · 4. Create/update `resource-config.json` · 5. Update `application.properties` · 6. Update `env/<env>/properties.yml` files · 7. Add `@RegisterForReflection` annotations · 8. Add `@GraphQLName` annotations |
| Process API (REST) | [process-api-native-compile](./rules/process-api-native-compile) | Steps defined within the rule file |

## Resources

- [sb-native-compile-agent.agent](./sb-native-compile-agent.agent) — Main agent definition and behaviour
- [experience-api-native-compile](./rules/experience-api-native-compile) — Full native compilation guide for Experience API (GraphQL) projects
- [process-api-native-compile](./rules/process-api-native-compile) — Full native compilation guide for Process API (REST) projects

## Typical Workflow

1. Run the agent against a Quarkus project root
2. The agent reads `pom.xml` to detect the project type — if `devkit-graphql-common` is present it is an **Experience API**, otherwise a **Process API**
3. The agent reads the corresponding rule file from `./rules/` and executes all steps in order
4. After each major step the agent validates the changes
5. The agent provides a final summary of all files modified and any remaining manual steps

## Request approve for pool: "sc-rhel8ec2-large" 

1. Follow https://dev.azure.com/sc-ado/ADO%20Support/_workitems/edit/12317110 to raise ADO support ticket