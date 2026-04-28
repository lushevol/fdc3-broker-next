import { z } from 'zod';
import type { Toolkit } from 'chat-protocol-ui';
import type { ChatToolDescriptor } from 'chat-protocol-contract';
import {
  AnalyticsTool,
  ApprovalConfirmTool,
  FunctionUsageRankingTool,
  HighestOperationUsersTool,
  ProfileLookupTool,
  ResolveRelativeDateTool,
  SummaryComposeTool,
  TimezoneCurrentTool,
} from '@/components/toolkit/tool-renderers';

type ToolkitDefinition = Toolkit[string] & {
  source?: ChatToolDescriptor['source'];
  providerId?: string;
};

const sharedToolDefinitions: Record<string, ToolkitDefinition> = {
  profile_lookup: {
    type: 'frontend',
    description: 'Lookup user profile information',
    parameters: z.object({
      userId: z.string().describe('The ID of the user to look up'),
    }),
    execute: async (input) => {
      console.log('[DEBUG profile_lookup] execute called with input:', input);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const { userId } = input as { userId: string };
      // Simulate a user profile lookup
      const result = {
        userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
      };
      console.log('[DEBUG profile_lookup] execute returning result:', result);
      return result;
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
  highest_operation_users_by_application: {
    type: 'backend',
    source: 'mcp',
    providerId: 'analytics-mcp',
    description: 'Rank users by operation count for an application in a time window.',
    parameters: z.object({
      application: z.string().describe('Application name, such as trades or cashflow blotter'),
      startTime: z.string().optional().describe('Inclusive start time in ISO-8601 format'),
      endTime: z.string().optional().describe('Inclusive end time in ISO-8601 format'),
      limit: z.number().optional().describe('Maximum number of ranked users to return'),
    }),
    render: HighestOperationUsersTool,
  },
  most_used_functions_by_application: {
    type: 'backend',
    source: 'mcp',
    providerId: 'analytics-mcp',
    description: 'Rank function paths by usage count for an application in a time window.',
    parameters: z.object({
      application: z.string().describe('Application name, such as trades or cashflow blotter'),
      startTime: z.string().optional().describe('Inclusive start time in ISO-8601 format'),
      endTime: z.string().optional().describe('Inclusive end time in ISO-8601 format'),
      limit: z.number().optional().describe('Maximum number of ranked functions to return'),
    }),
    render: FunctionUsageRankingTool,
  },
  resolve_relative_date: {
    type: 'backend',
    render: ResolveRelativeDateTool,
  },
};

const presetToolNames: Record<ToolPreset, string[]> = {
  minimal: ['timezone_current'],
  full: [
    'timezone_current',
    'approval_confirm',
    'profile_lookup',
    'visited_user_count_by_application',
    'visited_user_hourly_by_application',
    'highest_operation_users_by_application',
    'most_used_functions_by_application',
    'resolve_relative_date',
  ],
};

export const runtimeToolkit = sharedToolDefinitions;

export function getToolkitForPreset(_preset: ToolPreset): Toolkit {
  return runtimeToolkit;
}

export type ToolPreset = 'minimal' | 'full';

export function getToolDescriptors(preset: ToolPreset): ToolDescriptorForPanel[] {
  const toolNames = presetToolNames[preset];
  return toolNames.map((name) => {
    const definition = runtimeToolkit[name];
    return {
      name,
      source: resolveToolSource(definition),
      providerId: definition.providerId,
      description: definition.description ?? '',
      parameters: extractParamInfo(definition.parameters),
    };
  });
}

export function getProtocolToolDescriptors(preset: ToolPreset): ChatToolDescriptor[] {
  return presetToolNames[preset].map((name) => {
    const definition = runtimeToolkit[name];

    return {
      name,
      source: resolveToolSource(definition),
      providerId: definition.providerId,
      description: definition.description ?? '',
      parameters: extractParamInfo(definition.parameters),
    };
  });
}

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
    const f = field as { typeName?: string; description?: string; _def?: { typeName?: string } };
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
    };
    result[key] = {
      type: typeMap[unwrappedTypeName] ?? 'string',
      description: f.description,
      required: typeName !== 'ZodOptional',
    };
  }
  return result;
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

export type ToolDescriptorForPanel = {
  name: string;
  source: 'frontend' | 'backend' | 'human' | 'mcp';
  providerId?: string;
  description: string;
  parameters: ParamInfo;
};
