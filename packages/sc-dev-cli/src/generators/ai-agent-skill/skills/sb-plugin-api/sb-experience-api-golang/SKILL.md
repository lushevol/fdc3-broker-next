---
name: sb-experience-api-golang
description: Development guide for Service Bench Experience API projects using Golang. Use this skill whenever building or modifying a Golang-based Experience API — covers prerequisites, project creation (gqlgen schema-driven), GraphQL queries/mutations, Hasura router onboarding, and deployment. Trigger on any request involving: Golang Experience API, gqlgen, schema-driven GraphQL, Golang devkit, go.mod experience API.
---

# Service Bench — Experience API (Golang)

Golang Experience APIs use **gqlgen** (schema-driven GraphQL framework) to expose a GraphQL endpoint that connects to the Hasura supergraph.

---

## Prerequisites

### Node.js
- Required: v20.x+
- Set npm registry: `npm config set registry https://artifactory.global.standardchartered.com/artifactory/api/npm/npm-release`

### Golang
- Required: Go 1.23 or higher
- Download: `https://artifactory.global.standardchartered.com/artifactory/technology-standard-release/application/application-development/languages-frameworks-build-tools-runtime/go/1.23.0/`
- Verify: `go version`

### Golang Setup
```bash
# Enable modules
go env -w GO111MODULE=on

# Set SCB Artifactory Go proxy
go env -w GOPROXY=https://artifactory.global.standardchartered.com/artifactory/api/go/go-release,direct
```

---

## Project Creation

Use **SC DevKit CLI**:

```bash
npx @scdevkit/cli@latest
# Select: Service Bench → Experience API (Golang) template
# Enter: project name, application id, bank id
```

Follow `README.md` in the generated project directory to run it.

### Project Structure

| Path | Description |
|---|---|
| `graph/` | gqlgen-generated and manual GraphQL code |
| `test/` | Test files |
| `env/` | Environment-specific properties |
| `resources/` | Application resource files |
| `go.mod` | Go module file and dependencies |
| `gqlgen.yml` | GraphQL framework auto-generated file |
| `image.yml` | Final build image definition |
| `server.go` | HTTP server main file |
| `tools.go` | Development tools definition |

### GraphQL Framework
The framework used is **gqlgen** (`https://gqlgen.com/`) — a schema-driven framework. Learn the framework before starting development.

---

## GraphQL Query

Define the schema first, then implement the resolver.

**Naming rule:** All query resolvers must have the prefix `get_` for PEP sidecar authorization.

**`schema.graphqls`:**
```graphql
type Query {
  get_objects: [MyObject!]!
}

type MyObject {
  id: ID!
  name: String!
}
```

**`schema.resolvers.go`:**
```go
func (r *queryResolver) GetObjects(ctx context.Context) ([]*model.MyObject, error) {
    return []*model.MyObject{
        {ID: "1", Name: "TEST"},
    }, nil
}
```

---

## GraphQL Mutation

**Naming rule:** Mutation resolvers must have the prefix `post_`, `put_`, `patch_`, or `delete_`.

**`schema.graphqls`:**
```graphql
type Mutation {
  put_object(input: ObjectInput!): MyObject!
}

input ObjectInput {
  id: ID!
  name: String!
}
```

**`schema.resolvers.go`:**
```go
func (r *mutationResolver) PutObject(ctx context.Context, input model.ObjectInput) (*model.MyObject, error) {
    return &model.MyObject{ID: input.ID, Name: input.Name}, nil
}
```

---

## Deployment & Hasura Onboarding

Same process as other Experience API variants:

1. Deploy via ADO pipeline (do not change the default HTTP port).
2. Wait ~10 minutes — the remote schema auto-registers in Hasura.
3. **Naming convention:** `55313` + sub-component-id + `_` + functionName (dashes → underscores).
4. Contact SB API team at `http://go/chat/sc-app-platform` if onboarding issues arise.

**Hasura endpoints:**

| Environment | URL |
|---|---|
| UK DEV | `https://dev-graphql.servicebench.global.standardchartered.com/v1/graphql` |
| Catalyst Non-Prod SIT | `https://graphql-servicebench-sit-stg.55313.app.standardchartered.com/v1/graphql` |
| Catalyst Non-Prod UAT | `https://graphql-servicebench-uat-stg.55313.app.standardchartered.com/v1/graphql` |
| Catalyst Non-Prod QA | `https://graphql-servicebench-qa-stg.55313.app.standardchartered.com/v1/graphql` |

---

## Support
- Teams: http://go/chat/sb-api
- Email: ServiceBench@sc.com
