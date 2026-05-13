# Bash Tool Sandbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the agent-utils `Bash` tool secure by default and only usable inside an explicit, constrained sandbox.

**Architecture:** Disable Bash unless `chatbot.agent-utils.bash.enabled=true` is explicitly configured, then enforce a dedicated filesystem root plus an allowlist for command executables. `BashTool` should validate the requested working directory, execute without `sh -c`, constrain environment variables, and reject shell metacharacter command strings.

**Tech Stack:** Spring Boot configuration properties, Java 17 `ProcessBuilder`, JUnit 5 unit tests.

---

## Files

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/AgentUtilsProperties.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/AgentUtilsConfig.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/tool/agentutils/BashTool.java`
- Modify: `services/chatbot-backend/src/main/resources/application.yml`
- Modify: `services/chatbot-backend/.env.example`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/tool/agentutils/BashToolTest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/config/AgentUtilsPropertiesTest.java`

## Task 1: Secure Defaults

- [ ] **Step 1: Write failing config tests**

Add assertions in `AgentUtilsPropertiesTest` that default Bash is disabled and has a sandbox root:

```java
AgentUtilsProperties defaults = new AgentUtilsProperties();
assertFalse(defaults.getBash().isEnabled());
assertEquals("chatbot-agent-sandbox", defaults.getBash().getSandboxDirectoryName());
assertEquals(List.of("python3", "python", "node"), defaults.getBash().getAllowedCommands());
```

- [ ] **Step 2: Make defaults secure**

In `AgentUtilsProperties.Bash`, change `enabled` to `false` and add properties:

```java
private boolean enabled = false;
private String sandboxDirectoryName = "chatbot-agent-sandbox";
private List<String> allowedCommands = List.of("python3", "python", "node");
```

- [ ] **Step 3: Remove unconditional YAML enablement**

In `application.yml`, replace:

```yaml
bash:
  enabled: true
```

with:

```yaml
bash:
  enabled: ${CHATBOT_AGENT_UTILS_BASH_ENABLED:false}
  sandbox-directory-name: ${CHATBOT_AGENT_UTILS_BASH_SANDBOX_DIR:chatbot-agent-sandbox}
  allowed-commands: ${CHATBOT_AGENT_UTILS_BASH_ALLOWED_COMMANDS:python3,python,node}
```

- [ ] **Step 4: Verify tests fail, then pass**

Run: `cd services/chatbot-backend && mvn test -Dtest=AgentUtilsPropertiesTest`

Expected after implementation: tests pass and default Bash is disabled.

## Task 2: Filesystem Sandbox

- [ ] **Step 1: Write failing BashTool sandbox tests**

Add tests covering:

```java
assertTrue(tool.execute("python3 --version", sandbox.toString()).contains("Python"));
assertTrue(tool.execute("python3 --version", "/tmp").contains("outside sandbox"));
assertTrue(tool.execute("python3 --version", "../").contains("outside sandbox"));
```

- [ ] **Step 2: Change BashTool constructor**

Replace the two-argument constructor with a constructor that receives timeout, output limit, sandbox root, and allowed commands:

```java
public BashTool(int timeoutSeconds, int maxOutputChars, Path sandboxRoot, List<String> allowedCommands)
```

Create the sandbox root if needed and normalize it:

```java
this.sandboxRoot = Files.createDirectories(sandboxRoot).toAbsolutePath().normalize();
```

- [ ] **Step 3: Validate workdir**

Resolve blank `workdir` to `sandboxRoot`. Reject any non-blank `workdir` whose normalized absolute path does not start with `sandboxRoot`.

- [ ] **Step 4: Wire config**

In `AgentUtilsConfig.bashToolCallback`, create the sandbox root under `java.io.tmpdir` using `config.getSandboxDirectoryName()` and pass the allowlist into `BashTool`.

## Task 3: Command Allowlist

- [ ] **Step 1: Write failing command tests**

Add tests that reject shell metacharacters and non-allowlisted executables:

```java
assertTrue(tool.execute("cat /etc/passwd", sandbox.toString()).contains("not allowed"));
assertTrue(tool.execute("python3 -c \"print(1)\"; cat /etc/passwd", sandbox.toString()).contains("shell syntax"));
```

- [ ] **Step 2: Parse commands without shell execution**

Implement a small tokenizer for quoted arguments. Reject command strings containing shell control syntax: `;`, `&&`, `||`, `|`, `<`, `>`, backticks, `$(`.

- [ ] **Step 3: Execute with ProcessBuilder directly**

Replace:

```java
new ProcessBuilder("sh", "-c", command)
```

with:

```java
new ProcessBuilder(parsedArgs)
```

The first token must match `allowedCommands`.

## Task 4: Environment Containment

- [ ] **Step 1: Write environment test**

Set a fake process env-sensitive variable through `ProcessBuilder.environment()` only if needed by implementation tests; verify the child process does not inherit arbitrary variables by default.

- [ ] **Step 2: Clear inherited environment**

Before starting the process:

```java
Map<String, String> environment = pb.environment();
environment.clear();
environment.put("HOME", sandboxRoot.toString());
environment.put("TMPDIR", sandboxRoot.toString());
environment.put("PATH", "/usr/bin:/bin:/usr/local/bin");
```

## Task 5: Documentation and Final Verification

- [ ] **Step 1: Document opt-in env vars**

Add to `services/chatbot-backend/.env.example`:

```bash
CHATBOT_AGENT_UTILS_BASH_ENABLED=false
CHATBOT_AGENT_UTILS_BASH_SANDBOX_DIR=chatbot-agent-sandbox
CHATBOT_AGENT_UTILS_BASH_ALLOWED_COMMANDS=python3,python,node
```

- [ ] **Step 2: Run focused tests**

Run:

```bash
cd services/chatbot-backend && mvn test -Dtest=BashToolTest,AgentUtilsPropertiesTest,AgentUtilsConfigTest
```

- [ ] **Step 3: Run broader backend tests**

Run:

```bash
cd services/chatbot-backend && mvn test
```

Expected: all tests pass; Bash is absent unless explicitly enabled; enabled Bash cannot leave the configured sandbox or use arbitrary shell syntax.
