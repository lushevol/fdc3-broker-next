import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScPagination } from '../../src/components/ScPagination/ScPagination.js';
import { getLocale, setLocale } from '../../src/i18n/localization.js';
import '../../elements/sc-pagination.js';
import { ScMenuItem } from '../../elements/sc-menu.js';
import { mockAnimation } from '../shared/animation.js';

describe('ScPagination', () => {
  beforeEach(()=>{
    mockAnimation();
  });

  const initialLocale = getLocale();

  afterEach(async () => {
    await setLocale(initialLocale);
  });
  
  it('renders default pagination', async () => {
    const el = await fixture<ScPagination>(html`<sc-pagination total="100"></sc-pagination>`);

    expect(el.total).to.equal(100);
    expect(el.pageSize).to.equal(10);
    expect(el.label).to.equal(false);
    expect(el.quickJumper).to.equal(false);
    expect(el.sizeChanger).to.equal(false);
    expect(el.noTruncation).to.equal(false);
    expect(el.disabledPages).to.deep.equal([]);
    expect(el.currentPage).to.equal(1);
  });

  it('renders pagination with label and no truncation', async () => {
    const el = await fixture<ScPagination>(html`<sc-pagination total="100" no-truncation label></sc-pagination>`);
    expect(el.noTruncation).to.equal(true);
    expect(el.label).to.equal(true);
  });

  it('renders pagination with disabled pages', async () => {
    const el = await fixture<ScPagination>(html`<sc-pagination total="100" disabled-pages="[2, 3]"></sc-pagination>`);
    expect(el.disabledPages).to.deep.equal([2, 3]);
    const pagination = new ScPagination();
    pagination.goPrev();
    expect((pagination as any).selectedPage).to.equal(1);
    (pagination as any).selectedPage = 100;
    pagination.goNext();
    expect((pagination as any).selectedPage).to.equal(100);
  });

  it('renders pagination with quick jumper', async () => {
    const el = await fixture<ScPagination>(html`<sc-pagination total="100" quick-jumper></sc-pagination>`);
    expect(el.quickJumper).to.equal(true);
  });

  it('renders localized pagination labels', async () => {
    await setLocale('zh-CN');

    const el = await fixture<ScPagination>(html`<sc-pagination total="100" label quick-jumper></sc-pagination>`);
    await el.updateComplete;

    const label = el.shadowRoot?.querySelector('.sc-pagination-label');
    const goTo = el.shadowRoot?.querySelector('.sc-pagination-go-to-text');

    expect(label?.textContent?.trim()).to.equal('1 - 10 共 100 条');
    expect(goTo?.textContent?.trim()).to.equal('跳转至');
  });

  it('renders pagination with size changer', async () => {
    const el = await fixture<ScPagination>(html`<sc-pagination total="100" size-changer></sc-pagination>`);
    expect(el.sizeChanger).to.equal(true);
  });

  it('renders pagination with customized page size', async () => {
    const el = await fixture<ScPagination>(html`<sc-pagination total="100" page-size="30"></sc-pagination>`);
    expect(el.pageSize).to.equal(30);
  });

  it('renders pagination with customized selected page', async () => {
    const el = await fixture<ScPagination>(html`<sc-pagination total="100" current-page="2"></sc-pagination>`);
    expect(el.currentPage).to.equal(2);
  });

  it('handleChange should update selectedPage and call generatePages', () => {
    const pagination = new ScPagination();
    const generatePagesSpy = { calledWith: null, call(args: any) { this.calledWith = args; } };
    (pagination as any).generatePages = generatePagesSpy.call.bind(generatePagesSpy);
    (pagination as any).handleChange(2);
    expect((pagination as any).selectedPage).to.equal(2);
    expect(generatePagesSpy.calledWith).to.deep.equal({ emitEvents: true });
  });
  
  it('goPrev should decrement selectedPage', () => {
    const pagination = new ScPagination();
    (pagination as any).selectedPage = 3;
    pagination.goPrev();
    expect((pagination as any).selectedPage).to.equal(2);
  });
  
  it('goNext should increment selectedPage', () => {
    const pagination = new ScPagination();
    (pagination as any).selectedPage = 1;
    (pagination as any).total = 30;
    (pagination as any).pageSize = 10;
    pagination.goNext();
    expect((pagination as any).selectedPage).to.equal(2);
  });
  
  it('should set selectedPage correctly for goFirst and goLast', () => {
    const pagination = new ScPagination();
    (pagination as any).selectedPage = 2;
    (pagination as any).total = 50;
    (pagination as any).pageSize = 10;
    (pagination as any).handleChange = function(page: number) {
        this.selectedPage = page;
    };

    pagination.goFirst();
    expect((pagination as any).selectedPage).to.equal(1);

    pagination.goLast();
    expect((pagination as any).selectedPage).to.equal(5);
});

it('should render and handle first and last page buttons correctly', async () => {
  const pagination = await fixture<ScPagination>(
    html`<sc-pagination total="50" .jumpFirstLastPage=${true}></sc-pagination>`
  );

  const firstButton = pagination.shadowRoot?.querySelector(
    '.sc-pagination-first'
  );
  const lastButton = pagination.shadowRoot?.querySelector(
    '.sc-pagination-last'
  );
  expect(firstButton).to.exist;
  expect(lastButton).to.exist;

  expect(firstButton?.getAttribute('aria-disabled')).to.equal('true');
  expect(lastButton?.getAttribute('aria-disabled')).to.equal('false');

  (pagination as any).selectedPage = 5;

  pagination.requestUpdate();
  await pagination.updateComplete;

  expect(firstButton?.getAttribute('aria-disabled')).to.equal('false');
  expect(lastButton?.getAttribute('aria-disabled')).to.equal('true');
});

  it('should not render first and last page buttons when jumpFirstLastPage is false', async () => {
    const pagination = await fixture<ScPagination>(html`<sc-pagination .jumpFirstLastPage=${false}></sc-pagination>`);
    const firstButton = pagination.shadowRoot?.querySelector('.sc-pagination-first');
    const lastButton = pagination.shadowRoot?.querySelector('.sc-pagination-last');
    expect(firstButton).to.not.exist;
    expect(lastButton).to.not.exist;
  });
  
  it('isPageDisabled should return true if page is in disabledPages', () => {
    const pagination = new ScPagination();
    pagination.disabledPages = [1, 2, 3];
    expect(pagination.isPageDisabled(2)).to.equal(true);
  });
  
  it('calculatePage should return correct total pages', () => {
    const pagination = new ScPagination();
    (pagination as any).total = 50;
    (pagination as any).selectedPageSize = 10;
    expect((pagination as any).calculatePage()).to.equal(5);
  });
  
  it('generatePages should calculate totalPages and call requestUpdate', () => {
    const pagination = new ScPagination();
    const requestUpdateSpy = { called: false, call() { this.called = true; } };
    pagination.requestUpdate = requestUpdateSpy.call.bind(requestUpdateSpy);
    (pagination as any).total = 50;
    (pagination as any).selectedPageSize = 10;
    (pagination as any).generatePages();
    expect((pagination as any).totalPages).to.equal(5);
    expect(requestUpdateSpy.called).to.equal(true);
  });
  
  it('truncationChange should call generatePages with emitEvents true', () => {
    const pagination = new ScPagination();
    const generatePagesSpy = { calledWith: {} as any, call(args: any) { this.calledWith = args; } };
    (pagination as any).generatePages = generatePagesSpy.call.bind(generatePagesSpy);
    (pagination as any).truncationChange();
    expect(generatePagesSpy.calledWith).to.deep.equal({ emitEvents: true });
  });
  
  it('pageSizeChange should call handlePageSizeChange', () => {
    const pagination = new ScPagination();
    const handleSpy = {
      calledWith: 0,
      call(size: number) {
        this.calledWith = size;
      },
    };
    (pagination as any).handlePageSizeChange = handleSpy.call.bind(handleSpy);

    (pagination as any).pageSize = 20;
    (pagination as any).pageSizeChange();

    expect(handleSpy.calledWith).to.equal(20);
  });
  
  it('jumpToPage should set selectedPage and call generatePages', () => {
    const pagination = new ScPagination();
    const generatePagesSpy = { calledWith: {} as any, call(args: any) { this.calledWith = args; } };
    (pagination as any).generatePages = generatePagesSpy.call.bind(generatePagesSpy);
    (pagination as any).inputValue = '3';
    (pagination as any).jumpToPage();
    expect((pagination as any).selectedPage).to.equal(0);
    expect(generatePagesSpy.calledWith).to.deep.equal({ emitEvents: true });
  });

  it('pageSizeOptions should render custom page size options', async() => {
    const pagination = new ScPagination();
    pagination.pageSizeOptions = [5, 10, 15];
    expect(pagination.pageSizeOptions.length).to.equal(3);

    const menuItems: NodeListOf<ScMenuItem> | undefined = pagination.shadowRoot?.querySelectorAll('sl-menu-item');
    menuItems?.forEach((el, idx) => {
      expect(el.value).to.equal(pagination.pageSizeOptions[idx]);
    });
  });

  it('renders correct label and navigation with manual attributes', async () => {
    const el = await fixture<ScPagination>(html`
      <sc-pagination
        mode="document"
        label
        total="50"
        total-pages="5"
      ></sc-pagination>
    `);
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector('.sc-pagination-label');
    const info = el.shadowRoot?.querySelector('.document-info');
    expect(label).to.exist;
    expect(info).to.exist;
    const labelText = label?.textContent?.trim().replace(/\s+/g, ' ');
    const infoText = info?.textContent?.trim().replace(/\s+/g, ' ');
    expect(labelText).to.contain('of 50 items');
    expect(infoText).to.contain('of 5');
  });

  it('navigation respects total-pages in document mode', async () => {
    const el = await fixture<ScPagination>(html`
      <sc-pagination
        mode="document"
        total-pages="5"
        current-page="1"
      ></sc-pagination>
    `);
    el.goNext();
    await el.updateComplete;
    expect((el as any).selectedPage).to.equal(2);
  });

  it('handles keyboard navigation (Arrow keys)', async () => {
    const el = await fixture<ScPagination>(
      html`<sc-pagination total="50"></sc-pagination>`
    );
    el.focus();

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await el.updateComplete;
    expect((el as any).selectedPage).to.equal(2);

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await el.updateComplete;
    expect((el as any).selectedPage).to.equal(1);
  });

  it('handles keyboard navigation (Home/End keys)', async () => {
    const el = await fixture<ScPagination>(
      html`<sc-pagination total="100"></sc-pagination>`
    );

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    await el.updateComplete;
    expect((el as any).selectedPage).to.equal(10);

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    await el.updateComplete;
    expect((el as any).selectedPage).to.equal(1);
  });

  it('handles keyboard navigation (PageUp/PageDown)', async () => {
    const el = await fixture<ScPagination>(
      html`<sc-pagination total="200" current-page="1"></sc-pagination>`
    );
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown' }));
    await el.updateComplete;
    expect((el as any).selectedPage).to.be.greaterThan(1);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp' }));
    await el.updateComplete;
    expect((el as any).selectedPage).to.equal(1);
  });

  it('toggles loading state correctly', async () => {
    const el = await fixture<ScPagination>(
      html`<sc-pagination total="100"></sc-pagination>`
    );

    // Enable loading on 'next' button
    el.loading = true;
    el.loadingTarget = 'next';
    await el.updateComplete;

    const nextBtn = el.shadowRoot?.querySelector('.sc-pagination-next');
    expect(el.loading).to.be.true;
    expect(el.loadingTarget).to.equal('next');
    expect(nextBtn?.classList.contains('loading')).to.be.true;

    // Disable loading
    el.loading = false;
    await el.updateComplete;

    expect(el.loading).to.be.false;
    expect(nextBtn?.classList.contains('loading')).to.be.false;
  });

  it('shows loading spinner on page number', async () => {
    const el = await fixture<ScPagination>(
      html`<sc-pagination
        total="100"
        loading
        loading-target="3"
      ></sc-pagination>`
    );

    await el.updateComplete;

    const pageItems = el.shadowRoot?.querySelectorAll('.sc-pagination-item');
    const page3 = Array.from(pageItems || []).find(
      item => item.getAttribute('title') === '3'
    );

    expect(page3?.classList.contains('loading')).to.be.true;
    expect(page3?.querySelector('sc-spinner')).to.exist;
  });

  it('shows loading spinner on navigation buttons', async () => {
    const el = await fixture<ScPagination>(
      html`<sc-pagination
        total="100"
        loading
        loading-target="prev"
      ></sc-pagination>`
    );

    await el.updateComplete;

    const prevBtn = el.shadowRoot?.querySelector('.sc-pagination-prev');
    expect(prevBtn?.classList.contains('loading')).to.be.true;
    expect(prevBtn?.querySelector('sc-spinner')).to.exist;
  });

  it('does not show loading when loading is false', async () => {
    const el = await fixture<ScPagination>(
      html`<sc-pagination total="100" loading-target="3"></sc-pagination>`
    );

    await el.updateComplete;

    const pageItems = el.shadowRoot?.querySelectorAll('.sc-pagination-item');
    const page3 = Array.from(pageItems || []).find(
      item => item.getAttribute('title') === '3'
    );

    expect(page3?.classList.contains('loading')).to.be.false;
  });

});
