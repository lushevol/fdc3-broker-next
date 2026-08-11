---
name: sb-process-api-golang
description: Development guide for Service Bench Process API projects using Golang. Use this skill whenever building or modifying a Golang-based Process API — covers prerequisites, project creation, exposing REST endpoints (Gin framework), GORM database mapping, CRUD operations, body validation, security (SC-IDP / PEP sidecar), and deployment. Trigger on any request involving: Golang Process API, Gin REST, GORM, Golang private-api, Golang internal-api, go.mod process API, Golang CRUD.
---

# Service Bench — Process API (Golang)

Golang Process APIs use the **Gin** HTTP framework and **GORM** ORM to expose REST endpoints as the system integration layer.

---

## Support

- Teams: http://go/chat/sb-api
- Email: ServiceBench@sc.com

---

## Prerequisites

### Node.js
- Required: v20.x+
- Set npm registry: `npm config set registry https://artifactory.global.standardchartered.com/artifactory/api/npm/npm-release`

### Golang
- Required: Go 1.23 or higher
- Install via myIT request if not available

### Golang Proxy Setup
```bash
go env -w GOPROXY=https://artifactory.global.standardchartered.com/artifactory/api/go/go-release
```

---

## Project Creation

Use **SC DevKit CLI**:

```bash
npx @scdevkit/cli@latest
# Select: Service Bench → Process API (Golang) template
# Enter: project name, application id, bank id
```

Follow `README.md` in the generated project directory.

### Project Structure

| Path | Description |
|---|---|
| `common/` | Common utilities and shared code |
| `config/` | Application configuration files |
| `dto/` | Data Transfer Objects for API request/response |
| `env/` | Environment-specific configuration |
| `health/` | Health check endpoints |
| `model/` | Database entity models |
| `repo/` | Repository layer for data access |
| `resources/` | Static resources |
| `routes/` | HTTP route definitions |
| `service/` | Business logic implementations |
| `test/` | Unit and integration tests |
| `go.mod` | Go module file and dependencies |
| `main.go` | Application entry point |
| `image.yml` | Docker image configuration |
| `azure-pipelines-go.yml` | CI/CD pipeline configuration |

---

## Database Table Mapping (GORM)

GORM is used for ORM mapping.

```go
// model/go_test.go
type GoTest struct {
    ID   string `gorm:"column:id;primaryKey"`
    Name string `gorm:"column:name"`
}

func (GoTest) TableName() string {
    return "go_test"  // explicit table name matching actual DB table
}
```

> Always set `TableName()` explicitly to match the database table name.

---

## Exposing REST Endpoints

```go
// routes/routes.go
func RegisterRoutes(r *gin.Engine, svc *service.GoTestService) {
    r.POST("/case-task", svc.Create)
    r.GET("/case-task/:id", svc.GetByID)
    r.GET("/case-task/list", svc.List)
    r.PUT("/case-task/:id", svc.Update)
    r.DELETE("/case-task/:id", svc.Delete)
}
```

---

## CRUD Logic and Body Validation

### Request DTO with Binding Tags

```go
// dto/go_test_dto.go
type CreateGoTestRequest struct {
    ID   string `json:"id"   binding:"required"`
    Name string `json:"name" binding:"required,max=255"`
}
```

### Handler with Validation

```go
func (s *GoTestService) Create(c *gin.Context) {
    var req dto.CreateGoTestRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    // ... business logic
    c.JSON(http.StatusOK, result)
}
```

If validation fails, returns `HTTP 400` with error details.

### CRUD Implementation Patterns

```go
// Create
db.Create(&model.GoTest{ID: req.ID, Name: req.Name})

// Read
db.First(&task, "id = ?", id)

// Update
db.Model(&model.GoTest{}).Where("id = ?", id).Updates(model.GoTest{ID: req.ID, Name: req.Name})

// Delete
db.Delete(&model.GoTest{}, "id = ?", id)

// List with pagination
db.Where("name LIKE ?", "%"+filter+"%").
    Offset((page-1)*pageSize).
    Limit(pageSize).
    Find(&tasks)
```

---

## Security (SC-IDP / PEP Sidecar)

### API Classification
Set `functionType` in `env/<environment>/properties.yml`:
```yaml
functionType: <private-api|internal-api>
```

### Internal API — SB Onboarding
Contact SB support team with: ECM name, namespace, function name, release date.

### Private API
No SB onboarding needed. Callers invoke directly: `http://<function-name>.<namespace>.svc.cluster.local`.

### SC-IDP Onboarding
Approach SC-IDP team to register your Process API as a service.

### PEP Sidecar JWKS URLs (internal-system realm)

| Environment | JWKS URL |
|---|---|
| UK SIT | `https://dev-authn.idp.global.standardchartered.com/realms/internal-system/protocol/openid-connect/certs` |
| HK SIT | `https://sit-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| HK UAT | `https://uat-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| UK ARK STAGE | `https://ark-stg-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| UK ARK PROD | `https://ark-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| UK WATFORD PROD | `https://watford-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| HK JUMBO STAGE | `https://jumbo-stg-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| HK MEGA STAGE | `https://mega-stg-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| HK JUMBO PROD | `https://jumbo-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| HK MEGA PROD | `https://mega-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |

### PEP Sidecar config in `env/<env>/properties.yml`

```yaml
pep:
  config: |
    {
      "rules": [
        {
          "match": {
            "url": "[\\S\\s]*",
            "method": ["CONNECT","GET","POST","DELETE","PUT"]
          },
          "handlers": [
            {
              "id": "authenticator",
              "config": {
                "jwks_uri": "<env-jwks-url>"
              }
            }
          ]
        }
      ]
    }
```

### PEP Egress Sidecar (SEP) and Truststore/Keystore

Same model as the Kotlin/Java Process API. See `sb-process-api-java` skill for the full `properties.yml` template.

---

## Deployment

- Deploy via ADO pipeline using `azure-pipelines-go.yml`.
- Do not change the default HTTP port.
- Follow the ADO deployment guide: `https://confluence.global.standardchartered.com/display/SERVICEBENCH/API+Deployment`
