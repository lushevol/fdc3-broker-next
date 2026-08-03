import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScButton } from '../../src/components/ScButton/ScButton.js';
import '../../elements/sc-button.js';
import sinon from 'sinon';

describe('ScButton', () => {
  it('renders primary disabled button', async () => {
    const el = await fixture<ScButton>(
      html`
        <sc-button
          type="primary"
          disabled
          width="100px"
          icon="logout"
          icon-position="right"
        ></sc-button>
      `
    );

    expect(el.type).to.equal('primary');
  });

  it('renders secondary error button', async () => {
    const el = await fixture<ScButton>(
      html`
        <sc-button inverse no-pill loading type="secondary" state="error" width="100px"></sc-button>
      `
    );

    expect(el.type).to.equal('secondary');
    expect(el.state).to.equal('error');
  });

  it('renders primary inverse button', async () => {
    const el = await fixture<ScButton>(
      html`<sc-button inverse size="lg" icon="logout" type="primary"></sc-button>`
    );

    expect(el.type).to.equal('primary');
    expect(el.inverse).to.equal(true);
  });

  it('renders secondary inverse sm button', async () => {
    const el = await fixture<ScButton>(
      html`<sc-button  size="sm" inverse type="secondary"></sc-button>`
    );

    expect(el.size).to.equal('sm');
  });

  it('renders link xs button', async () => {
    const el = await fixture<ScButton>(
      html`<sc-button size="xs" icon="logout" type="link"></sc-button>`
    );

    expect(el.type).to.equal('link');
  });

  it('renders secondary icon button', async () => {
    const el = await fixture<ScButton>(
      html`<sc-button size="xxs" icon="upload" icon-position="left" type="secondary"></sc-button>`
    );

    expect(el.type).to.equal('secondary');
  });

  it('renders primary left icon button', async () => {
    const el = await fixture<ScButton>(
      html`<sc-button size="xxs" left-icon="upload" right-icon="checkmark-circle--fill"></sc-button>`
    );

    expect(el['leftIcon']).to.equal('upload');
    expect(el['rightIcon']).to.equal('checkmark-circle--fill');
  });

  it('renders secondary loading with icons button', async () => {
    const el = await fixture<ScButton>(
      html`<sc-button size="xxs" fill loading left-icon="upload" right-icon="checkmark-circle--fill"></sc-button>`
    );

    expect(el['leftIcon']).to.equal('upload');
    expect(el.loading).to.equal(true);
    // expect(el.fill).to.equal(true);
  });
  
  it('selectable button', async () => {
    const el = await fixture<ScButton>(
      html`<sc-button selectable></sc-button>`
    );
    
    expect(el.selected).to.equal(false);

    el.shadowRoot
      ?.querySelector<HTMLElement>('sl-button')
      ?.shadowRoot?.querySelector('button')
      ?.click();

    expect(el.selected).to.equal(true);
  });

  it('selectable toggle button', async () => {
    const el = await fixture<ScButton>(
      html`<sc-button selectable="toggle"></sc-button>`
    );
    
    expect(el.selected).to.equal(false);

    el.shadowRoot
      ?.querySelector<HTMLElement>('sl-button')
      ?.shadowRoot?.querySelector('button')
      ?.click();

    expect(el.selected).to.equal(true);
    
    el.shadowRoot
      ?.querySelector<HTMLElement>('sl-button')
      ?.shadowRoot?.querySelector('button')
      ?.click();

    expect(el.selected).to.equal(false);
  });

  it('should prevent click when disabled', async () => {
    const el = await fixture<ScButton>(html`
      <sc-button .disabled=${true}></sc-button>
    `);
    const event = new MouseEvent('click');
    // mock preventDefault 和 stopPropagation
    event.preventDefault =  sinon.spy();
    event.stopPropagation =  sinon.spy();

    el.handleClick(event);

    expect(event.preventDefault).to.have.been.called;
    expect(event.stopPropagation).to.have.been.called;
  });

  it('should toggle selected when selectable is toggle', async () => {
    const el = await fixture<ScButton>(html`
      <sc-button .selectable=${'toggle'} .disabled=${false}></sc-button>
    `);
    el.selected = false;
    const event = new MouseEvent('click');
    el.handleClick(event);
    expect(el.selected).to.equal(true);
    el.handleClick(event);
    expect(el.selected).to.equal(false);
  });

  it('should set selected true when selectable is true', async () => {
    const el = await fixture<ScButton>(html`
      <sc-button .selectable=${true} .disabled=${false}></sc-button>
    `);
    el.selected = false;
    const event = new MouseEvent('click');
    el.handleClick(event);
    expect(el.selected).to.equal(true);
  });

  it('should prevent mousedown when disabled', async () => {
    const el = await fixture<ScButton>(html`
      <sc-button .disabled=${true}></sc-button>
    `);
    const event = new MouseEvent('mousedown');
    event.preventDefault =  sinon.spy();
    event.stopPropagation =  sinon.spy();

    el.handleMouseDown(event);

    expect(event.preventDefault).to.have.been.called;
    expect(event.stopPropagation).to.have.been.called;
  });

  it('should not prevent mousedown when enabled', async () => {
    const el = await fixture<ScButton>(html`
      <sc-button .disabled=${false}></sc-button>
    `);
    const event = new MouseEvent('mousedown');
    event.preventDefault =  sinon.spy();
    event.stopPropagation =  sinon.spy();

    el.handleMouseDown(event);

    expect(event.preventDefault).not.to.have.been.called;
    expect(event.stopPropagation).not.to.have.been.called;
  });

});
