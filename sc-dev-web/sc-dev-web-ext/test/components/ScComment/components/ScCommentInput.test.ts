import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCommentInput } from '../../../../src/components/ScComment/components/ScCommentInput/ScCommentInput.js';
import '../../../../elements/sc-comment-input.js';
import type { UserInfo } from '../../../../src/components/ScComment/ScComment.types.js';
import { ScCommentFileHandler } from '../../../../src/components/ScComment/ScCommentFileHandler.js';

describe('ScCommentInput', () => {
  const userInfo: UserInfo = {
    name: 'Test User',
    bankid: 'test-user-id',
    avatarUrl: 'https://example.com/avatar.jpg',
  };

  it('renders in post mode with Post button', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        mode="post"
        .value=${''}
        .fileHandler=${new ScCommentFileHandler(5)}
        .enableUpload=${true}
      ></sc-comment-input>
    `);
    
    await el.updateComplete;
    
    expect(el).to.exist;
    // Post button should be present
    const button = el.shadowRoot?.querySelector('sc-button');
    expect(button).to.exist;
  });

  it('renders in reply mode with Reply button', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        mode="reply"
        .value=${''}
        .fileHandler=${new ScCommentFileHandler(5)}
        .enableUpload=${true}
      ></sc-comment-input>
    `);
    
    await el.updateComplete;
    
    expect(el).to.exist;
    // Reply button should be present
    const button = el.shadowRoot?.querySelector('sc-button');
    expect(button).to.exist;
  });

  it('renders in edit mode with Save button', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        mode="edit"
        .value=${'Initial value'}
        .fileHandler=${new ScCommentFileHandler(5)}
        .enableUpload=${true}
      ></sc-comment-input>
    `);
    
    await el.updateComplete;
    
    expect(el).to.exist;
    // Save button should be present in edit mode
    const button = el.shadowRoot?.querySelector('sc-button');
    expect(button).to.exist;
  });

  it('emits sc-submit event when submit button clicked', async () => {
    const fileHandler = new ScCommentFileHandler(5);
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        mode="post"
        .initialValue=${'Test content'}
        .fileHandler=${fileHandler}
        .enableUpload=${true}
      ></sc-comment-input>
    `);
    
    await el.updateComplete;
    
    let eventFired = false;
    let eventDetail: any = null;
    
    el.addEventListener('sc-submit', ((e: CustomEvent) => {
      eventFired = true;
      eventDetail = e.detail;
    }) as EventListener);
    // Trigger submit
    el.handleSubmit();
    
    expect(eventFired).to.be.true;
    expect(eventDetail.text).to.equal('Test content');
  });

  it('emits sc-cancel event when cancel button clicked', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        mode="reply"
        .value=${'Test content'}
        .fileHandler=${new ScCommentFileHandler(5)}
        .enableUpload=${true}
      ></sc-comment-input>
    `);
    
    await el.updateComplete;
    
    let eventFired = false;
    
    el.addEventListener('sc-cancel', (() => {
      eventFired = true;
    }) as EventListener);
    
    // Trigger cancel
    el.handleCancel();
    
    expect(eventFired).to.be.true;
  });

  it('renders rich text editor', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        mode="post"
        .value=${''}
        .fileHandler=${new ScCommentFileHandler(5)}
        .enableUpload=${true}
      ></sc-comment-input>
    `);
    
    await el.updateComplete;
    
    const editor = el.shadowRoot?.querySelector('sc-rich-text-editor-v2');
    expect(editor).to.exist;
  });

  it('renders file upload when attachments enabled', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        mode="post"
        .value=${''}
        .fileHandler=${new ScCommentFileHandler(5)}
        .enableUpload=${true}
      ></sc-comment-input>
    `);
    
    await el.updateComplete;
    
    const fileUpload = el.shadowRoot?.querySelector('sc-comment-file-upload');
    expect(fileUpload).to.exist;
  });

  it('does not render file upload when attachments disabled', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        mode="post"
        .value=${''}
        .fileHandler=${new ScCommentFileHandler(5)}
        .enableUpload=${false}
      ></sc-comment-input>
    `);
    
    await el.updateComplete;
    
    const fileUpload = el.shadowRoot?.querySelector('sc-comment-file-upload');
    expect(fileUpload).to.not.exist;
  });

  it('shows cancel button in reply mode', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        mode="reply"
        .initialValue=${''}
        .fileHandler=${new ScCommentFileHandler(5)}
        .enableUpload=${true}
        .showCancel=${true}
      ></sc-comment-input>
    `);
    
    await el.updateComplete;
    
    // Cancel button should be present when showCancel=true
    const buttons = el.shadowRoot?.querySelectorAll('sc-button');
    expect(buttons!.length).to.be.greaterThan(1);
  });

  it('shows cancel button in edit mode', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        mode="edit"
        .initialValue=${'Initial value'}
        .fileHandler=${new ScCommentFileHandler(5)}
        .enableUpload=${true}
        .showCancel=${true}
      ></sc-comment-input>
    `);
    
    await el.updateComplete;
    
    // Cancel button should be present when showCancel=true
    const buttons = el.shadowRoot?.querySelectorAll('sc-button');
    expect(buttons!.length).to.be.greaterThan(1);
  });

  it('passes file handler to file upload component', async () => {
    const fileHandler = new ScCommentFileHandler(5);
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        mode="post"
        .value=${''}
        .fileHandler=${fileHandler}
        .enableUpload=${true}
        .commentId=${'test-comment'}
      ></sc-comment-input>
    `);
    
    await el.updateComplete;
    
    const fileUpload = el.shadowRoot?.querySelector('sc-comment-file-upload');
    expect(fileUpload).to.exist;
    // File handler should be passed to file upload component
  });

  it('emits sc-draft-change when value changes', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        .mode=${'reply'}
        .comment=${{ id: 'c-1' } as any}
        .fileHandler=${new ScCommentFileHandler(5)}
      ></sc-comment-input>
    `);

    let detail: any;
    const onDraftChange: EventListener = e => {
      detail = (e as CustomEvent).detail;
    };
    el.addEventListener('sc-draft-change', onDraftChange);

    const stopPropagation = jest.fn();
    el.handleValueChange({
      stopPropagation,
      detail: {
        text: 'draft-text',
        mentions: [{ id: 'u1', name: 'User 1' }],
      },
    } as any);

    expect(stopPropagation.mock.calls.length).to.be.greaterThan(0);
    expect(detail.commentId).to.equal('c-1');
    expect(detail.value).to.equal('draft-text');
    expect(detail.mentions).to.have.lengthOf(1);
  });

  it('does not emit sc-submit when value is empty', async () => {
    const fileHandler = new ScCommentFileHandler(5);
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        .mode=${'post'}
        .fileHandler=${fileHandler}
      ></sc-comment-input>
    `);

    let fired = false;
    el.addEventListener('sc-submit', (() => {
      fired = true;
    }) as EventListener);

    el.handleSubmit();
    expect(fired).to.be.false;
  });

  it('forwards file and attachment events', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        .fileHandler=${new ScCommentFileHandler(5)}
      ></sc-comment-input>
    `);

    const changes: any[] = [];
    const errors: any[] = [];
    const previews: any[] = [];

    const onFilesChange: EventListener = e => {
      changes.push((e as CustomEvent).detail);
    };
    const onFileError: EventListener = e => {
      errors.push((e as CustomEvent).detail);
    };
    const onAttachmentPreview: EventListener = e => {
      previews.push((e as CustomEvent).detail);
    };

    el.addEventListener('sc-files-change', onFilesChange);
    el.addEventListener('sc-file-error', onFileError);
    el.addEventListener('sc-attachment-preview', onAttachmentPreview);

    el.handleFileChange(new CustomEvent('x', { detail: { files: [1] } }));
    el.handleFileError(new CustomEvent('x', { detail: { reason: 'bad' } }));
    el.handleAttachmentPreview(new CustomEvent('x', { detail: { id: 'att-1' } }));

    expect(changes[0].files).to.have.lengthOf(1);
    expect(errors[0].reason).to.equal('bad');
    expect(previews[0].id).to.equal('att-1');
  });

  it('renders compact submit icon when compact mode is enabled', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        .compact=${true}
        .fileHandler=${new ScCommentFileHandler(5)}
      ></sc-comment-input>
    `);

    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('sc-icon-button')).to.exist;
  });

  it('closes only on outside clicks from document listener', async () => {
    const el = await fixture<ScCommentInput>(html`
      <sc-comment-input
        .userInfo=${userInfo}
        .fileHandler=${new ScCommentFileHandler(5)}
      ></sc-comment-input>
    `);

    let closeCount = 0;
    el.addEventListener('sc-close', (() => {
      closeCount += 1;
    }) as EventListener);

    const inputRoot = el.shadowRoot?.querySelector('.comment-input') as EventTarget;
    (el as any)._onDocumentClick?.({ composedPath: () => [inputRoot] } as any);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(closeCount).to.equal(0);

    (el as any)._onDocumentClick?.({ composedPath: () => [] } as any);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(closeCount).to.equal(1);

    el.removeInputListener();
    expect((el as any)._onDocumentClick).to.equal(undefined);
  });
});
