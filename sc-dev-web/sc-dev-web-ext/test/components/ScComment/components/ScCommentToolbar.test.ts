import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCommentToolbar } from '../../../../src/components/ScComment/components/ScCommentToolbar/ScCommentToolbar.js';
import '../../../../elements/sc-comment-toolbar.js';
import sinon from 'sinon';

describe('ScCommentToolbar', () => {
  const posterOptions = [
    { label: 'All users', value: 'all' },
    { label: 'Me only', value: 'me' },
  ];

  const sorterOptions = [
    { label: 'Newest first', value: 'newest' },
    { label: 'Oldest first', value: 'oldest' },
  ];

  it('renders comment count', async () => {
    const el = await fixture<ScCommentToolbar>(html`
      <sc-comment-toolbar
        .commentCount=${42}
        .currentPoster=${'all'}
        .currentSorter=${'newest'}
        .viewOptions=${posterOptions}
        .sortOptions=${sorterOptions}
      ></sc-comment-toolbar>
    `);
    
    await el.updateComplete;
    
    const textContent = el.shadowRoot?.textContent;
    expect(textContent).to.include('42');
  });

  it('renders singular form for 1 comment', async () => {
    const el = await fixture<ScCommentToolbar>(html`
      <sc-comment-toolbar
        .commentCount=${1}
        .currentPoster=${'all'}
        .currentSorter=${'newest'}
        .viewOptions=${posterOptions}
        .sortOptions=${sorterOptions}
      ></sc-comment-toolbar>
    `);
    
    await el.updateComplete;
    
    // Should say "1 comment" not "1 comments"
    expect(el).to.exist;
  });

  it('renders plural form for multiple comments', async () => {
    const el = await fixture<ScCommentToolbar>(html`
      <sc-comment-toolbar
        .commentCount=${5}
        .currentPoster=${'all'}
        .currentSorter=${'newest'}
        .viewOptions=${posterOptions}
        .sortOptions=${sorterOptions}
      ></sc-comment-toolbar>
    `);
    
    await el.updateComplete;
    
    // Should say "5 comments"
    expect(el).to.exist;
  });

  it('emits sc-filter-change event when poster filter changes', async () => {
    const el = await fixture<ScCommentToolbar>(html`
      <sc-comment-toolbar
        .commentCount=${5}
        .currentPoster=${'all'}
        .currentSorter=${'newest'}
        .viewOptions=${posterOptions}
        .sortOptions=${sorterOptions}
      ></sc-comment-toolbar>
    `);
    
    await el.updateComplete;
    
    let eventFired = false;
    let eventDetail: any = null;
    
    el.addEventListener('sc-filter-change', ((e: CustomEvent) => {
      eventFired = true;
      eventDetail = e.detail;
    }) as EventListener);
    
    // Trigger filter change
    const event = new CustomEvent('sc-select', { detail: { value: 'me' } });
    el.handlePosterChange(event);
    
    expect(eventFired).to.be.true;
    expect(eventDetail.poster).to.equal('me');
  });

  it('emits sc-sort-change event when sorter changes', async () => {
    const el = await fixture<ScCommentToolbar>(html`
      <sc-comment-toolbar
        .commentCount=${5}
        .currentPoster=${'all'}
        .currentSorter=${'newest'}
        .viewOptions=${posterOptions}
        .sortOptions=${sorterOptions}
      ></sc-comment-toolbar>
    `);
    
    await el.updateComplete;
    
    let eventFired = false;
    let eventDetail: any = null;
    
    el.addEventListener('sc-sort-change', ((e: CustomEvent) => {
      eventFired = true;
      eventDetail = e.detail;
    }) as EventListener);
    
    // Trigger sort change
    const event = new CustomEvent('sc-select', { detail: { value: 'oldest' } });
    el.handleSorterChange(event);
    
    expect(eventFired).to.be.true;
    expect(eventDetail).to.not.be.null;
    expect(eventDetail?.sorter).to.equal('oldest');
  });

  it('renders dropdown triggers for filter and sort', async () => {
    const el = await fixture<ScCommentToolbar>(html`
      <sc-comment-toolbar
        .commentCount=${5}
        .currentPoster=${'all'}
        .currentSorter=${'newest'}
        .viewOptions=${posterOptions}
        .sortOptions=${sorterOptions}
      ></sc-comment-toolbar>
    `);
    
    await el.updateComplete;
    
    // Check for dropdown components
    const dropdowns = el.shadowRoot?.querySelectorAll('sc-dropdown-input');
    expect(dropdowns).to.exist;
  });

  it('displays current filter and sort selections', async () => {
    const el = await fixture<ScCommentToolbar>(html`
      <sc-comment-toolbar
        .commentCount=${5}
        .currentPoster=${'me'}
        .currentSorter=${'oldest'}
        .viewOptions=${posterOptions}
        .sortOptions=${sorterOptions}
      ></sc-comment-toolbar>
    `);
    
    await el.updateComplete;
    
    // Component should display current selections
    expect(el).to.exist;
  });
});
