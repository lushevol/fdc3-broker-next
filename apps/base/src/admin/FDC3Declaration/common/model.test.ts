import type { FDC3DeclarationData } from './interface';
import {
  filterDeclarations,
  getContextType,
  getDeclarationSummary,
  getContextRows,
  getReferencedContextTypes,
  getReferencedIntentNames,
  normalizeInterop,
} from './model';

describe('FDC3Declaration model helpers', () => {
  const declarations: FDC3DeclarationData[] = [
    {
      appId: 'trade-blotter',
      interop: {
        intents: {
          listensFor: [{ intent: 'SearchTrades', contexts: ['fdc3.trade.query'] }],
          raises: [{ intent: 'ViewChart', contexts: ['fdc3.instrument'] }],
        },
      },
    },
    {
      appId: 'cashflow-tile',
      interop: { intents: { listensFor: [], raises: [] } },
    },
  ];

  test('extracts context type from JSON schema const before legacy schema type', () => {
    expect(
      getContextType({
        schema: { type: 'object', properties: { type: { const: 'fdc3.instrument' } } },
      }),
    ).toBe('fdc3.instrument');
    expect(getContextType({ schema: { type: 'fdc3.contact' } })).toBe('fdc3.contact');
  });

  test('normalizes missing raises and keyed listensFor to arrays', () => {
    expect(
      normalizeInterop({ intents: { listensFor: { ViewChart: { contexts: [] } } } }).intents,
    ).toEqual({
      listensFor: [{ intent: 'ViewChart', contexts: [] }],
      raises: [],
    });
  });

  test('summarizes declarations and empty declarations', () => {
    expect(
      getDeclarationSummary(declarations, [{ name: 'SearchTrades', description: '' }], []),
    ).toEqual({
      declarations: 2,
      intents: 1,
      contexts: 0,
      emptyDeclarations: 1,
    });
  });

  test('filters declarations by app id, tile title, intent, and context type', () => {
    const tiles = [{ tileId: 'trade-blotter', title: 'Trade Blotter' }];

    expect(filterDeclarations(declarations, tiles, 'blotter')).toHaveLength(1);
    expect(filterDeclarations(declarations, tiles, 'SearchTrades')).toHaveLength(1);
    expect(filterDeclarations(declarations, tiles, 'fdc3.instrument')).toHaveLength(1);
  });

  test('detects declaration references for intent and context deletion warnings', () => {
    expect(getReferencedIntentNames(declarations, 'SearchTrades')).toEqual(['trade-blotter']);
    expect(getReferencedContextTypes(declarations, 'fdc3.instrument')).toEqual(['trade-blotter']);
  });

  test('builds unique context grid rows from declared context type', () => {
    expect(
      getContextRows([
        {
          schema: { type: 'object', properties: { type: { const: 'fdc3.instrument' } } },
          description: 'Instrument',
        },
        {
          schema: { type: 'object', properties: { type: { const: 'fdc3.trade.query' } } },
          description: 'Trade query',
        },
      ]).map((row) => row.id),
    ).toEqual(['fdc3.instrument', 'fdc3.trade.query']);
  });
});
