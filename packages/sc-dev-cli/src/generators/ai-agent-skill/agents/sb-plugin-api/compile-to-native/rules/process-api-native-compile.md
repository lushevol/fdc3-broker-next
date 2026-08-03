---
name: process-api-native-compile
description: GraalVM native compilation guide for Process API (REST/JAX-RS) Quarkus projects. Use when enabling native compilation on a project using process-parent-java or process-parent-kotlin. Covers updating pom.xml parent version, azure-pipelines-maven.yml CI configuration, reflect-config.json, resource-config.json, application.properties, env properties files, and @RegisterForReflection annotations on classes accessed via reflection.
compatibility: Designed for VS Code Copilot agent mode
---

# Process API — Native Compilation Enablement Guide

> **Reference Project:** `55313-sb-shell-process-api` (this project, `catalyst/main` branch as the native-ready baseline)
> This guide is derived from the native-compilation-ready state of `55313-sb-shell-process-api` and documents every change required to enable GraalVM native compilation for a standard Java or Kotlin Process API (REST) project.

---

## Overview

A Process API project uses REST (JAX-RS / Quarkus REST) and `process-parent-java` or `process-parent-kotlin` as its parent POM. Enabling native compilation involves 7 sequential steps:

1. Update `pom.xml` parent version
2. Update `azure-pipelines-maven.yml` CI configuration
3. Create/update `src/main/resources/reflect-config.json`
4. Create/update `src/main/resources/resource-config.json`
5. Update `src/main/resources/application.properties`
6. Update all `env/<env-name>/properties.yml` files
7. Add `@RegisterForReflection` annotation to classes accessed via reflection

---

## Step 1 — Update `pom.xml`

### 1.1 — Update Parent POM Version

**For Java projects** — update `process-parent-java` to version `4.33.0-11341651` or higher:

```xml
<parent>
    <groupId>com.sc.devkit</groupId>
    <artifactId>process-parent-java</artifactId>
    <version>4.33.0-11341651</version>   <!-- update to this version or higher -->
</parent>
```

**For Kotlin projects** — update `process-parent-kotlin` to version `4.33.0-11354507` or higher:

```xml
<parent>
    <groupId>com.sc.devkit</groupId>
    <artifactId>process-parent-kotlin</artifactId>
    <version>4.33.0-11354507</version>   <!-- update to this version or higher -->
</parent>
```

**How to check current versions:**
- Read `pom.xml` and look for the `<parent>` block
- Compare the current version against the minimum versions above
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

### 3.1 — Required Base Entries (always include for Process API projects)

The following entries are always required for Process API projects using Logback and Caffeine cache:

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
  }
]
```

> **For Kotlin projects only:** Also add the following Kotlin reflection entries:
> ```json
> {
>   "name": "kotlin.reflect.jvm.internal.ReflectionFactoryImpl",
>   "allDeclaredConstructors": true
> },
> {
>   "name": "kotlin.reflect.jvm.internal.impl.descriptors.runtime.structure.ReflectJavaClassifierType",
>   "allDeclaredConstructors": true,
>   "allDeclaredMethods": true,
>   "allDeclaredFields": true
> },
> {
>   "name": "kotlin.reflect.jvm.internal.KTypeImpl",
>   "allDeclaredConstructors": true,
>   "allDeclaredMethods": true,
>   "allDeclaredFields": true
> },
> {
>   "name": "kotlin.reflect.jvm.internal.KClassImpl",
>   "allDeclaredConstructors": true,
>   "allDeclaredMethods": true,
>   "allDeclaredFields": true
> },
> {
>   "name": "kotlin.KotlinVersion",
>   "allPublicMethods": true,
>   "allDeclaredFields": true,
>   "allDeclaredMethods": true,
>   "allDeclaredConstructors": true
> }
> ```

### 3.2 — Jakarta Validation Constraint Entries

For every `jakarta.validation.constraints.*` annotation used anywhere in the project's source code, the corresponding `$List` inner class **must** be registered. Additionally, some annotations have nested enum types that also require registration.

**How to detect which constraints are used:**
- Search all `.kt` and `.java` files for `jakarta.validation.constraints.` imports
- Also search for annotation usage patterns: `@NotNull`, `@Size`, `@Pattern`, `@Min`, `@Max`, `@NotBlank`, `@NotEmpty`, `@Email`, `@Valid`, etc.
- Include DTO fields, entity fields, and service method parameters

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

**Worked example** — if the project uses `@NotEmpty`, `@NotBlank`, `@NotNull`, `@Size`, `@Min`, `@Max`, `@Pattern`:
```json
{
  "name": "jakarta.validation.constraints.NotEmpty$List",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
},
{
  "name": "jakarta.validation.constraints.NotBlank$List",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
},
{
  "name": "jakarta.validation.constraints.NotNull$List",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
},
{
  "name": "jakarta.validation.constraints.Max$List",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
},
{
  "name": "jakarta.validation.constraints.Min$List",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
},
{
  "name": "jakarta.validation.constraints.Pattern$List",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
},
{
  "name": "jakarta.validation.constraints.Pattern$Flag",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
},
{
  "name": "jakarta.validation.constraints.Size$List",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
}
```

### 3.3 — Custom Validator Entries

For any project-specific custom constraint annotations, register both the annotation class and its validator class:

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

**Example from this project:**
```json
{
  "name": "com.sc.devkit.shell.common.validator.ValidBankId",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
},
{
  "name": "com.sc.devkit.shell.common.validator.BankIdValidator",
  "allDeclaredConstructors": true,
  "allDeclaredMethods": true,
  "allDeclaredFields": true
}
```

---

## Step 4 — Create/Update `src/main/resources/resource-config.json`

This file registers classpath resources to be included in the native image.

**If the file does not exist**, create it at `src/main/resources/resource-config.json`.
**If the file already exists**, verify the required patterns are present.

**Required content for Java Process API projects:**

```json
{
  "resources": [
    {
      "pattern": "META-INF/services/.*"
    }
  ]
}
```

**Required content for Kotlin Process API projects** (include Kotlin-specific patterns):

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

> **Note:** The `kotlin_module` and `kotlin_builtins` patterns are only required for Kotlin projects. Remove them for pure Java projects.

---

## Step 5 — Update `src/main/resources/application.properties`

Add the following native compilation properties. **If any already exist, do not duplicate — update the values instead.**

**For Java Process API projects:**

```properties
# Native build arguments for GraalVM
quarkus.native.additional-build-args=-H:+UnlockExperimentalVMOptions,-H:ReflectionConfigurationFiles=reflect-config.json,-H:ResourceConfigurationFiles=resource-config.json,-H:DeadlockWatchdogInterval=60000,-H:-UnlockExperimentalVMOptions,-H:+ReportExceptionStackTraces,--verbose,--initialize-at-build-time=ch.qos.logback\\,org.slf4j,--parallelism=4,-march=compatibility,--report-unsupported-elements-at-runtime

# Resource patterns to include in native image
quarkus.native.resources.includes=i18n/**,.*\\.json$

# Memory allocation for native image build
quarkus.native.native-image-xmx=16g
```

**For Kotlin Process API projects** (add Kotlin to `--initialize-at-build-time`):

```properties
# Native build arguments for GraalVM
quarkus.native.additional-build-args=-H:+UnlockExperimentalVMOptions,-H:ReflectionConfigurationFiles=reflect-config.json,-H:ResourceConfigurationFiles=resource-config.json,-H:DeadlockWatchdogInterval=60000,-H:-UnlockExperimentalVMOptions,-H:+ReportExceptionStackTraces,--verbose,--initialize-at-build-time=kotlin\\,ch.qos.logback\\,org.slf4j,--parallelism=4,-march=compatibility,--report-unsupported-elements-at-runtime

# Resource patterns to include in native image
quarkus.native.resources.includes=i18n/**,.*\\.json$

# Memory allocation for native image build
quarkus.native.native-image-xmx=16g
```

**Key flags explained:**

| Flag | Purpose |
|---|---|
| `-H:ReflectionConfigurationFiles=reflect-config.json` | Points GraalVM to the reflection config file |
| `-H:ResourceConfigurationFiles=resource-config.json` | Points GraalVM to the resource config file |
| `-H:DeadlockWatchdogInterval=60000` | Enables deadlock detection (60s interval) |
| `--initialize-at-build-time=kotlin\\,...` | Forces Kotlin (and other listed classes) to initialise at build time (Kotlin projects only) |
| `--initialize-at-build-time=ch.qos.logback\\,org.slf4j` | Forces logging framework classes to initialise at build time |
| `--parallelism=4` | Controls parallel build threads (adjust to available CPU) |
| `-march=compatibility` | Generates portable binary (not CPU-model-specific) |
| `--report-unsupported-elements-at-runtime` | Delays errors for unsupported elements to runtime rather than failing the build |
| `quarkus.native.native-image-xmx=16g` | Memory cap for native image build process |
| `quarkus.native.resources.includes=i18n/**,.*\\.json$` | Includes i18n resource files and all JSON files in the native image |

> **Warning:** The `quarkus.native.additional-build-args` value must be a single line with no line breaks. Avoid splitting across multiple lines.

---

## Step 6 — Update `env/<env-name>/properties.yml`

For **each** environment YAML file under `env/`, add the `isNative: true` property if it is not already present.

**Location:** `env/<env-name>/properties.yml` — add at the **root level** of the file (not nested inside any block).

```yaml
isNative: true
```

**Example** — before:
```yaml
functionType: private-api
enableRestLivenessProbe: true
enableRestReadinessProbe: true

enableSIP: true
```

**Example** — after:
```yaml
functionType: private-api
enableRestLivenessProbe: true
enableRestReadinessProbe: true

enableSIP: true
isNative: true
```

**How to check:** Read each file under `env/` and search for `isNative`. Only add if missing.

> **Note:** All environment files must have this property — including dev, sit, uat, qa, pre-prod, and all prod environments.

---

## Step 7 — Add `@RegisterForReflection` Annotation

GraalVM native compilation removes unreachable code at build time. Classes that are accessed via reflection at runtime (e.g., via Jackson serialisation/deserialisation, dynamic instantiation, or framework internals) must be explicitly annotated.

### 7.1 — DTO / Model Classes Used in Reflection Contexts

Classes that are instantiated or accessed reflectively (e.g., passed to generic frameworks, used with `ObjectMapper`, returned from REST client interfaces, or serialised/deserialised dynamically) should be annotated with `@RegisterForReflection`.

**How to identify candidates:**
- DTO classes used as REST response/request bodies that may be deserialized by Jackson reflectively
- Classes used with `ObjectMapper.readValue(...)` where the target type is resolved at runtime
- Classes used in generic type parameters that GraalVM cannot statically analyse
- Any class that causes `ClassNotFoundException` or `InstantiationException` in native mode

**Java example:**
```java
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection           // ← add this annotation
public class PluginMaintenanceDto {
    private Boolean isMaintainanceWindowActive;
    private String pluginId;
    // ...
}
```

**Kotlin example:**
```kotlin
import io.quarkus.runtime.annotations.RegisterForReflection

@RegisterForReflection           // ← add this annotation
data class PluginMaintenanceDto(
    val isMaintainanceWindowActive: Boolean? = null,
    val pluginId: String? = null,
    // ...
)
```

**Rules:**
- Place `@RegisterForReflection` before other class-level annotations
- Add the import statement if not already present: `import io.quarkus.runtime.annotations.RegisterForReflection`
- Do not add to entity classes annotated with `@Entity` — Hibernate ORM handles those automatically
- Do not add to CDI beans (`@ApplicationScoped`, `@RequestScoped`, etc.) unless they are also directly accessed reflectively

### 7.2 — Classes Accessed Reflectively by Third-Party Libraries

Some third-party libraries (e.g., ModelMapper, JSON-Path) use reflection to inspect and map classes. Identify any classes passed to these libraries:

**ModelMapper example — register source and target mapping classes:**
```java
@RegisterForReflection
public class PluginResponseDto {
    // ...
}
```

**JSON-Path / JsonSmartParser example — register model classes used in JSON path evaluation:**
```java
@RegisterForReflection
public class StoreResponseDto {
    // ...
}
```

**How to detect:**
- Search for usages of `ModelMapper`, `JsonPath.read(...)`, `ObjectMapper.convertValue(...)`, or similar reflective operations
- Register the classes passed to these operations as type parameters or target types

---

## Verification Checklist

After completing all steps, verify the following:

- [ ] `pom.xml`: `process-parent-java` version ≥ `4.33.0-11341651` (Java) OR `process-parent-kotlin` version ≥ `4.33.0-11354507` (Kotlin)
- [ ] `azure-pipelines-maven.yml`: `pool` = `sc-rhel8ec2-large`
- [ ] `azure-pipelines-maven.yml`: `buildpackImageName` = `buildpack-quarkus-native:20260326.3` or higher
- [ ] `azure-pipelines-maven.yml`: `builderImageName` = `builder-quarkus-native:20260326.3` or higher
- [ ] `src/main/resources/reflect-config.json` exists with all required base entries (Caffeine cache, Logback)
- [ ] `src/main/resources/reflect-config.json` contains entries for all `jakarta.validation.constraints.*` annotations used in the project
- [ ] `src/main/resources/reflect-config.json` contains entries for all custom validators
- [ ] `src/main/resources/reflect-config.json` contains Kotlin entries (Kotlin projects only)
- [ ] `src/main/resources/resource-config.json` exists with required resource patterns
- [ ] `src/main/resources/application.properties` contains `quarkus.native.additional-build-args`
- [ ] `src/main/resources/application.properties` contains `quarkus.native.resources.includes`
- [ ] `src/main/resources/application.properties` contains `quarkus.native.native-image-xmx`
- [ ] All `env/*/properties.yml` files contain `isNative: true`
- [ ] All DTO/model classes accessed reflectively at runtime have `@RegisterForReflection`

---

## Troubleshooting

### `ClassNotFoundException` or `NoSuchMethodException` at runtime
- A class is missing from `reflect-config.json` or is missing `@RegisterForReflection`
- Add the class to `reflect-config.json` or annotate it with `@RegisterForReflection`

### Validation annotations not working in native image
- One or more `jakarta.validation.constraints.*$List` entries are missing from `reflect-config.json`
- Also check for `Pattern$Flag` if `@Pattern` is used
- Search the codebase for all `@` validation annotation usages and cross-reference with `reflect-config.json`

### Native image build fails with `OutOfMemoryError`
- Increase `quarkus.native.native-image-xmx` (e.g., `24g` or `32g`)

### Pipeline fails with wrong pool / agent error
- Confirm `pool: 'sc-rhel8ec2-large'` is set under `buildStackParams` in `azure-pipelines-maven.yml`

### JSON resource files (i18n, config) not found at runtime
- Ensure `.*\\.json$` and `i18n/**` patterns are present in `quarkus.native.resources.includes` in `application.properties`

### ModelMapper / Jackson mapping fails at runtime
- Register the DTO/model classes used as mapping targets with `@RegisterForReflection`

### Kotlin reflection errors at runtime
- Add the Kotlin-specific entries to `reflect-config.json` (see Step 3.1)
- Ensure `kotlin` is listed in `--initialize-at-build-time` in `quarkus.native.additional-build-args`
- Ensure `META-INF/.*.kotlin_module$` and `.*.kotlin_builtins` patterns are in `resource-config.json`

