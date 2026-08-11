import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScSearchLayout } from '../../src/components/ScLayout/ScSearchLayout.js';
import '../../elements/sc-search-layout.js';
import { mockMatchMedia } from '../shared/mediaQuery.js';

describe('ScSearchLayout', () => {
  beforeAll(() => mockMatchMedia());
  afterAll(() => mockMatchMedia.stopMocking());

  it('renders search layout', async () => {
    const el = await fixture<ScSearchLayout>(html`
      <sc-search-layout title='test' description='test' single-search-placeholder='test'>
        <div slot='result'>Result</div>
      </sc-search-layout>
    `);
    await fixture<ScSearchLayout>(html`
      <sc-search-layout multiple-search hide-image
      >
        <div slot='title'>title</div>
        <div slot='description'>Description</div>
        <div slot='basic search'>Filter</div>
        <div slot='advance search'>Filter</div>
        <div slot='empty-message'>Empty</div>
      </sc-search-layout>
    `);
    await fixture<ScSearchLayout>(html`
      <sc-search-layout multiple-search loading image-src='test'
      >
        <div slot='title'>title</div>
        <div slot='description'>Description</div>
        <div slot='basic search'>Filter</div>
        <div slot='empty-message'>Empty</div>
      </sc-search-layout>
    `);
    el.searchValueChange({ detail: 'test' });
    el.singleSearch();
    el.multipleSearch = true;
    await el.updateComplete;

    el.renderOnMobile();
    await el.updateComplete;

    expect(el.isPcModeLayout).to.be.false;

    mockMatchMedia.toggle(el.mediaQuery.mobileLg.media);
    mockMatchMedia.toggle(el.mediaQuery.portrait.media);
    expect(el.isMobile).to.be.true;
    expect(el.isPortrait).to.be.true;
    expect(el.columnSize.md).eq(12);
    await el.updateComplete;

    mockMatchMedia.toggle(el.mediaQuery.mobileLg.media);
    mockMatchMedia.toggle(el.mediaQuery.desktop.media);
    expect(el.isDesktop).to.be.true;
    expect(el.columnSize.md).eq(undefined);
    await el.updateComplete;

    mockMatchMedia.toggle(el.mediaQuery.portrait.media);
    expect(el.isPortrait).to.be.false;
    expect(el.isPcModeLayout).to.be.true;

    expect(el.hideImage).to.equal(false);
  });
});

describe('ScSearchLayout columnSize', () => {
  const defineMediaFlags = (
    el: ScSearchLayout,
    flags: { isMobile: boolean; isPortrait: boolean; isDesktop: boolean },
  ) => {
    Object.defineProperty(el, 'isMobile', { value: flags.isMobile, configurable: true });
    Object.defineProperty(el, 'isPortrait', { value: flags.isPortrait, configurable: true });
    Object.defineProperty(el, 'isDesktop', { value: flags.isDesktop, configurable: true });
  };

  it('sets xs and md to 12 for mobile portrait', async () => {
    const el = await fixture<ScSearchLayout>(html`<sc-search-layout></sc-search-layout>`);
    defineMediaFlags(el, { isMobile: true, isPortrait: true, isDesktop: false });

    const res = el.columnSize;

    expect(res.xs).to.equal(12);
    expect(res.md).to.equal(12);
  });

  it('sets xs to 12 for tablet-like layout (non-desktop, non-portrait)', async () => {
    const el = await fixture<ScSearchLayout>(html`<sc-search-layout></sc-search-layout>`);
    defineMediaFlags(el, { isMobile: false, isPortrait: false, isDesktop: false });

    const res = el.columnSize;

    expect(res.xs).to.equal(12);
    expect(res.md).to.equal(undefined);
  });

  it('returns empty sizes for desktop landscape', async () => {
    const el = await fixture<ScSearchLayout>(html`<sc-search-layout></sc-search-layout>`);
    defineMediaFlags(el, { isMobile: false, isPortrait: false, isDesktop: true });

    const res = el.columnSize;

    expect(res.xs).to.equal(undefined);
    expect(res.md).to.equal(undefined);
  });

  it('renderOnMobile requests update', async () => {
    const el = await fixture<ScSearchLayout>(html`<sc-search-layout></sc-search-layout>`);
    let called = false;
    (el as any).requestUpdate = () => {
      called = true;
    };

    el.renderOnMobile();

    expect(called).to.equal(true);
  });
});describe('ScSearchLayout columnSize', () => {
  const defineMediaFlags = (
    el: ScSearchLayout,
    flags: { isMobile: boolean; isPortrait: boolean; isDesktop: boolean },
  ) => {
    Object.defineProperty(el, 'isMobile', { value: flags.isMobile, configurable: true });
    Object.defineProperty(el, 'isPortrait', { value: flags.isPortrait, configurable: true });
    Object.defineProperty(el, 'isDesktop', { value: flags.isDesktop, configurable: true });
  };

  it('sets xs and md to 12 for mobile portrait', async () => {
    const el = await fixture<ScSearchLayout>(html`<sc-search-layout></sc-search-layout>`);
    defineMediaFlags(el, { isMobile: true, isPortrait: true, isDesktop: false });

    const res = el.columnSize;

    expect(res.xs).to.equal(12);
    expect(res.md).to.equal(12);
  });

  it('sets xs to 12 for tablet-like layout (non-desktop, non-portrait)', async () => {
    const el = await fixture<ScSearchLayout>(html`<sc-search-layout></sc-search-layout>`);
    defineMediaFlags(el, { isMobile: false, isPortrait: false, isDesktop: false });

    const res = el.columnSize;

    expect(res.xs).to.equal(12);
    expect(res.md).to.equal(undefined);
  });

  it('returns empty sizes for desktop landscape', async () => {
    const el = await fixture<ScSearchLayout>(html`<sc-search-layout></sc-search-layout>`);
    defineMediaFlags(el, { isMobile: false, isPortrait: false, isDesktop: true });

    const res = el.columnSize;

    expect(res.xs).to.equal(undefined);
    expect(res.md).to.equal(undefined);
  });

  it('renderOnMobile requests update', async () => {
    const el = await fixture<ScSearchLayout>(html`<sc-search-layout></sc-search-layout>`);
    let called = false;
    (el as any).requestUpdate = () => {
      called = true;
    };

    el.renderOnMobile();

    expect(called).to.equal(true);
  });
});