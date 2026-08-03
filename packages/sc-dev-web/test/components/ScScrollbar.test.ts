import { html, fixture, expect, nextFrame } from '@open-wc/testing';
import { ScScrollbar } from '../../src/components/ScScrollbar/ScScrollbar.js';
import '../../elements/sc-scrollbar.js';

describe('ScScrollbar', () => {
  it('scrolls child default', async () => {
    const parent = await fixture<HTMLElement>(
      html`<div id="outer">
        <sc-scrollbar><div id="inner"></div></sc-scrollbar>
      </div>`
    );
    const el = parent.querySelector<ScScrollbar>('sc-scrollbar');
    const inner = parent.querySelector<HTMLElement>('#inner');
    await el?.updateComplete;
    await nextFrame();

    expect(Array.from(inner?.classList ?? [])).to.contain('-sc-scroll-target');
  });
  it('scrolls sibling default', async () => {
    const parent = await fixture<HTMLElement>(
      html`<div id="outer">
        <sc-scrollbar selector=""></sc-scrollbar>
        <div id="inner"></div>
      </div>`
    );
    const el = parent.querySelector<ScScrollbar>('sc-scrollbar');
    const inner = parent.querySelector<HTMLElement>('#inner');
    await el?.updateComplete;

    expect(parent.style.position).to.equal('relative');
    expect(Array.from(inner?.classList ?? [])).to.contain('-sc-scroll-target');
  });
  it('scrolls selector default', async () => {
    const parent = await fixture<HTMLElement>(
      html`<div id="outer">
        <sc-scrollbar selector="#inner"></sc-scrollbar>
        <div id="inner"></div>
      </div>`
    );
    const el = parent.querySelector<ScScrollbar>('sc-scrollbar');
    const inner = parent.querySelector<HTMLElement>('#inner');
    await el?.updateComplete;

    expect(parent.style.position).to.equal('relative');
    expect(Array.from(inner?.classList ?? [])).to.contain('-sc-scroll-target');
  });

  it('mouse enter/leave', async () => {
    const parent = await fixture<HTMLElement>(
      html`<div id="outer">
        <sc-scrollbar><div id="inner"></div></sc-scrollbar>
      </div>`
    );
    const el = parent.querySelector<ScScrollbar>('sc-scrollbar');
    const inner = parent.querySelector<HTMLElement>('#inner');
    await el?.updateComplete;
    await nextFrame();

    const container = el?.shadowRoot?.querySelector('[part="container"]');

    inner?.dispatchEvent(new MouseEvent('mouseenter'));
    expect(Array.from(container?.classList ?? [])).to.contain('show');

    inner?.dispatchEvent(new MouseEvent('mouseleave'));
    expect(Array.from(container?.classList ?? [])).to.not.contain('show');
  });

  it('renders scroll gutter', async () => {
    const parent = await fixture<HTMLElement>(
      html`<div id="outer">
        <sc-scrollbar gutter="none"><div id="inner"></div></sc-scrollbar>
      </div>`
    );
    const el = parent.querySelector<ScScrollbar>('sc-scrollbar');
    await el?.updateComplete;
    const target = parent.querySelector<HTMLElement>('#inner');
    expect(el).to.exist;
    expect(target).to.exist;
    if (!el || !target) return;

    const classes = Array.from(target.classList);
    expect(classes).to.contain('-sc-scroll-target');
    expect(classes).to.not.contain('-sc-scroll-guttered');

    const gutters = ['none', 'auto', 'stable', 'stable-both'] as const;
    for (const key of gutters) {
      el.gutter = key;
      await el.updateComplete;
      expect(Array.from(target.classList)).to.contain(
        `-sc-scroll-gutter-${key}`
      );
    }
  });

  it('renders scroll sizes', async () => {
    const parent = await fixture<HTMLElement>(
      html`<div id="outer">
        <sc-scrollbar><div id="inner"></div></sc-scrollbar>
      </div>`
    );
    const el = parent.querySelector<ScScrollbar>('sc-scrollbar');
    await el?.updateComplete;
    const target = parent.querySelector<HTMLElement>('#inner');
    expect(el).to.exist;
    expect(target).to.exist;
    if (!el || !target) return;

    const sizes = ['xs', 'sm', 'lg', 'xl'] as const;
    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(Array.from(target.classList)).to.contain(`-sc-scroll-${size}`);
    }
  });

  it('inside shadow dom', async () => {
    const parent = await fixture<HTMLElement>(html`<div id="outer"></div>`);
    parent.attachShadow({ mode: 'open' });

    if (!parent.shadowRoot) throw new Error('No shadow root');
    parent.shadowRoot.innerHTML =
      '<sc-scrollbar><div id="scroll-target"></div></sc-scrollbar>';
    const scrollbar =
      parent.shadowRoot.querySelector<ScScrollbar>('sc-scrollbar');
    const target = parent.shadowRoot.querySelector<HTMLElement>('#scroll-target');
    await scrollbar?.updateComplete;
    await nextFrame();
    
    expect(Array.from(target?.classList ?? [])).to.contain('-sc-scroll-target');
    if (scrollbar) {      
      parent.dispatchEvent(new Event('sl-show'));
      await scrollbar.updateComplete;
      parent.dispatchEvent(new Event('sl-after-show'));
      await scrollbar.updateComplete;

      scrollbar.selector = undefined;
      await scrollbar.updateComplete;
      await nextFrame();
      scrollbar.remove();
      parent.shadowRoot.appendChild(scrollbar);
    }
    expect(scrollbar).to.not.throw;
  });

  it('sync only', async () => {
    const parent = await fixture<HTMLElement>(
      html`<div id="outer">
        <div id="target"></div>
        <sc-scrollbar sync-selector-all="#target, #another"></sc-scrollbar>
        <sc-scrollbar id="another"></sc-scrollbar>
      </div>`
    );
    const scrollbar = parent.querySelector<ScScrollbar>('sc-scrollbar');
    const target = parent.querySelector<HTMLElement>('#target');
    await scrollbar?.updateComplete;
    await nextFrame();

    expect(Array.from(target?.classList ?? [])).to.not.contain(
      '-sc-scroll-target'
    );
    if (scrollbar) {
      scrollbar.selector = '#another';
      scrollbar.syncSelectorAll = undefined;
      target?.dispatchEvent(new Event('sc-show'));
    }
    expect(scrollbar).to.not.throw;
  });
});
