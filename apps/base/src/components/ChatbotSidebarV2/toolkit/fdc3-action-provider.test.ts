import { describe, expect, it } from '@jest/globals';
import { createDeclarationBackedFdc3ActionProvider } from './fdc3-action-provider';

describe('createDeclarationBackedFdc3ActionProvider', () => {
  it('lists declaration-backed FDC3 actions', async () => {
    const provider = createDeclarationBackedFdc3ActionProvider();
    const actions = await provider.listActions();

    expect(actions.map((action) => action.id)).toEqual(['trade-blotter.pending-validation']);
  });
});
