import { describe, expect, it } from 'vitest';
import { validateJsonSchema } from '../src/json-schema';

describe('validateJsonSchema', () => {
  it.each([
    [{}, { anything: true }, true],
    [{ type: 'null' }, null, true],
    [{ type: 'null' }, false, false],
    [{ type: 'boolean' }, true, true],
    [{ type: 'boolean' }, 'true', false],
    [{ type: 'string' }, 'value', true],
    [{ type: 'string' }, 1, false],
    [{ type: 'number' }, 1.25, true],
    [{ type: 'number' }, Number.POSITIVE_INFINITY, false],
    [{ type: 'integer' }, 2, true],
    [{ type: 'integer' }, 2.5, false],
    [{ type: 'array' }, [], true],
    [{ type: 'array' }, {}, false],
    [{ type: 'object' }, {}, true],
    [{ type: 'object' }, [], false],
    [{ type: ['string', 'null'] }, null, true],
    [{ type: ['string', 42] }, 'value', false],
    [{ type: 'unsupported' }, 'value', false],
    [{ $ref: '#/$defs/input' }, {}, false],
    [{ const: { desk: ['FX'] } }, { desk: ['FX'] }, true],
    [{ const: { desk: ['FX'] } }, { desk: ['Rates'] }, false],
    [{ enum: ['FX', { desk: 'Rates' }] }, { desk: 'Rates' }, true],
    [{ enum: 'FX' }, 'FX', false],
  ] as const)('validates basic schema %#', (schema, value, expected) => {
    expect(validateJsonSchema(schema, value)).toBe(expected);
  });

  it.each([
    [{ allOf: [{ type: 'string' }, { minLength: 2 }] }, 'FX', true],
    [{ allOf: [{ type: 'string' }, { minLength: 3 }] }, 'FX', false],
    [{ allOf: 'invalid' }, 'FX', false],
    [{ anyOf: [{ type: 'string' }, { type: 'number' }] }, 4, true],
    [{ anyOf: [{ type: 'string' }] }, false, false],
    [{ anyOf: [false] }, false, false],
    [{ oneOf: [{ type: 'string' }, { const: 'FX' }] }, 'FX', false],
    [{ oneOf: [{ type: 'string' }, { type: 'number' }] }, 'FX', true],
    [{ oneOf: 'invalid' }, 'FX', false],
    [{ not: { type: 'string' } }, 4, true],
    [{ not: { type: 'string' } }, 'FX', false],
    [{ not: 'invalid' }, 'FX', false],
  ] as const)('validates composition schema %#', (schema, value, expected) => {
    expect(validateJsonSchema(schema, value)).toBe(expected);
  });

  it.each([
    [
      {
        type: 'object',
        properties: { desk: { type: 'string' }, limit: { type: 'integer' } },
        required: ['desk'],
        additionalProperties: false,
      },
      { desk: 'FX', limit: 2 },
      true,
    ],
    [{ type: 'object', required: ['desk'] }, {}, false],
    [{ type: 'object', required: [42] }, {}, false],
    [{ type: 'object', properties: 'invalid' }, {}, false],
    [{ type: 'object', properties: { desk: 'invalid' } }, { desk: 'FX' }, false],
    [{ type: 'object', additionalProperties: false }, { desk: 'FX' }, false],
    [
      { type: 'object', additionalProperties: { type: 'string' } },
      { desk: 'FX' },
      true,
    ],
    [
      { type: 'object', additionalProperties: { type: 'number' } },
      { desk: 'FX' },
      false,
    ],
    [{ type: 'object', minProperties: 2 }, { desk: 'FX' }, false],
    [{ type: 'object', maxProperties: 0 }, { desk: 'FX' }, false],
  ] as const)('validates object schema %#', (schema, value, expected) => {
    expect(validateJsonSchema(schema, value)).toBe(expected);
  });

  it.each([
    [{ type: 'array', minItems: 2 }, [1], false],
    [{ type: 'array', maxItems: 1 }, [1, 2], false],
    [{ type: 'array', uniqueItems: true }, [{ id: 1 }, { id: 1 }], false],
    [{ type: 'array', uniqueItems: true }, [{ id: 1 }, { id: 2 }], true],
    [{ type: 'array', items: { type: 'integer' } }, [1, 2], true],
    [{ type: 'array', items: { type: 'integer' } }, [1, 2.5], false],
    [{ type: 'array', items: 'invalid' }, [], false],
  ] as const)('validates array schema %#', (schema, value, expected) => {
    expect(validateJsonSchema(schema, value)).toBe(expected);
  });

  it.each([
    [{ type: 'string', minLength: 2 }, 'F', false],
    [{ type: 'string', maxLength: 2 }, 'FDC3', false],
    [{ type: 'string', pattern: '^FD' }, 'FDC3', true],
    [{ type: 'string', pattern: '^FD' }, 'FX', false],
    [{ type: 'string', pattern: '[' }, 'FX', false],
    [{ type: 'number', minimum: 2 }, 1, false],
    [{ type: 'number', maximum: 2 }, 3, false],
    [{ type: 'number', exclusiveMinimum: 2 }, 2, false],
    [{ type: 'number', exclusiveMaximum: 2 }, 2, false],
    [{ type: 'number', multipleOf: 0 }, 2, false],
    [{ type: 'number', multipleOf: 0.5 }, 1.5, true],
    [{ type: 'number', multipleOf: 0.5 }, 1.6, false],
  ] as const)('validates scalar constraints %#', (schema, value, expected) => {
    expect(validateJsonSchema(schema, value)).toBe(expected);
  });
});
