# Chatbot Agent Skill File Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users attach PDFs to chatbot messages, keep uploaded files in a day-one in-memory UUID registry, expose local file paths to the agent, and let the agent parse PDFs through the bundled `pdf` Agent Skill.

**Architecture:** The protocol carries uploaded files as `file` parts with base64 data or file IDs. The runtime preserves assistant-ui attachments as protocol file parts. The backend validates and stores uploaded files in memory, materializes them to an agent workspace path, appends file references to the agent prompt, and loads full Agent Skill directories including scripts and references.

**Tech Stack:** TypeScript, Zod, Vitest, React/assistant-ui, Java 17, Spring Boot, JUnit 5, Spring AI Agent Utils.

---

## File Structure

- Modify `packages/chat-protocol-contract/src/types.ts`: add upload fields to `ChatFilePart`.
- Modify `packages/chat-protocol-contract/src/schemas.ts`: validate file part retrieval source and base64 encoding.
- Modify `packages/chat-protocol-contract/test/validation.test.ts`: add contract coverage for uploaded file parts.
- Modify `packages/chat-protocol-runtime/src/runtime/client.ts`: serialize assistant-ui attachments as async protocol file parts.
- Modify `packages/chat-protocol-runtime/test/runtime-client.test.ts`: add runtime coverage for user message text plus PDF attachment.
- Modify `packages/chat-protocol-ui/src/provider.tsx`: await async protocol message conversion before building requests.
- Modify `services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolPart.java`: add file fields.
- Create `services/chatbot-backend/src/main/java/com/fdc3/chatbot/files/UploadedFile.java`: immutable uploaded file metadata and bytes.
- Create `services/chatbot-backend/src/main/java/com/fdc3/chatbot/files/UploadedFileRegistry.java`: in-memory UUID file store with validation and materialization.
- Create `services/chatbot-backend/src/main/java/com/fdc3/chatbot/files/UploadedFileContextBuilder.java`: turns protocol file parts into prompt context.
- Modify `services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java`: append uploaded-file context to active user message and history.
- Create tests under `services/chatbot-backend/src/test/java/com/fdc3/chatbot/files/`.
- Modify `services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/ProtocolChatServiceTest.java`: verify agent receives file context.
- Copy `/Users/taissa/lushuai/code/github/skills/skills/pdf` to `services/chatbot-backend/src/main/resources/skills/pdf`.
- Modify `services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/AgentUtilsConfig.java`: expose real filesystem skill base directories when skill directories contain scripts.
- Modify `services/chatbot-backend/src/test/java/com/fdc3/chatbot/config/AgentUtilsConfigTest.java`: verify `pdf` skill loads and reports a filesystem base directory.

---

### Task 1: Contract File Part Upload Shape

**Files:**
- Modify: `packages/chat-protocol-contract/src/types.ts`
- Modify: `packages/chat-protocol-contract/src/schemas.ts`
- Test: `packages/chat-protocol-contract/test/validation.test.ts`

- [ ] **Step 1: Write failing contract tests**

Add tests that assert:

```ts
it('accepts a base64 PDF file part in a user message', () => {
  const result = validateChatRunRequest({
    conversationId: 'conv-1',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        parts: [
          { type: 'text', text: 'Summarize this PDF' },
          {
            type: 'file',
            name: 'report.pdf',
            mimeType: 'application/pdf',
            sizeBytes: 12,
            data: 'JVBERi0xLjQ=',
            encoding: 'base64',
          },
        ],
      },
    ],
  });

  expect(result.success).toBe(true);
});

it('rejects a file part without data, fileId, or url', () => {
  const result = validateChatRunRequest({
    conversationId: 'conv-1',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        parts: [{ type: 'file', name: 'report.pdf', mimeType: 'application/pdf' }],
      },
    ],
  });

  expect(result.success).toBe(false);
});

it('rejects base64 file data without base64 encoding', () => {
  const result = validateChatRunRequest({
    conversationId: 'conv-1',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        parts: [{ type: 'file', name: 'report.pdf', data: 'JVBERi0xLjQ=' }],
      },
    ],
  });

  expect(result.success).toBe(false);
});
```

- [ ] **Step 2: Run the tests to verify RED**

Run: `cd packages/chat-protocol-contract && npm run test -- validation.test.ts`

Expected: FAIL because `data`, `encoding`, and `fileId` are unknown strict fields or because schema still requires `url`.

- [ ] **Step 3: Implement contract fields**

Update `ChatFilePart`:

```ts
export type ChatFilePart = {
  type: 'file';
  url?: string;
  fileId?: string;
  name?: string;
  mimeType?: string;
  sizeBytes?: number;
  data?: string;
  encoding?: 'base64';
};
```

Update `chatFilePartSchema` to make `url` optional, add `fileId`, `data`, and `encoding`, then add `superRefine`:

```ts
.superRefine((value, ctx) => {
  if (!value.url && !value.fileId && !value.data) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'file part requires one of url, fileId, or data',
    });
  }
  if (value.data && value.encoding !== 'base64') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['encoding'],
      message: 'encoding must be base64 when data is provided',
    });
  }
})
```

- [ ] **Step 4: Run contract tests to verify GREEN**

Run: `cd packages/chat-protocol-contract && npm run test -- validation.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add packages/chat-protocol-contract/src/types.ts packages/chat-protocol-contract/src/schemas.ts packages/chat-protocol-contract/test/validation.test.ts
git commit -m "feat: support uploaded file parts in chat protocol"
```

---

### Task 2: Runtime Attachment Serialization

**Files:**
- Modify: `packages/chat-protocol-runtime/src/runtime/client.ts`
- Test: `packages/chat-protocol-runtime/test/runtime-client.test.ts`
- Modify: `packages/chat-protocol-ui/src/provider.tsx`

- [ ] **Step 1: Write failing runtime test**

Add a test using a user message with text and an attachment-like content part:

```ts
it('converts user text and PDF attachments into protocol parts', async () => {
  const pdf = new File(['%PDF-1.4'], 'report.pdf', { type: 'application/pdf' });
  const messages = [
    {
      id: 'msg-1',
      role: 'user',
      content: [
        { type: 'text', text: 'Summarize this' },
        { type: 'file', file: pdf, filename: 'report.pdf', mimeType: 'application/pdf' },
      ],
      metadata: { custom: {} },
    },
  ];

  const result = await toProtocolMessages(messages as never);

  expect(result[0]).toMatchObject({
    id: 'msg-1',
    role: 'user',
    parts: [
      { type: 'text', text: 'Summarize this' },
      {
        type: 'file',
        name: 'report.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 8,
        encoding: 'base64',
      },
    ],
  });
  expect(result[0]?.parts[1]).toHaveProperty('data');
});
```

- [ ] **Step 2: Run the runtime test to verify RED**

Run: `cd packages/chat-protocol-runtime && npm run test -- runtime-client.test.ts`

Expected: FAIL because `toProtocolMessages` is synchronous and drops attachments.

- [ ] **Step 3: Implement async attachment conversion**

Change `toProtocolMessages` to return `Promise<ChatMessage[]>`. Add helpers:

```ts
function isFileLikePart(part: ThreadMessage['content'][number]): boolean {
  return part.type === 'file' || part.type === 'document';
}

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
```

When handling user/system messages, include text parts and file parts. For a file part with `file: File`, emit:

```ts
{
  type: 'file',
  name: file.name,
  mimeType: file.type || undefined,
  sizeBytes: file.size,
  data: await fileToBase64(file),
  encoding: 'base64',
}
```

For a file part with existing `fileId` or `url`, pass those fields through.

- [ ] **Step 4: Update provider call sites**

In `packages/chat-protocol-ui/src/provider.tsx`, make the stream builders async enough to await:

```ts
const protocolMessages = await toProtocolMessages(runOptions.messages);
const request = buildChatProtocolRequest({ conversationId, messages: protocolMessages, ... });
```

Do the same for human tool resume requests where current runtime messages are converted.

- [ ] **Step 5: Run runtime and UI package tests**

Run:

```bash
cd packages/chat-protocol-runtime && npm run test -- runtime-client.test.ts
cd packages/chat-protocol-ui && npm run test
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add packages/chat-protocol-runtime/src/runtime/client.ts packages/chat-protocol-runtime/test/runtime-client.test.ts packages/chat-protocol-ui/src/provider.tsx
git commit -m "feat: serialize chat attachments as protocol files"
```

---

### Task 3: Backend Uploaded File Registry

**Files:**
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/files/UploadedFile.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/files/UploadedFileRegistry.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/files/UploadedFileRegistryTest.java`

- [ ] **Step 1: Write failing registry tests**

Create tests for:

```java
@Test
void storesBase64PdfWithUuidMetadata() {
    UploadedFileRegistry registry = new UploadedFileRegistry();

    UploadedFile file = registry.store(
            "conv-1",
            "report.pdf",
            "application/pdf",
            "%PDF-1.4".getBytes(StandardCharsets.UTF_8)
    );

    assertNotNull(file.fileId());
    assertEquals("conv-1", file.conversationId());
    assertEquals("report.pdf", file.name());
    assertEquals("application/pdf", file.mimeType());
    assertArrayEquals("%PDF-1.4".getBytes(StandardCharsets.UTF_8), file.bytes());
}

@Test
void rejectsUnsupportedMimeType() {
    UploadedFileRegistry registry = new UploadedFileRegistry();

    IllegalArgumentException error = assertThrows(IllegalArgumentException.class, () ->
            registry.store("conv-1", "notes.txt", "text/plain", "hello".getBytes(StandardCharsets.UTF_8)));

    assertTrue(error.getMessage().contains("Unsupported file type"));
}

@Test
void materializesFileUnderSafeConversationDirectory() throws IOException {
    UploadedFileRegistry registry = new UploadedFileRegistry();
    UploadedFile file = registry.store("conv/../1", "../report.pdf", "application/pdf", "%PDF".getBytes(StandardCharsets.UTF_8));

    Path path = registry.materialize(file);

    assertTrue(Files.exists(path));
    assertTrue(path.toString().contains("chatbot-agent-files"));
    assertFalse(path.getFileName().toString().contains(".."));
}
```

- [ ] **Step 2: Run backend file tests to verify RED**

Run: `cd services/chatbot-backend && mvn test -Dtest=UploadedFileRegistryTest`

Expected: FAIL because the classes do not exist.

- [ ] **Step 3: Implement `UploadedFile`**

Use a Java record:

```java
package com.fdc3.chatbot.files;

import java.time.Instant;

public record UploadedFile(
        String fileId,
        String conversationId,
        String name,
        String mimeType,
        long sizeBytes,
        byte[] bytes,
        Instant createdAt
) {}
```

- [ ] **Step 4: Implement `UploadedFileRegistry`**

Implement:

```java
public UploadedFile store(String conversationId, String name, String mimeType, byte[] bytes)
public Optional<UploadedFile> find(String fileId)
public Path materialize(UploadedFile file)
```

Use:

- `ConcurrentHashMap<String, UploadedFile>`
- `UUID.randomUUID().toString()`
- allowed MIME set containing `application/pdf`
- max size constant `20L * 1024L * 1024L`
- temp root `Path.of(System.getProperty("java.io.tmpdir"), "chatbot-agent-files")`
- sanitizer replacing non `[A-Za-z0-9._-]` characters with `_`

- [ ] **Step 5: Run backend file tests to verify GREEN**

Run: `cd services/chatbot-backend && mvn test -Dtest=UploadedFileRegistryTest`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/files/UploadedFile.java services/chatbot-backend/src/main/java/com/fdc3/chatbot/files/UploadedFileRegistry.java services/chatbot-backend/src/test/java/com/fdc3/chatbot/files/UploadedFileRegistryTest.java
git commit -m "feat: add chatbot uploaded file registry"
```

---

### Task 4: Backend File Parts To Agent Context

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolPart.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/files/UploadedFileContextBuilder.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/files/UploadedFileContextBuilderTest.java`

- [ ] **Step 1: Write failing context builder tests**

Create tests that:

```java
@Test
void storesBase64FilePartAndBuildsPromptContext() {
    UploadedFileRegistry registry = new UploadedFileRegistry();
    UploadedFileContextBuilder builder = new UploadedFileContextBuilder(registry);
    ProtocolPart part = ProtocolPart.builder()
            .type("file")
            .name("report.pdf")
            .mimeType("application/pdf")
            .sizeBytes(8L)
            .data(Base64.getEncoder().encodeToString("%PDF-1.4".getBytes(StandardCharsets.UTF_8)))
            .encoding("base64")
            .build();

    String context = builder.build("conv-1", List.of(part));

    assertTrue(context.contains("Uploaded files available for this conversation"));
    assertTrue(context.contains("report.pdf"));
    assertTrue(context.contains("application/pdf"));
    assertTrue(context.contains("localPath:"));
    assertTrue(context.contains("invoke the pdf skill"));
}

@Test
void rejectsFileDataWithoutBase64Encoding() {
    UploadedFileContextBuilder builder = new UploadedFileContextBuilder(new UploadedFileRegistry());
    ProtocolPart part = ProtocolPart.builder()
            .type("file")
            .name("report.pdf")
            .mimeType("application/pdf")
            .data("abc")
            .build();

    assertThrows(IllegalArgumentException.class, () -> builder.build("conv-1", List.of(part)));
}
```

- [ ] **Step 2: Run context tests to verify RED**

Run: `cd services/chatbot-backend && mvn test -Dtest=UploadedFileContextBuilderTest`

Expected: FAIL because fields and builder do not exist.

- [ ] **Step 3: Add protocol file fields**

Add to `ProtocolPart`:

```java
private String url;
private String fileId;
private String name;
private String mimeType;
private Long sizeBytes;
private String data;
private String encoding;
```

If `name` conflicts with existing field names, keep `name` because protocol file parts use `name`.

- [ ] **Step 4: Implement `UploadedFileContextBuilder`**

Implement:

```java
public String build(String conversationId, List<ProtocolPart> parts)
```

Behavior:

- Filter `type == "file"`.
- For `data`, require `encoding == "base64"` and decode.
- Store decoded bytes in `UploadedFileRegistry`.
- For `fileId`, resolve existing registry entry.
- Materialize each file through registry.
- Return empty string if no file parts.
- Return a prompt block listing `fileId`, `name`, `mimeType`, `sizeBytes`, `localPath`, and the instruction to invoke the matching skill.

- [ ] **Step 5: Run context tests to verify GREEN**

Run: `cd services/chatbot-backend && mvn test -Dtest=UploadedFileContextBuilderTest`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/model/ProtocolPart.java services/chatbot-backend/src/main/java/com/fdc3/chatbot/files/UploadedFileContextBuilder.java services/chatbot-backend/src/test/java/com/fdc3/chatbot/files/UploadedFileContextBuilderTest.java
git commit -m "feat: build agent context for uploaded files"
```

---

### Task 5: Wire File Context Into Protocol Chat

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/ProtocolChatServiceTest.java`

- [ ] **Step 1: Write failing protocol service test**

Add a test that sends a user message with text and a PDF file part, then asserts `agentService.lastInvocation.userMessage()` contains:

```text
Summarize this PDF
Uploaded files available for this conversation:
report.pdf
localPath:
invoke the pdf skill
```

- [ ] **Step 2: Run protocol service test to verify RED**

Run: `cd services/chatbot-backend && mvn test -Dtest=ProtocolChatServiceTest`

Expected: FAIL because file context is not appended.

- [ ] **Step 3: Inject file context builder**

Add `UploadedFileContextBuilder` to `ProtocolChatService` constructor dependencies. In `ProtocolInvocation.from`, collect the active user `file` parts and append the builder output to the collected text:

```java
String userText = collectText(currentUserMessage);
String fileContext = uploadedFileContextBuilder.build(conversationId, currentUserMessage.getParts());
String userMessage = fileContext.isBlank() ? userText : userText + "\n\n" + fileContext;
```

If a static record factory makes injection awkward, move file-context augmentation outside `ProtocolInvocation.from` in `streamRun` after the invocation is created, or change the factory signature to accept the builder.

- [ ] **Step 4: Run protocol service test to verify GREEN**

Run: `cd services/chatbot-backend && mvn test -Dtest=ProtocolChatServiceTest`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/ProtocolChatServiceTest.java
git commit -m "feat: pass uploaded file context to chatbot agent"
```

---

### Task 6: Bundle Full PDF Skill Directory

**Files:**
- Create: `services/chatbot-backend/src/main/resources/skills/pdf/**`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/AgentUtilsConfig.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/config/AgentUtilsConfigTest.java`

- [ ] **Step 1: Write failing skill loading test**

Add a test that constructs the skill callback and calls it with `{"command":"pdf"}`. Assert the result contains:

```text
Base directory for this skill:
PDF Processing Guide
scripts/
reference.md
```

Also assert the reported base directory exists as a filesystem directory.

- [ ] **Step 2: Run config test to verify RED**

Run: `cd services/chatbot-backend && mvn test -Dtest=AgentUtilsConfigTest`

Expected: FAIL because the `pdf` skill is not bundled and classpath base paths may not be real filesystem paths.

- [ ] **Step 3: Copy full PDF skill directory**

Run:

```bash
cp -R /Users/taissa/lushuai/code/github/skills/skills/pdf services/chatbot-backend/src/main/resources/skills/pdf
```

Verify:

```bash
find services/chatbot-backend/src/main/resources/skills/pdf -maxdepth 2 -type f | sort
```

Expected files include `SKILL.md`, `reference.md`, `forms.md`, `LICENSE.txt`, and scripts under `scripts/`.

- [ ] **Step 4: Implement filesystem skill workspace support**

In `AgentUtilsConfig.skillsToolCallback`, load skills from classpath resources as today, but when returning a skill:

- Resolve/copy the skill directory to a real temp directory if the classpath resource is not a filesystem directory.
- Preserve all child files.
- Return `Base directory for this skill: <real-directory>`.

Keep the callback name `Skill` and the existing description format.

- [ ] **Step 5: Run config tests to verify GREEN**

Run: `cd services/chatbot-backend && mvn test -Dtest=AgentUtilsConfigTest`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add services/chatbot-backend/src/main/resources/skills/pdf services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/AgentUtilsConfig.java services/chatbot-backend/src/test/java/com/fdc3/chatbot/config/AgentUtilsConfigTest.java
git commit -m "feat: bundle pdf agent skill"
```

---

### Task 7: Full Verification

**Files:**
- May modify docs only if verification reveals a contract mismatch.

- [ ] **Step 1: Run package tests**

Run:

```bash
cd packages/chat-protocol-contract && npm run test
cd packages/chat-protocol-runtime && npm run test
cd packages/chat-protocol-ui && npm run test
```

Expected: PASS.

- [ ] **Step 2: Run backend targeted tests**

Run:

```bash
cd services/chatbot-backend && mvn test -Dtest=UploadedFileRegistryTest,UploadedFileContextBuilderTest,ProtocolChatServiceTest,AgentUtilsConfigTest
```

Expected: PASS.

- [ ] **Step 3: Run broader backend test if targeted tests pass**

Run:

```bash
cd services/chatbot-backend && mvn test
```

Expected: PASS or document unrelated existing failures.

- [ ] **Step 4: Build affected packages**

Run:

```bash
cd packages/chat-protocol-contract && npm run build
cd packages/chat-protocol-runtime && npm run build
cd packages/chat-protocol-ui && npm run build
```

Expected: PASS.

- [ ] **Step 5: Final status**

Run:

```bash
git status --short
```

Expected: only intentional changes or clean after commits.
