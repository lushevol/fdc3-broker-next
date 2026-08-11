import axe, { type AxeResults, type RunOptions } from 'axe-core';

export interface AxeAssertionOptions {
  readonly context?: Element | Document;
  readonly options?: RunOptions;
}

export async function assertNoAxeViolations({
  context = document,
  options,
}: AxeAssertionOptions = {}): Promise<AxeResults> {
  const result = await axe.run(context, {
    rules: {
      'color-contrast': { enabled: false },
      ...options?.rules,
    },
    ...options,
  });
  if (result.violations.length > 0) {
    const summary = result.violations
      .map(
        (violation) =>
          `${violation.id}: ${violation.help} (${violation.nodes.length} nodes)`,
      )
      .join('\n');
    throw new Error(`Axe accessibility violations:\n${summary}`);
  }
  return result;
}
