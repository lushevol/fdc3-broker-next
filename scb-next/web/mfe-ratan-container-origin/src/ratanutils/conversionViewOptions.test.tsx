import { conversionViewOptions } from './conversionViewOptions';

describe('conversionViewOptions', () => {
  it('should return a Map with grouped column definitions', () => {
    const businessFields = [
      {
        indexedTerm: 'a.b.c',
        colDefs: { hide: false },
        businessTerm: 'Business Term C',
      },
      {
        indexedTerm: 'd.e',
      },
      {
        indexedTerm: 'a.f',
        colDefs: { hide: true, pinned: true },
        disabledView: ['Workspace1'],
      },
      {
        indexedTerm: 'g.h.i',
        colDefs: { hide: false, pinned: false },
        disabledView: ['Workspace2', 'Workspace3'],
      },
    ];

    const valueIsArray = ['a', 'd'];

    const result = conversionViewOptions(businessFields, true, 'Workspace1', valueIsArray);

    expect(result).toBeInstanceOf(Map);

    expect(result.has('Trade Detail')).toBe(true);
    expect(result.has('Cashflow Detail')).toBe(false);
    expect(result.has('Others')).toBe(false);

    const tradeDetailGroup = result.get('Trade Detail');
    expect(tradeDetailGroup).toHaveLength(2);
    expect(tradeDetailGroup[0].headerName).toBe('Business Term C');
    expect(tradeDetailGroup[0].field).toBe('a.b.c');
    expect(tradeDetailGroup[0].hide).toBe(false);
  });

  it('should handle empty businessFields', () => {
    const result = conversionViewOptions([], true, 'Workspace1', []);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  it('should handle isTrade as false', () => {
    const businessFields = [
      {
        indexedTerm: 'a.b.c',
        colDefs: { hide: false },
        businessTerm: 'Business Term C',
      },
    ];

    const result = conversionViewOptions(businessFields, false, 'Workspace1', ['a']);
    expect(result.has('Cashflow Detail')).toBe(true);
  });

  it('should handle workspace not in disabledView', () => {
    const businessFields = [
      {
        indexedTerm: 'a.b.c',
        colDefs: { hide: false },
        businessTerm: 'Business Term C',
        disabledView: ['Workspace2'],
      },
    ];

    const result = conversionViewOptions(businessFields, true, 'Workspace1', ['a']);
    expect(result.has('Trade Detail')).toBe(true);
  });

  it('should handle empty valueIsArray', () => {
    const businessFields = [
      {
        indexedTerm: 'a.b.c',
        colDefs: { hide: false },
        businessTerm: 'Business Term C',
      },
    ];

    const result = conversionViewOptions(businessFields, true, 'Workspace1', []);
    expect(result.has('Trade Detail')).toBe(false);
  });

  it('should handle missing colDefs', () => {
    const businessFields = [
      {
        indexedTerm: 'a.b.c',
        businessTerm: 'Business Term C',
      },
    ];

    const result = conversionViewOptions(businessFields, true, 'Workspace1', ['a']);
    expect(result.has('Trade Detail')).toBe(true);
    const tradeDetailGroup = result.get('Trade Detail');
    expect(tradeDetailGroup[0].hide).toBe(true);
  });
});
