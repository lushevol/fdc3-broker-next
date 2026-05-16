import type { ChatToolDescriptor } from 'chat-protocol-contract';

export type ToolkitDefinition = {
  type: string;
  description?: string;
  parameters?: unknown;
  execute?: (input: unknown) => Promise<unknown>;
  render?: unknown;
  source?: ChatToolDescriptor['source'];
  providerId?: string;
  disabled?: boolean;
};

export type ParamInfo = Record<string, { type: string; description?: string; required: boolean }>;

export function extractParamInfo(schema: unknown): ParamInfo {
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
    const f = field as {
      typeName?: string;
      description?: string;
      _def?: {
        typeName?: string;
        innerType?: { typeName?: string; _def?: { typeName?: string } };
      };
    };
    const typeName = f.typeName ?? f._def?.typeName ?? 'unknown';
    const unwrappedTypeName =
      typeName === 'ZodOptional' && f._def && 'innerType' in f._def
        ? f._def.innerType?.typeName ??
          f._def.innerType?._def?.typeName ??
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

export function resolveToolSource(
  definition: ToolkitDefinition,
): ChatToolDescriptor['source'] {
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
