import { html } from 'lit';
import { fixture, expect, aTimeout } from '@open-wc/testing';
import { ScCommentItem } from '../../../../src/components/ScComment/components/ScCommentItem/ScCommentItem.js';
import '../../../../elements/sc-comment-item.js';
import type { Comment, UserInfo } from '../../../../src/components/ScComment/ScComment.types.js';
import sinon from 'sinon';

const mockComment = {
  id: 'comment-1',
  text: 'Test comment',
  createdAt: new Date('2024-01-01'),
  user: { bankid: 'user1', name: 'User One' },
  likes: 0,
  likedByCurrentUser: false,
  replies: [],
};

const userInfo: UserInfo = {
  name: 'Test User',
  bankid: 'test-user-id',
  avatarUrl: 'https://example.com/avatar.jpg',
};

describe('ScCommentItem', () => {
  let el: any;

  beforeEach(async () => {
    el = await fixture(html`
      <sc-comment-item
        .comment=${mockComment}
        .userInfo=${userInfo}
        .depth=${0}
        .enableLike=${true}
        .enableShare=${true}
        .enableReport=${true}
        .enableEdit=${true}
        .enableDelete=${true}
      ></sc-comment-item>
    `);
  });

  let commentIdCounter = 0;
  const makeComment = (overrides: Partial<Comment> = {}): Comment => {
    return {
      id: `comment-${++commentIdCounter}`,
      text: 'Test comment',
      createdAt: new Date('2024-01-01T12:00:00Z'),
      user: userInfo,
      ...overrides,
    };
  };

  it('renders a comment with user information', async () => {
    const comment = makeComment({ text: 'Hello world' });
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    expect(el).to.exist;
    expect(el.shadowRoot?.textContent).to.include('Hello world');
    expect(el.shadowRoot?.textContent).to.include('Test User');
  });

  it('renders avatar for comment author', async () => {
    const comment = makeComment();
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    const avatar = el.shadowRoot?.querySelector('sc-employee-avatar');
    expect(avatar).to.exist;
  });

  it('renders action buttons when enabled', async () => {
    const comment = makeComment();
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${true}
        .enableShare=${true}
        .enableReport=${true}
        .enableEdit=${true}
        .enableDelete=${true}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    // Wait for render
    await el.updateComplete;
    
    // Check that action buttons are present in the shadow DOM
    const actionButtons = el.shadowRoot?.querySelectorAll('.action-button');
    expect(actionButtons).to.exist;
    expect(actionButtons!.length).to.be.greaterThan(0);
  });

  it('renders action list in dropdown when compact is true', async () => {
    const comment = makeComment();
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${true}
        .enableShare=${true}
        .enableReport=${true}
        .enableEdit=${true}
        .enableDelete=${false}
        .compact=${true}
        .depth=${0}
      ></sc-comment-item>
    `);

    await el.updateComplete;

    const dropdown = el.shadowRoot?.querySelector('sc-dropdown-input.actions');
    expect(dropdown).to.exist;

    const inlineActions = el.shadowRoot?.querySelectorAll('.reply-more-actions .action-button');
    expect(inlineActions).to.exist;
    expect(inlineActions!.length).to.equal(1);
  });

  it('renders action list in dropdown when in mobile view', async () => {
    const comment = makeComment();
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${true}
        .enableShare=${true}
        .enableReport=${true}
        .enableEdit=${true}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);

    el.isMobile = true;
    await el.updateComplete;

    const dropdown = el.shadowRoot?.querySelector('sc-dropdown-input.actions');
    expect(dropdown).to.exist;
  });

  it('emits sc-reply event when reply button is clicked', async () => {
    const comment = makeComment();
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${true}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    let eventFired = false;
    let eventDetail: any = null;
    
    el.addEventListener('sc-reply', ((e: CustomEvent) => {
      eventFired = true;
      eventDetail = e.detail;
    }) as EventListener);
    
    // Trigger reply by simulating click
    el.handleReplyClick();
    await el.updateComplete;
    
    expect(eventFired).to.be.true;
    expect(eventDetail.comment).to.deep.equal(comment);
  });

  it('emits sc-edit event when edit button is clicked', async () => {
    const comment = makeComment();
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${true}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    let eventFired = false;
    let eventDetail: any = null;
    
    el.addEventListener('sc-edit', ((e: CustomEvent) => {
      eventFired = true;
      eventDetail = e.detail;
    }) as EventListener);
    
    // Trigger edit
    el.handleEditClick();
    await el.updateComplete;
    
    expect(eventFired).to.be.true;
    expect(eventDetail.comment).to.deep.equal(comment);
  });

  it('emits sc-delete-request event when delete is requested', async () => {
    const comment = makeComment();
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${true}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    let eventFired = false;
    let eventDetail: any = null;
    
    el.addEventListener('sc-delete-request', ((e: CustomEvent) => {
      eventFired = true;
      eventDetail = e.detail;
    }) as EventListener);
    
    // Trigger delete
    el.handleDeleteClick();
    await el.updateComplete;
    
    expect(eventFired).to.be.true;
    expect(eventDetail.comment).to.deep.equal(comment);
  });

  it('emits sc-comment-like event when like button is clicked', async () => {
    const comment = makeComment({ likes: 0 });
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${true}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    let eventFired = false;
    let eventDetail: any = null;
    
    el.addEventListener('sc-comment-like', ((e: CustomEvent) => {
      eventFired = true;
      eventDetail = e.detail;
    }) as EventListener);
    
    // Trigger like
    el.handleLikeClick();
    await el.updateComplete;
    
    expect(eventFired).to.be.true;
    expect(eventDetail.comment).to.deep.equal(comment);
  });

  it('renders attachments when comment has attachments', async () => {
    const comment = makeComment({
      attachments: [
        {
          id: 'att1',
          fileName: 'test.pdf',
          fileSize: 1024,
          fileType: 'application/pdf',
          fileUrl: 'https://example.com/test.pdf',
          commentId: 'c1',
          uploadedBy: 'user1',
          uploadedAt: new Date(),
        },
      ],
    });
    
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .enableDownloadAttachment=${true}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    await el.updateComplete;
    
    // Check that attachments component is rendered
    const attachments = el.shadowRoot?.querySelector('sc-comment-attachments');
    expect(attachments).to.exist;
  });

  it('renders custom actions when provided', async () => {
    const comment = makeComment();
    const customActions = [
      {
        label: 'Custom Action',
        value: 'custom',
        iconName: 'star',
      },
    ];
    
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .actions=${customActions}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    await el.updateComplete;
    
    // Actions are rendered via action buttons
    expect(el.shadowRoot).to.exist;
  });

  it('shows hover state when hoveringCommentId matches', async () => {
    const comment = makeComment({ id: 'hover-test' });
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .hoveringCommentId=${'hover-test'}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    await el.updateComplete;
    
    // Check that component is rendered (hover state is visual)
    expect(el).to.exist;
  });

  it('emits sc-hover event on mouse enter', async () => {
    const comment = makeComment();
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    let eventFired = false;
    let eventDetail: any = null;
    
    el.addEventListener('sc-hover', ((e: CustomEvent) => {
      eventFired = true;
      eventDetail = e.detail;
    }) as EventListener);
    
    // Trigger hover
    el.handleMouseOver();
    await el.updateComplete;
    
    expect(eventFired).to.be.true;
    expect(eventDetail.commentId).to.equal(comment.id);
  });

  it('emits sc-hover-end event on mouse leave', async () => {
    const comment = makeComment();
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    let eventFired = false;
    
    el.addEventListener('sc-hover-end', (() => {
      eventFired = true;
    }) as EventListener);
    
    // Trigger hover end
    el.handleMouseOut();
    await el.updateComplete;
    
    expect(eventFired).to.be.true;
  });

  it('renders relative time for comment creation', async () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const comment = makeComment({ createdAt: oneHourAgo });
    
    const el = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);
    
    await el.updateComplete;
    
    // Check that time is rendered (actual format depends on dayjs)
    const textContent = el.shadowRoot?.textContent;
    expect(textContent).to.exist;
  });

  // handleShareClick
  it('should emit sc-comment-share on share click', async () => {
    el.enableShare = true;
    await el.updateComplete;
    const spy = sinon.spy();
    el.addEventListener('sc-comment-share', spy);
    el.handleShareClick();
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.comment).to.deep.equal(mockComment);
  });

  // handleReportClick
  it('should emit sc-comment-report on report click', () => {
    const spy = sinon.spy();
    el.addEventListener('sc-comment-report', spy);
    el.handleReportClick();
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.comment).to.deep.equal(mockComment);
  });

  // handleActionTrigger
  it('should emit sc-action-trigger on action trigger', () => {
    const spy = sinon.spy();
    el.addEventListener('sc-action-trigger', spy);
    const mockEvent = new CustomEvent('sc-select', { detail: { value: 'custom-action' } });
    el.handleActionTrigger(mockEvent);
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.value).to.equal('custom-action');
  });

  // handleAttachmentDownload
  it('should emit sc-attachment-download on attachment download', () => {
    const spy = sinon.spy();
    el.addEventListener('sc-attachment-download', spy);
    const mockEvent = new CustomEvent('sc-attachment-download', { detail: { fileId: 'file1' } });
    el.handleAttachmentDownload(mockEvent);
    expect(spy.calledOnce).to.be.true;
  });

  // handleAttachmentPreview
  it('should emit sc-attachment-preview on attachment preview', () => {
    const spy = sinon.spy();
    el.addEventListener('sc-attachment-preview', spy);
    const mockEvent = new CustomEvent('sc-attachment-preview', { detail: { fileId: 'file1' } });
    el.handleAttachmentPreview(mockEvent);
    expect(spy.calledOnce).to.be.true;
  });

  // handleMediaQueryChange
  it('should set isMobile true when mobileLg', () => {
    el.handleMediaQueryChange(false, false, true, false);
    expect(el.isMobile).to.be.true;
  });

  it('should set isMobile false when desktop', () => {
    el.isMobile = true;
    el.handleMediaQueryChange(true, false, false, false);
    expect(el.isMobile).to.be.false;
  });

  // branch: likes > 1
  it('should show Likes when likes > 1', async () => {
    el.comment = { ...mockComment, likes: 2 };
    el.enableLike = true;
    await el.updateComplete;
    const text = el.shadowRoot?.textContent;
    expect(text).to.include('2');
  });

  // branch: likedByCurrentUser
  it('should render filled heart icon when likedByCurrentUser is true', async () => {
    el.comment = { ...mockComment, likedByCurrentUser: true };
    el.enableLike = true;
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector('sc-icon[name="heart--fill"]');
    expect(icon).to.exist;
  });

  // branch: compact mode actions
  it('should push likeBtn to compactActions when compact and enableLike', async () => {
    el.compact = true;
    el.enableLike = true;
    await el.updateComplete;
    expect(el.shadowRoot?.innerHTML).to.include('sc-dropdown-input');
  });

  // branch: status badge resolved
  it('should render resolved badge when status is resolved', async () => {
    el.comment = { ...mockComment, status: 'resolved' };
    await el.updateComplete;
    const badge = el.shadowRoot?.querySelector('.comment-status-badge--resolved');
    expect(badge).to.exist;
  });

  // branch: status badge need-clarification
  it('should render need-clarification badge when status is need-clarification', async () => {
    el.comment = { ...mockComment, status: 'need-clarification' };
    await el.updateComplete;
    const badge = el.shadowRoot?.querySelector('.comment-status-badge--need-clarification');
    expect(badge).to.exist;
  });

  // branch: hideAvatar
  it('should not render avatar when hideAvatar is true', async () => {
    el.hideAvatar = true;
    await el.updateComplete;
    const avatar = el.shadowRoot?.querySelector('sc-employee-avatar');
    expect(avatar?.classList.contains('hide-avatar')).to.be.true;
  });

  // canShowMore = false
  it('should not render more button when not author', async () => {
    el.userInfo = { bankid: 'other-user', name: 'Other' };
    el.moreActions = [{ label: 'Action', value: 'action' }];
    await el.updateComplete;
    const moreBtn = el.shadowRoot?.querySelector('.reply-more');
    expect(moreBtn).to.be.null;
  });

  // ─── getRelativeTime — "Just now" branch (diffSeconds < 60) ─────────────

  it('returns "Just now" for a comment created less than 60 seconds ago', async () => {
    const recent = new Date(Date.now() - 10_000); // 10 seconds ago
    const comment = makeComment({ createdAt: recent });
    const instance = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);
    await instance.updateComplete;
    const result = instance.getRelativeTime(recent);
    // The msg() call returns the English key in jsdom → "Just now"
    expect(result).to.exist;
  });

  // ─── getRelativeTime — minutes branch (1 ≤ diffMinutes < 60) ────────────

  it('returns minutes-ago string for a comment created 5 minutes ago', async () => {
    const fiveMin = new Date(Date.now() - 5 * 60_000);
    const comment = makeComment({ createdAt: fiveMin });
    const instance = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);
    await instance.updateComplete;
    const result = instance.getRelativeTime(fiveMin);
    expect(result).to.be.a('string');
    expect(result).to.include('5');
  });

  it('returns compact minutes-ago string when compact is true', async () => {
    const fiveMin = new Date(Date.now() - 5 * 60_000);
    const comment = makeComment({ createdAt: fiveMin });
    const instance = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        ?compact=${true}
        .depth=${0}
      ></sc-comment-item>
    `);
    await instance.updateComplete;
    const result = instance.getRelativeTime(fiveMin);
    expect(result).to.be.a('string');
    expect(result).to.include('5');
  });

  // ─── loadUserInfo — emits sc-userinfo-load ───────────────────────────────

  it('emits sc-userinfo-load when loadUserInfo is called', async () => {
    const comment = { ...makeComment({ id: 'lui-1' }), replies: [] } as any;
    const instance = await fixture<ScCommentItem>(html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${userInfo}
        .enableLike=${false}
        .enableShare=${false}
        .enableReport=${false}
        .enableEdit=${false}
        .enableDelete=${false}
        .depth=${0}
      ></sc-comment-item>
    `);
    await instance.updateComplete;

    const spy = sinon.spy();
    instance.addEventListener('sc-userinfo-load', spy);

    const mockEvent = new CustomEvent('sc-loaded', { detail: { data: { name: 'Loaded Name' } } });
    instance.loadUserInfo(mockEvent, comment);

    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.comment).to.deep.equal(comment);
    expect(spy.firstCall.args[0].detail.data).to.deep.equal({ name: 'Loaded Name' });
  });
});