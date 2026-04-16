import { z } from 'zod';
import type { Toolkit } from '@assistant-ui/react';

const LOCATION_DB: Record<string, { name: string; latitude: number; longitude: number }> = {
  beijing: { name: 'Beijing, CN', latitude: 39.9042, longitude: 116.4074 },
  'san francisco': { name: 'San Francisco, CA', latitude: 37.7749, longitude: -122.4194 },
  london: { name: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
  tokyo: { name: 'Tokyo, JP', latitude: 35.6762, longitude: 139.6503 },
};

function resolveLocation(query: string) {
  const normalized = query.toLowerCase();
  for (const [key, value] of Object.entries(LOCATION_DB)) {
    if (normalized.includes(key)) return value;
  }
  return LOCATION_DB['san francisco'];
}

export const minimalToolkit: Toolkit = {
  'location.resolve': {
    type: 'frontend',
    description: 'Resolve a geographic location from a query string',
    parameters: z.object({
      query: z.string().describe('City name or location query'),
    }),
    execute: async ({ query }) => {
      const location = resolveLocation(query);
      return { ...location, query };
    },
    render: ({ args, result }) => {
      if (!result) {
        return (
          <div className="aui-tool-location-resolve rounded-md border bg-emerald-50 px-3 py-2 text-sm">
            <span className="font-medium text-emerald-800">location.resolve</span>
            <span className="text-emerald-600"> — resolving &quot;{args.query}&quot;…</span>
          </div>
        );
      }
      return (
        <div className="aui-tool-location-resolve rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-800">{result.name}</span>
          </div>
          <div className="text-xs text-emerald-600">
            {result.latitude}, {result.longitude}
          </div>
        </div>
      );
    },
  },
};

export const fullToolkit: Toolkit = {
  ...minimalToolkit,

  'approval.confirm': {
    type: 'human',
    description: 'Confirm a user decision before proceeding with an action',
    parameters: z.object({
      decision: z.string().describe('The decision to confirm'),
    }),
    render: ({ args, interrupt, resume, result }) => {
      if (interrupt) {
        return (
          <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-semibold text-amber-800">Human Approval Required</span>
            </div>
            <div className="mb-3 text-sm text-amber-900">
              <p>Decision: <strong>{args.decision}</strong></p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => resume?.({ decision: 'approved', confirmed: true })}
                className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => resume?.({ decision: 'rejected', confirmed: false })}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Reject
              </button>
            </div>
          </div>
        );
      }

      if (result) {
        const isApproved = result.confirmed === true;
        return (
          <div className={`mt-2 rounded-md border px-3 py-2 text-sm ${isApproved ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
            <span className="font-medium">{isApproved ? 'Approved' : 'Rejected'}</span>: {args.decision}
          </div>
        );
      }

      return (
        <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Waiting for approval: <strong>{args.decision}</strong>
        </div>
      );
    },
  },

  'summary.compose': {
    type: 'backend',
    render: ({ args, result }) => {
      if (!result) {
        return (
          <div className="aui-tool-summary-compose rounded-md border bg-blue-50 px-3 py-2 text-sm text-blue-800">
            <span className="font-medium">summary.compose</span>
            <span className="text-blue-600"> — composing summary…</span>
          </div>
        );
      }
      return (
        <div className="aui-tool-summary-compose rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm">
          <div className="font-medium text-blue-800">Summary</div>
          <div className="text-blue-600">{typeof result === 'string' ? result : result.text ?? JSON.stringify(result)}</div>
        </div>
      );
    },
  },

  'analytics.lookup': {
    type: 'backend',
    render: ({ args, result }) => {
      if (!result) {
        return (
          <div className="aui-tool-analytics-lookup rounded-md border bg-violet-50 px-3 py-2 text-sm text-violet-800">
            <span className="font-medium">analytics.lookup</span>
            <span className="text-violet-600"> — looking up {String(args.appId ?? '')}…</span>
          </div>
        );
      }
      return (
        <div className="aui-tool-analytics-lookup rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-sm">
          <div className="font-medium text-violet-800">Analytics: {String(args.appId ?? '')}</div>
          <pre className="mt-1 text-xs text-violet-600 whitespace-pre-wrap">{JSON.stringify(result, null, 1)}</pre>
        </div>
      );
    },
  },

  'profile.lookup': {
    type: 'backend',
    render: ({ args, result }) => {
      if (!result) {
        return (
          <div className="aui-tool-profile-lookup rounded-md border bg-violet-50 px-3 py-2 text-sm text-violet-800">
            <span className="font-medium">profile.lookup</span>
            <span className="text-violet-600"> — looking up {String(args.userId ?? '')}…</span>
          </div>
        );
      }
      return (
        <div className="aui-tool-profile-lookup rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-sm">
          <div className="font-medium text-violet-800">Profile: {String(args.userId ?? '')}</div>
          <pre className="mt-1 text-xs text-violet-600 whitespace-pre-wrap">{JSON.stringify(result, null, 1)}</pre>
        </div>
      );
    },
  },
};

export function getToolkitForPreset(preset: ToolPreset): Toolkit {
  return preset === 'minimal' ? minimalToolkit : fullToolkit;
}

export type ToolPreset = 'minimal' | 'full';

export function getToolDescriptors(preset: ToolPreset): ToolDescriptorForPanel[] {
  const toolkit = getToolkitForPreset(preset);
  return Object.entries(toolkit).map(([name, def]) => ({
    name,
    source: def.type === 'frontend' ? 'frontend' : def.type === 'human' ? 'human' : 'backend',
    description: def.description ?? '',
    parameters: extractParamInfo(def.parameters),
  }));
}

type ParamInfo = Record<string, { type: string; description?: string; required: boolean }>;

function extractParamInfo(schema: unknown): ParamInfo {
  if (!schema || typeof schema !== 'object') return {};
  
  let shape: Record<string, unknown> | undefined;
  
  const s = schema as { _def?: { shape?: () => Record<string, unknown>; shape?: Record<string, unknown> } };
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
      type: typeMap[typeName] ?? 'any',
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
