import { configureScModal } from './components';

describe('configureScModal', () => {
  it('synchronizes React state to the custom-element property', () => {
    const modal = document.createElement('sc-modal') as HTMLElement & { open: boolean };
    modal.open = false;

    configureScModal(modal, { open: true, width: '64rem' });

    expect(modal.open).toBe(true);
  });
});
