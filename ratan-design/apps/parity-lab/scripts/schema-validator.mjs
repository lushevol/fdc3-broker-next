function valueType(value) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

export function validateAgainstSchema(value, schema, location = '$') {
  const errors = [];
  const actualType = valueType(value);
  if (schema.type && actualType !== schema.type) {
    errors.push(`${location} must be ${schema.type}; received ${actualType}`);
    return errors;
  }
  if (Object.hasOwn(schema, 'const') && value !== schema.const) {
    errors.push(`${location} must equal ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${location} must be one of ${schema.enum.join(', ')}`);
  }
  if (schema.type === 'object') {
    for (const key of schema.required ?? []) {
      if (!Object.hasOwn(value, key)) errors.push(`${location}.${key} is required`);
    }
    for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
      if (Object.hasOwn(value, key)) {
        errors.push(...validateAgainstSchema(value[key], childSchema, `${location}.${key}`));
      }
    }
  }
  if (schema.type === 'array') {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${location} must contain at least ${schema.minItems} items`);
    }
    if (schema.items) {
      value.forEach((entry, index) => {
        errors.push(...validateAgainstSchema(entry, schema.items, `${location}[${index}]`));
      });
    }
  }
  return errors;
}
