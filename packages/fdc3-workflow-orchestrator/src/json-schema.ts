import type { JsonObject } from './types';

type Schema = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function schemas(value: unknown): Schema[] | null {
  return Array.isArray(value) && value.every(isRecord) ? value : null;
}

function deepEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((value, index) => deepEqual(value, right[index]));
  }
  if (isRecord(left) && isRecord(right)) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    return (
      leftKeys.length === rightKeys.length &&
      leftKeys.every((key) => key in right && deepEqual(left[key], right[key]))
    );
  }
  return false;
}

function matchesType(type: string, value: unknown): boolean {
  switch (type) {
    case 'null':
      return value === null;
    case 'boolean':
      return typeof value === 'boolean';
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value);
    case 'array':
      return Array.isArray(value);
    case 'object':
      return isRecord(value);
    default:
      return false;
  }
}

function validateCompositions(schema: Schema, value: unknown): boolean {
  const allOf = schemas(schema.allOf);
  if (schema.allOf !== undefined && (!allOf || !allOf.every((item) => validate(item, value)))) {
    return false;
  }
  const anyOf = schemas(schema.anyOf);
  if (schema.anyOf !== undefined && (!anyOf || !anyOf.some((item) => validate(item, value)))) {
    return false;
  }
  const oneOf = schemas(schema.oneOf);
  if (
    schema.oneOf !== undefined &&
    (!oneOf || oneOf.filter((item) => validate(item, value)).length !== 1)
  ) {
    return false;
  }
  if (schema.not !== undefined && (!isRecord(schema.not) || validate(schema.not, value))) {
    return false;
  }
  return true;
}

function validateObject(schema: Schema, value: Record<string, unknown>): boolean {
  const required = schema.required;
  if (
    required !== undefined &&
    (!Array.isArray(required) ||
      !required.every((key) => typeof key === 'string' && Object.hasOwn(value, key)))
  ) {
    return false;
  }

  const properties = schema.properties;
  if (properties !== undefined && !isRecord(properties)) return false;
  const propertySchemas = properties ?? {};
  for (const [key, propertyValue] of Object.entries(value)) {
    const propertySchema = propertySchemas[key];
    if (propertySchema !== undefined) {
      if (!isRecord(propertySchema) || !validate(propertySchema, propertyValue)) return false;
      continue;
    }
    if (schema.additionalProperties === false) return false;
    if (isRecord(schema.additionalProperties) && !validate(schema.additionalProperties, propertyValue)) {
      return false;
    }
  }

  const propertyCount = Object.keys(value).length;
  if (typeof schema.minProperties === 'number' && propertyCount < schema.minProperties) return false;
  if (typeof schema.maxProperties === 'number' && propertyCount > schema.maxProperties) return false;
  return true;
}

function validateArray(schema: Schema, value: unknown[]): boolean {
  if (typeof schema.minItems === 'number' && value.length < schema.minItems) return false;
  if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) return false;
  if (schema.uniqueItems === true) {
    if (value.some((item, index) => value.slice(0, index).some((prior) => deepEqual(prior, item)))) {
      return false;
    }
  }
  if (schema.items !== undefined) {
    if (!isRecord(schema.items) || !value.every((item) => validate(schema.items as Schema, item))) {
      return false;
    }
  }
  return true;
}

function validateString(schema: Schema, value: string): boolean {
  if (typeof schema.minLength === 'number' && value.length < schema.minLength) return false;
  if (typeof schema.maxLength === 'number' && value.length > schema.maxLength) return false;
  if (typeof schema.pattern === 'string') {
    try {
      if (!new RegExp(schema.pattern, 'u').test(value)) return false;
    } catch {
      return false;
    }
  }
  return true;
}

function validateNumber(schema: Schema, value: number): boolean {
  if (typeof schema.minimum === 'number' && value < schema.minimum) return false;
  if (typeof schema.maximum === 'number' && value > schema.maximum) return false;
  if (typeof schema.exclusiveMinimum === 'number' && value <= schema.exclusiveMinimum) return false;
  if (typeof schema.exclusiveMaximum === 'number' && value >= schema.exclusiveMaximum) return false;
  if (typeof schema.multipleOf === 'number') {
    if (schema.multipleOf <= 0 || Math.abs(value / schema.multipleOf - Math.round(value / schema.multipleOf)) > Number.EPSILON) {
      return false;
    }
  }
  return true;
}

function validate(schema: Schema, value: unknown): boolean {
  if ('$ref' in schema) return false;
  if (!validateCompositions(schema, value)) return false;
  if (schema.const !== undefined && !deepEqual(schema.const, value)) return false;
  if (schema.enum !== undefined) {
    if (!Array.isArray(schema.enum) || !schema.enum.some((candidate) => deepEqual(candidate, value))) {
      return false;
    }
  }

  const declaredTypes =
    typeof schema.type === 'string'
      ? [schema.type]
      : Array.isArray(schema.type) && schema.type.every((type) => typeof type === 'string')
        ? schema.type
        : schema.type === undefined
          ? []
          : null;
  if (!declaredTypes || (declaredTypes.length > 0 && !declaredTypes.some((type) => matchesType(type, value)))) {
    return false;
  }

  if (isRecord(value) && !validateObject(schema, value)) return false;
  if (Array.isArray(value) && !validateArray(schema, value)) return false;
  if (typeof value === 'string' && !validateString(schema, value)) return false;
  if (typeof value === 'number' && !validateNumber(schema, value)) return false;
  return true;
}

/** Validates workflow input against the supported JSON Schema draft keywords. */
export function validateJsonSchema(schema: JsonObject, value: unknown): boolean {
  return validate(schema, value);
}
