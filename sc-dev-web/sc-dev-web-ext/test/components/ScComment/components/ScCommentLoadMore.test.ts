import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCommentLoadMore } from '../../../../src/components/ScComment/components/ScCommentLoadMore/ScCommentLoadMore.js';
import '../../../../elements/sc-comment-load-more.js';
import sinon from 'sinon';

describe('ScCommentLoadMore', () => {
  // ─── always renders the wrapper ───────────────────────────────────────────

  it('renders load-more-wrapper by default', async () => {
    const el = await fixture<ScCommentLoadMore>(html`
      <sc-comment-load-more></sc-comment-load-more>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.load-more-wrapper')).to.exist;
  });

  it('renders load-more link when not loading', async () => {
    const el = await fixture<ScCommentLoadMore>(html`
      <sc-comment-load-more .loading=${false}></sc-comment-load-more>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.load-more-link')).to.exist;
  });

  // ─── loading = false: shows text + icon, not spinner ─────────────────────

  it('shows load-more text and arrow icon when not loading', async () => {
    const el = await fixture<ScCommentLoadMore>(html`
      <sc-comment-load-more .loading=${false}></sc-comment-load-more>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('sc-spinner')).to.be.null;
    expect(el.shadowRoot?.querySelector('.load-more-link')).to.exist;
  });

  // ─── loading = true: shows spinner, hides text ───────────────────────────

  it('renders sc-spinner when loading is true', async () => {
    const el = await fixture<ScCommentLoadMore>(html`
      <sc-comment-load-more .loading=${true}></sc-comment-load-more>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('sc-spinner')).to.exist;
  });

  it('adds loading CSS class to link when loading is true', async () => {
    const el = await fixture<ScCommentLoadMore>(html`
      <sc-comment-load-more .loading=${true}></sc-comment-load-more>
    `);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.load-more-link--loading')).to.exist;
  });

  // ─── click: emits sc-load-more with totalCount, page, size ───────────────

  it('emits sc-load-more with totalCount, page and size when clicked and not loading', async () => {
    const el = await fixture<ScCommentLoadMore>(html`
      <sc-comment-load-more
        .totalCount=${42}
        .loading=${false}
        .requestPageNumber=${1}
        .requestPageSize=${20}
      ></sc-comment-load-more>
    `);
    await el.updateComplete;

    const spy = sinon.spy();
    el.addEventListener('sc-load-more', spy);

    (el as any).handleClick();

    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.totalCount).to.equal(42);
    expect(spy.firstCall.args[0].detail.page).to.equal(1);
    expect(spy.firstCall.args[0].detail.size).to.equal(20);
  });

  // ─── click guarded when loading ──────────────────────────────────────────

  it('does NOT emit sc-load-more when loading is true and handleClick is called', async () => {
    const el = await fixture<ScCommentLoadMore>(html`
      <sc-comment-load-more .loading=${true}></sc-comment-load-more>
    `);
    await el.updateComplete;

    const spy = sinon.spy();
    el.addEventListener('sc-load-more', spy);

    (el as any).handleClick();

    expect(spy.called).to.be.false;
  });

  // ─── property defaults ───────────────────────────────────────────────────

  it('loading defaults to false', async () => {
    const el = await fixture<ScCommentLoadMore>(html`
      <sc-comment-load-more></sc-comment-load-more>
    `);
    await el.updateComplete;
    expect(el.loading).to.be.false;
  });

  it('totalCount defaults to 0', async () => {
    const el = await fixture<ScCommentLoadMore>(html`
      <sc-comment-load-more></sc-comment-load-more>
    `);
    await el.updateComplete;
    expect(el.totalCount).to.equal(0);
  });

  it('requestPageSize defaults to 20', async () => {
    const el = await fixture<ScCommentLoadMore>(html`
      <sc-comment-load-more></sc-comment-load-more>
    `);
    await el.updateComplete;
    expect(el.requestPageSize).to.equal(20);
  });

  it('requestPageNumber defaults to 0', async () => {
    const el = await fixture<ScCommentLoadMore>(html`
      <sc-comment-load-more></sc-comment-load-more>
    `);
    await el.updateComplete;
    expect(el.requestPageNumber).to.equal(0);
  });
});


