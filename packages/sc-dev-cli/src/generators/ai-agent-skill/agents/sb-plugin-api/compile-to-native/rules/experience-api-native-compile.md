---
name: experience-api-native-compile
description: GraalVM native compilation guide for Experience API (GraphQL/Federation) Quarkus projects. Use when enabling native compilation on a project that contains devkit-graphql-common dependency. Covers updating pom.xml dependency versions, azure-pipelines-maven.yml CI configuration, reflect-config.json, resource-config.json, application.properties, env properties files, @RegisterForReflection annotations on DTO and service classes, and @GraphQLName annotations on public method parameters.
compatibility: Designed for VS Code Copilot agent mode
---

# Experience API — Native Compilation Enablement Guide

> **Reference Project:** `55313-sb-shell-exp-api` branch `feature/native`
> This guide is derived by comparing `feature/native` (native-ready) against `catalyst/main` (non-native) of the same project.

---

## Overview

An Experience API project uses GraphQL federation via `devkit-graphql-common` and `graphql-parent` as its parent POM. Enabling native compilation involves 8 sequential steps:

1. Update `pom.xml` dependency versions
2. Update `azure-pipelines-maven.yml` CI configuration
3. Create/update `src/main/resources/reflect-config.json`
4. Create/update `src/main/resources/resource-config.json`
5. Update `src/main/resources/application.properties`
6. Update all `env/<env-name>/properties.yml` files
7. Add `@RegisterForReflection` annotation to DTO model classes and GraphQL service classes
8. Add `@GraphQLName` annotation to all parameters of public methods in GraphQL service classes

---

## Step 1 — Update `pom.xml`

### 1.1 — Update Parent POM Version

**For Kotlin projects** — update `graphql-parent` to version `4.33.0-11347960` or higher:

```xml
<parent>
    <groupId>com.sc.devkit</groupId>
    <artifactId>graphql-parent</artifactId>
    <version>4.33.0-11347960</version>   <!-- update to this version or higher -->
</parent>
```

**For Java projects** — update `graphql-parent-java` to the appropriate version (confirm with your team's latest approved version).

```xml
<parent>
    <groupId>com.sc.devkit</groupId>
    <artifactId>graphql-parent-java</artifactId>
    <version>4.33.0-11347949</version>   <!-- update to this version or higher -->
</parent>
```

### 1.2 — Update `devkit-graphql-common` Version

Update to version `4.33.0-11354450` or higher:

```xml
<dependency>
    <groupId>com.sc.devkit</groupId>
    <artifactId>devkit-graphql-common</artifactId>
    <version>4.33.0-11354450</version>   <!-- update to this version or higher -->
</dependency>
```

**How to check current versions:**
- Read `pom.xml` and look for `<parent>` block and the `devkit-graphql-common` dependency
- Compare current versions against the minimum versions above
- Only update if the current version is lower than the minimum required

---

## Step 2 — Update `azure-pipelines-maven.yml`

Three properties inside `buildStackParams` must be set correctly:

| Property | Required Value |
|---|---|
| `pool` | `sc-rhel8ec2-large` |
| `buildpackImageName` | `buildpack-quarkus-native:20260326.3` or higher |
| `builderImageName` | `builder-quarkus-native:20260326.3` or higher |

**Example (correct configuration):**

```yaml
buildStackParams:
  pool: 'sc-rhel8ec2-large'
  goals: "clean package -Dquarkus.package.type=uber-jar"
  buildpackImageName: "buildpack-quarkus-native:20260326.3"
  builderImageName: "builder-quarkus-native:20260326.3"
```

**What to check:**
- Read the current `azure-pipelines-maven.yml`
- If `pool` is not `sc-rhel8ec2-large`, update it
- If `buildpackImageName` or `builderImageName` are missing or point to a non-native image (e.g., `buildpack-quarkus:...`), replace them with the native variants
- If the image version is older than `20260326.3`, update to `20260326.3` or higher

---

## Step 3 — Create/Update `src/main/resources/reflect-config.json`

This file registers classes that require reflection access during native image execution.

**If the file does not exist**, create it at `src/main/resources/reflect-config.json`.
**If the file already exists**, merge in any missing entries.

### 3.1 — Required Base Entries (always include for GraphQL + Kotlin projects)

```json
[
  {
    "name": "com.github.benmanes.caffeine.cache.SSMSA",
    "allDeclaredConstructors": true,
    "allPublicConstructors": true,
    "allDeclaredMethods": true,
    "allPublicMethods": true,
    "allDeclaredFields": true,
    "allPublicFields": true
  },
  {
    "name": "com.github.benmanes.caffeine.cache.PSAMS",
    "allDeclaredConstructors": true,
    "allPublicConstructors": true,
    "allDeclaredMethods": true,
    "allPublicMethods": true,
    "allDeclaredFields": true,
    "allPublicFields": true
  },
  {
    "name": "graphql.ExecutionResult",
    "allDeclaredConstructors": true,
    "allPublicConstructors": true,
    "allDeclaredMethods": true,
    "allPublicMethods": true,
    "allDeclaredFields": true,
    "allPublicFields": true
  },
  {
    "name": "graphql.GraphQLError",
    "allDeclaredConstructors": true,
    "allPublicConstructors": true,
    "allDeclaredMethods": true,
    "allPublicMethods": true,
    "allDeclaredFields": true,
    "allPublicFields": true
  },
  {
    "name": "graphql.schema.GraphQLObjectType",
    "allDeclaredConstructors": true,
    "allPublicConstructors": true,
    "allDeclaredMethods": true,
    "allPublicMethods": true,
    "allDeclaredFields": true,
    "allPublicFields": true
  },
  {
    "name": "graphql.schema.GraphQLSchema",
    "allDeclaredConstructors": true,
    "allPublicConstructors": true,
    "allDeclaredMethods": true,
    "allPublicMethods": true,
    "allDeclaredFields": true,
    "allPublicFields": true
  },
  {
    "name": "ch.qos.logback.classic.AsyncAppender",
    "allDeclaredConstructors": true,
    "allPublicConstructors": true,
    "allDeclaredMethods": true,
    "allPublicMethods": true,
    "allDeclaredFields": true,
    "allPublicFields": true,
    "allDeclaredClasses": true,
    "allPublicClasses": true
  },
  {
    "name": "ch.qos.logback.classic.encoder.PatternLayoutEncoder",
    "allDeclaredConstructors": true,
    "allPublicConstructors": true,
    "allDeclaredMethods": true,
    "allPublicMethods": true,
    "allDeclaredFields": true,
    "allPublicFields": true,
    "allDeclaredClasses": true,
    "allPublicClasses": true
  },
  {
    "name": "ch.qos.logback.core.ConsoleAppender",
    "allDeclaredConstructors": true,
    "allPublicConstructors": true,
    "allDeclaredMethods": true,
    "allPublicMethods": true,
    "allDeclaredFields": true,
    "allPublicFields": true,
    "allDeclaredClasses": true,
    "allPublicClasses": true
  },
  {
    "name": "kotlin.reflect.jvm.internal.ReflectionFactoryImpl",
    "allDeclaredConstructors": true
  },
  {
    "name": "kotlin.reflect.jvm.internal.impl.descriptors.runtime.structure.ReflectJavaClassifierType",
    "allDeclaredConstructors": true,
    "allDeclaredMethods": true,
    "allDeclaredFields": true
  },
  {
    "name": "kotlin.reflect.jvm.internal.KTypeImpl",
    "allDeclaredConstructors": true,
    "allDeclaredMethods": true,
    "allDeclaredFields": true
  },
  {
    "name": "kotlin.reflect.jvm.internal.KClassImpl",
    "allDeclaredConstructors": true,
    "allDeclaredMethods": true,
    "allDeclaredFields": true
  },
  {
    "name": "kotlin.KotlinVersion",
    "allPublicMethods": true,
    "allDeclaredFields": true,
    "allDeclaredMethods": true,
    "allDeclaredConstructors": true
  }
]
```

> **Note:** For Java-only projects, remove the `kotlin.*` entries if the project does not use Kotlin.

### 3.2 — Jakarta Validation Constraint Entries

For every `jakarta.validation.constraints.*` annotation used anywhere in the project's source code, the corresponding `$List` inner class **must** be registered. Additionally, some annotations have nested enum types that also require registration.

**How to detect which constraints are used:**
- Search all `.kt` and `.java` files for `jakarta.validation.constraints.` imports
- Also search for annotation usage patterns: `@NotNull`, `@Size`, `@Pattern`, `@Min`, `@Max`, `@NotBlank`, `@NotEmpty`, `@Valid`, etc.
- Include both DTO fields and service method parameters

**Constraint Registration Rules:**

| Annotation Used | Required `reflect-config.json` Entry | Notes |
|---|---|---|
| `@Max` | `jakarta.validation.constraints.Max$List` | — |
| `@Min` | `jakarta.validation.constraints.Min$List` | — |
| `@NotNull` | `jakarta.validation.constraints.NotNull$List` | — |
| `@NotBlank` | `jakarta.validation.constraints.NotBlank$List` | — |
| `@NotEmpty` | `jakarta.validation.constraints.NotEmpty$List` | — |
| `@Size` | `jakarta.validation.constraints.Size$List` | — |
| `@Pattern` | `jakarta.validation.constraints.Pattern$List` **AND** `jakarta.validation.constraints.Pattern$Flag` | `@Pattern` has a `flags` attribute referencing the `Flag` enum — both entries are required |
| `@Email` | `jakarta.validation.constraints.Email$List` | — |
| `@Digits` | `jakarta.validation.constraints.Digits$List` | — |
| `@DecimalMax` | `jakarta.validation.constraints.DecimalMax$List` | — |
| `@DecimalMin` | `jakarta.validation.constraints.DecimalMin$List` | — |
| `@Positive` | `jakarta.validation.constraints.Positive$List` | — |
| `@PositiveOrZero` | `jakarta.validation.constraints.PositiveOrZero$List` | — |
| `@Negative` | `jakarta.validation.constraints.Negative$List` | — |
| `@NegativeOrZero` | `jakarta.validation.constraints.NegativeOrZero$List` | — |
| `@Future` | `jakarta.validation.constraints.Future$List` | — |
| `@FutureOrPresent` | `jakarta.validation.constraints.FutureOrPresent$List` | — |
| `@Past` | `jakarta.validation.constraints.Past$List` | — |
| `@PastOrPresent` | `jakarta.validation.constraints.PastOrPresent$List` | — |
| `@AssertTrue` | `jakarta.validation.constraints.AssertTrue$List` | — |
| `@AssertFalse` | `jakarta.validation.constraints.AssertFalse$List` | — |

**Template entry for each constraint (replace `<ConstraintName>` and `<InnerClass>`):**
```json
{
  "name": "jakarta.validation.constraints.<ConstraintName>$<InnerClass>",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
}
```

### 3.3 — Custom Validator Entries

For any project-specific custom constraint annotations, register both the annotation and its validator class:

```json
{
  "name": "com.example.myproject.validator.MyCustomConstraint",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
},
{
  "name": "com.example.myproject.validator.MyCustomValidator",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
}
```

**How to detect custom validators:**
- Search for classes annotated with `@Constraint(validatedBy = ...)` in the project
- The annotation class and the class referenced in `validatedBy` both need entries

---

## Step 4 — Create/Update `src/main/resources/resource-config.json`

This file registers classpath resources to be included in the native image.

**If the file does not exist**, create it at `src/main/resources/resource-config.json`.

**Required content:**

```json
{
  "resources": [
    {
      "pattern": "META-INF/.*.kotlin_module$"
    },
    {
      "pattern": "META-INF/services/.*"
    },
    {
      "pattern": ".*.kotlin_builtins"
    }
  ]
}
```

> **Note:** For Java-only projects, remove Kotlin-specific patterns (`kotlin_module`, `kotlin_builtins`) if the project does not use Kotlin.

---

## Step 5 — Update `src/main/resources/application.properties`

Add the following native compilation properties. **If any already exist, do not duplicate — update the values instead.**

```properties
# Native build arguments for GraalVM
quarkus.native.additional-build-args=-H:+UnlockExperimentalVMOptions,-H:ReflectionConfigurationFiles=reflect-config.json,-H:ResourceConfigurationFiles=resource-config.json,-H:DeadlockWatchdogInterval=60000,-H:-UnlockExperimentalVMOptions,-H:+ReportExceptionStackTraces,--verbose,--initialize-at-run-time=graphql.util.IdGenerator,--initialize-at-build-time=kotlin\\,ch.qos.logback\\,org.slf4j,--parallelism=4,-march=compatibility

# Resource patterns to include in native image
quarkus.native.resources.includes=i18n/**,.*\\.graphqls$,.*\\.sdl$,.*\\.json$

# Memory allocation for native image build
quarkus.native.native-image-xmx=16g
```

**Key flags explained:**

| Flag | Purpose |
|---|---|
| `-H:ReflectionConfigurationFiles=reflect-config.json` | Points GraalVM to the reflection config file |
| `-H:ResourceConfigurationFiles=resource-config.json` | Points GraalVM to the resource config file |
| `-H:DeadlockWatchdogInterval=60000` | Enables deadlock detection (60s interval) |
| `--initialize-at-run-time=graphql.util.IdGenerator` | Defers `IdGenerator` initialisation to runtime (GraphQL-specific) |
| `--initialize-at-build-time=kotlin\\,ch.qos.logback\\,org.slf4j` | Forces these to initialise at build time |
| `--parallelism=4` | Controls parallel build threads (adjust to available CPU) |
| `-march=compatibility` | Generates portable binary (not CPU-model-specific) |
| `quarkus.native.native-image-xmx=16g` | Memory cap for native image build process |

---

## Step 6 — Update `env/<env-name>/properties.yml`

For **each** environment YAML file under `env/`, add the `isNative: true` property if it is not already present.

**Location:** `env/<env-name>/properties.yml` — add at the **root level** of the file (not nested inside any block).

```yaml
isNative: true
```

**Example** — before:
```yaml
envData:
  - name: SOME_ENV_VAR
    value: some-value
```

**Example** — after:
```yaml
isNative: true

envData:
  - name: SOME_ENV_VAR
    value: some-value
```

**How to check:** Read each file under `env/` and search for `isNative`. Only add if missing.

---

## Step 7 — Add `@RegisterForReflection` Annotation

GraalVM native compilation removes unreachable code at build time. Classes that are accessed via reflection at runtime must be explicitly registered. There are two categories of classes to annotate in an Experience API project.

### 7.1 — DTO / Model Classes in Federated Packages

Read `application.properties` and find the `devkit.federated.supported.packages` property. This lists the packages whose classes are used as GraphQL federation types and are accessed reflectively.

**Example:**
```properties
devkit.federated.supported.packages=com.sc.devkit.shell.menu.model,com.sc.devkit.shell.plugin.model,...
```

For **every class** in these packages, add `@RegisterForReflection`:

```kotlin
import io.quarkus.runtime.annotations.RegisterForReflection

@RegisterForReflection           // ← add this annotation
data class Menu(
    var id: String? = null,
    var title: String? = null,
    // ...
)
```

**Java equivalent:**
```java
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection           // ← add this annotation
public class Menu {
    public String id;
    public String title;
    // ...
}
```

**How to find classes:**
- For each package listed in `devkit.federated.supported.packages`, locate all `.kt` / `.java` files under that package path
- Add `@RegisterForReflection` to every class in those packages
- Also add the import: `import io.quarkus.runtime.annotations.RegisterForReflection`

### 7.2 — GraphQL Query and Mutation Service Classes

Find the GraphQL entry file (typically named `Function.kt` or `Function.java` in the root package). This file contains a `GraphQLServer.Builder()` call that lists all registered queries and mutations via `TopLevelObject(...)`.

**Identify all service classes** referenced in the builder's `.queries()` and `.mutations()` lists:

```kotlin
.queries(
    listOf(
        TopLevelObject(menuQueryService, MenuQueryService::class),       // → MenuQueryService
        TopLevelObject(pluginQueryService, PluginQueryService::class),   // → PluginQueryService
        // ...
    )
)
.mutations(
    listOf(
        TopLevelObject(widgetMutationService, WidgetMutationService::class),  // → WidgetMutationService
        // ...
    )
)
```

For **each** of these service classes, add `@RegisterForReflection`:

```kotlin
import io.quarkus.runtime.annotations.RegisterForReflection

@RegisterForReflection           // ← add this annotation
@ApplicationScoped
class MenuQueryService(@RestClient private val menuClient: MenuClient) {
    // ...
}
```

**Rules:**
- Add `@RegisterForReflection` **before** existing class-level annotations (e.g., before `@ApplicationScoped`)
- Add the import statement if not already present
- Do not modify the service method implementations
- This applies to **all** services in both `.queries()` and `.mutations()` lists, and any service that appears in both

---

## Step 8 — Add `@GraphQLName` to All Parameters of Public Methods in GraphQL Service Classes

GraalVM native compilation strips Java parameter name metadata from bytecode. Without explicit `@GraphQLName` annotations on method parameters, the GraphQL schema generator cannot resolve argument names at runtime in a native image, causing schema generation failures or incorrect argument names.

### 8.1 — Identify Methods to Update

For **each** service class identified in Step 7.2 (all classes referenced in `.queries()` and `.mutations()` in `Function.java` / `Function.kt`):

1. Read the full source file
2. Find every **`public`** (Java) or **`public`/`open`** (Kotlin) method in the class
3. For each method, inspect **every parameter**
4. If a parameter does **not** already have a `@GraphQLName(...)` annotation, add one with the value equal to the parameter's variable name

> **Skip** private, protected, or package-private methods — only `public` (and `open` in Kotlin) methods are exposed as GraphQL operations.
> **Skip** constructor parameters — only method parameters need annotation.
> **Skip** parameters that already have `@GraphQLName(...)` — do not duplicate.

### 8.2 — Annotation Rules

- The `@GraphQLName` value must exactly match the parameter variable name (case-sensitive)
- Use `com.expediagroup.graphql.generator.annotations.GraphQLName` — add the import if not already present
- Place the annotation directly before the parameter type in the method signature

**Java — before:**
```java
@GraphQLName("get_userAllCalendars")
public List<CalendarListResponse> getUserAllCalendars(String userId) { ... }

@GraphQLName("get_userCalendars")
public CalendarListResponse getUserCalendars(String userId, String version, String source) { ... }
```

**Java — after:**
```java
@GraphQLName("get_userAllCalendars")
public List<CalendarListResponse> getUserAllCalendars(@GraphQLName("userId") String userId) { ... }

@GraphQLName("get_userCalendars")
public CalendarListResponse getUserCalendars(@GraphQLName("userId") String userId, @GraphQLName("version") String version, @GraphQLName("source") String source) { ... }
```

**Kotlin — before:**
```kotlin
@GraphQLName("get_userCalendars")
fun getUserCalendars(userId: String, version: String?, source: String?): CalendarListResponse { ... }
```

**Kotlin — after:**
```kotlin
@GraphQLName("get_userCalendars")
fun getUserCalendars(@GraphQLName("userId") userId: String, @GraphQLName("version") version: String?, @GraphQLName("source") source: String?): CalendarListResponse { ... }
```

### 8.3 — Import Statement

For **Java** files, ensure the following import is present at the top of each modified service file:

```java
import com.expediagroup.graphql.generator.annotations.GraphQLName;
```

For **Kotlin** files:

```kotlin
import com.expediagroup.graphql.generator.annotations.GraphQLName
```

> If the import already exists (e.g. the class already uses `@GraphQLName` at method level), do not add a duplicate import.

### 8.4 — How to Detect Parameters Already Annotated

A parameter is considered already annotated if its declaration matches the pattern:
- Java: `@GraphQLName("...") <Type> <paramName>`
- Kotlin: `@GraphQLName("...") <paramName>: <Type>`

Only add the annotation when the pattern is absent for that specific parameter.

---

## Verification Checklist

After completing all steps, verify the following:

- [ ] `pom.xml`: `graphql-parent` version ≥ `4.33.0-11347960`
- [ ] `pom.xml`: `devkit-graphql-common` version ≥ `4.33.0-11354450`
- [ ] `azure-pipelines-maven.yml`: `pool` = `sc-rhel8ec2-large`
- [ ] `azure-pipelines-maven.yml`: `buildpackImageName` contains `quarkus-native` and version ≥ `20260326.3`
- [ ] `azure-pipelines-maven.yml`: `builderImageName` contains `quarkus-native` and version ≥ `20260326.3`
- [ ] `src/main/resources/reflect-config.json` exists with all required entries
- [ ] `src/main/resources/resource-config.json` exists
- [ ] `src/main/resources/application.properties` contains all three native build properties
- [ ] All `env/*/properties.yml` files contain `isNative: true`
- [ ] All model/DTO classes in `devkit.federated.supported.packages` have `@RegisterForReflection`
- [ ] All GraphQL query/mutation service classes from `Function.kt` / `Function.java` have `@RegisterForReflection`
- [ ] All `public` (Java) / `public`/`open` (Kotlin) method parameters in every GraphQL query/mutation service class have `@GraphQLName("<paramName>")` — no parameter is left unannotated
- [ ] `com.expediagroup.graphql.generator.annotations.GraphQLName` import is present in every service file that received parameter annotations

---

## Troubleshooting

### `ClassNotFoundException` at runtime
- A class is missing from `reflect-config.json` or is missing `@RegisterForReflection`
- Add the class to `reflect-config.json` or annotate it

### Validation annotations not working in native image
- One or more `jakarta.validation.constraints.*$List` entries are missing from `reflect-config.json`
- Also check for `Pattern$Flag` if `@Pattern` is used
- Search the codebase for all `@` validation annotation usages and cross-reference with `reflect-config.json`

### Native image build fails with `OutOfMemoryError`
- Increase `quarkus.native.native-image-xmx` (e.g., `24g` or `32g`)

### Pipeline fails with pool error
- Confirm `pool: 'sc-rhel8ec2-large'` is set under `buildStackParams`

### `.graphqls` schema file not found at runtime
- Ensure `.*\\.graphqls$` pattern is in `quarkus.native.resources.includes`

### GraphQL argument names are wrong or schema generation fails at startup
- One or more `public` method parameters in a query or mutation service class are missing `@GraphQLName`
- GraalVM strips Java parameter name debug info from bytecode; without `@GraphQLName`, the schema generator cannot resolve argument names
- Re-run Step 8: check every `public` method in every service class registered under `.queries()` and `.mutations()`, and ensure all parameters carry `@GraphQLName("<paramName>")`
