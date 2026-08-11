import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCommentAttachments } from '../../../../src/components/ScComment/components/ScCommentAttachments/ScCommentAttachments.js';
import '../../../../elements/sc-comment-attachments.js';
import type { CommentAttachment } from '../../../../src/components/ScComment/types/comment-attachment.js';

describe('ScCommentAttachments', () => {
  const mockAttachments: CommentAttachment[] = [
    {
      id: 'att-1',
      commentId: 'comment-1',
      fileName: 'document.pdf',
      fileSize: 1024000,
      fileType: 'application/pdf',
      fileUrl: 'https://example.com/document.pdf',
      uploadedAt: new Date('2024-01-01'),
      uploadedBy: 'user-1',
    },
    {
      id: 'att-2',
      commentId: 'comment-1',
      fileName: 'image.png',
      fileSize: 512000,
      fileType: 'image/png',
      fileUrl: 'https://example.com/image.png',
      uploadedAt: new Date('2024-01-02'),
      uploadedBy: 'user-1',
    },
  ];

  it('renders attachment list', async () => {
    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${mockAttachments}
        .commentId=${'comment-1'}
        .enableDownload=${true}
      ></sc-comment-attachments>
    `);

    expect(el).to.exist;
    expect(el.attachments.length).to.equal(2);

    const fileList = el.shadowRoot?.querySelector('sc-file-list');
    expect(fileList).to.exist;

    const fileItems = el.shadowRoot?.querySelectorAll('sc-file-item');
    expect(fileItems?.length).to.equal(1);

    const imageButtons = el.shadowRoot?.querySelectorAll('.attachment-image-button');
    expect(imageButtons?.length).to.equal(1);
  });

  it('renders nothing when no attachments', async () => {
    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${[]}
        .commentId=${'comment-1'}
        .enableDownload=${true}
      ></sc-comment-attachments>
    `);

    const fileList = el.shadowRoot?.querySelector('sc-file-list');
    expect(fileList).to.not.exist;
  });

  it('displays attachment file names and sizes', async () => {
    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${mockAttachments}
        .commentId=${'comment-1'}
        .enableDownload=${true}
      ></sc-comment-attachments>
    `);

    await el.updateComplete;

    const fileItems = el.shadowRoot?.querySelectorAll('sc-file-item');
    expect(fileItems?.[0]?.getAttribute('name')).to.equal('document.pdf');

    const imageButtons = el.shadowRoot?.querySelectorAll('.attachment-image-button');
    expect(imageButtons?.length).to.equal(1);
  });

  it('emits sc-attachment-download event when download is clicked', async () => {
    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${mockAttachments}
        .commentId=${'comment-1'}
        .enableDownload=${true}
      ></sc-comment-attachments>
    `);

    let eventFired = false;
    let eventDetail: any = null;

    el.addEventListener('sc-attachment-download', ((e: CustomEvent) => {
      eventFired = true;
      eventDetail = e.detail;
    }) as EventListener);

    // Mock document.createElement to prevent actual download
    const originalCreateElement = document.createElement.bind(document);
    let clickCalled = false;
    const mockLink = {
      href: '',
      download: '',
      click: () => { clickCalled = true; },
    };
    document.createElement = ((tagName: string) => {
      if (tagName === 'a') {
        return mockLink as any;
      }
      return originalCreateElement(tagName);
    }) as any;

    // Simulate file selection
    const selectEvent = new CustomEvent('sc-select', {
      detail: { 'file-id': 'att-1' },
      bubbles: true,
      composed: true,
    });

    el.handleFileSelect(selectEvent);
    await el.updateComplete;

    expect(eventFired).to.be.true;
    expect(eventDetail).to.exist;
    expect(eventDetail.attachment.id).to.equal('att-1');
    expect(eventDetail.attachment.fileName).to.equal('document.pdf');
    expect(eventDetail.commentId).to.equal('comment-1');
    expect(clickCalled, 'Link click should be called').to.be.true;

    // Restore original createElement
    document.createElement = originalCreateElement;
  });

  it('triggers download with correct URL and filename', async () => {
    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${mockAttachments}
        .commentId=${'comment-1'}
        .enableDownload=${true}
      ></sc-comment-attachments>
    `);

    let clickCalled = false;
    const mockLink = {
      href: '',
      download: '',
      click: () => { clickCalled = true; },
    };

    const originalCreateElement = document.createElement.bind(document);
    document.createElement = ((tagName: string) => {
      if (tagName === 'a') {
        return mockLink as any;
      }
      return originalCreateElement(tagName);
    }) as any;

    el.handleDownloadAttachment(mockAttachments[0]);

    expect(mockLink.href).to.equal('https://example.com/document.pdf');
    expect(mockLink.download).to.equal('document.pdf');
    expect(clickCalled, 'Link click should be called').to.be.true;

    // Restore
    document.createElement = originalCreateElement;
  });

  it('makes attachments selectable when enableDownload is true', async () => {
    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${mockAttachments}
        .commentId=${'comment-1'}
        .enableDownload=${true}
      ></sc-comment-attachments>
    `);

    await el.updateComplete;

    const fileItems = el.shadowRoot?.querySelectorAll('sc-file-item');
    expect(fileItems?.[0]?.hasAttribute('selectable')).to.be.true;
  });

  it('does not make attachments selectable when enableDownload is false', async () => {
    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${mockAttachments}
        .commentId=${'comment-1'}
        .enableDownload=${false}
      ></sc-comment-attachments>
    `);

    await el.updateComplete;

    const fileItems = el.shadowRoot?.querySelectorAll('sc-file-item');
    expect(fileItems?.[0]?.hasAttribute('selectable')).to.be.false;
  });

  it('handles invalid attachment metadata gracefully', async () => {
    const invalidAttachments = [
      {
        id: 'invalid-1',
        commentId: 'comment-1',
        fileName: 'valid.pdf',
        fileSize: 1024,
        fileType: 'application/pdf',
        fileUrl: 'https://example.com/valid.pdf',
        uploadedAt: new Date(),
        uploadedBy: 'user-1',
      },
      {
        // Missing required fields
        id: 'invalid-2',
        commentId: 'comment-1',
        fileName: '',
        fileSize: null as any,
        fileType: '',
        fileUrl: '',
        uploadedAt: new Date(),
        uploadedBy: 'user-1',
      },
    ];

    // Spy on console.warn
    const originalWarn = console.warn;
    let warnCalled = false;
    console.warn = (...args: any[]) => {
      if (args[0] === 'Invalid attachment metadata:') {
        warnCalled = true;
      }
    };

    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${invalidAttachments}
        .commentId=${'comment-1'}
        .enableDownload=${true}
      ></sc-comment-attachments>
    `);

    await el.updateComplete;

    const fileItems = el.shadowRoot?.querySelectorAll('sc-file-item');
    expect(fileItems?.length).to.equal(2);

    // Invalid attachment should have error status
    expect(fileItems?.[1]?.getAttribute('status')).to.equal('error');
    expect(warnCalled).to.be.true;

    // Restore console.warn
    console.warn = originalWarn;
  });

  it('handles attachment selection when attachment is not found', async () => {
    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${mockAttachments}
        .commentId=${'comment-1'}
        .enableDownload=${true}
      ></sc-comment-attachments>
    `);

    let eventFired = false;

    el.addEventListener('sc-attachment-download', (() => {
      eventFired = true;
    }) as EventListener);

    // Simulate selection of non-existent attachment
    const selectEvent = new CustomEvent('sc-select', {
      detail: { 'file-id': 'non-existent-id' },
      bubbles: true,
      composed: true,
    });

    el.handleFileSelect(selectEvent);
    await el.updateComplete;

    // Event should not fire for non-existent attachment
    expect(eventFired).to.be.false;
  });

  it('renders attachments in horizontal direction', async () => {
    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${mockAttachments}
        .commentId=${'comment-1'}
        .enableDownload=${true}
      ></sc-comment-attachments>
    `);

    await el.updateComplete;

    const fileList = el.shadowRoot?.querySelector('sc-file-list');
    expect(fileList?.getAttribute('direction')).to.equal('horizontal');
  });

  it('updates display when attachments prop changes', async () => {
    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${[mockAttachments[0]]}
        .commentId=${'comment-1'}
        .enableDownload=${true}
      ></sc-comment-attachments>
    `);

    let fileItems = el.shadowRoot?.querySelectorAll('sc-file-item');
    expect(fileItems?.length).to.equal(1);

    // Update attachments
    el.attachments = mockAttachments;
    await el.updateComplete;

    fileItems = el.shadowRoot?.querySelectorAll('sc-file-item');
    expect(fileItems?.length).to.equal(1);

    const imageButtons = el.shadowRoot?.querySelectorAll('.attachment-image-button');
    expect(imageButtons?.length).to.equal(1);
  });

  it('renders file items with no-border attribute', async () => {
    const el = await fixture<ScCommentAttachments>(html`
      <sc-comment-attachments
        .attachments=${mockAttachments}
        .commentId=${'comment-1'}
        .enableDownload=${true}
      ></sc-comment-attachments>
    `);

    await el.updateComplete;

    const fileItems = el.shadowRoot?.querySelectorAll('sc-file-item');
    fileItems?.forEach(item => {
      expect(item.hasAttribute('no-border')).to.be.true;
    });
  });
});
