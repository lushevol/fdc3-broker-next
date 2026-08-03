import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScTooltip } from '../../src/components/ScTooltip/ScTooltip.js';
import '../../elements/sc-tooltip.js';

describe('ScTooltip', () => {
  it('renders default tooltip', async () => {
    const el = await fixture<ScTooltip>(html`<sc-tooltip></sc-tooltip>`);

    expect(el.placement).to.equal('top');
    expect(el.trigger).to.equal('click');
    expect(el.mode).to.equal('dark');
  });

  it('renders light mode tooltip', async () => {
    const el = await fixture<ScTooltip>(html`<sc-tooltip mode=light></sc-tooltip>`);

    expect(el.mode).to.equal('light');
  });

  it('renders glassy mode tooltip', async () => {
    const el = await fixture<ScTooltip>(html`<sc-tooltip mode=glassy></sc-tooltip>`);

    expect(el.mode).to.equal('glassy');
  }); 

  it('renders success mode tooltip', async () => {
    const el = await fixture<ScTooltip>(html`<sc-tooltip mode=success></sc-tooltip>`);

    expect(el.mode).to.equal('success');
  }); 

  it('reposition', async () => {
    const el = await fixture<ScTooltip>(html`<sc-tooltip mode=light open></sc-tooltip>`);
    await el.reposition();
    const tooltipEle = el.shadowRoot?.querySelector('sl-tooltip');
    expect(tooltipEle?.getAttribute('data-current-placement')).to.equal(null);
  });

  it('renders header', async () => {
    const el = await fixture<ScTooltip>(html`<sc-tooltip header="Test header" content="Test Content"></sc-tooltip>`);
    expect(el.header).to.equal('Test header');
  });

  it('should not renders header if not provided', async () => {
    const el = await fixture<ScTooltip>(html`<sc-tooltip content="Test Content"></sc-tooltip>`);
    expect(el.header).to.equal('');
  });

  it('allow user to select tooltip content', async () => {
    const el = await fixture<ScTooltip>(html`<sc-tooltip content="Test Content" open></sc-tooltip>`);
    await el.updateComplete;
    expect(el).to.exist;
    
    const styleTag = el.shadowRoot?.querySelector('style');
    expect(styleTag).to.exist;

    expect(styleTag?.textContent).to.contain('.sc-tooltip::part(body)');

    const regexUserSelect = /\.sc-tooltip::part\(body\)\s*\{[^}]*user-select:\s*text;/;
    expect(styleTag?.textContent).to.match(regexUserSelect);

    const regexPointerEvent = /\.sc-tooltip::part\(body\)\s*\{[^}]*pointer-events:\s*auto;/;
    expect(styleTag?.textContent).to.match(regexPointerEvent);
  });
});
