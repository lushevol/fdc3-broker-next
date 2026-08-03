import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScIconButton } from '../../src/components/ScIconButton/ScIconButton.js';
import '../../elements/sc-icon-button.js';

describe('ScIconButton', () => {
  it('renders primary warning disabled icon button', async () => {
    const el = await fixture<ScIconButton>(
      html`
        <sc-icon-button
          type="primary"
          disabled
          name='checkbox-empty'
        ></sc-icon-button>
      `
    );

    expect(el.type).to.equal('primary');
    expect(el.name).to.equal('checkbox-empty');
    expect(el.disabled).to.equal(true);
  });

  it('renders primary error icon button', async () => {
    const el = await fixture<ScIconButton>(
      html`
        <sc-icon-button
          fill
          state="error"
          name='upload'
        ></sc-icon-button>
      `
    );

    expect(el.state).to.equal('error');
    expect(el.name).to.equal('upload');
    // expect(el.fill).to.equal(true);
  });

  // it('renders no border icon button', async () => {
  //   const el = await fixture<ScIconButton>(
  //     html`
  //       <sc-icon-button
  //         no-border
  //         type="text"
  //         size="lg"
  //         name='checkbox-empty'
  //       ></sc-icon-button>
  //     `
  //   );

  //   expect(el['noBorder']).to.equal(true);
  //   expect(el.size).to.equal('lg');
  // });

  it('renders secondary icon button', async () => {
    const el = await fixture<ScIconButton>(
      html`
        <sc-icon-button
          type="secondary"
          state="error"
          name='upload'
        ></sc-icon-button>
      `
    );

    expect(el.state).to.equal('error');
    expect(el.type).to.equal('secondary');
  });

  it('renders link icon button', async () => {
    const el = await fixture<ScIconButton>(
      html`
        <sc-icon-button
          type="link"
          state="default"
          name='upload'
        ></sc-icon-button>
      `
    );

    expect(el.state).to.equal('default');
    expect(el.type).to.equal('link');
  });

  it('renders text icon button', async () => {
    const el = await fixture<ScIconButton>(
      html`
        <sc-icon-button
          type="text"
          name='upload'
          size="xxs"
        ></sc-icon-button>
      `
    );

    expect(el.size).to.equal('xxs');
    expect(el.type).to.equal('text');
    expect(el.name).to.equal('upload');
  });
});
