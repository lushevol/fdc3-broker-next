import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCommentFileUpload } from '../../../../src/components/ScComment/components/ScCommentFileUpload/ScCommentFileUpload.js';
import { ScCommentFileHandler } from '../../../../src/components/ScComment/ScCommentFileHandler.js';
import '../../../../elements/sc-comment-file-upload.js';
import type { CommentAttachment } from '../../../../src/components/ScComment/types/comment-attachment.js';

describe('ScCommentFileUpload', () => {
  let fileHandler: ScCommentFileHandler;
  const commentId = 'test-comment-1';

  beforeEach(() => {
    fileHandler = new ScCommentFileHandler(5);
  });

  it('renders file upload component', async () => {
    const el = await fixture<ScCommentFileUpload>(html`
      <sc-comment-file-upload
        .commentId=${commentId}
        .fileHandler=${fileHandler}
        .singleFileUpload=${false}
        .maxFilesPerComment=${5}
      ></sc-comment-file-upload>
    `);

    expect(el).to.exist;
    expect(el.commentId).to.equal(commentId);
    expect(el.singleFileUpload).to.be.false;
  });

  it('handles file selection via sc-change event', async () => {
    const el = await fixture<ScCommentFileUpload>(html`
      <sc-comment-file-upload
        .commentId=${commentId}
        .fileHandler=${fileHandler}
        .singleFileUpload=${false}
        .maxFilesPerComment=${5}
      ></sc-comment-file-upload>
    `);

    // Create mock files
    const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
    const fileList = {
      0: file1,
      1: file2,
      length: 2,
      item: (index: number) => [file1, file2][index],
      *[Symbol.iterator] () {
        yield file1;
        yield file2;
      },
    } as unknown as FileList;

    // Simulate file selection
    const changeEvent = new CustomEvent('sc-change', {
      detail: { value: fileList },
      bubbles: true,
      composed: true,
    });

    el.handleFileSelection(changeEvent);
    await el.updateComplete;

    // Verify files were added to handler
    const draftFiles = fileHandler.getDraftAttachments(commentId);
    expect(draftFiles.length).to.equal(2);
    expect(draftFiles[0].name).to.equal('test1.txt');
    expect(draftFiles[1].name).to.equal('test2.txt');
  });

  it('emits sc-file-error when validation fails', async () => {
    // Create a fileHandler with maxFiles=1 to test validation
    const restrictedHandler = new ScCommentFileHandler(1, '.txt');
    const el = await fixture<ScCommentFileUpload>(html`
      <sc-comment-file-upload
        .commentId=${commentId}
        .fileHandler=${restrictedHandler}
        .singleFileUpload=${true}
        .maxFilesPerComment=${1}
      ></sc-comment-file-upload>
    `);

    let errorEmitted = false;
    let errorDetail: any = null;

    el.addEventListener('sc-file-error', ((e: CustomEvent) => {
      errorEmitted = true;
      errorDetail = e.detail;
    }) as EventListener);

    // Try to select 2 files when maxFilesPerComment is 1
    const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
    const fileList = {
      0: file1,
      1: file2,
      length: 2,
      item: (index: number) => [file1, file2][index],
      *[Symbol.iterator] () {
        yield file1;
        yield file2;
      },
    } as unknown as FileList;

    const changeEvent = new CustomEvent('sc-change', {
      detail: { value: fileList },
      bubbles: true,
      composed: true,
    });

    el.handleFileSelection(changeEvent);
    await el.updateComplete;

    // The error should be emitted
    expect(errorEmitted, 'Error event should be emitted').to.be.true;
    expect(errorDetail, 'Error detail should exist').to.exist;
    expect(errorDetail.errorType, 'Error type should be MAX_FILES_EXCEEDED').to.equal('MAX_FILES_EXCEEDED');
  });

  it('validates file types when acceptedFileTypes is set', async () => {
    const el = await fixture<ScCommentFileUpload>(html`
      <sc-comment-file-upload
        .commentId=${commentId}
        .fileHandler=${fileHandler}
        .singleFileUpload=${false}
        .maxFilesPerComment=${5}
        .acceptedFileTypes=${'image/*,.pdf'}
      ></sc-comment-file-upload>
    `);

    let errorEmitted = false;

    el.addEventListener('sc-file-error', (() => {
      errorEmitted = true;
    }) as EventListener);

    // Try to upload a .txt file when only images and PDFs are allowed
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    const fileList = {
      0: invalidFile,
      length: 1,
      item: () => invalidFile,
      *[Symbol.iterator] () {
        yield invalidFile;
      },
    } as unknown as FileList;

    // Create fileHandler with acceptedFileTypes
    const restrictedFileHandler = new ScCommentFileHandler(5, 'image/*,.pdf');
    el.fileHandler = restrictedFileHandler;
    await el.updateComplete;

    const changeEvent = new CustomEvent('sc-change', {
      detail: { value: fileList },
      bubbles: true,
      composed: true,
    });

    el.handleFileSelection(changeEvent);
    await el.updateComplete;

    expect(errorEmitted).to.be.true;
  });

  it('handles draft file removal', async () => {
    const el = await fixture<ScCommentFileUpload>(html`
      <sc-comment-file-upload
        .commentId=${commentId}
        .fileHandler=${fileHandler}
        .singleFileUpload=${false}
        .maxFilesPerComment=${5}
      ></sc-comment-file-upload>
    `);

    // Add files first
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const fileList = {
      0: file,
      length: 1,
      item: () => file,
      *[Symbol.iterator] () {
        yield file;
      },
    } as unknown as FileList;

    const changeEvent = new CustomEvent('sc-change', {
      detail: { value: fileList },
      bubbles: true,
      composed: true,
    });

    el.handleFileSelection(changeEvent);
    await el.updateComplete;

    expect(fileHandler.getDraftAttachments(commentId).length).to.equal(1);

    // Now remove the file
    const removeEvent = new CustomEvent('sc-file-remove', {
      detail: { 'file-id': `draft-${commentId}-0` },
      bubbles: true,
      composed: true,
    });

    el.handleDraftFileRemove(removeEvent);
    await el.updateComplete;

    expect(fileHandler.getDraftAttachments(commentId).length).to.equal(0);
  });

  it('handles existing attachment deletion in edit mode', async () => {
    const existingAttachment: CommentAttachment = {
      id: 'existing-1',
      commentId,
      fileName: 'existing.pdf',
      fileSize: 1024,
      fileType: 'application/pdf',
      fileUrl: 'https://example.com/existing.pdf',
      uploadedAt: new Date(),
      uploadedBy: 'user-1',
    };

    const el = await fixture<ScCommentFileUpload>(html`
      <sc-comment-file-upload
        .commentId=${commentId}
        .fileHandler=${fileHandler}
        .singleFileUpload=${false}
        .maxFilesPerComment=${5}
        .editMode=${true}
        .existingAttachments=${[existingAttachment]}
      ></sc-comment-file-upload>
    `);

    // Remove existing attachment
    const removeEvent = new CustomEvent('sc-file-remove', {
      detail: { 'file-id': 'existing-existing-1' },
      bubbles: true,
      composed: true,
    });

    el.handleDraftFileRemove(removeEvent);
    await el.updateComplete;

    // Verify attachment was marked for deletion
    expect(fileHandler.getDeletedAttachmentIds().has('existing-1')).to.be.true;
  });

  it('supports drag and drop file upload', async () => {
    const el = await fixture<ScCommentFileUpload>(html`
      <sc-comment-file-upload
        .commentId=${commentId}
        .fileHandler=${fileHandler}
        .singleFileUpload=${false}
        .maxFilesPerComment=${5}
      ></sc-comment-file-upload>
    `);

    const dropZone = el.shadowRoot?.querySelector('.file-upload-container') as HTMLElement;
    expect(dropZone).to.exist;

    // Test drag over using a mock event with currentTarget
    const mockDragOverEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      currentTarget: dropZone,
    } as any;
    el.handleDragOver(mockDragOverEvent);

    // Test drag leave
    const mockDragLeaveEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      currentTarget: dropZone,
    } as any;
    el.handleDragLeave(mockDragLeaveEvent);

    // Component should handle these events without errors
    expect(el).to.exist;
  });

  it('updates fileInputKey when commentId changes', async () => {
    const el = await fixture<ScCommentFileUpload>(html`
      <sc-comment-file-upload
        .commentId=${'comment-1'}
        .fileHandler=${fileHandler}
        .singleFileUpload=${false}
        .maxFilesPerComment=${5}
      ></sc-comment-file-upload>
    `);
    await el.updateComplete;

    // Get initial key directly from fileHandler
    const initialKey = fileHandler.getFileInputKey('comment-1');
    expect(initialKey).to.be.a('number');

    // Change commentId which should trigger willUpdate and update fileInputKey
    el.commentId = 'comment-2';
    await el.updateComplete;

    // Get new key from fileHandler
    const newKey = fileHandler.getFileInputKey('comment-2');
    expect(newKey).to.be.a('number');
    
    // The component's fileInputKey should now match the new commentId's key
    expect(el['fileInputKey']).to.equal(newKey);
  });

  it('prevents re-processing already saved files', async () => {
    const el = await fixture<ScCommentFileUpload>(html`
      <sc-comment-file-upload
        .commentId=${commentId}
        .fileHandler=${fileHandler}
        .singleFileUpload=${false}
        .maxFilesPerComment=${5}
        .editMode=${false}
      ></sc-comment-file-upload>
    `);

    // Add files with IDs (simulating already saved files)
    const fileWithId = new File(['content'], 'test.txt', { type: 'text/plain' });
    (fileWithId as any).id = 'already-saved-1';

    const fileList = {
      0: fileWithId,
      length: 1,
      item: () => fileWithId,
      *[Symbol.iterator] () {
        yield fileWithId;
      },
    } as unknown as FileList;

    // Pre-populate draft attachments
    fileHandler.handleFileSelection(fileList, commentId, null);

    const initialCount = fileHandler.getDraftAttachments(commentId).length;

    // Try to process same files again
    const changeEvent = new CustomEvent('sc-change', {
      detail: { value: fileList },
      bubbles: true,
      composed: true,
    });

    el.handleFileSelection(changeEvent);
    await el.updateComplete;

    // Count should not increase
    expect(fileHandler.getDraftAttachments(commentId).length).to.equal(initialCount);
  });
});
