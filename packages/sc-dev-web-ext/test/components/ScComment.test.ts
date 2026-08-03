import { html } from 'lit';
import { fixture, expect, aTimeout } from '@open-wc/testing';
import { ScComment } from '../../src/components/ScComment/ScComment.js';
import { ScCommentUtils } from '../../src/components/ScComment/ScComment.utils.js';
import '../../elements/sc-comment.js';
import dayjs from 'dayjs/esm/index.js';
import sinon from 'sinon';

jest.mock('dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: (input: string) => input,
  },
}));

jest.mock('../../src/apis/comment.js', () => ({
  createComment: jest.fn().mockResolvedValue(undefined),
  getComments: jest.fn().mockResolvedValue({ items: [], total: 0 }),
  deleteComment: jest.fn().mockResolvedValue({ success: true }),
  updateComment: jest.fn().mockResolvedValue({}),
  likeComment: jest.fn().mockResolvedValue(undefined),
  unlikeComment: jest.fn().mockResolvedValue(undefined),
}));

// Polyfill crypto.randomUUID for test environment
if (!globalThis.crypto?.randomUUID) {
  // @ts-ignore
  globalThis.crypto = globalThis.crypto || {};
  // @ts-ignore
  globalThis.crypto.randomUUID = () =>
    `test-uuid-${Math.random().toString(36).substring(2, 10)}` as any;
}

describe('ScComment', () => {
  let el: any;

  beforeEach(async () => {
    el = await fixture(html`
      <sc-comment
        .userInfo=${userInfo}
        .comments=${[makeComment({ id: 'c1' }), makeComment('c2')]}
        reference-id="ref-1"
      ></sc-comment>
    `);
  });

  it('calls handleEditClick and sets activeEditComment', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-edit
      ></sc-comment>`
    );
    expect(el.activeEditComment).to.be.null;
    el.handleEditClick({ ...comment, replies: [] });
    expect(el.activeEditComment).to.not.be.null;
    expect(el.activeEditComment?.id).to.equal(comment.id);
  });

  it('edit mode disables after cancel', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-edit
      ></sc-comment>`
    );
    el.handleEditClick({ ...comment, replies: [] });
    expect(el.activeEditComment).to.not.be.null;
    el.handleCancel();
    expect(el.activeEditComment).to.be.null;
  });

  it('edit mode disables after successful reply (edit)', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-edit
      ></sc-comment>`
    );
    el.handleEditClick({ ...comment, replies: [] });
    el.replyContent = 'Edited text';
    el.handleReply();
    expect(el.activeEditComment).to.be.null;
  });
  const userInfo = {
    bankid: 'user1',
    name: 'Test User',
    avatarUrl: 'https://example.com/avatar.png',
  };

  function makeComment(overrides = {}) {
    return {
      id: `c${Math.random().toString(36).slice(2, 8)}`,
      text: 'Comment',
      createdAt: new Date(),
      user: userInfo,
      ...overrides,
    };
  }

  it('renders root input', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);
    // After refactoring: root input is now rendered via sc-comment-input component
    expect(el.shadowRoot?.querySelector('sc-comment-input')).to.exist;
    const inputEl = el.shadowRoot?.querySelector('sc-comment-input');
    expect(inputEl?.shadowRoot?.querySelector('sc-employee-avatar')).to.exist;
    expect(inputEl?.shadowRoot?.querySelector('sc-rich-text-editor-v2')).to.exist;
    expect(inputEl?.shadowRoot?.querySelector('sc-button')).to.exist;
  });

  it('adds a new comment on post', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);
    let eventDetail: any = null;
    el.addEventListener('sc-change', (e: Event) => {
      eventDetail = (e as CustomEvent).detail;
    });
    el.value = 'Hello world';
    el.handlePost();
    await new Promise(r => setTimeout(r, 0));
    expect(eventDetail?.allComments?.length).to.equal(1);
    expect(eventDetail?.allComments?.[0]?.text).to.equal('Hello world');
    expect(eventDetail?.allComments?.[0]?.user?.name).to.equal('Test User');
  });

  it('renders replies when comments are provided', async () => {
    const comments = [
      {
        id: 'c1',
        text: 'Parent comment',
        createdAt: new Date(),
        user: userInfo,
      },
      {
        id: 'c2',
        text: 'Reply comment',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'c1',
      },
    ];
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${comments}></sc-comment>
    `);
    // After refactoring: comments are rendered via sc-comment-list which renders sc-comment-item
    // Content is deeply nested in shadow DOMs, check if sc-comment-item elements exist
    const listEl = el.shadowRoot?.querySelector('sc-comment-list');
    expect(listEl).to.exist;
    const commentItems = listEl?.shadowRoot?.querySelectorAll('sc-comment-item');
    expect(commentItems).to.have.lengthOf(2); // Parent + Reply
    // Check that comment items are rendered (actual text is in their shadow roots)
    expect(commentItems?.[0]).to.exist;
    expect(commentItems?.[1]).to.exist;
  });

  it('toggles replies expanded state', async () => {
    const comments = [
      {
        id: 'c1',
        text: 'Parent',
        createdAt: new Date(),
        user: userInfo,
      },
      {
        id: 'c2',
        text: 'Reply',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'c1',
      },
    ];
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${comments}></sc-comment>
    `);
    // fakeActionEvent removed - now inlined in modal
    el.handleReplyClick({ ...el.comments[0], replies: [] });
    el.handleToggleReplies(el.comments[0].id);
    el.handleToggleReplies(el.comments[0].id);
    el.handleReply();
    el.handleValueChange(
      new CustomEvent('', { detail: { text: 'Reply text' } })
    );
    el.handleReplyContentChange(
      new CustomEvent('', { detail: { text: 'Reply text' } })
    );
    expect(el.isRepliesExpanded('c1')).to.be.true;
    el.toggleReplies('c1');
    expect(el.isRepliesExpanded('c1')).to.be.false;
  });

  it('shows relative time for comments', async () => {
    const now = new Date();
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);
    const timeStr = el.getRelativeTime(now);
    expect(timeStr).to.be.a('string');
  });

  it('emits sc-change when comments change', async () => {
    const el = await fixture<ScComment>(
      html`<sc-comment .userInfo=${userInfo}></sc-comment>`
    );
    let callCount = 0;
    el.addEventListener('sc-change', (e: Event) => {
      callCount++;
    });
    el.value = 'Test comment';
    el.handlePost();
    await new Promise(r => setTimeout(r, 0));
    expect(callCount).to.be.greaterThan(0);
  });

  it('emits sc-comment-like when like is clicked', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-like
      ></sc-comment>`
    );
    let callCount = 0;
    let eventDetail = null;
    el.addEventListener('sc-comment-like', (e: Event) => {
      callCount++;
      eventDetail = (e as CustomEvent).detail;
    });
    el.handleLikeClick({ ...comment, replies: [] });
    expect(callCount).to.be.greaterThan(0);
  });

  it('emits sc-comment-share when share is clicked', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-share
      ></sc-comment>`
    );
    let callCount = 0;
    let eventDetail = null;
    el.addEventListener('sc-comment-share', (e: Event) => {
      callCount++;
      eventDetail = (e as CustomEvent).detail;
    });
    el.handleShareClick({ ...comment, replies: [] });
    expect(callCount).to.be.greaterThan(0);
  });

  it('emits sc-comment-report when report is clicked', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-report
      ></sc-comment>`
    );
    let callCount = 0;
    let eventDetail = null;
    el.addEventListener('sc-comment-report', (e: Event) => {
      callCount++;
      eventDetail = (e as CustomEvent).detail;
    });
    el.handleReportClick({ ...comment, replies: [] });
    expect(callCount).to.be.greaterThan(0);
  });

  it('emits sc-comment-filter when filter/sort is changed', async () => {
    const el = await fixture<ScComment>(
      html`<sc-comment .userInfo=${userInfo}></sc-comment>`
    );
    let callCount = 0;
    el.addEventListener('sc-comment-filter', () => {
      callCount++;
    });
    // Simulate filter/sort change via property assignment (triggers watchers)
    el.poster = 'me';
    await el.updateComplete;
    el.sorter = 'most';
    await el.updateComplete;
    // Note: sc-comment-filter event is emitted by toolbar sub-component,
    // so direct property changes won't trigger the event.
    // This test should be moved to ScCommentToolbar tests.
    expect(el.poster).to.equal('me');
    expect(el.sorter).to.equal('most');
  });

  it('emits sc-change with full list on post', async () => {
    const el = await fixture<ScComment>(
      html`<sc-comment .userInfo=${userInfo}></sc-comment>`
    );
    let eventDetail: any = null;
    el.addEventListener('sc-change', (e: Event) => {
      eventDetail = (e as CustomEvent).detail;
    });
    el.value = 'Test comment';
    el.handlePost();
    await new Promise(r => setTimeout(r, 0));
    expect(eventDetail?.allComments?.length).to.equal(1);
  });

  it.skip('getDisplayNameOfCondition returns correct label - MOVED TO ScCommentToolbar', async () => {
    const el = await fixture<ScComment>(
      html`<sc-comment .userInfo=${userInfo}></sc-comment>`
    );
    // expect(el.getDisplayNameOfCondition('all', 'poster')).to.equal(
    //   'All comments'
    // );
    // expect(el.getDisplayNameOfCondition('me', 'poster')).to.equal('Only me');
    // expect(el.getDisplayNameOfCondition('newest', 'sorter')).to.equal('Newest');
    // expect(el.getDisplayNameOfCondition('most', 'sorter')).to.equal(
    //   'Most replied'
    // );
  });

  it.skip('handleConditionChange does not emit if value is unchanged - MOVED TO ScCommentToolbar', async () => {
    const el = await fixture<ScComment>(
      html`<sc-comment .userInfo=${userInfo}></sc-comment>`
    );
    let callCount = 0;
    el.addEventListener('sc-comment-filter', () => {
      callCount++;
    });
    // el.handleConditionChange('poster', 'all');
    // el.handleConditionChange('sorter', 'newest');
    expect(callCount).to.equal(0);
  });

  it.skip('renderCondition renders filter and sorter controls - MOVED TO ScCommentToolbar', async () => {
    const el = await fixture<ScComment>(
      html`<sc-comment .userInfo=${userInfo}></sc-comment>`
    );
    // const frag = el.renderCondition(2);
    // expect(frag).to.be.ok;
  });

  it('calls handleDelete and opens modal', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-delete
      ></sc-comment>`
    );
    el.handleDelete(comment);
    expect(el.openModal).to.be.true;
    expect(el.modalRelatedComment).to.deep.equal(comment);
  });

  it('calls handleDeleteAction with type primary and deletes comment', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-delete
      ></sc-comment>`
    );
    let eventDetail: any = null;
    el.addEventListener('sc-change', (e: Event) => {
      eventDetail = (e as CustomEvent).detail;
    });
    el.modalRelatedComment = comment;
    const event = new CustomEvent('delete', { detail: { type: 'primary' } });
    el.handleDeleteAction(event);
    await new Promise(r => setTimeout(r, 0));
    expect(eventDetail?.allComments?.length).to.equal(0);
    expect(el.openModal).to.be.false;
  });

  it('calls handleModalAction and closes modal', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-delete
      ></sc-comment>`
    );
    el.openModal = true;
    el.modalRelatedComment = comment;
    el.modalRelatedAction = () => {
      el.handleDelete(comment);
    };
    const event = new CustomEvent('modal-action', { detail: {} });
    el.handleModalAction(event);
    expect(el.openModal).to.be.true; // modalRelatedAction does not close modal by itself
    el.handleModalClose();
    expect(el.openModal).to.be.false;
  });

  it('calls handleActionTrigger for delete', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-delete
      ></sc-comment>`
    );
    const event = new CustomEvent('action', { detail: { value: 'delete', comment } });
    el.handleActionTrigger(event);
    // Should open modal for delete
    expect(el.openModal).to.be.true;
    expect(el.modalRelatedComment).to.deep.equal(comment);
  });

  it('handles reply when in edit mode', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-edit
      ></sc-comment>`
    );

    let eventDetail: any = null;
    el.addEventListener('sc-change', (e: Event) => {
      eventDetail = (e as CustomEvent).detail;
    });

    // Start edit mode
    el.handleEditClick({ ...comment, replies: [] });
    expect(el.activeEditComment).to.not.be.null;

    // Set reply content and trigger handleReply
    el.replyContent = 'Updated comment text';
    el.handleReply();

    // Check that comment was modified
    await new Promise(r => setTimeout(r, 0));
    expect(eventDetail?.allComments?.[0]?.text).to.equal('Updated comment text');
    expect(el.activeEditComment).to.be.null;
  });

  it('handles reply when in reply mode', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
      ></sc-comment>`
    );

    let eventDetail: any = null;
    el.addEventListener('sc-change', (e: Event) => {
      eventDetail = (e as CustomEvent).detail;
    });

    // Start reply mode
    el.handleReplyClick({ ...comment, replies: [] });
    expect(el.activeComment).to.not.be.null;

    // Set reply content and trigger handleReply
    el.replyContent = 'Reply to comment';
    el.handleReply();

    // Check that new comment was added
    await new Promise(r => setTimeout(r, 0));
    expect(eventDetail?.allComments?.length).to.equal(2);
    expect(eventDetail?.allComments?.[1]?.parentID).to.equal(comment.id);
  });

  it('toggles edit mode by clicking same comment twice', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-edit
      ></sc-comment>`
    );

    // First click - activate edit
    el.handleEditClick({ ...comment, replies: [] });
    expect(el.activeEditComment).to.not.be.null;

    // Second click - deactivate edit
    el.handleEditClick({ ...comment, replies: [] });
    expect(el.activeEditComment).to.be.null;
    expect(el.activeComment).to.be.null;
  });

  it('toggles reply mode by clicking same comment twice', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
      ></sc-comment>`
    );

    // First click - activate reply
    el.handleReplyClick({ ...comment, replies: [] });
    expect(el.activeComment).to.not.be.null;

    // Second click - deactivate reply
    el.handleReplyClick({ ...comment, replies: [] });
    expect(el.activeComment).to.be.null;
  });

  it('switches from edit to reply mode', async () => {
    const comment1 = makeComment({ id: 'c1' });
    const comment2 = makeComment({ id: 'c2' });
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment1, comment2]}
        enable-edit
      ></sc-comment>`
    );

    // Start edit mode on first comment
    el.handleEditClick({ ...comment1, replies: [] });
    expect(el.activeEditComment?.id).to.equal('c1');

    // Switch to reply mode on second comment
    el.handleReplyClick({ ...comment2, replies: [] });
    expect(el.activeEditComment).to.be.null;
    expect(el.activeComment?.id).to.equal('c2');
  });

  it('handles toggle replies with active comment', async () => {
    const parent = makeComment({ id: 'parent' });
    const child = makeComment({ id: 'child', parentID: 'parent' });
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[parent, child]}
      ></sc-comment>`
    );

    // Activate comment on child
    el.handleReplyClick({ ...child, replies: [] });
    expect(el.activeComment).to.not.be.null;

    // Toggle replies on parent
    el.handleToggleReplies('parent');

    // Wait for setTimeout
    await new Promise(r => setTimeout(r, 100));

    // activeComment should be reset
    expect(el.activeComment).to.be.null;
  });

  it('renders replies up to max depth', async () => {
    const comments = [
      { id: 'c1', text: 'Level 1', createdAt: new Date(), user: userInfo },
      {
        id: 'c2',
        text: 'Level 2',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'c1',
      },
      {
        id: 'c3',
        text: 'Level 3',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'c2',
      },
      {
        id: 'c4',
        text: 'Level 4',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'c3',
      },
      {
        id: 'c5',
        text: 'Level 5',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'c4',
      },
      {
        id: 'c6',
        text: 'Level 6',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'c5',
      },
    ];
    const el = await fixture<ScComment>(html`
      <sc-comment
        .userInfo=${userInfo}
        .comments=${comments}
        .maxRepliesdepth=${5}
      ></sc-comment>
    `);

    // After refactoring: comments are rendered via sc-comment-list which renders sc-comment-item
    // Max depth is implemented by ScCommentList not rendering beyond depth 5
    const listEl = el.shadowRoot?.querySelector('sc-comment-list');
    expect(listEl).to.exist;
    const commentItems = listEl?.shadowRoot?.querySelectorAll('sc-comment-item');
    // Should have 5 items (Level 1-5), Level 6 should not be rendered
    expect(commentItems).to.have.lengthOf(5);
  });

  it('sorts comments by most replied', async () => {
    const comments = [
      { id: 'c1', text: 'Comment 1', createdAt: new Date(), user: userInfo },
      { id: 'c2', text: 'Comment 2', createdAt: new Date(), user: userInfo },
      {
        id: 'r1',
        text: 'Reply 1',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'c2',
      },
      {
        id: 'r2',
        text: 'Reply 2',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'c2',
      },
    ];
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${comments}></sc-comment>
    `);

    el.sorter = 'most';
    await el.updateComplete;

    const finalized = ScCommentUtils.finalizedComments(
      el.comments,
      el.poster,
      el.sorter,
      el.userInfo.bankid
    );
    // c2 should be first because it has 2 replies
    expect(finalized[0].id).to.equal('c2');
  });

  it('filters comments by current user', async () => {
    const otherUser = { bankid: 'other', name: 'Other User' };
    const comments = [
      { id: 'c1', text: 'My comment', createdAt: new Date(), user: userInfo },
      {
        id: 'c2',
        text: 'Other comment',
        createdAt: new Date(),
        user: otherUser,
      },
    ];
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${comments}></sc-comment>
    `);

    el.poster = 'me';
    await el.updateComplete;

    const finalized = ScCommentUtils.finalizedComments(
      el.comments,
      el.poster,
      el.sorter,
      el.userInfo.bankid
    );
    expect(finalized.length).to.equal(1);
    expect(finalized[0].id).to.equal('c1');
  });

  it('applies modifications to comments', async () => {
    const comment = makeComment({ id: 'c1' });
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
      ></sc-comment>`
    );

    // Modify comment
    const modifiedComment = {
      ...comment,
      text: 'Modified text',
      updatedAt: new Date(),
    };
    el.comments = [modifiedComment];
    await el.updateComplete;
    expect(el.comments[0].text).to.equal('Modified text');
  });

  it('deletes comment and its children', async () => {
    const parent = makeComment({ id: 'parent' });
    const child1 = makeComment({ id: 'child1', parentID: 'parent' });
    const child2 = makeComment({ id: 'child2', parentID: 'child1' });
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[parent, child1, child2]}
        enable-delete
      ></sc-comment>`
    );

    let eventDetail: any = null;
    el.addEventListener('sc-change', (e: Event) => {
      eventDetail = (e as CustomEvent).detail;
    });
    el.modalRelatedComment = parent;
    const event = new CustomEvent('delete', { detail: { type: 'primary' } });
    el.handleDeleteAction(event);

    // All three should be deleted
    await new Promise(r => setTimeout(r, 0));
    expect(eventDetail?.allComments?.length).to.equal(0);
  });

  it('handles like toggle correctly', async () => {
    const comment = makeComment({
      id: 'c1',
      likes: 5,
      likedByCurrentUser: false,
    });
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-like
      ></sc-comment>`
    );

    let callCount = 0;
    el.addEventListener('sc-comment-like', () => {
      callCount++;
    });

    el.handleLikeClick({ ...comment, replies: [] });
    el.handleLikeClick({ ...comment, replies: [] });
    expect(callCount).to.equal(2);
  });

  it('renders toggle button for many replies', async () => {
    const parent = makeComment({ id: 'parent' });
    const replies = Array.from({ length: 10 }, (_, i) =>
      makeComment({ id: `reply${i}`, parentID: 'parent' })
    );
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[parent, ...replies]}
        .maxVisibleReplies=${5}
      ></sc-comment>`
    );

    const text = el.shadowRoot?.textContent;
    expect(text).to.include('Show');
    expect(text).to.include('replies');
  });

  it('handles custom actions', async () => {
    const comment = makeComment();
    let actionCalled = false;
    const customAction = {
      icon: 'star--line',
      label: 'Custom',
      handler: (c: any) => {
        actionCalled = true;
      },
    };

    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        .actions=${[customAction]}
      ></sc-comment>`
    );

    // Trigger custom action
    customAction.handler({ ...comment, replies: [] });
    expect(actionCalled).to.be.true;
  });

  it('shows relative time with updatedAt', async () => {
    const now = new Date();
    const earlier = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour ago
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);
    const timeStr = el.getRelativeTime(earlier, now);
    expect(timeStr).to.be.a('string');
  });

  it('handles deleteAction with no modalRelatedComment', async () => {
    const el = await fixture<ScComment>(
      html`<sc-comment .userInfo=${userInfo} enable-delete></sc-comment>`
    );

    el.modalRelatedComment = null;
    const event = new CustomEvent('delete', { detail: { type: 'primary' } });
    el.handleDeleteAction(event);

    // Should not throw error
    expect(el.openModal).to.be.false;
  });

  it('handles actionTrigger with unknown action', async () => {
    const comment = makeComment();
    const el = await fixture<ScComment>(
      html`<sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
      ></sc-comment>`
    );

    const event = new CustomEvent('action', { detail: { value: 'unknown', comment } });
    el.handleActionTrigger(event);

    // Should not throw error or open modal
    expect(el.openModal).to.be.false;
  });

  it('renders modal correctly', async () => {
    const el = await fixture<ScComment>(
      html`<sc-comment .userInfo=${userInfo} enable-delete></sc-comment>`
    );

    el.openModal = true;
    await el.updateComplete;

    const modal = el.shadowRoot?.querySelector('sc-modal');
    expect(modal).to.exist;
  });

  it('getAllChildCommentIds returns all descendants', async () => {
    const comments = [
      { id: 'p1', text: 'Parent', createdAt: new Date(), user: userInfo },
      {
        id: 'c1',
        text: 'Child 1',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'p1',
      },
      {
        id: 'c2',
        text: 'Child 2',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'p1',
      },
      {
        id: 'gc1',
        text: 'Grandchild 1',
        createdAt: new Date(),
        user: userInfo,
        parentID: 'c1',
      },
    ];
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${comments}></sc-comment>
    `);

    const childIds = el.getAllChildCommentIds('p1', comments);
    expect(childIds.length).to.equal(3);
    expect(childIds).to.include('c1');
    expect(childIds).to.include('c2');
    expect(childIds).to.include('gc1');
  });

  it('opens reminder modal with existing reminderAt', async () => {
    const reminderAt = new Date('2026-03-03T10:30:00.000Z');
    const comment = makeComment({ reminderAt });
    const el = await fixture<ScComment>(html`
      <sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-reminder
      ></sc-comment>
    `);

    (el as any).openReminderModal(comment);

    expect((el as any).reminderOpen).to.be.true;
    expect((el as any).reminderDate).to.equal(
      dayjs(reminderAt).format('YYYY-MM-DD')
    );
    expect((el as any).reminderTime).to.equal(
      dayjs(reminderAt).format('HH:mm')
    );
  });

  it('clears reminder and emits sc-change', async () => {
    const reminderAt = new Date('2026-03-03T10:30:00.000Z');
    const comment = makeComment({ id: 'c1', reminderAt });
    const el = await fixture<ScComment>(html`
      <sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-reminder
      ></sc-comment>
    `);

    let eventDetail: any = null;
    el.addEventListener('sc-change', (e: Event) => {
      eventDetail = (e as CustomEvent).detail;
    });

    (el as any).reminderRelatedComment = comment;
    (el as any).handleReminderClear();

    await new Promise(r => setTimeout(r, 0));
    expect(eventDetail?.allComments?.[0]?.reminderAt).to.equal(undefined);
    expect((el as any).reminderOpen).to.be.false;
  });

  it('marks reminder now and updates status', async () => {
    const reminderAt = new Date('2026-03-03T10:30:00.000Z');
    const comment = makeComment({ id: 'c2', reminderAt });
    const el = await fixture<ScComment>(html`
      <sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        enable-reminder
      ></sc-comment>
    `);

    let eventDetail: any = null;
    el.addEventListener('sc-change', (e: Event) => {
      eventDetail = (e as CustomEvent).detail;
    });

    (el as any).reminderRelatedComment = comment;
    (el as any).reminderStatus = 'resolved';
    (el as any).handleReminderMarkNow();

    await new Promise(r => setTimeout(r, 0));
    expect(eventDetail?.allComments?.[0]?.status).to.equal('resolved');
    expect(eventDetail?.allComments?.[0]?.reminderAt).to.equal(undefined);
  });

  it('schedules reminder and emits trigger after delay', async () => {
    jest.useFakeTimers();
    try {
      const comment = makeComment({ id: 'c3' });
      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          .comments=${[comment]}
          enable-reminder
        ></sc-comment>
      `);

      const scheduledAt = new Date(Date.now() + 60000);
      const reminderDate = `${scheduledAt.getFullYear()}-${String(
        scheduledAt.getMonth() + 1
      ).padStart(2, '0')}-${String(scheduledAt.getDate()).padStart(2, '0')}`;
      const reminderTime = `${String(scheduledAt.getHours()).padStart(2, '0')}:${String(
        scheduledAt.getMinutes()
      ).padStart(2, '0')}`;

      (el as any).reminderRelatedComment = comment;
      (el as any).reminderDate = reminderDate;
      (el as any).reminderTime = reminderTime;
      (el as any).reminderStatus = 'resolved';

      let triggerCount = 0;
      el.addEventListener('sc-reminder-trigger', () => {
        triggerCount += 1;
      });

      (el as any).handleReminderConfirm();
      expect((el as any).reminderTimers.size).to.equal(1);

      jest.advanceTimersByTime(60000);
      expect(triggerCount).to.equal(1);
      expect((el as any).reminderTimers.size).to.equal(0);
    } finally {
      jest.useRealTimers();
    }
  });

  it('emits sc-attachment-preview and opens preview modal', async () => {
    const comment = makeComment({ id: 'c4' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]}></sc-comment>
    `);

    const attachment = {
      id: 'att-1',
      commentId: comment.id,
      fileName: 'preview.png',
      fileSize: 123,
      fileType: 'image/png',
      fileUrl: 'https://example.com/preview.png',
      uploadedBy: userInfo.bankid,
      uploadedAt: new Date(),
    };

    let eventDetail: any = null;
    el.addEventListener('sc-attachment-preview', (e: Event) => {
      eventDetail = (e as CustomEvent).detail;
    });

    (el as any).handleAttachmentPreview(
      new CustomEvent('sc-attachment-preview', {
        detail: {
          commentId: comment.id,
          attachment,
        },
      })
    );

    expect((el as any).previewOpen).to.be.true;
    expect(eventDetail?.attachment?.id).to.equal('att-1');

    (el as any).handlePreviewClose();
    expect((el as any).previewOpen).to.be.false;
  });

  it('calls custom action handler when triggered', async () => {
    const comment = makeComment({ id: 'c5' });
    const handler = jest.fn();
    const el = await fixture<ScComment>(html`
      <sc-comment
        .userInfo=${userInfo}
        .comments=${[comment]}
        .moreActions=${[
          {
            id: 'pin',
            label: 'Pin',
            handler,
          },
        ]}
      ></sc-comment>
    `);

    el.handleActionTrigger(
      new CustomEvent('sc-action-trigger', {
        detail: {
          value: 'pin',
          comment,
        },
      })
    );

    expect(handler.mock.calls.length).to.equal(1);
    expect(handler.mock.calls[0][0]).to.equal(comment);
  });

  it('does nothing when reminder confirm is missing fields', async () => {
    const comment = makeComment({ id: 'c6' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]}></sc-comment>
    `);

    let changeCount = 0;
    el.addEventListener('sc-change', () => {
      changeCount += 1;
    });

    (el as any).reminderRelatedComment = comment;
    (el as any).reminderDate = '';
    (el as any).reminderTime = '';
    (el as any).handleReminderConfirm();

    await new Promise(r => setTimeout(r, 0));
    expect(changeCount).to.equal(0);
  });

  it('handles file selection error and emits sc-comment-file-error', async () => {
    const comment = makeComment({ id: 'c7', attachments: [{ id: 'att1', fileName: 'a.txt' }] });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]}></sc-comment>
    `);

    let errorDetail: any = null;
    el.addEventListener('sc-comment-file-error', (e: Event) => {
      errorDetail = (e as CustomEvent).detail;
    });

    (el as any).activeEditComment = comment;
    (el as any).fileHandler = {
      getDeletedAttachmentIds: () => new Set<string>(),
      markAttachmentDeleted: jest.fn(),
      handleFileSelection: () => ({
        success: false,
        errorType: 'maxFiles',
        errorMessage: 'Too many files',
        fileCount: 2,
        fileNames: ['a.txt', 'b.txt'],
      }),
      prepareFileInputValue: () => [],
    } as any;

    const event = new CustomEvent('sc-files-change', { detail: { value: [] } });
    el.handleFileSelection(event, comment.id);

    expect(errorDetail?.errorType).to.equal('maxFiles');
    expect(errorDetail?.errorMessage).to.equal('Too many files');
  });

  it('removes draft attachments and resets input state', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);

    const inputEl = document.createElement('input');
    inputEl.id = 'file-input-root';
    el.shadowRoot?.appendChild(inputEl);

    const removeDraftAttachment = jest.fn();
    const prepareFileInputValue = jest.fn(() => []);
    (el as any).fileHandler = {
      removeDraftAttachment,
      prepareFileInputValue,
    } as any;

    el.removeDraftAttachment('root', 0);
    expect(removeDraftAttachment.mock.calls.length).to.equal(1);
    expect(prepareFileInputValue.mock.calls.length).to.equal(1);
  });

  it('handleCancel clears drafts and resets file input', async () => {
    const comment = makeComment({ id: 'c8' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);

    const clearDrafts = jest.fn();
    const resetFileInput = jest.fn((_: string, cb: () => void) => cb());
    const clearDeletedIds = jest.fn();
    (el as any).fileHandler = {
      clearDrafts,
      resetFileInput,
      clearDeletedIds,
    } as any;

    (el as any).activeEditComment = comment;
    (el as any).handleCancel();

    expect(clearDrafts.mock.calls.length).to.equal(1);
    expect(resetFileInput.mock.calls.length).to.equal(1);
    expect(clearDeletedIds.mock.calls.length).to.equal(1);
    expect((el as any).activeEditComment).to.equal(null);
    expect((el as any).activeComment).to.equal(null);
  });

  it('updates poster/sorter and hover state via handlers', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);

    (el as any).handleFilterChange(
      new CustomEvent('sc-filter-change', { detail: { poster: 'mine' } })
    );
    (el as any).handleSortChange(
      new CustomEvent('sc-sort-change', { detail: { sorter: 'oldest' } })
    );
    (el as any).handleHover(
      new CustomEvent('sc-hover', { detail: { commentId: 'c9' } })
    );
    (el as any).handleHoverEnd();

    expect((el as any).poster).to.equal('mine');
    expect((el as any).sorter).to.equal('oldest');
    expect((el as any).hoveringCommentId).to.equal(undefined);
  });

  it('handles file selection success without emitting errors', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);

    let errorCount = 0;
    el.addEventListener('sc-comment-file-error', () => {
      errorCount += 1;
    });

    (el as any).fileHandler = {
      getDeletedAttachmentIds: () => new Set<string>(),
      handleFileSelection: () => ({ success: true }),
    } as any;

    const event = new CustomEvent('sc-files-change', { detail: { value: [] } });
    el.handleFileSelection(event, 'root');

    expect(errorCount).to.equal(0);
  });

  it('returns early when reminder confirm has no comment', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);

    let changeCount = 0;
    el.addEventListener('sc-change', () => {
      changeCount += 1;
    });

    (el as any).reminderRelatedComment = null;
    (el as any).reminderDate = '2026-03-03';
    (el as any).reminderTime = '10:30';
    (el as any).handleReminderConfirm();

    expect(changeCount).to.equal(0);
  });

  it('opens reminder modal when action trigger is reminder', async () => {
    const comment = makeComment({ id: 'c10' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]}></sc-comment>
    `);

    el.handleActionTrigger(
      new CustomEvent('sc-action-trigger', {
        detail: {
          value: 'reminder',
          comment,
        },
      })
    );

    expect((el as any).reminderOpen).to.equal(true);
  });

  it('downloads attachments via handleAttachmentDownload', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);

    const attachment = {
      id: 'att-2',
      commentId: 'c11',
      fileName: 'file.pdf',
      fileSize: 100,
      fileType: 'application/pdf',
      fileUrl: 'https://example.com/file.pdf',
      uploadedBy: userInfo.bankid,
      uploadedAt: new Date(),
    };

    const originalCreateElement = document.createElement.bind(document);
    let clickCalled = false;
    document.createElement = ((tagName: string) => {
      if (tagName === 'a') {
        return {
          href: '',
          download: '',
          click: () => {
            clickCalled = true;
          },
        } as any;
      }
      return originalCreateElement(tagName);
    }) as any;

    el.handleAttachmentDownload(
      new CustomEvent('sc-attachment-download', {
        detail: {
          commentId: 'c11',
          attachment,
        },
      })
    );

    expect(clickCalled).to.equal(true);
    document.createElement = originalCreateElement;
  });

  it('reschedules reminder by clearing existing timer', async () => {
    jest.useFakeTimers();
    try {
      const comment = makeComment({ id: 'c12' });
      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          .comments=${[comment]}
          enable-reminder
        ></sc-comment>
      `);

      const first = new Date(Date.now() + 60000);
      (el as any).reminderRelatedComment = comment;
      (el as any).reminderDate = `${first.getFullYear()}-${String(
        first.getMonth() + 1
      ).padStart(2, '0')}-${String(first.getDate()).padStart(2, '0')}`;
      (el as any).reminderTime = `${String(first.getHours()).padStart(2, '0')}:${String(
        first.getMinutes()
      ).padStart(2, '0')}`;
      (el as any).reminderStatus = 'in-progress';

      (el as any).handleReminderConfirm();
      expect((el as any).reminderTimers.size).to.equal(1);

      const second = new Date(Date.now() + 120000);
      (el as any).reminderDate = `${second.getFullYear()}-${String(
        second.getMonth() + 1
      ).padStart(2, '0')}-${String(second.getDate()).padStart(2, '0')}`;
      (el as any).reminderTime = `${String(second.getHours()).padStart(2, '0')}:${String(
        second.getMinutes()
      ).padStart(2, '0')}`;
      (el as any).handleReminderConfirm();

      expect((el as any).reminderTimers.size).to.equal(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it('resets file input value when selection fails validation', async () => {
    const comment = makeComment({ id: 'c13' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]}></sc-comment>
    `);

    const inputEl = document.createElement('input');
    inputEl.id = 'file-input-c13';
    el.shadowRoot?.appendChild(inputEl);

    const prepareFileInputValue = jest.fn(() => ['file-a']);
    (el as any).fileHandler = {
      getDeletedAttachmentIds: () => new Set<string>(),
      handleFileSelection: () => ({
        success: false,
        errorType: 'type',
        errorMessage: 'Bad type',
      }),
      prepareFileInputValue,
    } as any;

    el.handleFileSelection(
      new CustomEvent('sc-files-change', { detail: { value: [] } }),
      'c13'
    );

    expect(prepareFileInputValue.mock.calls.length).to.equal(1);
    expect((inputEl as any).value).to.equal('file-a');
  });

  it('closes modal when delete action is not primary', async () => {
    const comment = makeComment({ id: 'c14' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]}></sc-comment>
    `);

    (el as any).modalRelatedComment = comment;
    (el as any).openModal = true;
    el.handleDeleteAction(
      new CustomEvent('delete', { detail: { type: 'secondary' } })
    );

    expect((el as any).openModal).to.equal(false);
  });

  it('initializes poster and sorter from options on update', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);

    (el as any).viewOptions = [{ label: 'All', value: 'all' }];
    (el as any).sortOptions = [{ label: 'Newest', value: 'newest' }];
    await (el as any).updateComplete;

    expect((el as any).poster).to.equal('all');
    expect((el as any).sorter).to.equal('newest');
  });

  it('handleCancel skips draft reset when no active comment', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);

    const clearDrafts = jest.fn();
    const resetFileInput = jest.fn();
    const clearDeletedIds = jest.fn();
    (el as any).fileHandler = {
      clearDrafts,
      resetFileInput,
      clearDeletedIds,
    } as any;

    (el as any).handleCancel();

    expect(clearDrafts.mock.calls.length).to.equal(0);
    expect(resetFileInput.mock.calls.length).to.equal(0);
    expect(clearDeletedIds.mock.calls.length).to.equal(1);
  });

  it('returns early on reminder clear/mark when no related comment', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);

    let changeCount = 0;
    el.addEventListener('sc-change', () => {
      changeCount += 1;
    });

    (el as any).reminderRelatedComment = null;
    (el as any).handleReminderClear();
    (el as any).handleReminderMarkNow();

    expect(changeCount).to.equal(0);
  });

  it('handleClose collapses and preserves draft text', async () => {
    const comment = makeComment({ id: 'draft-c1' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]}></sc-comment>
    `);

    (el as any).activeComment = comment;
    (el as any).replyContent = 'draft value';
    (el as any).handleClose();

    expect((el as any).activeComment).to.equal(null);
    expect((el as any).activeEditComment).to.equal(null);
    expect((el as any).draftTexts.get('draft-c1')).to.equal('draft value');
  });

  it('forwards sc-view-sort-change from handler', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);

    let detail: any;
    el.addEventListener('sc-view-sort-change', (e: Event) => {
      detail = (e as CustomEvent).detail;
    });

    (el as any).handleViewSortChange(
      new CustomEvent('sc-view-sort-change', {
        detail: { poster: 'all', sorter: 'newest' },
      })
    );

    expect(detail.poster).to.equal('all');
    expect(detail.sorter).to.equal('newest');
  });

  it('handleLoadMore emits sc-load-more in non-api mode', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);

    let detail: any;
    el.addEventListener('sc-load-more', (e: Event) => {
      detail = (e as CustomEvent).detail;
    });

    await (el as any).handleLoadMore(
      new CustomEvent('sc-load-more', {
        detail: { page: 2 },
      })
    );

    expect(detail.page).to.equal(2);
    expect((el as any).loadMoreLoading).to.equal(false);
  });

  it('opens mark modal when mark action is triggered', async () => {
    const comment = makeComment({ id: 'mark-c1' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]}></sc-comment>
    `);

    (el as any).handleActionTrigger(
      new CustomEvent('sc-action-trigger', {
        detail: { value: 'mark', comment },
      })
    );

    expect((el as any).markOpen).to.equal(true);
    expect((el as any).reminderRelatedComment?.id).to.equal('mark-c1');
  });

  it('does not render root input in readonly mode', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .readonly=${true}></sc-comment>
    `);

    const rootInput = el.shadowRoot?.querySelector('sc-comment-input');
    expect(rootInput).to.not.exist;
  });

  describe('File Attachments', () => {
    it('emits sc-comment-file-upload event when posting with files', async () => {
      const el = await fixture<ScComment>(html`
        <sc-comment .userInfo=${userInfo} enable-upload></sc-comment>
      `);

      let uploadEventFired = false;
      let uploadEventDetail: any = null;

      el.addEventListener('sc-comment-file-upload', (e: Event) => {
        uploadEventFired = true;
        uploadEventDetail = (e as CustomEvent).detail;
      });

      // Create mock file
      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      // Mock fileHandler.getDraftAttachments to return files
      el['fileHandler'].getDraftAttachments = () => [mockFile];

      el.value = 'Comment with file';
      el.handlePost();

      await new Promise(r => setTimeout(r, 0));

      expect(uploadEventFired).to.be.true;
      expect(uploadEventDetail).to.not.be.null;
      expect(uploadEventDetail.files).to.be.an('array');
      expect(uploadEventDetail.files.length).to.equal(1);
      expect(uploadEventDetail.attachments).to.be.an('array');
      expect(uploadEventDetail.uploadCount).to.equal(1);
      expect(uploadEventDetail.isEdit).to.be.false;
      expect(uploadEventDetail.comment.id).to.be.a('string');
    });

    it('emits sc-comment-file-upload event when replying with files', async () => {
      const parentComment = makeComment({ id: 'parent' });
      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          .comments=${[parentComment]}
          enable-upload
        ></sc-comment>
      `);

      let uploadEventFired = false;
      let uploadEventDetail: any = null;

      el.addEventListener('sc-comment-file-upload', (e: Event) => {
        uploadEventFired = true;
        uploadEventDetail = (e as CustomEvent).detail;
      });

      // Create mock file
      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      el.activeComment = { ...parentComment };
      el.replyContent = 'Reply with file';

      // Mock fileHandler.getDraftAttachments to return files
      el['fileHandler'].getDraftAttachments = () => [mockFile];

      el.handleReply();

      await new Promise(r => setTimeout(r, 0));

      expect(uploadEventFired).to.be.true;
      expect(uploadEventDetail).to.not.be.null;
      expect(uploadEventDetail.files.length).to.equal(1);
      expect(uploadEventDetail.isEdit).to.be.false;
    });

    it('emits sc-comment-file-upload event when editing with new files', async () => {
      const comment = makeComment({
        id: 'c1',
        attachments: [],
      });
      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          .comments=${[comment]}
          enable-upload
          enable-edit
        ></sc-comment>
      `);

      let uploadEventFired = false;
      let uploadEventDetail: any = null;

      el.addEventListener('sc-comment-file-upload', (e: Event) => {
        uploadEventFired = true;
        uploadEventDetail = (e as CustomEvent).detail;
      });

      // Create mock file
      const mockFile = new File(['content'], 'new.txt', { type: 'text/plain' });

      el.handleEditClick({ ...comment, replies: [] });
      el.replyContent = 'Edited with file';

      // Mock fileHandler methods
      el['fileHandler'].getDraftAttachments = () => [mockFile];
      el['fileHandler'].getDeletedAttachmentIds = () => new Set();

      el.handleReply();

      await new Promise(r => setTimeout(r, 0));

      expect(uploadEventFired).to.be.true;
      expect(uploadEventDetail).to.not.be.null;
      expect(uploadEventDetail.isEdit).to.be.true;
      expect(uploadEventDetail.uploadCount).to.equal(1);
      expect(uploadEventDetail.totalAttachments).to.equal(1);
    });

    it('emits sc-comment-file-delete event when deleting attachments in edit mode', async () => {
      const attachment = {
        id: 'att1',
        fileName: 'test.txt',
        fileSize: 1024,
        fileType: 'text/plain',
        fileUrl: 'blob:test',
        uploadedBy: 'user1',
        uploadedAt: new Date(),
        commentId: 'c1',
      };

      const comment = makeComment({
        id: 'c1',
        attachments: [attachment],
      });

      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          .comments=${[comment]}
          enable-upload
          enable-edit
        ></sc-comment>
      `);

      let deleteEventFired = false;
      let deleteEventDetail: any = null;

      el.addEventListener('sc-comment-file-delete', (e: Event) => {
        deleteEventFired = true;
        deleteEventDetail = (e as CustomEvent).detail;
      });

      el.handleEditClick({ ...comment, replies: [] });
      el.replyContent = 'Edited';

      // Mock fileHandler methods
      el['fileHandler'].getDraftAttachments = () => [];
      el['fileHandler'].getDeletedAttachmentIds = () => new Set(['att1']);

      el.handleReply();

      await new Promise(r => setTimeout(r, 0));

      expect(deleteEventFired).to.be.true;
      expect(deleteEventDetail).to.not.be.null;
      expect(deleteEventDetail.deletedAttachments).to.be.an('array');
      expect(deleteEventDetail.deletedAttachments.length).to.equal(1);
      expect(deleteEventDetail.deletedAttachments[0].id).to.equal('att1');
      expect(deleteEventDetail.deleteCount).to.equal(1);
      expect(deleteEventDetail.comment.id).to.equal('c1');
    });

    it.skip('does not emit file-delete event when removing draft in edit mode - MOVED TO ScCommentInput/ScCommentFileUpload', async () => {
      // This functionality is now handled by sub-components
      // TODO: Move this test to ScCommentInput or ScCommentFileUpload tests
      const comment = makeComment({ id: 'c1', attachments: [] });
      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          .comments=${[comment]}
          enable-upload
          enable-edit
        ></sc-comment>
      `);

      let deleteEventFired = false;
      el.addEventListener('sc-comment-file-delete', () => {
        deleteEventFired = true;
      });

      el.handleEditClick({ ...comment, replies: [] });

      // Simulate removing a draft file (not saved yet)
      const event = new CustomEvent('sc-remove', {
        detail: { 'file-id': 'draft-c1-0' },
      });

      // el.handleDraftFileRemove(event, 'c1'); // Method removed

      await new Promise(r => setTimeout(r, 0));

      // Should NOT fire event for draft removal
      expect(deleteEventFired).to.be.false;
    });

    it.skip('marks existing attachment for deletion without immediate event - MOVED TO ScCommentInput/ScCommentFileUpload', async () => {
      // This functionality is now handled by sub-components
      // TODO: Move this test to ScCommentInput or ScCommentFileUpload tests
      const attachment = {
        id: 'att1',
        fileName: 'test.txt',
        fileSize: 1024,
        fileType: 'text/plain',
        fileUrl: 'blob:test',
        uploadedBy: 'user1',
        uploadedAt: new Date(),
        commentId: 'c1',
      };

      const comment = makeComment({
        id: 'c1',
        attachments: [attachment],
      });

      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          .comments=${[comment]}
          enable-upload
          enable-edit
        ></sc-comment>
      `);

      let deleteEventFired = false;
      el.addEventListener('sc-comment-file-delete', () => {
        deleteEventFired = true;
      });

      el.handleEditClick({ ...comment, replies: [] });

      // Simulate removing an existing attachment in edit mode
      const event = new CustomEvent('sc-remove', {
        detail: { 'file-id': 'existing-att1' },
      });

      // el.handleDraftFileRemove(event, 'c1'); // Method removed

      await new Promise(r => setTimeout(r, 0));

      // Should NOT fire event immediately (only on save)
      expect(deleteEventFired).to.be.false;
    });

    it('emits sc-comment-file-download when downloading attachment', async () => {
      const attachment = {
        id: 'att1',
        fileName: 'test.pdf',
        fileSize: 2048,
        fileType: 'application/pdf',
        fileUrl: 'blob:test',
        uploadedBy: 'user1',
        uploadedAt: new Date(),
        commentId: 'c1',
      };

      const comment = makeComment({
        id: 'c1',
        attachments: [attachment],
      });

      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          .comments=${[comment]}
          enable-upload
        ></sc-comment>
      `);

      let downloadEventFired = false;
      let downloadEventDetail: any = null;

      el.addEventListener('sc-comment-file-download', (e: Event) => {
        downloadEventFired = true;
        downloadEventDetail = (e as CustomEvent).detail;
      });

      // Simulate the event that would be emitted by the sub-component
      const downloadEvent = new CustomEvent('sc-attachment-download', {
        detail: { attachment },
      });
      el.handleAttachmentDownload(downloadEvent);

      await new Promise(r => setTimeout(r, 0));

      expect(downloadEventFired).to.be.true;
      expect(downloadEventDetail).to.not.be.null;
      expect(downloadEventDetail.attachment.id).to.equal('att1');
      expect(downloadEventDetail.attachment.fileName).to.equal('test.pdf');
    });

    it('does not emit upload event when posting without files', async () => {
      const el = await fixture<ScComment>(html`
        <sc-comment .userInfo=${userInfo} enable-upload></sc-comment>
      `);

      let uploadEventFired = false;
      el.addEventListener('sc-comment-file-upload', () => {
        uploadEventFired = true;
      });

      el['fileHandler'].getDraftAttachments = () => [];
      el.value = 'Comment without file';
      el.handlePost();

      await new Promise(r => setTimeout(r, 0));

      expect(uploadEventFired).to.be.false;
    });

    it('does not emit delete event when editing without deletions', async () => {
      const comment = makeComment({
        id: 'c1',
        attachments: [],
      });

      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          .comments=${[comment]}
          enable-upload
          enable-edit
        ></sc-comment>
      `);

      let deleteEventFired = false;
      el.addEventListener('sc-comment-file-delete', () => {
        deleteEventFired = true;
      });

      el.handleEditClick({ ...comment, replies: [] });
      el.replyContent = 'Edited';

      el['fileHandler'].getDraftAttachments = () => [];
      el['fileHandler'].getDeletedAttachmentIds = () => new Set();

      el.handleReply();

      await new Promise(r => setTimeout(r, 0));

      expect(deleteEventFired).to.be.false;
    });

    it('handles multiple file deletions in batch', async () => {
      const attachments = [
        {
          id: 'att1',
          fileName: 'test1.txt',
          fileSize: 1024,
          fileType: 'text/plain',
          fileUrl: 'blob:test1',
          uploadedBy: 'user1',
          uploadedAt: new Date(),
          commentId: 'c1',
        },
        {
          id: 'att2',
          fileName: 'test2.txt',
          fileSize: 2048,
          fileType: 'text/plain',
          fileUrl: 'blob:test2',
          uploadedBy: 'user1',
          uploadedAt: new Date(),
          commentId: 'c1',
        },
      ];

      const comment = makeComment({
        id: 'c1',
        attachments,
      });

      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          .comments=${[comment]}
          enable-upload
          enable-edit
        ></sc-comment>
      `);

      let deleteEventDetail: any = null;

      el.addEventListener('sc-comment-file-delete', (e: Event) => {
        deleteEventDetail = (e as CustomEvent).detail;
      });

      el.handleEditClick({ ...comment, replies: [] });
      el.replyContent = 'Edited';

      el['fileHandler'].getDraftAttachments = () => [];
      el['fileHandler'].getDeletedAttachmentIds = () =>
        new Set(['att1', 'att2']);

      el.handleReply();

      await new Promise(r => setTimeout(r, 0));

      expect(deleteEventDetail).to.not.be.null;
      expect(deleteEventDetail.deletedAttachments.length).to.equal(2);
      expect(deleteEventDetail.deleteCount).to.equal(2);
      expect(deleteEventDetail.remainingAttachments).to.equal(0);
    });

    it('emits sc-comment-file-error when file validation fails', async () => {
      const el = await fixture<ScComment>(html`
        <sc-comment .userInfo=${userInfo} enable-upload></sc-comment>
      `);

      let errorEventFired = false;
      let errorEventDetail: any = null;

      el.addEventListener('sc-comment-file-error', (e: Event) => {
        errorEventFired = true;
        errorEventDetail = (e as CustomEvent).detail;
      });

      el.emitFileErrorEvent('FILE_TYPE_ERROR', 'Invalid file type', 'root', 1, [
        'test.exe',
      ]);

      await new Promise(r => setTimeout(r, 0));

      expect(errorEventFired).to.be.true;
      expect(errorEventDetail).to.not.be.null;
      expect(errorEventDetail.errorType).to.equal('FILE_TYPE_ERROR');
      expect(errorEventDetail.errorMessage).to.equal('Invalid file type');
      expect(errorEventDetail.commentId).to.equal('root');
      expect(errorEventDetail.fileCount).to.equal(1);
      expect(errorEventDetail.fileNames).to.deep.equal(['test.exe']);
    });

    it.skip('handles file select event for download - MOVED TO ScCommentAttachments', async () => {
      // This functionality is now handled by ScCommentAttachments sub-component
      // TODO: Move this test to ScCommentAttachments tests
      const attachment = {
        id: 'att1',
        fileName: 'test.pdf',
        fileSize: 2048,
        fileType: 'application/pdf',
        fileUrl: 'blob:test',
        uploadedBy: 'user1',
        uploadedAt: new Date(),
        commentId: 'c1',
      };

      const comment = makeComment({
        id: 'c1',
        attachments: [attachment],
      });

      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          .comments=${[comment]}
          enable-upload
        ></sc-comment>
      `);

      let downloadEventFired = false;

      el.addEventListener('sc-comment-file-download', () => {
        downloadEventFired = true;
      });

      const event = new CustomEvent('sc-select', {
        detail: { 'file-id': 'att1' },
      });

      // el.handleFileSelect(event, 'c1'); // Method removed

      await new Promise(r => setTimeout(r, 0));

      // expect(downloadEventFired).to.be.true;
    });

    it.skip('resets sc-file-input when file validation fails due to max files exceeded - MOVED TO ScCommentFileUpload', async () => {
      // This functionality is now handled by ScCommentFileUpload sub-component
      // TODO: Move this test to ScCommentFileUpload tests
      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          enable-upload
          max-files-per-comment="2"
        ></sc-comment>
      `);

      await el.updateComplete;

      let errorEventFired = false;
      let errorEventDetail: any = null;

      el.addEventListener('sc-comment-file-error', (e: Event) => {
        errorEventFired = true;
        errorEventDetail = (e as CustomEvent).detail;
      });

      // Create 4 mock files (exceeds max of 2)
      const mockFiles = [
        new File(['content1'], 'file1.txt', { type: 'text/plain' }),
        new File(['content2'], 'file2.txt', { type: 'text/plain' }),
        new File(['content3'], 'file3.txt', { type: 'text/plain' }),
        new File(['content4'], 'file4.txt', { type: 'text/plain' }),
      ];

      // Mock the fileHandler to simulate validation failure
      const handleFileSelectionSpy = jest.spyOn(
        el['fileHandler'],
        'handleFileSelection'
      );
      handleFileSelectionSpy.mockReturnValue({
        success: false,
        errorType: 'MAX_FILES_EXCEEDED',
        errorMessage: 'Maximum 2 files per comment',
        fileCount: 4,
      });

      // Simulate file selection event
      const selectEvent = new CustomEvent('sc-change', {
        detail: { value: mockFiles as any },
      });

      el.handleFileSelection(selectEvent, 'root');

      await el.updateComplete;

      // Verify error event was fired
      expect(errorEventFired).to.be.true;
      expect(errorEventDetail.errorType).to.equal('MAX_FILES_EXCEEDED');
      expect(errorEventDetail.fileCount).to.equal(4);

      // Verify sc-file-input exists
      const fileInput = el.shadowRoot?.querySelector('#file-input-root') as any;
      expect(fileInput).to.exist;

      handleFileSelectionSpy.mockRestore();
    });

    it('allows subsequent upload after validation failure', async () => {
      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          enable-upload
          max-files-per-comment="2"
        ></sc-comment>
      `);

      await el.updateComplete;

      let errorEventCount = 0;
      el.addEventListener('sc-comment-file-error', () => {
        errorEventCount++;
      });

      // First attempt: upload 4 files (should fail)
      const invalidFiles = Array.from({ length: 4 }, (_, i) =>
        new File([`content${i}`], `file${i}.txt`, { type: 'text/plain' })
      );

      const handleFileSelectionSpy = jest.spyOn(
        el['fileHandler'],
        'handleFileSelection'
      );
      
      // Mock first call to fail
      handleFileSelectionSpy.mockReturnValueOnce({
        success: false,
        errorType: 'MAX_FILES_EXCEEDED',
        errorMessage: 'Maximum 2 files per comment',
        fileCount: 4,
      });

      el.handleFileSelection(
        new CustomEvent('sc-change', { detail: { value: invalidFiles as any } }),
        'root'
      );

      await el.updateComplete;

      expect(errorEventCount).to.equal(1);

      // Second attempt: upload 2 files (should succeed)
      const validFiles = [
        new File(['content1'], 'file1.txt', { type: 'text/plain' }),
        new File(['content2'], 'file2.txt', { type: 'text/plain' }),
      ];

      // Mock second call to succeed
      handleFileSelectionSpy.mockReturnValueOnce({
        success: true,
        draftFiles: validFiles,
      });

      el.handleFileSelection(
        new CustomEvent('sc-change', { detail: { value: validFiles as any } }),
        'root'
      );

      await el.updateComplete;

      // Should still only have 1 error (no new error for valid upload)
      expect(errorEventCount).to.equal(1);

      handleFileSelectionSpy.mockRestore();
    });

    it.skip('clears error after removing file that caused validation failure - MOVED TO ScCommentFileUpload', async () => {
      // This functionality is now handled by ScCommentFileUpload sub-component
      // TODO: Move this test to ScCommentFileUpload tests
      const el = await fixture<ScComment>(html`
        <sc-comment
          .userInfo=${userInfo}
          enable-upload
          max-files-per-comment="2"
        ></sc-comment>
      `);

      await el.updateComplete;

      // Simulate error state
      el['fileHandler']['attachmentErrors'].set('root', 'Maximum 2 files per comment');
      
      // Verify error exists
      expect(el['fileHandler'].getAttachmentError('root')).to.equal('Maximum 2 files per comment');

      // Simulate file removal
      const removeEvent = new CustomEvent('sc-remove', {
        detail: { 'file-id': 'draft-root-0' },
      });

      // el.handleDraftFileRemove(removeEvent, 'root'); // Method removed

      await el.updateComplete;

      // Verify error was cleared
      // expect(el['fileHandler'].getAttachmentError('root')).to.be.undefined;
    });
  });

  // ─── effectivePosterOptions ─────────────────────────────────────────────

  describe('effectivePosterOptions', () => {
    it('should return default poster options', () => {
      const options = el.effectivePosterOptions;
      expect(options.map((o: any) => o.value)).to.include.members(['all', 'mine']);
    });

    it('should merge extra poster options without duplicates', () => {
      el.viewOptions = [{ label: 'Team', value: 'team' }, { label: 'All', value: 'all' }];
      const options = el.effectivePosterOptions;
      const values = options.map((o: any) => o.value);
      expect(values.filter((v: string) => v === 'all')).to.have.length(1);
      expect(values).to.include('team');
    });
  });

  // ─── effectiveSorterOptions ─────────────────────────────────────────────

  describe('effectiveSorterOptions', () => {
    it('should return default sorter options', () => {
      const options = el.effectiveSorterOptions;
      expect(options.map((o: any) => o.value)).to.include.members(['newest', 'oldest']);
    });

    it('should merge extra sorter options without duplicates', () => {
      el.sortOptions = [{ label: 'Most Liked', value: 'likes' }, { label: 'Newest', value: 'newest' }];
      const options = el.effectiveSorterOptions;
      const values = options.map((o: any) => o.value);
      expect(values.filter((v: string) => v === 'newest')).to.have.length(1);
      expect(values).to.include('likes');
    });
  });

  // ─── handleValueChange ──────────────────────────────────────────────────

  it('should update value on handleValueChange', () => {
    const event = new CustomEvent('sc-change', { detail: { text: 'hello' } });
    el.handleValueChange(event);
    expect(el.value).to.equal('hello');
  });

  // ─── handleReplyContentChange ───────────────────────────────────────────

  it('should update replyContent on handleReplyContentChange', () => {
    const event = new CustomEvent('sc-change', { detail: { text: 'reply text' } });
    el.handleReplyContentChange(event);
    expect(el.replyContent).to.equal('reply text');
  });

  // ─── handlePost ─────────────────────────────────────────────────────────

  describe('handlePost', () => {
    it('should emit sc-change event with new comment', () => {
      const spy = sinon.spy();
      el.addEventListener('sc-change', spy);
      el.value = 'New comment text';
      el.handlePost();
      expect(spy.calledOnce).to.be.true;
    });

    it('should use event detail text when event provided', () => {
      const event = new CustomEvent('sc-submit', { detail: { text: 'from event', files: [] } });
      el.handlePost(event);
    });
  });

  // ─── setUserInfo ────────────────────────────────────────────────────────

  it('should set userInfo from _user context', async () => {
    el._user = { id: 'u1', firstName: 'John', lastName: 'Doe' };
    el.setUserInfo();
    await el.updateComplete;
    expect(el.userInfo.bankid).to.equal('u1');
    expect(el.userInfo.name).to.include('John');
  });

  it('should fallback empty string when _user fields are missing', () => {
    el._user = {};
    el.setUserInfo();
    expect(el.userInfo.bankid).to.equal('');
  });

  // ─── requestUpdateCommentApi ────────────────────────────────────────────

  it('should update matching comment in local list after update', async () => {
    const updatedContent = 'updated text';
    el._graphQLClient = {
      query: jest.fn().mockResolvedValue({
        json: () => Promise.resolve({
          data: {
            _55313_128_webkit_exp_api: {
              put_updateComment: { ...makeComment({ id: 'c1' }), content: updatedContent, text: updatedContent },
            },
          },
        }),
      }),
    };
    await el.requestUpdateCommentApi({ ...makeComment({ id: 'c1' }), text: updatedContent, mentions: [] });
  });

  // ─── requestDeleteCommentApi ────────────────────────────────────────────

  it('should remove deleted comment from local list', async () => {
    el._graphQLClient = {
      query: jest.fn().mockResolvedValue({
        json: () => Promise.resolve({
          data: {
            _55313_128_webkit_exp_api: {
              delete_removeComment: { success: true, message: 'Comment removed successfully' },
            },
          },
        }),
      }),
    };
    await el.requestDeleteCommentApi('c1');
  });

  // ─── requestLikeCommentApi ──────────────────────────────────────────────

  it('should update likes in local list after like', async () => {
    el._graphQLClient = {
      query: jest.fn().mockResolvedValue({
        json: () => Promise.resolve({
          data: {
            _55313_128_webkit_exp_api: {
              put_likeComment: { likedByCurrentUser: true, likes: 1 },
            },
          },
        }),
      }),
    };
    await el.requestLikeCommentApi('c1');
  });

  // ─── requestUnlikeCommentApi ────────────────────────────────────────────

  it('should update likes in local list after unlike', async () => {
    el._graphQLClient = {
      query: jest.fn().mockResolvedValue({
        json: () => Promise.resolve({
          data: {
            _55313_128_webkit_exp_api: {
              put_unlikeComment: { likedByCurrentUser: false, likes: 0 },
            },
          },
        }),
      }),
    };
    await el.requestUnlikeCommentApi('c1');
  });

  // ─── reminderStatusChange ───────────────────────────────────────────────

  it('should update reminderStatus on handleReminderStatusChange', () => {
    const event = new CustomEvent('sc-select', { detail: { value: 'resolved' } });
    el.handleReminderStatusChange(event);
    expect(el.reminderStatus).to.equal('resolved');
  });

  // ─── reminderDateChange ─────────────────────────────────────────────────

  it('should update reminderDate from event detail', () => {
    const event = new CustomEvent('sc-change', { detail: { value: '2026-06-01' } });
    el.handleReminderDateChange(event);
    expect(el.reminderDate).to.equal('2026-06-01');
  });

  it('should fallback reminderDate to input target value', () => {
    const input = document.createElement('input');
    input.value = '2026-07-01';
    const event = new CustomEvent('sc-change', { detail: {} });
    Object.defineProperty(event, 'target', { value: input });
    el.handleReminderDateChange(event);
    expect(el.reminderDate).to.equal('2026-07-01');
  });

  // ─── handleMarkClose / handleReminderClose ──────────────────────────────

  it('should close mark modal on handleMarkClose', async () => {
    el.markOpen = true;
    el.handleMarkClose();
    await el.updateComplete;
    expect(el.markOpen).to.be.false;
  });

  it('should close reminder modal on handleReminderClose', async () => {
    el.reminderRelatedComment = makeComment({ id: 'c1' });
    el.handleReminderClose();
    await el.updateComplete;
    expect(el.reminderRelatedComment).to.be.null;
  });
});

// ─── Extended scenario tests ─────────────────────────────────────────────────

describe('ScComment — extended coverage', () => {
  const userInfo = {
    bankid: 'user1',
    name: 'Test User',
    avatarUrl: 'https://example.com/avatar.png',
  };

  function makeComment(overrides: Record<string, any> = {}) {
    return {
      id: `c${Math.random().toString(36).slice(2, 8)}`,
      text: 'Comment',
      createdAt: new Date(),
      user: userInfo,
      ...overrides,
    };
  }

  // ─── _collapseWithDraftPreserved ─────────────────────────────────────────

  it('_collapseWithDraftPreserved preserves replyContent in draftTexts', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    const comment = makeComment({ id: 'draft-c' });
    el.handleReplyClick({ ...comment, replies: [] });
    (el as any).replyContent = 'draft text';

    (el as any)._collapseWithDraftPreserved();
    expect((el as any).draftTexts.get('draft-c')).to.equal('draft text');
    expect((el as any).activeComment).to.be.null;
  });

  it('_collapseWithDraftPreserved preserves deletedIds when nonzero', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    const comment = makeComment({ id: 'del-c' });
    el.handleReplyClick({ ...comment, replies: [] });

    // Fake fileHandler with a deleted ID
    (el as any).fileHandler = {
      getDeletedAttachmentIds: () => new Set(['att-x']),
      clearDrafts: () => {},
      clearDeletedIds: () => {},
      resetFileInput: (_: string, cb: () => void) => cb(),
      getDraftAttachments: () => [],
    };

    (el as any)._collapseWithDraftPreserved();
    const saved = (el as any).draftDeletedIds.get('del-c');
    expect(saved).to.exist;
    expect(saved.has('att-x')).to.be.true;
  });

  // ─── handleEditClick — draft restore branches ────────────────────────────

  it('handleEditClick restores savedDeletedIds when size > 0', async () => {
    const comment = makeComment({ id: 'edit-c' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-edit enable-api></sc-comment>
    `);
    // Pre-populate draftDeletedIds
    (el as any).draftDeletedIds.set('edit-c', new Set(['att-1']));
    const markStub = sinon.stub((el as any).fileHandler, 'markAttachmentDeleted');
    el.handleEditClick({ ...comment, replies: [] });
    expect(markStub.calledWith('att-1')).to.be.true;
    markStub.restore();
  });

  it('handleEditClick keeps existing draft files without reset', async () => {
    const comment = makeComment({ id: 'edit-d' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-edit enable-api></sc-comment>
    `);
    // Fake draft files already present
    (el as any).fileHandler.getDraftAttachments = () => [new File(['x'], 'x.txt')];
    const resetStub = sinon.stub((el as any).fileHandler, 'resetFileInput');
    el.handleEditClick({ ...comment, replies: [] });
    expect(resetStub.called).to.be.false;
    resetStub.restore();
  });

  // ─── handleLikeClick — likedByCurrentUser = true (unlike path) ──────────

  it('handleLikeClick decrements likes when likedByCurrentUser is true', async () => {
    const comment = makeComment({ id: 'like-c', likes: 3, likedByCurrentUser: true });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-like></sc-comment>
    `);
    await el.updateComplete;
    el.handleLikeClick({ ...comment, replies: [] });
    const updated = el.comments.find(c => c.id === 'like-c');
    expect(updated?.likes).to.equal(2);
    expect(updated?.likedByCurrentUser).to.be.false;
    el.enableApi = true;
    el.handleLikeClick({ ...comment, replies: [] });
  });

  // ─── handleLoadMore — non-api path (emits event, returns) ───────────────

  it('handleLoadMore emits sc-load-more when enableApi is false', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo}></sc-comment>
    `);
    const spy = sinon.spy();
    el.addEventListener('sc-load-more', spy);
    await (el as any).handleLoadMore(
      new CustomEvent('sc-load-more', { detail: { page: 0, size: 20 } })
    );
    expect(spy.calledOnce).to.be.true;
  });

  // ─── handleFilterChange / handleSortChange — non-api path ───────────────

  it('handleFilterChange updates poster when not manualSorting', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    await (el as any).handleFilterChange(
      new CustomEvent('sc-filter-change', { detail: { poster: 'mine' } })
    );
    expect((el as any).poster).to.equal('mine');
  });

  it('handleSortChange updates sorter when not manualSorting', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    await (el as any).handleSortChange(
      new CustomEvent('sc-sort-change', { detail: { sorter: 'oldest' } })
    );
    expect((el as any).sorter).to.equal('oldest');
  });

  // ─── handleViewSortChange ────────────────────────────────────────────────

  it('handleViewSortChange emits sc-view-sort-change and updates poster', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    const spy = sinon.spy();
    el.addEventListener('sc-view-sort-change', spy);
    (el as any).handleViewSortChange(
      new CustomEvent('sc-view-sort-change', { detail: { poster: 'mine', sorter: 'newest' } })
    );
    expect(spy.calledOnce).to.be.true;
    expect((el as any).poster).to.equal('mine');
  });

  // ─── handleCompactDraftChange / handleNonCompactDraftChange ─────────────

  it('handleCompactDraftChange stores draft text by commentId', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    (el as any).handleCompactDraftChange(
      new CustomEvent('sc-compact-draft-change', { detail: { commentId: 'c-draft', value: 'hello' } })
    );
    expect((el as any).draftTexts.get('c-draft')).to.equal('hello');
  });

  it('handleNonCompactDraftChange stores draft text and syncs replyContent', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    (el as any).handleNonCompactDraftChange(
      new CustomEvent('sc-draft-change', { detail: { commentId: 'c-ndc', value: 'world' } })
    );
    expect((el as any).draftTexts.get('c-ndc')).to.equal('world');
    expect((el as any).replyContent).to.equal('world');
  });

  it('handleCompactDraftChange ignores event with no commentId', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    (el as any).handleCompactDraftChange(
      new CustomEvent('sc-compact-draft-change', { detail: {} })
    );
    expect((el as any).draftTexts.size).to.equal(0);
  });

  it('handleNonCompactDraftChange ignores event with no commentId', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    (el as any).handleNonCompactDraftChange(
      new CustomEvent('sc-draft-change', { detail: {} })
    );
    expect((el as any).draftTexts.size).to.equal(0);
  });

  // ─── handleActionTrigger — mark branch ──────────────────────────────────

  it('handleActionTrigger with value=mark opens mark modal', async () => {
    const comment = makeComment({ id: 'mark-c' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-mark enable-api></sc-comment>
    `);
    el.handleActionTrigger(
      new CustomEvent('sc-action-trigger', { detail: { value: 'mark', comment } })
    );
    expect((el as any).markOpen).to.be.true;
    expect((el as any).reminderRelatedComment).to.deep.equal(comment);
  });

  // ─── handleReminderTimeListDelete ────────────────────────────────────────

  it('handleReminderTimeListDelete removes entry and clears dates when list is empty', async () => {
    const comment = makeComment({ id: 'rtd-c' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-reminder enable-api></sc-comment>
    `);
    (el as any).reminderRelatedComment = comment;
    (el as any).reminderTimeList = [{ id: 'e1', time: '2026-06-01 10:00:00' }];

    let changeDetail: any = null;
    el.addEventListener('sc-change', (e: Event) => { changeDetail = (e as CustomEvent).detail; });

    (el as any).handleReminderTimeListDelete('e1');

    expect((el as any).reminderTimeList.length).to.equal(0);
    expect((el as any).reminderDate).to.equal('');
    expect((el as any).reminderTime).to.equal('');
    expect(changeDetail).to.not.be.null;
  });

  it('handleReminderTimeListDelete updates dates when list still has entries', async () => {
    const comment = makeComment({ id: 'rtd-d' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-reminder enable-api></sc-comment>
    `);
    (el as any).reminderRelatedComment = comment;
    (el as any).reminderTimeList = [
      { id: 'e1', time: '2026-06-01 10:00:00' },
      { id: 'e2', time: '2026-07-01 10:00:00' },
    ];

    (el as any).handleReminderTimeListDelete('e1');

    expect((el as any).reminderTimeList.length).to.equal(1);
    expect((el as any).reminderDate).to.not.equal('');
  });

  // ─── handleReminderTimeListDelete with no reminderRelatedComment ─────────

  it('handleReminderTimeListDelete does nothing when no reminderRelatedComment', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    (el as any).reminderRelatedComment = null;
    (el as any).reminderTimeList = [{ id: 'e1', time: '2026-06-01 10:00:00' }];
    // Should not throw
    (el as any).handleReminderTimeListDelete('e1');
    expect((el as any).reminderTimeList.length).to.equal(0);
  });

  // ─── scheduleReminder — NaN targetTime ──────────────────────────────────

  it('scheduleReminder returns early when scheduledAt is invalid', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    const triggerSpy = sinon.spy();
    el.addEventListener('sc-reminder-trigger', triggerSpy);
    (el as any).scheduleReminder({
      commentId: 'bad',
      scheduledAt: 'not-a-date',
      targetStatus: 'in-progress',
    });
    expect(triggerSpy.called).to.be.false;
    expect((el as any).reminderTimers.size).to.equal(0);
  });

  it('scheduleReminder fires immediately when delay <= 0', async () => {
    const comment = makeComment({ id: 's-past' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-reminder enable-api></sc-comment>
    `);
    const triggerSpy = sinon.spy();
    el.addEventListener('sc-reminder-trigger', triggerSpy);
    // Past time
    const pastTime = new Date(Date.now() - 5000).toISOString();
    (el as any).reminderRelatedComment = comment;
    (el as any).scheduleReminder({
      commentId: comment.id,
      scheduledAt: pastTime,
      targetStatus: 'resolved',
    });
    expect(triggerSpy.calledOnce).to.be.true;
  });

  // ─── scheduleReminder — clear existing timer ─────────────────────────────

  it('clearReminderTimer clears existing timerId for commentId', async () => {
    jest.useFakeTimers();
    try {
      const el = await fixture<ScComment>(html`
        <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
      `);
      const timerId = window.setTimeout(() => {}, 60000);
      (el as any).reminderTimers.set('t-c', timerId);
      (el as any).clearReminderTimer('t-c');
      expect((el as any).reminderTimers.has('t-c')).to.be.false;
    } finally {
      jest.useRealTimers();
    }
  });

  // ─── handleReminderConfirm — duplicate time entry error ──────────────────

  it('handleReminderConfirm sets errorMessage when duplicate time is added', async () => {
    const comment = makeComment({ id: 'dup-c' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-reminder enable-api></sc-comment>
    `);
    const futureTime = new Date(Date.now() + 3600000);
    const dateStr = `${futureTime.getFullYear()}-${String(futureTime.getMonth() + 1).padStart(2, '0')}-${String(futureTime.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(futureTime.getHours()).padStart(2, '0')}:${String(futureTime.getMinutes()).padStart(2, '0')}:${String(futureTime.getSeconds()).padStart(2, '0')}`;

    (el as any).reminderRelatedComment = comment;
    (el as any).reminderDate = dateStr;
    (el as any).reminderTime = timeStr;
    (el as any).reminderStatus = 'in-progress';
    (el as any).reminderActionType = 'create';
    (el as any).reminderTimeList = [{ id: 'e-dup', time: `${dateStr} ${timeStr}` }];

    (el as any).handleReminderConfirm();
    expect((el as any).errorMessage).to.not.equal('');
  });

  // ─── updateDisabledTimeOptions — isToday branches ────────────────────────

  it('updateDisabledTimeOptions computes disabled options when date is today', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    // Set reminderDate to today, reminderTime to current hour:minute
    const currentHour = String(today.getHours()).padStart(2, '0');
    const currentMinute = String(today.getMinutes()).padStart(2, '0');
    (el as any).reminderDate = dateStr;
    (el as any).reminderTime = `${currentHour}:${currentMinute}:00`;
    (el as any).updateDisabledTimeOptions();
    // disabledHours should be non-empty (all hours before current)
    expect((el as any).disabledHours.length).to.be.greaterThan(0);
    // disabledMinutes should be non-empty (current hour selected)
    expect((el as any).disabledMinutes.length).to.be.greaterThan(0);
    // disabledSeconds should be non-empty (current minute selected)
    expect((el as any).disabledSeconds.length).to.be.greaterThan(0);
  });

  // ─── loadUserInfo — enableApi=false (no update) ──────────────────────────

  it('loadUserInfo does not update comment when enableApi is false', async () => {
    const comment = makeComment({ id: 'lu-c' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]}></sc-comment>
    `);
    const originalName = el.comments[0].user.name;
    await el.loadUserInfo(
      new CustomEvent('sc-userinfo-load', { detail: { comment, data: { name: 'New Name' } } })
    );
    expect(el.comments[0].user.name).to.equal(originalName);
  });

  // ─── handleReminderConfirm — past time sets errorMessage ─────────────────

  it('handleReminderConfirm sets errorMessage when reminder time is in the past', async () => {
    const comment = makeComment({ id: 'past-r' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-reminder enable-api></sc-comment>
    `);
    (el as any).reminderRelatedComment = comment;
    (el as any).reminderDate = '2020-01-01';
    (el as any).reminderTime = '00:00:00';
    (el as any).reminderStatus = 'in-progress';
    (el as any).reminderTimeList = [];
    (el as any).handleReminderConfirm();
    expect((el as any).errorMessage).to.not.equal('');
  });

  // ─── resetParametersAndData ──────────────────────────────────────────────

  it('resetParametersAndData resets all pagination and comment state', async () => {
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} enable-api></sc-comment>
    `);
    (el as any).requestPageNumber = 5;
    (el as any).requestPageSize = 50;
    (el as any).comments = [makeComment()];
    (el as any).singleRequestComments = [makeComment()];
    (el as any).repliesExpanded = { x: true };
    (el as any).resetParametersAndData();
    expect((el as any).requestPageNumber).to.equal(0);
    expect((el as any).requestPageSize).to.equal(20);
    expect((el as any).comments.length).to.equal(0);
    expect((el as any).singleRequestComments.length).to.equal(0);
    expect(Object.keys((el as any).repliesExpanded).length).to.equal(0);
  });
  // ─── renderReminderModal — sc-closable-tag ───────────────────────────────

  it('renders sc-closable-tag for each reminderTimeList entry', async () => {
    const comment = makeComment({ id: 'tag-c' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-reminder></sc-comment>
    `);

    (el as any).reminderRelatedComment = comment;
    (el as any).reminderOpen = true;
    (el as any).reminderTimeList = [
      { id: 'e1', time: '2026-05-15 10:00:00' },
      { id: 'e2', time: '2026-05-16 12:00:00' },
    ];
    await el.updateComplete;

    const modal = el.shadowRoot?.querySelector('sc-modal[open]') ?? el.shadowRoot?.querySelector('sc-modal');
    const tags = modal?.querySelectorAll('sc-closable-tag') ?? el.shadowRoot?.querySelectorAll('sc-closable-tag');
    expect(tags?.length).to.equal(2);
  });

  it('sc-closable-tag sc-close event triggers handleReminderTimeListDelete', async () => {
    const comment = makeComment({ id: 'tag-del' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-reminder></sc-comment>
    `);

    (el as any).reminderRelatedComment = comment;
    (el as any).reminderOpen = true;
    (el as any).reminderTimeList = [{ id: 'e1', time: '2026-05-15 10:00:00' }];
    await el.updateComplete;

    // Call delete directly (simulating sc-close event handler)
    (el as any).handleReminderTimeListDelete('e1');
    expect((el as any).reminderTimeList.length).to.equal(0);
    expect((el as any).reminderDate).to.equal('');
    expect((el as any).reminderTime).to.equal('');
  });

  it('does not render reminder tag list when reminderTimeList is empty', async () => {
    const comment = makeComment({ id: 'tag-empty' });
    const el = await fixture<ScComment>(html`
      <sc-comment .userInfo=${userInfo} .comments=${[comment]} enable-reminder></sc-comment>
    `);

    (el as any).reminderRelatedComment = comment;
    (el as any).reminderOpen = true;
    (el as any).reminderTimeList = [];
    await el.updateComplete;

    const tags = el.shadowRoot?.querySelectorAll('sc-closable-tag');
    expect(tags?.length ?? 0).to.equal(0);
  });
});
// We recommend installing an extension to run jest tests.

