# Chatbot Agent Skill File Context Design

## Purpose

Users need to upload PDFs from the chatbot UI and ask the agent to analyze them. The backend must support this natively through Agent Skills, not through a dedicated PDF extraction service. Day-one support targets PDFs, but the design must generalize to later Excel, Word, image, and other file skills.

## Core Decisions

- Uploaded files are first-class chat protocol parts, not pre-extracted text.
- The backend stores uploaded files in memory using UUID references for day one.
- The agent receives file metadata and a backend-materialized local file path for each uploaded file.
- The agent decides when to invoke a skill. PDF parsing happens only after the model calls the `Skill` tool with `pdf`.
- Agent Skill support must include full skill directories: `SKILL.md`, scripts, references, forms, assets, and any other files under the skill folder.
- The Java backend must not implement a dedicated PDF parser for this workflow.

## User Workflow

1. User attaches a PDF in the chatbot composer.
2. The UI sends the message with a `file` part that includes the file name, MIME type, size, and encoded bytes.
3. The backend validates the attachment and stores bytes in an in-memory file registry keyed by UUID.
4. The backend materializes the file into an agent workspace path when building the active prompt context.
5. The prompt lists uploaded files and states that contents are not extracted yet.
6. When the user asks for PDF analysis, the model calls `Skill` with `pdf`.
7. The PDF skill instructions load, including references to scripts and additional docs.
8. The agent uses the materialized file path and the PDF skill scripts or commands to parse the PDF.
9. The agent answers using the parsed content.

## Protocol Changes

`chat-protocol-contract` keeps `parts` as the canonical message field. `ChatFilePart` should be extended to support upload payloads while preserving existing URL-based file references:

- `type: "file"`
- `url?: string`
- `fileId?: string`
- `name?: string`
- `mimeType?: string`
- `sizeBytes?: number`
- `data?: string`
- `encoding?: "base64"`

Validation rules:

- A file part must include at least one retrievable source: `data`, `fileId`, or `url`.
- `data` requires `encoding: "base64"`.
- PDF day-one UI should send `data` with `mimeType: "application/pdf"`.
- Later file types can reuse the same shape.

## UI And Runtime Changes

`chat-protocol-ui` already renders attachment controls through assistant-ui. The missing piece is runtime serialization.

`chat-protocol-runtime` should convert assistant-ui attachments into protocol `file` parts instead of dropping them. For day one:

- Read attached `File` objects as base64.
- Preserve text and file parts in the same user message.
- Prefer MIME type from the browser `File`.
- Keep attachment previews in the existing assistant-ui components.
- Do not parse PDF content in the browser.

The base app can continue using `ChatProtocolProvider`; no separate chatbot upload endpoint is required for the first version.

## Backend File Registry

Add an in-memory uploaded file registry in `services/chatbot-backend`.

Responsibilities:

- Accept protocol file parts with base64 data.
- Validate max file size, file count, MIME type, and non-empty names.
- Generate UUID-backed file IDs.
- Store bytes and metadata in memory.
- Provide lookup by file ID for prompt preparation.
- Apply retention cleanup. Day-one retention is process-local and time-based.

Default limits:

- Maximum files per request: 5.
- Maximum single file size: 20 MB.
- Maximum stored age: 24 hours.
- Allowed day-one MIME types: `application/pdf`.

The registry is intentionally not durable. Restarting chatbot-backend clears uploaded files.

## Agent Workspace Materialization

Skills and skill scripts need filesystem paths. Before invoking the agent for a request with file attachments, the backend should materialize uploaded bytes into a controlled workspace directory.

Expected path shape:

`<temp-root>/chatbot-agent-files/<conversation-id>/<file-id>/<safe-original-name>`

Requirements:

- Sanitize file names.
- Prevent path traversal.
- Reuse the same file path for the same stored file when possible.
- Include the path in prompt context.
- Keep deletion tied to registry cleanup.

The prompt should include a compact block similar to:

```text
Uploaded files available for this conversation:
- fileId: 8f3...
  name: quarterly-report.pdf
  mimeType: application/pdf
  sizeBytes: 123456
  localPath: /tmp/chatbot-agent-files/conv-1/8f3/quarterly-report.pdf

Do not assume file contents are already extracted. If the user asks about PDF contents, invoke the pdf skill and use the localPath.
```

## Agent Skills Support

The chatbot-backend Agent Utils `Skill` tool currently loads classpath skills. It must support full skill directories, not only `SKILL.md` text.

Day-one work:

- Copy `/Users/taissa/lushuai/code/github/skills/skills/pdf` into `services/chatbot-backend/src/main/resources/skills/pdf`.
- Preserve all files under the skill directory, including `scripts/`, `reference.md`, `forms.md`, and `LICENSE.txt`.
- Ensure the skill loader reports the base directory for the loaded skill.
- Ensure that skill scripts are accessible from the base directory when the agent follows skill instructions.
- Keep the `TaskTool` skill directory configuration aligned with the same classpath/extracted skill directory model.

If classpath resources are packaged inside a jar, scripts may need to be copied to a temporary executable skill workspace at startup or first use. The agent-facing base directory must point to a real filesystem directory when scripts are required.

## Backend Prompt Integration

`ProtocolChatService` currently flattens only textual parts into the active user message. It should additionally:

- Parse file parts from the active user message.
- Store uploaded file data in the registry.
- Materialize stored files for the active conversation.
- Append uploaded-file metadata and local paths to the agent input.
- Keep normal chat history text behavior unchanged.

History should not duplicate base64 data. If prior messages include file IDs, the backend can resolve them from the in-memory registry while they remain available.

## Error Handling

User-facing failures should be clear and early:

- Unsupported file type: reject the run with a protocol error frame.
- Oversized file: reject the run with a protocol error frame.
- Missing expired file ID: explain that the file is no longer available and ask the user to upload again.
- Invalid base64: reject the run with a protocol error frame.
- Skill script failure: let the agent report the failure from the skill workflow.

## Testing

Contract tests:

- Accept valid base64 PDF file parts.
- Reject file parts without `data`, `fileId`, or `url`.
- Reject `data` without `encoding: "base64"`.

Runtime tests:

- Convert user text plus PDF attachment into a protocol message with both `text` and `file` parts.
- Preserve existing text-only behavior.

Backend tests:

- Deserialize protocol file fields into `ProtocolPart`.
- Store uploaded file bytes and metadata with UUID IDs.
- Materialize safe local paths without path traversal.
- Append uploaded-file context to the active agent message.
- Reject unsupported MIME types and oversized files.
- Verify the `Skill` tool lists and loads the copied `pdf` skill.

Manual verification:

1. Start UI and chatbot backend.
2. Upload a PDF in the chatbot.
3. Ask the agent to summarize or extract information from it.
4. Confirm the model invokes `Skill("pdf")`.
5. Confirm the agent uses the local file path and PDF skill scripts or documented commands.
6. Confirm no Java PDF parser performs eager extraction.

## Out Of Scope

- Durable file storage.
- Cross-process or clustered file lookup.
- Antivirus scanning.
- OCR service integration beyond what the PDF skill itself instructs.
- Dedicated Java PDF extraction service.
- Non-PDF upload enablement beyond keeping the protocol and registry general enough for later skills.
