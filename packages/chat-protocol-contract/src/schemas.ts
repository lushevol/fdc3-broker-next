import { z } from 'zod';

export const chatRoleSchema = z.enum(['system', 'user', 'assistant', 'tool']);
export const chatFinishReasonSchema = z.enum(['stop', 'tool-calls', 'action-required', 'error']);
export const chatToolCallStateSchema = z.enum([
  'input-available',
  'awaiting-execution',
  'awaiting-human',
  'output-available',
  'output-error',
]);
export const chatExecutionTargetSchema = z.enum(['backend', 'frontend']);
export const chatStepStatusSchema = z.enum(['pending', 'running', 'completed', 'failed']);
export const chatActionStatusSchema = z.enum(['pending', 'resolved']);
export const chatFrameMetadataSchema = z.record(z.unknown());
const chatStructuredPayloadSchema = z.record(z.unknown());
export const chatToolSourceSchema = z.enum(['frontend', 'backend', 'human', 'mcp']);

const chatTextPartSchema = z
  .object({
    type: z.literal('text'),
    text: z.string().min(1),
  })
  .strict();

const chatReasoningSummaryPartSchema = z
  .object({
    type: z.literal('reasoning-summary'),
    text: z.string().min(1),
  })
  .strict();

const chatPlanPartSchema = z
  .object({
    type: z.literal('plan'),
    planId: z.string().min(1),
    summary: z.string().min(1),
  })
  .strict();

const chatStepStartPartSchema = z
  .object({
    type: z.literal('step-start'),
    stepId: z.string().min(1),
    title: z.string().min(1).optional(),
  })
  .strict();

const chatStepPartSchema = z
  .object({
    type: z.literal('step'),
    stepId: z.string().min(1),
    title: z.string().min(1),
    status: chatStepStatusSchema,
    detail: z.string().min(1).optional(),
  })
  .strict();

const chatToolCallPartSchema = z
  .object({
    type: z.literal('tool-call'),
    toolCallId: z.string().min(1),
    toolName: z.string().min(1),
    source: chatToolSourceSchema,
    state: chatToolCallStateSchema,
    input: chatStructuredPayloadSchema,
    providerId: z.string().min(1).optional(),
    output: chatStructuredPayloadSchema.optional(),
    error: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.source === 'mcp' && !value.providerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['providerId'],
        message: 'providerId is required for MCP tools',
      });
    }
  });

const chatToolResultPartSchema = z
  .object({
    type: z.literal('tool-result'),
    toolCallId: z.string().min(1),
    output: chatStructuredPayloadSchema,
    error: z.string().min(1).optional(),
  })
  .strict();

const chatCardPartSchema = z
  .object({
    type: z.literal('card'),
    cardType: z.string().min(1),
    props: z.record(z.unknown()),
  })
  .strict();

const chatActionOptionSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
  })
  .strict();

const chatActionPartSchema = z
  .object({
    type: z.literal('action'),
    actionId: z.string().min(1),
    actionType: z.string().min(1),
    status: chatActionStatusSchema,
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    toolCallId: z.string().min(1).optional(),
    options: z.array(chatActionOptionSchema).min(1).optional(),
  })
  .strict();

const chatErrorPartSchema = z
  .object({
    type: z.literal('error'),
    message: z.string().min(1),
    code: z.string().min(1).optional(),
  })
  .strict();

const chatFilePartSchema = z
  .object({
    type: z.literal('file'),
    url: z.string().url().optional(),
    fileId: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    mimeType: z.string().min(1).optional(),
    sizeBytes: z.number().int().nonnegative().optional(),
    data: z.string().min(1).optional(),
    encoding: z.literal('base64').optional(),
  })
  .strict()
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
  });

const chatImagePartSchema = z
  .object({
    type: z.literal('image'),
    url: z.string().url(),
    alt: z.string().min(1).optional(),
    mimeType: z.string().min(1).optional(),
  })
  .strict();

export const chatUserPartSchema = z.union([
  chatTextPartSchema,
  chatFilePartSchema,
  chatImagePartSchema,
]);

export const chatAssistantPartSchema = z.union([
  chatTextPartSchema,
  chatReasoningSummaryPartSchema,
  chatPlanPartSchema,
  chatStepStartPartSchema,
  chatStepPartSchema,
  chatToolCallPartSchema,
  chatToolResultPartSchema,
  chatCardPartSchema,
  chatActionPartSchema,
  chatErrorPartSchema,
]);

const chatSystemMessageSchema = z
  .object({
    id: z.string().min(1),
    role: z.literal('system'),
    parts: z.array(chatTextPartSchema).min(1),
    metadata: z.record(z.unknown()).default({}),
  })
  .strict();

const chatUserMessageSchema = z
  .object({
    id: z.string().min(1),
    role: z.literal('user'),
    parts: z.array(chatUserPartSchema).min(1),
    metadata: z.record(z.unknown()).default({}),
  })
  .strict();

const chatAssistantMessageSchema = z
  .object({
    id: z.string().min(1),
    role: z.literal('assistant'),
    parts: z.array(chatAssistantPartSchema).min(1),
    metadata: z.record(z.unknown()).default({}),
  })
  .strict();

const chatToolMessageSchema = z
  .object({
    id: z.string().min(1),
    role: z.literal('tool'),
    toolCallId: z.string().min(1),
    toolName: z.string().min(1),
    parts: z.array(chatToolResultPartSchema).min(1),
    metadata: z.record(z.unknown()).default({}),
  })
  .strict();

export const chatMessageSchema = z.discriminatedUnion('role', [
  chatSystemMessageSchema,
  chatUserMessageSchema,
  chatAssistantMessageSchema,
  chatToolMessageSchema,
]);

export const chatRunConfigSchema = z
  .object({
    modelName: z.string().min(1).optional(),
    reasoningVisibility: z.enum(['summary', 'hidden']).optional(),
  })
  .strict();

export const chatToolDescriptorSchema = z
  .object({
    name: z.string().min(1),
    source: chatToolSourceSchema,
    description: z.string().min(1),
    parameters: z.record(z.unknown()),
    providerId: z.string().min(1).optional(),
    requiresConfirmation: z.boolean().optional(),
    ui: z.record(z.unknown()).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.source === 'mcp' && !value.providerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['providerId'],
        message: 'providerId is required for MCP tools',
      });
    }
  });

export const chatRunContextSchema = z
  .object({
    workspace: z
      .object({
        activeWorkspaceId: z.string().min(1).optional(),
        activeAppId: z.string().min(1).optional(),
      })
      .strict()
      .optional(),
    tools: z.array(chatToolDescriptorSchema).optional(),
  })
  .catchall(z.unknown())
  .strict();

export const chatRunRequestSchema = z
  .object({
    conversationId: z.string().min(1),
    runId: z.string().min(1).nullable().optional(),
    trigger: z.enum(['submit-message', 'submit-tool-result', 'submit-action']).optional(),
    config: chatRunConfigSchema.optional(),
    context: chatRunContextSchema.optional(),
    messages: z.array(chatMessageSchema).min(1),
    metadata: z.record(z.unknown()).default({}),
    /** Explicit user ID from MFE base auth context, used for memory isolation. */
    userId: z.string().min(1).optional(),
  })
  .strict();

export const chatStartFrameSchema = z
  .object({
    type: z.literal('start'),
    runId: z.string().min(1).optional(),
    conversationId: z.string().min(1).optional(),
  })
  .strict();

export const chatMessageStartFrameSchema = z
  .object({
    type: z.literal('message-start'),
    messageId: z.string().min(1),
    role: chatRoleSchema,
  })
  .strict();

export const chatMessageMetadataFrameSchema = z
  .object({
    type: z.literal('message-metadata'),
    messageId: z.string().min(1),
    metadata: chatFrameMetadataSchema,
  })
  .strict();

export const chatStartStepFrameSchema = z
  .object({
    type: z.literal('start-step'),
    stepId: z.string().min(1),
    title: z.string().min(1).optional(),
    parentStepId: z.string().min(1).optional(),
  })
  .strict();

export const chatReasoningSummaryFrameSchema = z
  .object({
    type: z.literal('reasoning-summary'),
    messageId: z.string().min(1).optional(),
    text: z.string().min(1),
  })
  .strict();

export const chatPlanAvailableFrameSchema = z
  .object({
    type: z.literal('plan-available'),
    planId: z.string().min(1),
    summary: z.string().min(1),
  })
  .strict();

export const chatStepStatusFrameSchema = z
  .object({
    type: z.literal('step-status'),
    stepId: z.string().min(1),
    status: chatStepStatusSchema,
    detail: z.string().min(1).optional(),
  })
  .strict();

export const chatFinishStepFrameSchema = z
  .object({
    type: z.literal('finish-step'),
    stepId: z.string().min(1),
    status: z.enum(['completed', 'failed']).optional(),
  })
  .strict();

export const chatTextStartFrameSchema = z
  .object({
    type: z.literal('text-start'),
    messageId: z.string().min(1),
    partId: z.string().min(1).optional(),
  })
  .strict();

export const chatTextDeltaFrameSchema = z
  .object({
    type: z.literal('text-delta'),
    messageId: z.string().min(1),
    partId: z.string().min(1).optional(),
    delta: z.string().min(1),
  })
  .strict();

export const chatTextEndFrameSchema = z
  .object({
    type: z.literal('text-end'),
    messageId: z.string().min(1),
    partId: z.string().min(1).optional(),
  })
  .strict();

export const chatToolInputStartFrameSchema = z
  .object({
    type: z.literal('tool-input-start'),
    toolCallId: z.string().min(1),
    toolName: z.string().min(1),
    source: chatToolSourceSchema.optional(),
    providerId: z.string().min(1).optional(),
    executionTarget: chatExecutionTargetSchema.optional(),
  })
  .strict();

export const chatToolInputDeltaFrameSchema = z
  .object({
    type: z.literal('tool-input-delta'),
    toolCallId: z.string().min(1),
    delta: z.string().min(1),
  })
  .strict();

export const chatToolInputAvailableFrameSchema = z
  .object({
    type: z.literal('tool-input-available'),
    toolCallId: z.string().min(1),
    input: chatStructuredPayloadSchema,
    source: chatToolSourceSchema.optional(),
    providerId: z.string().min(1).optional(),
  })
  .strict();

export const chatToolOutputAvailableFrameSchema = z
  .object({
    type: z.literal('tool-output-available'),
    toolCallId: z.string().min(1),
    output: chatStructuredPayloadSchema,
    source: chatToolSourceSchema.optional(),
    providerId: z.string().min(1).optional(),
  })
  .strict();

export const chatToolOutputErrorFrameSchema = z
  .object({
    type: z.literal('tool-output-error'),
    toolCallId: z.string().min(1),
    error: z.string().min(1),
    source: chatToolSourceSchema.optional(),
    providerId: z.string().min(1).optional(),
  })
  .strict();

export const chatUiPartAvailableFrameSchema = z
  .object({
    type: z.literal('ui-part-available'),
    messageId: z.string().min(1).optional(),
    cardType: z.string().min(1),
    props: z.record(z.unknown()),
  })
  .strict();

export const chatActionRequiredFrameSchema = z
  .object({
    type: z.literal('action-required'),
    actionId: z.string().min(1),
    actionType: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    options: z.array(chatActionOptionSchema).min(1).optional(),
  })
  .strict();

export const chatActionResolvedFrameSchema = z
  .object({
    type: z.literal('action-resolved'),
    actionId: z.string().min(1),
    status: z.literal('resolved'),
    decision: z.string().min(1),
  })
  .strict();

export const chatFinishFrameSchema = z
  .object({
    type: z.literal('finish'),
    finishReason: chatFinishReasonSchema,
    messageId: z.string().min(1).optional(),
    usage: z.record(z.unknown()).optional(),
  })
  .strict();

export const chatErrorFrameSchema = z
  .object({
    type: z.literal('error'),
    message: z.string().min(1),
    code: z.string().min(1).optional(),
  })
  .strict();

export const chatStreamFrameSchema = z.discriminatedUnion('type', [
  chatStartFrameSchema,
  chatMessageStartFrameSchema,
  chatMessageMetadataFrameSchema,
  chatStartStepFrameSchema,
  chatReasoningSummaryFrameSchema,
  chatPlanAvailableFrameSchema,
  chatStepStatusFrameSchema,
  chatFinishStepFrameSchema,
  chatTextStartFrameSchema,
  chatTextDeltaFrameSchema,
  chatTextEndFrameSchema,
  chatToolInputStartFrameSchema,
  chatToolInputDeltaFrameSchema,
  chatToolInputAvailableFrameSchema,
  chatToolOutputAvailableFrameSchema,
  chatToolOutputErrorFrameSchema,
  chatUiPartAvailableFrameSchema,
  chatActionRequiredFrameSchema,
  chatActionResolvedFrameSchema,
  chatFinishFrameSchema,
  chatErrorFrameSchema,
]);
