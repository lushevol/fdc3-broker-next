import { z } from 'zod';
import type { Toolkit } from '@fm/chat-protocol-ui';
import type { ChatToolDescriptor } from '@fm/chat-protocol-contract';
import {
  AnalyticsTool,
  ApprovalConfirmTool,
  ProfileLookupTool,
  ResolveRelativeDateTool,
  TimezoneCurrentTool,
} from './tool-renderers';

export const runtimeToolkit: Toolkit = {
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

export function getProtocolToolDescriptors(): ChatToolDescriptor[] {
  return Object.entries(runtimeToolkit).map(([name, definition]) => ({
    name,
    source:
      definition.type === 'frontend'
        ? 'frontend'
        : definition.type === 'human'
          ? 'human'
          : 'backend',
    description: definition.description ?? '',
    parameters: extractParamInfo(definition.parameters),
  }));
}
