import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScRating } from '../../src/components/ScRating.js';
import '../../elements/sc-rating.js';
import { mockMatchMedia } from '../shared/mediaQuery.js';

describe('ScRating', () => {
  it('renders rating', async () => {
    const el = await fixture<ScRating>(html`<sc-rating label='Rating'></sc-rating>`);
    await fixture<ScRating>(html`<sc-rating  number="1"></sc-rating>`);
    await fixture<ScRating>(html`<sc-rating size="lg" number="2"></sc-rating>`);
    await fixture<ScRating>(html`<sc-rating size="md" number="3"></sc-rating>`);
    await fixture<ScRating>(html`<sc-rating size="sm" number="4"></sc-rating>`);
    await fixture<ScRating>(html`<sc-rating max="3" number="3"></sc-rating>`);

    expect(el.size).to.equal('lg');
  });

  it('renders readonly rating', async () => {
    const el = await fixture<ScRating>(html`<sc-rating readonly></sc-rating>`);
    await fixture<ScRating>(
      html`<sc-rating  number="1" readonly></sc-rating>`
    );
    await fixture<ScRating>(
      html`<sc-rating size="lg" number="2" readonly></sc-rating>`
    );
    await fixture<ScRating>(
      html`<sc-rating size="md" number="3" readonly></sc-rating>`
    );
    await fixture<ScRating>(
      html`<sc-rating size="sm" number="4" readonly></sc-rating>`
    );
    await fixture<ScRating>(
      html`<sc-rating max="3" number="3" readonly></sc-rating>`
    );

    expect(el.readonly).to.equal(true);
  });

  it('renders button rating', async () => {
    const el = await fixture<ScRating>(html`<sc-rating mode='button' value="4" label='Rating' disabled></sc-rating>`);
    await fixture<ScRating>(
      html`<sc-rating  mode='button' value="4" label='Rating' readonly></sc-rating>`
    );

    expect(el.mode).to.equal('button');
  });

  it('renders button rating with options', async () => {
    const options = [{ label: 'a', value: 'a' }, { label: 'b', value: 'b' }, { label: 'c', value: 'c' }];

    const el = await fixture<ScRating>(
      html`<sc-rating
        mode="button"
        value="4"
        label="Rating"
        .options=${options}
      ></sc-rating>`
    );

    expect(el.mode).to.equal('button');
  });

  it('renders lower text in default mode with default values', async () => {
    const el = await fixture<ScRating>(html`<sc-rating></sc-rating>`);

    expect(el.firstLowerText).to.equal('');
    expect(el.lastLowerText).to.equal('');
  });

  it('renders lower text in default mode with custom values', async () => {
    const el = await fixture<ScRating>(html`<sc-rating first-lower-text="Not at all" last-lower-text="Extremely"></sc-rating>`);
    await el.updateComplete;

    const lowerText = el.shadowRoot!.querySelector('.sc-rating-lower-text');
    expect(lowerText).to.exist;
    const spans = lowerText!.querySelectorAll('span');
    expect(spans[0].textContent).to.equal('Not at all');
    expect(spans[1].textContent).to.equal('Extremely');
  });

  it('does not render lower text in default mode when both values are empty', async () => {
    const el = await fixture<ScRating>(html`<sc-rating first-lower-text="" last-lower-text=""></sc-rating>`);
    await el.updateComplete;

    const lowerText = el.shadowRoot!.querySelector('.sc-rating-lower-text');
    expect(lowerText).to.not.exist;
  });

  it('renders lower text in button mode with custom values', async () => {
    const el = await fixture<ScRating>(html`<sc-rating mode="button" first-lower-text="Not at all" last-lower-text="Extremely"></sc-rating>`);
    await el.updateComplete;

    expect(el.firstLowerText).to.equal('Not at all');
    expect(el.lastLowerText).to.equal('Extremely');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScRating>(html`<sc-rating label='Rating'></sc-rating>`);

    await expect(el).shadowDom.to.be.accessible();
  });

  
  describe('mobile responsive', () => {
    beforeAll(() => mockMatchMedia());
    afterAll(() => mockMatchMedia.stopMocking());

    it('renders in mobile', async () => {
      const el = await fixture<ScRating>(
        html`<sc-rating mode="button" value="2"></sc-rating>`
      );
      await el.updateComplete;

      expect(el.isMobile).to.equal(false);
      expect(el.isTablet).to.equal(false);
      expect(el.isDesktop).to.equal(false);

      mockMatchMedia.toggle(el.mediaQuery.mobileSm.media);
      el.requestUpdate();
      await el.updateComplete;

      expect(el.isMobile).to.equal(true);
      expect(el.isTablet).to.equal(false);
      expect(el.isDesktop).to.equal(false);
      
      // disconnect coverage
      el.remove();
    });
  });
});
