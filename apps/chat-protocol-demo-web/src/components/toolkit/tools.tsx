import { z } from 'zod';
import type { Toolkit } from '@fm/chat-protocol-ui';
import type { ChatToolDescriptor } from '@fm/chat-protocol-contract';
import {
  AnalyticsTool,
  ApprovalConfirmTool,
  ProfileLookupTool,
  ResolveRelativeDateTool,
  SummaryComposeTool,
  TimezoneCurrentTool,
} from '@/components/toolkit/tool-renderers';

const sharedToolDefinitions: Toolkit = {
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
  statistic_count_by_app: {
    type: 'backend',
    render: AnalyticsTool,
  },
  chart_by_app: {
    type: 'backend',
    render: AnalyticsTool,
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
    'statistic_count_by_app',
    'chart_by_app',
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
      source:
        definition.type === 'frontend'
          ? 'frontend'
          : definition.type === 'human'
            ? 'human'
            : 'backend',
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
      source:
        definition.type === 'frontend'
          ? 'frontend'
          : definition.type === 'human'
            ? 'human'
            : 'backend',
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
    const typeMap: Record<string, string> = {
      ZodString: 'string',
      ZodNumber: 'number',
      ZodBoolean: 'boolean',
      ZodArray: 'array',
      ZodObject: 'object',
      ZodEnum: 'enum',
    };
    result[key] = {
      type: typeMap[typeName] ?? 'string',
      description: f.description,
      required: true,
    };
  }
  return result;
}

export type ToolDescriptorForPanel = {
  name: string;
  source: 'frontend' | 'backend' | 'human';
  description: string;
  parameters: ParamInfo;
};
