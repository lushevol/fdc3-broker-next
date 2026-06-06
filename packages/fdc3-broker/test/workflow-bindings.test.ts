import { describe, expect, it } from 'vitest';
import {
  applyWorkflowBindings,
  parseWorkflowPath,
  readWorkflowPath,
} from '../src/workflow-bindings';

describe('workflow bindings', () => {
  it('parses root, object field, and array index workflow paths', () => {
    expect(parseWorkflowPath('$')).toEqual([]);
    expect(parseWorkflowPath('$.trades[0].instrument-id')).toEqual([
      { type: 'field', key: 'trades' },
      { type: 'index', index: 0 },
      { type: 'field', key: 'instrument-id' },
    ]);
  });

  it('rejects unsupported workflow path syntax', () => {
    expect(() => parseWorkflowPath('trades[0]')).toThrow('Invalid workflow path');
    expect(() => parseWorkflowPath('$.9bad')).toThrow('Invalid workflow path field');
    expect(() => parseWorkflowPath('$.trades[')).toThrow('Invalid workflow path index');
    expect(() => parseWorkflowPath('$.trades[-1]')).toThrow('Invalid workflow path index');
    expect(() => parseWorkflowPath('$[0]#bad')).toThrow('Invalid workflow path syntax');
  });

  it('reads values using the supported path subset', () => {
    expect(readWorkflowPath({ trades: [{ instrument: 'AAPL' }] }, '$.trades[0].instrument')).toBe(
      'AAPL',
    );
  });

  it('returns undefined when reading through incompatible values', () => {
    expect(readWorkflowPath(null, '$.instrument')).toBeUndefined();
    expect(readWorkflowPath({ trades: {} }, '$.trades[0]')).toBeUndefined();
  });

  it('writes prior result values into a context object', () => {
    const context = applyWorkflowBindings({
      baseContext: { type: 'fdc3.instrument', id: {} },
      priorResults: new Map([['search-trades', { trades: [{ instrument: 'MSFT' }] }]]),
      bindings: [
        {
          fromStepId: 'search-trades',
          resultPath: '$.trades[0].instrument',
          contextPath: '$.id.ticker',
          required: true,
        },
      ],
    });

    expect(context).toEqual({ type: 'fdc3.instrument', id: { ticker: 'MSFT' } });
  });

  it('creates missing nested context objects while preserving the base context', () => {
    const baseContext = { type: 'fdc3.instrument', id: 'legacy-id' };
    const context = applyWorkflowBindings({
      baseContext,
      priorResults: new Map([['search-trades', { trades: [{ instrument: 'IBM' }] }]]),
      bindings: [
        {
          fromStepId: 'search-trades',
          resultPath: '$.trades[0].instrument',
          contextPath: '$.id.ticker',
          required: true,
        },
      ],
    });

    expect(context).toEqual({ type: 'fdc3.instrument', id: { ticker: 'IBM' } });
    expect(baseContext).toEqual({ type: 'fdc3.instrument', id: 'legacy-id' });
  });

  it('skips unresolved optional bindings', () => {
    const context = applyWorkflowBindings({
      baseContext: { type: 'fdc3.instrument', id: {} },
      priorResults: new Map([
        ['missing-value', { value: null }],
        ['missing-step', {}],
      ]),
      bindings: [
        {
          fromStepId: 'missing-value',
          resultPath: '$.value',
          contextPath: '$.id.ticker',
        },
        {
          fromStepId: 'unknown-step',
          resultPath: '$.value',
          contextPath: '$.id.name',
        },
      ],
    });

    expect(context).toEqual({ type: 'fdc3.instrument', id: {} });
  });

  it('throws when a required binding cannot be resolved', () => {
    expect(() =>
      applyWorkflowBindings({
        baseContext: { type: 'fdc3.instrument', id: {} },
        priorResults: new Map([['search-trades', { trades: [] }]]),
        bindings: [
          {
            fromStepId: 'search-trades',
            resultPath: '$.trades[0].instrument',
            contextPath: '$.id.ticker',
            required: true,
          },
        ],
      }),
    ).toThrow('Required workflow binding could not be resolved');
  });

  it('rejects root and array-index context write paths', () => {
    const input = {
      baseContext: { type: 'fdc3.instrument' },
      priorResults: new Map([['step', { value: 'AAPL' }]]),
    };

    expect(() =>
      applyWorkflowBindings({
        ...input,
        bindings: [
          {
            fromStepId: 'step',
            resultPath: '$.value',
            contextPath: '$',
            required: true,
          },
        ],
      }),
    ).toThrow('Cannot bind workflow value to root context');

    expect(() =>
      applyWorkflowBindings({
        ...input,
        bindings: [
          {
            fromStepId: 'step',
            resultPath: '$.value',
            contextPath: '$.ids[0]',
            required: true,
          },
        ],
      }),
    ).toThrow('Workflow context path must use object fields');
  });
});
