import { fixture, html, expect } from '@open-wc/testing';
import '../../../elements/sc-comment.js';
import '../../../elements/sc-comment-compact-input.js';
import '../../../elements/sc-comment-file-upload.js';
import { ScCommentFileHandler } from '../../../src/components/ScComment/ScCommentFileHandler.js';
import { baseUser, imageAttachment, sampleComments } from './fixtures/comment-fixtures.js';
import { waitForEvent } from './helpers/event-helpers.js';

// Polyfill crypto.randomUUID for test environment
if (!globalThis.crypto?.randomUUID) {
  // @ts-ignore
  globalThis.crypto = globalThis.crypto || {};
  // @ts-ignore
  globalThis.crypto.randomUUID = () =>
    `test-uuid-${Math.random().toString(36).substring(2, 10)}` as any;
}

describe('ScComment enhancements', () => {
  const createFileList = (files: File[]): FileList => {
    const list: Partial<FileList> = {
      length: files.length,
      item: (index: number) => files[index] || null,
    };

    files.forEach((file, index) => {
      (list as any)[index] = file;
    });

    return list as FileList;
  };
  // T036: Integration/regression coverage is handled by these unit tests.
  it('emits full updated list on post (controlled model)', async () => {
    const el = (await fixture(html`
      <sc-comment .userInfo=${baseUser} .comments=${sampleComments}></sc-comment>
    `)) as HTMLElement & any;

    const eventPromise = waitForEvent(el as HTMLElement, 'sc-change');

    (el as any).handlePost(
      new CustomEvent('sc-submit', {
        detail: {
          text: 'New comment',
          files: [],
        },
      })
    );

    const event = (await eventPromise) as CustomEvent<any>;
    expect(event.detail.allComments).to.have.length(sampleComments.length + 1);
  });

  it('renders only host-provided list after external update', async () => {
    const el = (await fixture(html`
      <sc-comment .userInfo=${baseUser} .comments=${sampleComments}></sc-comment>
    `)) as HTMLElement & any;

    const updated = sampleComments.slice(0, 1);
    (el as any).comments = updated;
    await (el as any).updateComplete;

    const list = (el as any).shadowRoot?.querySelector('sc-comment-list');
    expect(list.comments).to.have.length(updated.length);
  });

  it('propagates toolbar tools to root and reply inputs', async () => {
    const tools = [{ name: 'bold' }];
    const el = (await fixture(html`
      <sc-comment
        .userInfo=${baseUser}
        .comments=${sampleComments}
        .toolbar=${tools}
      ></sc-comment>
    `)) as HTMLElement & any;

    const rootInput = el.shadowRoot?.querySelector('sc-comment-input') as any;
    expect(rootInput).to.exist;
    expect(rootInput.toolbar).to.equal(tools);

    (el as any).handleReplyClick(sampleComments[0]);
    await (el as any).updateComplete;

    const list = el.shadowRoot?.querySelector('sc-comment-list');
    const replyInput = list?.shadowRoot?.querySelector('sc-comment-input') as any;
    expect(replyInput).to.exist;
    expect(replyInput.toolbar).to.equal(tools);
  });

  it('renders compact reply/edit input when enabled', async () => {
    const el = (await fixture(html`
      <sc-comment
        .userInfo=${baseUser}
        .comments=${sampleComments}
        .compactReplyMode=${true}
      ></sc-comment>
    `)) as HTMLElement & any;

    (el as any).handleReplyClick(sampleComments[0]);
    await (el as any).updateComplete;

    const list = el.shadowRoot?.querySelector('sc-comment-list');
    const compactInput = list?.shadowRoot?.querySelector(
      'sc-comment-compact-input'
    );
    expect(compactInput).to.exist;
  });

  it('renders custom action labels and emits sc-action-trigger payload', async () => {
    // CommentAction uses { id, label: string, icon?: string, handler }
    const actions = [
      {
        id: 'pin',
        label: 'Pin',
        icon: 'pin',
        handler: () => undefined,
      },
    ];
    const el = (await fixture(html`
      <sc-comment
        .userInfo=${baseUser}
        .comments=${sampleComments}
        .moreActions=${actions}
      ></sc-comment>
    `)) as HTMLElement & any;

    await (el as any).updateComplete;

    const list = el.shadowRoot?.querySelector('sc-comment-list') as any;
    expect(list).to.exist;

    const menuItems = list.getCommentMoreActions(sampleComments[0]);
    const pinItem = menuItems.find((item: any) => item.value === 'pin');
    // With icon present, label is a TemplateResult; without icon it is the plain string
    expect(pinItem).to.exist;

    const eventPromise = waitForEvent(el as HTMLElement, 'sc-action-trigger');
    (el as any).handleActionTrigger(
      new CustomEvent('sc-action-trigger', {
        detail: {
          value: 'pin',
          comment: sampleComments[0],
        },
      })
    );

    const event = (await eventPromise) as CustomEvent<any>;
    expect(event.detail.value).to.equal('pin');
    expect(event.detail.comment.id).to.equal(sampleComments[0].id);
  });

  it('emits sc-reminder-trigger when reminder is due', async () => {
    const el = (await fixture(html`
      <sc-comment
        .userInfo=${baseUser}
        .comments=${sampleComments}
        .enableReminder=${true}
      ></sc-comment>
    `)) as HTMLElement & any;
    await el.updateComplete;

    // Use a past time: directly invoke scheduleReminder so delay <= 0 fires synchronously
    const pastIso = new Date(Date.now() - 5000).toISOString();
    const detail = {
      commentId: sampleComments[0].id,
      scheduledAt: pastIso,
      targetStatus: 'in-progress' as const,
    };
    (el as any).reminderRelatedComment = sampleComments[0];

    const eventPromise = waitForEvent(el as HTMLElement, 'sc-reminder-trigger');
    (el as any).scheduleReminder(detail);

    const event = (await eventPromise) as CustomEvent<any>;
    expect(event.detail.commentId).to.equal(sampleComments[0].id);
    expect(event.detail.targetStatus).to.equal('in-progress');
  });

  it('renders required reminder fields with labels', async () => {
    const el = (await fixture(html`
      <sc-comment
        .userInfo=${baseUser}
        .comments=${sampleComments}
        .enableReminder=${true}
      ></sc-comment>
    `)) as HTMLElement & any;

    (el as any).reminderOpen = true;
    (el as any).reminderRelatedComment = sampleComments[0];
    await (el as any).updateComplete;

    const dateInput = el.shadowRoot?.querySelector('sc-date-input');
    const timeInput = el.shadowRoot?.querySelector('sc-time-input');

    expect(dateInput?.getAttribute('label')).to.equal('Due date');
    expect(timeInput?.getAttribute('label')).to.equal('Due time');

    expect(dateInput?.hasAttribute('required')).to.equal(true);
    expect(timeInput?.hasAttribute('required')).to.equal(true);
  });

  it('toolbar receives built-in default options plus host-provided extras', async () => {
    // Built-in defaults (All/Mine, Newest/Oldest) are always injected.
    // Host-supplied extras are appended; values that duplicate a default are deduplicated.
    const extraPosterOption = { label: 'John Smith', value: 'johnsmith' };
    const extraSorterOption = { label: 'Most Replies', value: 'most-replies' };
    const el = (await fixture(html`
      <sc-comment
        .userInfo=${baseUser}
        .comments=${sampleComments}
        .viewOptions=${[extraPosterOption]}
        .sortOptions=${[extraSorterOption]}
      ></sc-comment>
    `)) as HTMLElement & any;

    const toolbar = el.shadowRoot?.querySelector('sc-comment-toolbar') as any;
    expect(toolbar).to.exist;

    // Toolbar should receive effectivePosterOptions: defaults + extras
    const posterValues = toolbar.viewOptions.map((o: any) => o.value);
    expect(posterValues).to.deep.equal(['all', 'mine', 'johnsmith']);

    const sorterValues = toolbar.sortOptions.map((o: any) => o.value);
    expect(sorterValues).to.deep.equal(['newest', 'oldest', 'most-replies']);
  });

  it('emits sc-toggle-replies with expanded state', async () => {
    const el = (await fixture(html`
      <sc-comment .userInfo=${baseUser} .comments=${sampleComments}></sc-comment>
    `)) as HTMLElement & any;

    const eventPromise = waitForEvent(el as HTMLElement, 'sc-toggle-replies');
    (el as any).toggleReplies(sampleComments[0].id);

    const event = (await eventPromise) as CustomEvent<any>;
    expect(event.detail.commentId).to.equal(sampleComments[0].id);
    expect(event.detail.expanded).to.equal(true);
  });

  it('renders image preview thumbnail and opens modal preview', async () => {
    const el = (await fixture(html`
      <sc-comment .userInfo=${baseUser} .comments=${sampleComments}></sc-comment>
    `)) as HTMLElement & any;

    await (el as any).updateComplete;

    (el as any).handleAttachmentPreview(
      new CustomEvent('sc-attachment-preview', {
        detail: {
          commentId: sampleComments[0].id,
          attachment: imageAttachment,
        },
      })
    );
    await (el as any).updateComplete;

    const modals = Array.from(el.shadowRoot?.querySelectorAll('sc-modal') || []);
    const previewModal = modals.find(
      modal => (modal as any).header === imageAttachment.fileName
    ) as any;

    expect(previewModal).to.exist;
    expect(previewModal.hasAttribute('open')).to.equal(true);
  });

  it('emits sc-compact-change and sc-submit for compact input', async () => {
    const el = (await fixture(html`
      <sc-comment-compact-input
        value=""
        placeholder="Reply"
        primaryLabel="Post"
        cancelLabel="Cancel"
      ></sc-comment-compact-input>
    `)) as HTMLElement & any;

    const changePromise = waitForEvent(el as HTMLElement, 'sc-compact-change');
    (el as any).handleInputChange(
      new CustomEvent('sc-input', { detail: { value: 'Hello' } })
    );
    const changeEvent = (await changePromise) as CustomEvent<any>;
    expect(changeEvent.detail.value).to.equal('Hello');

    let submitFired = false;
    el.addEventListener('sc-submit', () => {
      submitFired = true;
    });

    const submitButton = el.shadowRoot?.querySelector(
      'sc-button:not([type="secondary"])'
    ) as HTMLButtonElement | null;
    submitButton?.click();

    await (el as any).updateComplete;
    expect(submitFired).to.equal(true);
  });

  it('does not submit compact input when empty and emits cancel', async () => {
    const el = (await fixture(html`
      <sc-comment-compact-input
        value=""
        placeholder="Reply"
        primaryLabel="Post"
        cancelLabel="Cancel"
      ></sc-comment-compact-input>
    `)) as HTMLElement & any;

    let submitFired = false;
    el.addEventListener('sc-submit', () => {
      submitFired = true;
    });

    const submitButton = el.shadowRoot?.querySelector(
      'sc-button:not([type="secondary"])'
    ) as HTMLButtonElement | null;
    submitButton?.click();

    await (el as any).updateComplete;
    expect(submitFired).to.equal(false);

    // Cancel button is intentionally hidden in compact input; invoke handleCancel directly
    const cancelPromise = waitForEvent(el as HTMLElement, 'sc-cancel');
    (el as any).handleCancel();

    const cancelEvent = (await cancelPromise) as CustomEvent<any>;
    expect(cancelEvent.detail.value).to.equal('');
  });

  it('emits sc-file-error for invalid file type', async () => {
    const fileHandler = new ScCommentFileHandler(3, 'image/png');
    const el = (await fixture(html`
      <sc-comment-file-upload></sc-comment-file-upload>
    `)) as HTMLElement & any;

    el.commentId = 'c1';
    el.fileHandler = fileHandler;
    el.acceptedFileTypes = 'image/png';
    await (el as any).updateComplete;

    const invalidFile = new File(['bad'], 'bad.txt', { type: 'text/plain' });
    const files = createFileList([invalidFile]);

    const errorPromise = waitForEvent(el as HTMLElement, 'sc-file-error');
    (el as any).handleFileSelection(
      new CustomEvent('sc-change', { detail: { value: files } })
    );

    const errorEvent = (await errorPromise) as CustomEvent<any>;
    expect(errorEvent.detail.errorType).to.equal('INVALID_FILE_TYPE');
    expect(errorEvent.detail.commentId).to.equal('c1');
  });

  it('marks existing attachments deleted when clearing in edit mode', async () => {
    const fileHandler = new ScCommentFileHandler(3, 'image/png');
    const el = (await fixture(html`
      <sc-comment-file-upload></sc-comment-file-upload>
    `)) as HTMLElement & any;

    const existingAttachment = {
      id: 'att-1',
      commentId: 'c1',
      fileName: 'file.png',
      fileSize: 10,
      fileType: 'image/png',
      fileUrl: 'https://example.com/file.png',
    };

    el.commentId = 'c1';
    el.fileHandler = fileHandler;
    el.editMode = true;
    el.existingAttachments = [existingAttachment];
    await (el as any).updateComplete;

    const emptyFiles = createFileList([]);
    (el as any).handleFileSelection(
      new CustomEvent('sc-change', { detail: { value: emptyFiles } })
    );

    expect(fileHandler.getDeletedAttachmentIds().has('att-1')).to.equal(true);
  });

  it('renders draft image preview and removes draft attachment', async () => {
    const fileHandler = new ScCommentFileHandler(3, 'image/png');
    const el = (await fixture(html`
      <sc-comment-file-upload></sc-comment-file-upload>
    `)) as HTMLElement & any;

    el.commentId = 'c1';
    el.fileHandler = fileHandler;
    await (el as any).updateComplete;

    const imageFile = new File(['img'], 'image.png', { type: 'image/png' });
    const files = createFileList([imageFile]);
    fileHandler.handleFileSelection(files, 'c1', null);
    await (el as any).requestUpdate();
    await (el as any).updateComplete;

    const image = el.shadowRoot?.querySelector('.draft-image') as HTMLElement | null;
    expect(image).to.exist;

    (el as any).handleDraftFileRemove(
      new CustomEvent('sc-file-remove', { detail: { 'file-id': 'draft-c1-0' } })
    );

    expect(fileHandler.getDraftAttachments('c1')).to.have.length(0);
  });

  it('emits sc-attachment-preview for existing attachment', async () => {
    const fileHandler = new ScCommentFileHandler(3, 'image/png');
    const el = (await fixture(html`
      <sc-comment-file-upload></sc-comment-file-upload>
    `)) as HTMLElement & any;

    const existingAttachment = {
      id: 'att-2',
      commentId: 'c1',
      fileName: 'existing.png',
      fileSize: 10,
      fileType: 'image/png',
      fileUrl: 'https://example.com/existing.png',
    };

    el.commentId = 'c1';
    el.fileHandler = fileHandler;
    el.editMode = true;
    el.existingAttachments = [existingAttachment];
    await (el as any).updateComplete;

    const previewPromise = waitForEvent(el as HTMLElement, 'sc-attachment-preview');
    const button = el.shadowRoot?.querySelector(
      '.draft-image-button'
    ) as HTMLButtonElement | null;
    button?.click();

    const previewEvent = (await previewPromise) as CustomEvent<any>;
    expect(previewEvent.detail.commentId).to.equal('c1');
    expect(previewEvent.detail.attachment.id).to.equal('att-2');
  });
});
