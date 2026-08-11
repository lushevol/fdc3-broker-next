import { expect, fixture } from '@open-wc/testing';
import ScElement from '../../src/shared/sc-element.js';
import { mockMatchMedia } from './mediaQuery.js';
import { html } from 'lit';

window.customElements.define('sc-element', ScElement);
declare global {
  interface HTMLElementTagNameMap {
    'sc-element': ScElement
  }
}

describe('ScElement', () => {
  it('should have some customized functions', () => {
    const emit = ScElement.getPropertyOptions('emit');
    const stopDefaultEvent = ScElement.getPropertyOptions('stopDefaultEvent');
    expect(typeof emit).to.equal('object');
    expect(typeof stopDefaultEvent).to.equal('object');
  });

  describe('media queries', () => {
    beforeAll(() => mockMatchMedia());
    afterAll(() => mockMatchMedia.stopMocking());

    it('should have mediaQuery', async () => {
      const el = await fixture<ScElement>(html`<sc-element></sc-element>`);
      await el.updateComplete;
 
      expect(el.mediaQuery).to.exist;
    });
    it('should detect mobileSm', async () => {
      const el = await fixture<ScElement>(html`<sc-element></sc-element>`);
      await el.updateComplete;

      expect(el.isSmallMobile).to.equal(false);
      mockMatchMedia.toggle(el.mediaQuery.mobileSm.media);
      expect(el.isSmallMobile).to.equal(true);
    });
    it('should detect mobileLg', async () => {
      const el = await fixture<ScElement>(html`<sc-element></sc-element>`);
      await el.updateComplete;

      expect(el.isLargeMobile).to.equal(false);
      mockMatchMedia.toggle(el.mediaQuery.mobileLg.media);
      expect(el.isLargeMobile).to.equal(true);
    });
    it('should detect tablet', async () => {
      const el = await fixture<ScElement>(html`<sc-element></sc-element>`);
      await el.updateComplete;

      expect(el.isTablet).to.equal(false);
      mockMatchMedia.toggle(el.mediaQuery.tablet.media);
      expect(el.isTablet).to.equal(true);
    });
    it('should detect desktop', async () => {
      const el = await fixture<ScElement>(html`<sc-element></sc-element>`);
      await el.updateComplete;

      expect(el.isDesktop).to.equal(false);
      mockMatchMedia.toggle(el.mediaQuery.desktop.media);
      expect(el.isDesktop).to.equal(true);
    });
  });
});
