import { z } from 'zod';
import type { Toolkit } from 'chat-protocol-ui';
import type { ChatToolDescriptor } from 'chat-protocol-contract';
import {
  AnalyticsTool,
  ApprovalConfirmTool,
  Fdc3ApprovalTool,
  Fdc3ExecutionResultTool,
  FunctionUsageRankingTool,
  HighestOperationUsersTool,
  ProfileLookupTool,
  ResolveRelativeDateTool,
  TimezoneCurrentTool,
} from './tool-renderers';
import { getFdc3ChatActionDefinitions } from './fdc3-action-definitions';
import type { Fdc3ActionExecutor } from './fdc3-action-executor';

type RuntimeToolkitDeps = {
  fdc3Executor?: Fdc3ActionExecutor;
};

type ToolkitDefinition = Toolkit[string] & {
  source?: ChatToolDescriptor['source'];
  providerId?: string;
};

function getFdc3ActionCatalogDescription(): string {
  const actions = getFdc3ChatActionDefinitions();
  if (actions.length === 0) {
    return 'No declaration-backed FDC3 chatbot actions are currently available.';
  }

  return actions
    .map((action) => `${action.id}: ${action.approvalBody}`)
    .join(' ');
}

function createBaseToolkit(): Record<string, ToolkitDefinition> {
  return {
    profile_lookup: {
      type: 'frontend',
      description: 'Lookup user profile information',
      parameters: z.object({
        userId: z.string().describe('The ID of the user to look up'),
      }),
      execute: async (input) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const { userId } = input as { userId: string };
        return {
          userId,
          name: 'John Doe',
          email: 'john.doe@example.com',
        };
      },
      render: ProfileLookupTool,
    },
    timezone_current: {
      type: 'frontend',
      description: "Get the user's current timezone",
      parameters: z.object({}),
      execute: async () => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date();
        const offset = -now.getTimezoneOffset();
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        const sign = offset >= 0 ? '+' : '-';
        const gmtOffset = `GMT${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        const abbr = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
          .formatToParts(now)
          .find((p) => p.type === 'timeZoneName')?.value;

        return {
          timezone,
          offset: gmtOffset,
          abbr,
        };
      },
      render: TimezoneCurrentTool,
    },
    approval_confirm: {
      type: 'human',
      description: 'Send an email with confirmation',
      parameters: z.object({
        to: z.string().describe('Recipient email address'),
        subject: z.string().describe('Email subject'),
        body: z.string().describe('Email body content'),
      }),
      render: ApprovalConfirmTool,
    },
    visited_user_count_by_application: {
      type: 'backend',
      render: AnalyticsTool,
    },
    visited_user_hourly_by_application: {
      type: 'backend',
      render: AnalyticsTool,
    },
    resolve_relative_date: {
      type: 'backend',
      render: ResolveRelativeDateTool,
    },
    highest_operation_users_by_application: {
      type: 'backend',
      source: 'mcp',
      providerId: 'analytics-mcp',
      render: HighestOperationUsersTool,
    },
    most_used_functions_by_application: {
      type: 'backend',
      source: 'mcp',
      providerId: 'analytics-mcp',
      render: FunctionUsageRankingTool,
    },
  };
}

export function createRuntimeToolkit({ fdc3Executor }: RuntimeToolkitDeps = {}): Toolkit {
  const toolkit = createBaseToolkit();
  const actionCatalogDescription = getFdc3ActionCatalogDescription();

  const runtimeToolkit: Record<string, ToolkitDefinition> = {
    ...toolkit,
    propose_fdc3_action: {
      type: 'human',
      description: `Ask the user to approve a declaration-backed FDC3 action before it is raised through the broker. ${actionCatalogDescription}`,
      parameters: z.object({
        actionId: z
          .string()
          .describe('Use one of the declared FDC3 action ids from the action catalog in this tool description.'),
        question: z
          .string()
          .describe('Optional original user request, only for showing in the approval card.'),
      }),
      render: Fdc3ApprovalTool,
    },
  };

  if (!fdc3Executor) {
    return runtimeToolkit as unknown as Toolkit;
  }

  return {
    ...runtimeToolkit,
    execute_fdc3_action: {
      type: 'frontend',
      description:
        'After approval, raise the selected declaration-backed FDC3 intent through the platform broker and return the handler result to the chat.',
      parameters: z.object({
        actionId: z
          .string()
          .describe('Use one of the declared FDC3 action ids from the action catalog in propose_fdc3_action.'),
      }),
      execute: async (input) => fdc3Executor.execute(input as { actionId: string }, { continuationPayload: true }),
      render: Fdc3ExecutionResultTool,
    },
  } as unknown as Toolkit;
}

export const runtimeToolkit: Toolkit = createRuntimeToolkit();

type ParamInfo = Record<string, { type: string; description?: string; required: boolean }>;

function extractParamInfo(schema: unknown): ParamInfo {
  if (!schema || typeof schema !== 'object') return {};

  let shape: Record<string, unknown> | undefined;

  const s = schema as {
    _def?: { shape?: (() => Record<string, unknown>) | Record<string, unknown> };
  };
  if (typeof s._def?.shape === 'function') {
    shape = s._def.shape();
  } else if (s._def?.shape) {
    shape = s._def.shape;
  }

  if (!shape) return {};
  const result: ParamInfo = {};
  for (const [key, field] of Object.entries(shape)) {
    const f = field as { typeName?: string; description?: string; _def?: { typeName?: string; innerType?: { typeName?: string; _def?: { typeName?: string } } } };
    const typeName = f.typeName ?? f._def?.typeName ?? 'unknown';
    const unwrappedTypeName =
      typeName === 'ZodOptional' && f._def && 'innerType' in f._def
        ? (
            f._def as {
              innerType?: { typeName?: string; _def?: { typeName?: string } };
            }
          ).innerType?.typeName ??
          (
            f._def as {
              innerType?: { typeName?: string; _def?: { typeName?: string } };
            }
          ).innerType?._def?.typeName ??
          'unknown'
        : typeName;
    const typeMap: Record<string, string> = {
      ZodString: 'string',
      ZodNumber: 'number',
      ZodBoolean: 'boolean',
      ZodArray: 'array',
      ZodObject: 'object',
      ZodEnum: 'enum',
      ZodRecord: 'object',
    };
    result[key] = {
      type: typeMap[unwrappedTypeName] ?? 'string',
      description: f.description,
      required: typeName !== 'ZodOptional',
    };
  }
  return result;
}

export function getProtocolToolDescriptors(toolkit: Toolkit = runtimeToolkit): ChatToolDescriptor[] {
  return Object.entries(toolkit).map(([name, definition]) => {
    const def = definition as ToolkitDefinition;
    return {
      name,
      source: resolveToolSource(def),
      providerId: def.providerId,
      description: definition.description ?? '',
      parameters: extractParamInfo(definition.parameters),
    };
  });
}

function resolveToolSource(definition: ToolkitDefinition): ChatToolDescriptor['source'] {
  if (definition.source) {
    return definition.source;
  }

  if (definition.type === 'frontend') {
    return 'frontend';
  }

  if (definition.type === 'human') {
    return 'human';
  }

  return 'backend';
}
