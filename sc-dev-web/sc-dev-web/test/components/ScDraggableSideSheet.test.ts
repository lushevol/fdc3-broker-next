import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScDraggableSideSheet } from '../../src/components/ScSheet/ScDraggableSideSheet.js';
import '../../elements/sc-draggable-side-sheet.js';

describe('ScDraggableSideSheet', () => {
  it('renders default side sheet', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet></sc-draggable-side-sheet>`
    );

    expect(el.label).to.equal('');
    expect(el.noHeader).to.equal(false);
    expect(el.fixed).to.equal(false);
    expect(el.closed).to.equal(undefined);
  });

  it('renders side sheet with label', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet label="Actions" open></sc-draggable-side-sheet>`
    );
    expect(el.label).to.equal('Actions');
  });

  it('renders side sheet with no header', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet no-header></sc-draggable-side-sheet>`
    );
    expect(el.noHeader).to.equal(true);
  });

  it('renders width', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet width="200px"></sc-draggable-side-sheet>`
    );
    expect(el.width).to.equal('200px');
  });

  it('renders size', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet size="lg"></sc-draggable-side-sheet>`
    );
    expect(el.size).to.equal('lg');
  });

  it('renders fixed', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet fixed></sc-draggable-side-sheet>`
    );
    expect(el.fixed).to.equal(true);
  });

  it('reset', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet></sc-draggable-side-sheet>`
    );
    el.reset();
    expect(el._startX).to.equal(undefined);
  });

  it('onMouseUp', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet></sc-draggable-side-sheet>`
    );
    el.onMouseUp();
    expect(el._startX).to.equal(undefined);
  });

  it('onMouseOut', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet></sc-draggable-side-sheet>`
    );
    el.onMouseOut();
    expect(el._startX).to.equal(undefined);
  });

  it('onMouseDown', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet></sc-draggable-side-sheet>`
    );
    // @ts-ignore
    el.onMouseDown({
      clientX: 240,
    });
    expect(el._startX).to.equal(240);
  });

  it('emits sc-hide and sc-show with width on toggle', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet></sc-draggable-side-sheet>`
    );
    const sideSheet = el.shadowRoot?.querySelector('.draggable-side-sheet') as HTMLElement;
    Object.defineProperty(sideSheet, 'clientWidth', { value: 280, configurable: true });

    const hideEvents: Array<CustomEvent> = [];
    const showEvents: Array<CustomEvent> = [];
    el.addEventListener('sc-hide', event => hideEvents.push(event as CustomEvent));
    el.addEventListener('sc-show', event => showEvents.push(event as CustomEvent));

    el.onMouseUp();
    await el.updateComplete;

    expect(hideEvents.length).to.equal(1);
    expect(hideEvents[0].detail.width).to.equal(0);

    Object.defineProperty(sideSheet, 'clientWidth', { value: 320, configurable: true });
    el.onMouseUp();
    await el.updateComplete;

    expect(showEvents.length).to.equal(1);
    expect(showEvents[0].detail.width).to.equal(320);
  });

  it('emits sc-hide on double click', async () => {
    const el = await fixture<ScDraggableSideSheet>(
      html`<sc-draggable-side-sheet></sc-draggable-side-sheet>`
    );

    const hideEvents: Array<CustomEvent> = [];
    el.addEventListener('sc-hide', event => hideEvents.push(event as CustomEvent));

    el.onDoubleClick();
    await el.updateComplete;

    expect(hideEvents.length).to.equal(1);
  });
});
